export function parsePython(code) {
    const functions = [];
    const lines = code.split('\n');
    const regex = /^\s*(?:def|class)\s+([a-zA-Z_]\w*)\s*\(/;
    lines.forEach((line, index) => {
        const match = line.match(regex);
        if (match) {
            functions.push({ name: match[1], line: index + 1 });
        }
    });
    return functions;
}
