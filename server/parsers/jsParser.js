import { parse } from '@babel/parser';

export function parseJS(code, ext) {
    const functions = [];
    const plugins = ['jsx', 'decorators-legacy'];
    if (ext === 'ts' || ext === 'tsx') {
        plugins.push('typescript');
    }

    try {
        const ast = parse(code, {
            sourceType: 'module',
            plugins: plugins,
            errorRecovery: true
        });

        function walk(node) {
            if (!node || typeof node !== 'object') return;
            if (Array.isArray(node)) {
                node.forEach(walk);
                return;
            }

            if (node.type === 'FunctionDeclaration' && node.id) {
                functions.push({ name: node.id.name, line: node.loc.start.line });
            } else if (node.type === 'VariableDeclarator' && node.init && (node.init.type === 'ArrowFunctionExpression' || node.init.type === 'FunctionExpression')) {
                if (node.id && node.id.name) {
                    functions.push({ name: node.id.name, line: node.loc.start.line });
                }
            } else if (node.type === 'MethodDefinition' || node.type === 'ClassMethod' || node.type === 'ObjectMethod') {
                if (node.key && node.key.name) {
                    functions.push({ name: node.key.name, line: node.loc.start.line });
                }
            } else if (node.type === 'Property' && node.value && (node.value.type === 'ArrowFunctionExpression' || node.value.type === 'FunctionExpression')) {
                if (node.key && node.key.name) {
                    functions.push({ name: node.key.name, line: node.loc.start.line });
                }
            }

            for (const key in node) {
                if (!['loc', 'range', 'comments', 'leadingComments', 'trailingComments', 'tokens', 'extra'].includes(key)) {
                    walk(node[key]);
                }
            }
        }

        walk(ast);
    } catch (e) {
        // Fallback gracefully on parsing errors
        console.warn("Babel parsing failed, falling back to basic regex");
        return fallbackParse(code);
    }

    return functions;
}

function fallbackParse(code) {
    const functions = [];
    const lines = code.split('\n');
    const regex = /(?:function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(|(?:const|let|var)\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*=\s*(?:function|\([^)]*\)\s*=>|[^()]*\s*=>))/;
    lines.forEach((line, index) => {
        const match = line.match(regex);
        if (match) {
            functions.push({ name: match[1] || match[2], line: index + 1 });
        }
    });
    return functions;
}
