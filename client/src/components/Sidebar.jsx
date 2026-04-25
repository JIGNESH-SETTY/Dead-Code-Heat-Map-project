import { useMemo } from 'react';
import { AlertCircle, Clock } from 'lucide-react';
import { getScoreColor } from '../utils/deadScore';

export default function Sidebar({ data, threshold, onFunctionClick }) {
  const topFunctions = useMemo(() => {
    if (!data) return [];
    let allFuncs = [];
    data.files.forEach(f => {
      f.functions.forEach(fn => {
        allFuncs.push({ ...fn, filePath: f.path, fileRef: f });
      });
    });
    return allFuncs.sort((a, b) => b.deadScore - a.deadScore).slice(0, 20);
  }, [data]);

  return (
    <div className="w-80 border-l border-gray-200 bg-white shadow-[0px_0_15px_-3px_rgba(0,0,0,0.02)] flex flex-col h-full shrink-0 z-10 transition-all">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <h2 className="font-bold text-gray-800 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-brand-500" />
          Top Dead Code
        </h2>
        <p className="text-xs text-gray-500 mt-1">Functions with highest dead score</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {topFunctions.map((fn, idx) => (
          <div 
            key={`${fn.filePath}-${fn.name}-${idx}`}
            onClick={() => onFunctionClick(fn.fileRef)}
            className="p-3 rounded-lg border border-gray-100 hover:border-brand-200 hover:shadow-md cursor-pointer transition-all duration-200 group relative overflow-hidden bg-white hover:-translate-y-0.5"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-brand-500 transition-colors"></div>
            
            <div className="flex justify-between items-start mb-1 gap-2">
              <h3 className="font-semibold text-sm text-gray-800 truncate" title={fn.name}>{fn.name}</h3>
              <span 
                className="text-xs font-bold px-2 py-0.5 rounded-full text-white shrink-0"
                style={{ backgroundColor: getScoreColor(fn.deadScore) }}
              >
                {fn.deadScore}
              </span>
            </div>
            
            <p className="text-xs font-mono text-gray-400 truncate mb-2" title={fn.filePath}>
              {fn.filePath.split('/').pop()}:{fn.line}
            </p>
            
            <div className="flex items-center gap-2 mt-auto">
              {!fn.isCalled && (
                <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">Never Called</span>
              )}
              <div className="flex items-center gap-1 text-[10px] text-gray-500 ml-auto">
                <Clock className="w-3 h-3" />
                 {fn.daysSinceTouch}d ago
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
