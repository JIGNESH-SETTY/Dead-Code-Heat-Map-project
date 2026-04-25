import { Filter, SlidersHorizontal } from 'lucide-react';

export default function FilterBar({ threshold, setThreshold, showOnlyNeverCalled, setShowOnlyNeverCalled, languageFilter, setLanguageFilter }) {
  return (
    <div className="bg-white rounded-xl p-3 px-5 shadow-sm border border-gray-200 flex items-center justify-between">
      
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-5 h-5 text-gray-400" />
          <div className="flex flex-col">
            <label className="text-[10px] sm:text-xs font-semibold text-gray-600 mb-1">Dead Score Threshold: <span className="text-brand-600">{threshold}</span></label>
            <input 
              type="range" min="0" max="100" 
              value={threshold} 
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-32 sm:w-48 accent-brand-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="h-8 w-px bg-gray-200"></div>

        <label className="flex items-center gap-2 cursor-pointer group">
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only" 
              checked={showOnlyNeverCalled}
              onChange={(e) => setShowOnlyNeverCalled(e.target.checked)}
            />
            <div className={`block w-10 h-6 border-2 rounded-full transition-colors ${showOnlyNeverCalled ? 'bg-brand-500 border-brand-500' : 'bg-gray-200 border-gray-200'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${showOnlyNeverCalled ? 'transform translate-x-4' : ''}`}></div>
          </div>
          <span className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Only Never Called</span>
        </label>
      </div>

      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-gray-400" />
        <select 
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
          className="text-xs sm:text-sm border-none bg-gray-50 focus:ring-0 font-medium text-gray-700 py-1.5 px-3 rounded-lg appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <option value="All">All Languages</option>
          <option value="javascript">JavaScript / TS</option>
          <option value="python">Python</option>
          <option value="go">Go</option>
          <option value="java">Java</option>
        </select>
      </div>

    </div>
  );
}
