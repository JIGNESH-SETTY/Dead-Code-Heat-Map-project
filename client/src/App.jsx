import { useState, useMemo } from 'react';
import { useAnalysis } from './hooks/useAnalysis';
import UploadPanel from './components/UploadPanel';
import HeatMap from './components/HeatMap';
import Sidebar from './components/Sidebar';
import StatsBar from './components/StatsBar';
import FilterBar from './components/FilterBar';
import Tooltip from './components/Tooltip';
import DrillDown from './components/DrillDown';

export default function App() {
  const { data, loading, error, analyze, loadDemo } = useAnalysis();
  
  const [threshold, setThreshold] = useState(60);
  const [showOnlyNeverCalled, setShowOnlyNeverCalled] = useState(false);
  const [languageFilter, setLanguageFilter] = useState('All');
  
  const [hoveredFile, setHoveredFile] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [selectedFile, setSelectedFile] = useState(null);

  const filteredData = useMemo(() => {
    if (!data) return null;
    let newFiles = data.files.map(f => {
      let filteredFuncs = f.functions;
      if (showOnlyNeverCalled) {
        filteredFuncs = filteredFuncs.filter(fn => !fn.isCalled);
      }
      return { ...f, functions: filteredFuncs };
    }).filter(f => f.functions.length > 0);

    if (languageFilter !== 'All') {
      newFiles = newFiles.filter(f => f.language.includes(languageFilter.toLowerCase()));
    }

    return { ...data, files: newFiles };
  }, [data, showOnlyNeverCalled, languageFilter]);

  const handleHover = (file, e) => {
    if (file && e) {
      setHoveredFile(file);
      setHoverPos({ x: e.clientX, y: e.clientY });
    } else {
      setHoveredFile(null);
    }
  };

  if (!data && !loading) {
    return <UploadPanel onAnalyze={analyze} onLoadDemo={loadDemo} error={error} />;
  }

  return (
    <div className="flex h-screen w-screen flex-col font-sans text-gray-800 bg-[#fafafa]">
      <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
            D
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Dead Code Heat Map
          </h1>
        </div>
      </header>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-600">Analyzing Codebase...</h2>
        </div>
      ) : (
        <>
          <StatsBar summary={data?.summary} />
          
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex flex-col relative h-full p-4 overflow-hidden">
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
                  {selectedFile ? (
                    <DrillDown 
                      file={selectedFile} 
                      onBack={() => setSelectedFile(null)} 
                      threshold={threshold}
                    />
                  ) : (
                    <HeatMap 
                      data={filteredData} 
                      onFileClick={(file) => setSelectedFile(file)}
                      onHover={handleHover}
                      hoveredItem={hoveredFile}
                      threshold={threshold}
                    />
                  )}
                </div>
                
                <div className="mt-4 shrink-0">
                  <FilterBar 
                    threshold={threshold} 
                    setThreshold={setThreshold}
                    showOnlyNeverCalled={showOnlyNeverCalled}
                    setShowOnlyNeverCalled={setShowOnlyNeverCalled}
                    languageFilter={languageFilter}
                    setLanguageFilter={setLanguageFilter}
                  />
                </div>
            </div>
            
            <Sidebar data={filteredData} threshold={threshold} onFunctionClick={(file) => setSelectedFile(file)} />
          </div>
        </>
      )}

      {hoveredFile && !selectedFile && (
        <Tooltip file={hoveredFile} pos={hoverPos} />
      )}
    </div>
  );
}
