import { FileCode, Activity, Code2, AlertTriangle, TrendingUp } from 'lucide-react';

export default function StatsBar({ summary }) {
  if (!summary) return null;

  return (
    <div className="bg-gradient-to-r from-brand-50 to-purple-50 p-4 border-b border-gray-200 grid grid-cols-5 gap-4 shrink-0">
      <StatBox icon={<FileCode />} label="Total Files" value={summary.totalFiles} />
      <StatBox icon={<Code2 />} label="Total Functions" value={summary.totalFunctions} />
      <StatBox icon={<AlertTriangle className="text-red-500" />} label="Dead Functions" value={summary.deadFunctions} />
      <StatBox icon={<Activity className="text-brand-500"/>} label="% Dead Code" value={`${summary.deadPercent}%`} />
      <StatBox icon={<TrendingUp />} label="Most Dead File" value={<span className="text-[10px] sm:text-xs truncate block max-w-[150px]" title={summary.mostDeadFile}>{summary.mostDeadFile?.split('/').pop()}</span>} />
    </div>
  );
}

function StatBox({ icon, label, value }) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100/50 flex items-center gap-3 hover:shadow-md transition-shadow min-w-0">
      <div className="p-2 rounded-lg bg-gray-50 text-gray-600 shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] sm:text-xs text-gray-500 font-medium truncate">{label}</div>
        <div className="text-sm sm:text-lg font-bold text-gray-800 truncate">{value}</div>
      </div>
    </div>
  );
}
