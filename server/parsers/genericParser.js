export function parseGeneric(code, ext) {
    const functions = [];
    const lines = code.split('\n');
    
    const rules = [
      /^\s*func\s+(?:(?:\([^)]+\)\s+)?)([a-zA-Z_]\w*)\s*\(/, // Go
      /^\s*(?:(?:public|private|protected|static|final|abstract)\s+)*[\w<>\[\]]+\s+([a-zA-Z_]\w*)\s*\(/, // Java
      /^\s*fn\s+([a-zA-Z_]\w*)\s*(?:<[^>]+>)?\s*\(/ // Rust
    ];
  
    lines.forEach((line, index) => {
      for (const rule of rules) {
        const match = line.match(rule);
        if (match) {
          functions.push({ name: match[1], line: index + 1 });
          break;
        }
      }
    });
    return functions;
}
