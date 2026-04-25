import { useState, useCallback } from 'react';
import { UploadCloud, FileArchive, PlayCircle } from 'lucide-react';

export default function UploadPanel({ onAnalyze, onLoadDemo, error }) {
  const [dragActive, setDragActive] = useState(false);
  const [months, setMonths] = useState(6);
  const [file, setFile] = useState(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-200/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      
      <div className="max-w-2xl w-full glass rounded-3xl p-10 z-10 space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-brand-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
            <FileArchive className="w-8 h-8 text-white -rotate-3" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mt-4">Dead Code Heat Map</h1>
          <p className="text-gray-500 text-lg">Upload your codebase to discover forgotten functions.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-center justify-center">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div 
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ease-out flex flex-col items-center justify-center gap-4 group cursor-pointer
              ${dragActive ? 'border-brand-500 bg-brand-50/50 scale-[1.02]' : 'border-gray-300 hover:border-brand-400 hover:bg-gray-50'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              accept=".zip" 
              onChange={handleChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className={`p-4 rounded-full transition-colors ${file ? 'bg-brand-100' : 'bg-gray-100 group-hover:bg-brand-50'}`}>
              <UploadCloud className={`w-8 h-8 ${file ? 'text-brand-600' : 'text-gray-400 group-hover:text-brand-500'}`} />
            </div>
            
            <div>
              {file ? (
                <div className="text-lg font-semibold text-brand-600">{file.name} ({(file.size/1024/1024).toFixed(2)} MB)</div>
              ) : (
                <>
                  <p className="text-lg font-semibold text-gray-700">Drag & drop your ZIP file</p>
                  <p className="text-sm text-gray-400 mt-1">Supports JS, TS, Python, Go, Java, Rust</p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
              <label>Analyze code not touched in:</label>
              <span className="text-brand-600 bg-brand-50 px-3 py-1 rounded-full">{months} Months</span>
            </div>
            <input 
              type="range" min="1" max="24" 
              value={months} 
              onChange={(e) => setMonths(e.target.value)}
              className="w-full accent-brand-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 font-medium">
              <span>1 Month</span>
              <span>24 Months</span>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
               onClick={() => { if(file) onAnalyze(file, months) }}
               disabled={!file}
               className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all shadow-md active:scale-95
                           ${file ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/25' : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'}`}
            >
              Analyze Codebase
            </button>
            <button 
               onClick={onLoadDemo}
               className="px-6 py-4 rounded-xl font-bold text-lg bg-white border-2 border-gray-200 text-gray-700 hover:border-brand-500 hover:text-brand-600 transition-all flex items-center gap-2 active:scale-[0.98]"
            >
              <PlayCircle className="w-5 h-5" />
              Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
