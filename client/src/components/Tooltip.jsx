export default function Tooltip({ file, pos }) {
  if (!file) return null;

  const style = {
    position: 'fixed',
    left: `${Math.min(pos.x + 15, window.innerWidth - 220)}px`,
    top: `${Math.min(pos.y + 15, window.innerHeight - 150)}px`,
    pointerEvents: 'none',
    zIndex: 100,
  };

  return (
    <div style={style} className="glass p-4 rounded-xl min-w-[200px] border border-gray-100/50 shadow-xl bg-white/95 text-sm font-sans animate-in fade-in zoom-in duration-200">
      <div className="font-semibold text-gray-800 break-all mb-2 leading-tight">{file.path}</div>
      <div className="space-y-1 text-gray-600">
        <div className="flex justify-between">
          <span>Functions:</span> 
          <span className="font-medium text-gray-900">{file.functions.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Avg Source Status:</span> 
          <span className="font-bold" style={{ color: file.avgDeadScore > 60 ? '#ef4444' : '#22c55e' }}>
            {file.avgDeadScore}
          </span>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
          Click to zoom into {file.functions.length} function{file.functions.length!==1?'s':''}
      </div>
    </div>
  );
}
