import { useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { getScoreColor } from '../utils/deadScore';

export default function HeatMap({ data, onFileClick, onHover, hoveredItem, threshold }) {
  const containerRef = useRef(null);

  const root = useMemo(() => {
    if (!data || !data.files || data.files.length === 0) return null;
    
    const hierarchyData = {
      name: "root",
      children: data.files.map(f => ({ ...f, value: f.functions.length || 1 }))
    };
    
    const rootNode = d3.hierarchy(hierarchyData)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);
      
    d3.treemap()
      .size([1000, 600])
      .paddingInner(3)
      .paddingOuter(4)
      .round(true)(rootNode);
      
    return rootNode;
  }, [data]);

  if (!root) {
    return <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
       <p className="text-xl font-medium">No functions found matching criteria</p>
    </div>;
  }

  return (
    <div className="w-full h-full bg-white relative" ref={containerRef}>
      <svg viewBox="0 0 1000 600" className="w-full h-full font-sans text-xs preserve-3d" style={{ display: 'block' }}>
        {root.leaves().map((leaf, i) => {
          const file = leaf.data;
          const width = leaf.x1 - leaf.x0;
          const height = leaf.y1 - leaf.y0;
          
          let bgColor = getScoreColor(file.avgDeadScore);
          const isFaded = file.avgDeadScore < threshold;
          
          return (
            <g key={file.path + i} 
               transform={`translate(${leaf.x0},${leaf.y0})`}
               onClick={() => onFileClick(file)}
               onMouseEnter={(e) => onHover(file, e)}
               onMouseLeave={() => onHover(null, null)}
               className={`cursor-pointer transition-all duration-300 ease-out origin-center block
                          ${isFaded ? 'opacity-30 hover:opacity-100 saturate-50' : 'opacity-100 hover:scale-[1.015]'}`}
               style={{ transformOrigin: 'center' }}
            >
              <rect 
                width={width} 
                height={height} 
                fill={bgColor} 
                rx={6}
                className={`transition-all duration-200 stroke-1 ${hoveredItem?.path === file.path ? 'stroke-white stroke-[3px] filter drop-shadow-md' : 'stroke-transparent'}`}
              />
              {width > 60 && height > 30 && (
                <text 
                  x={8} 
                  y={20} 
                  fill="#ffffff" 
                  className="pointer-events-none font-medium text-[11px] drop-shadow-md truncate"
                >
                  {file.path.split('/').pop()}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  );
}
