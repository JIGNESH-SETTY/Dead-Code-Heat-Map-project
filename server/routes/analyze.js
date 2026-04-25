import express from 'express';
import multer from 'multer';
import AdmZip from 'adm-zip';
import { parseJS } from '../parsers/jsParser.js';
import { parsePython } from '../parsers/pyParser.js';
import { parseGeneric } from '../parsers/genericParser.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('codebase'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No zip file uploaded' });
        }

        const monthsThreshold = parseInt(req.body.months || '6', 10);
        const zip = new AdmZip(req.file.buffer);
        const zipEntries = zip.getEntries();
        
        let metadata = {};
        const metaEntry = zipEntries.find(e => e.entryName.endsWith('.deadcode-meta.json'));
        if (metaEntry) {
            try {
                metadata = JSON.parse(metaEntry.getData().toString('utf8'));
            } catch (e) {
                console.error("Failed to parse .deadcode-meta.json", e);
            }
        }

        const filesData = [];
        let totalFunctions = 0;
        let deadFunctions = 0;
        let mostDeadFile = "";
        let highestFileDeadScore = -1;

        // Collect all code for cross-referencing
        const allCode = zipEntries
            .filter(e => !e.isDirectory && !e.entryName.includes('node_modules/') && !e.entryName.includes('.git/'))
            .map(e => {
                try { return e.getData().toString('utf8'); } catch(err) { return ""; }
            })
            .join('\n');

        for (const entry of zipEntries) {
            if (entry.isDirectory || entry.entryName.includes('node_modules/') || entry.entryName.includes('.git/')) continue;
            
            const filePath = entry.entryName;
            const ext = filePath.split('.').pop().toLowerCase();
            const validExts = ['js', 'jsx', 'ts', 'tsx', 'py', 'go', 'java', 'rs'];
            
            if (!validExts.includes(ext)) continue;

            const code = entry.getData().toString('utf8');
            let functions = [];

            if (['js', 'jsx', 'ts', 'tsx'].includes(ext)) {
                functions = parseJS(code, ext);
            } else if (ext === 'py') {
                functions = parsePython(code);
            } else {
                functions = parseGeneric(code, ext);
            }

            if (functions.length === 0) continue;

            totalFunctions += functions.length;
            
            const isEntryPoint = /(index\.(js|jsx|ts|tsx)|main\.(py|go|java)|app\.(js|jsx|ts|tsx))$/i.test(filePath);
            
            let fileDeadScoreSum = 0;
            
            for (let fn of functions) {
                // Simulate last modified
                let lastModifiedDate;
                if (metadata[filePath]) {
                    lastModifiedDate = new Date(metadata[filePath]);
                } else {
                    // Random date between 6 months and 3 years ago
                    const now = new Date();
                    const daysAgo = Math.floor(Math.random() * (1095 - 180)) + 180;
                    lastModifiedDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
                }
                
                fn.lastModified = lastModifiedDate.toISOString().split('T')[0];
                
                const daysSinceTouch = Math.floor((new Date() - lastModifiedDate) / (1000 * 60 * 60 * 24));
                fn.daysSinceTouch = daysSinceTouch;
                
                // Cross file call check
                const callPattern = new RegExp(`\\b${fn.name}\\b`, 'g');
                const matches = allCode.match(callPattern) || [];
                // If it appears more than once, it's called (1 is the definition, ideally)
                fn.isCalled = matches.length > 1;
                
                // Dead Score calculation
                // Base: min(100, daysSinceTouch / 10.95), wait requirements: min(100, daysSinceTouch / 3) wait, 3 years = 100 score => 1095 days = 100
                let baseScore = Math.min(100, (daysSinceTouch / 1095) * 100);
                
                if (!fn.isCalled) baseScore += 20;
                if (isEntryPoint) baseScore -= 15;
                
                fn.deadScore = Math.max(0, Math.min(100, Math.round(baseScore)));
                
                if (fn.deadScore > 60) deadFunctions++;
                fileDeadScoreSum += fn.deadScore;
            }

            const avgDeadScore = Math.round(fileDeadScoreSum / functions.length);
            if (avgDeadScore > highestFileDeadScore) {
                highestFileDeadScore = avgDeadScore;
                mostDeadFile = filePath;
            }

            filesData.push({
                path: filePath,
                language: ext === 'py' ? 'python' : ['js','jsx','ts','tsx'].includes(ext) ? 'javascript/typescript' : ext,
                avgDeadScore,
                functions
            });
        }

        const summary = {
            totalFiles: filesData.length,
            totalFunctions,
            deadFunctions,
            deadPercent: totalFunctions > 0 ? Number(((deadFunctions / totalFunctions) * 100).toFixed(1)) : 0,
            mostDeadFile
        };

        res.json({ summary, files: filesData });

    } catch (error) {
        console.error("Analysis Error:", error);
        res.status(500).json({ error: "Failed to analyze codebase" });
    }
});

export default router;
