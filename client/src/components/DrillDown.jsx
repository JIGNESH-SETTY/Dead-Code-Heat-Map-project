import { ArrowLeft, Clock, AlertCircle } from 'lucide-react';
import { getScoreColor } from '../utils/deadScore';

export default function DrillDown({ file, onBack, threshold }) {
  
  const sortedFunctions = [...file.functions].sort((a,b) => b.deadScore - a.deadScore);

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden animate-in slide-in-from-right-8 duration-300">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-gray-800 truncate" title={file.path}>{file.path.split('/').pop()}</h2>
            <p className="text-xs text-gray-500 font-mono truncate">{file.path}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-extrabold" style={{ color: getScoreColor(file.avgDeadScore) }}>
            {file.avgDeadScore}
          </div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Avg Score</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#fafafa]">
        {sortedFunctions.map((fn, idx) => (
          <div 
            key={`${fn.name}-${idx}`} 
            className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden
                       ${fn.deadScore >= threshold ? 'border-red-200' : 'border-gray-200'}`}
          >
            <div className="absolute top-0 left-0 bottom-0 w-2" style={{ backgroundColor: getScoreColor(fn.deadScore) }}></div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start pl-4 gap-4">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-gray-800 font-mono truncate" title={fn.name}>{fn.name}()</h3>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  Line {fn.line} • <Clock className="w-4 h-4 ml-2"/> Last modified {fn.lastModified}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-bold block" style={{ color: getScoreColor(fn.deadScore) }}>
                  {fn.deadScore}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">SCORE</span>
              </div>
            </div>

            <div className="pl-4 mt-4 flex flex-wrap gap-2">
                {!fn.isCalled && (
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Never Called Internally
                  </span>
                )}
                {fn.daysSinceTouch > 365 && (
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-md text-xs font-bold">
                     Untouched > 1yr
                  </span>
                )}
                {fn.deadScore < 20 && (
                   <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-xs font-bold">
                     Very Active
                  </span>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
