import React, { useState, useEffect } from 'react';
import { Map, Target, AlertTriangle } from 'lucide-react';

const OperationsMap = () => {
  const [blinkState, setBlinkState] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkState(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const operations = [
    { id: 1, name: 'Site-416', type: 'HQ', status: 'secure', x: 45, y: 35 },
    { id: 2, name: 'Outpost Jericho', type: 'outpost', status: 'alert', x: 72, y: 28 },
    { id: 3, name: 'Alpha Team', type: 'team', status: 'active', x: 25, y: 55 },
    { id: 4, name: 'Bravo Team', type: 'team', status: 'deployed', x: 58, y: 62 },
    { id: 5, name: 'OD Activity', type: 'hostile', status: 'hostile', x: 82, y: 45 },
    { id: 6, name: 'SoTA Cell', type: 'hostile', status: 'monitoring', x: 15, y: 25 },
    { id: 7, name: 'Research Lab 7', type: 'facility', status: 'secure', x: 38, y: 70 },
  ];

  const getMarkerStyle = (op) => {
    const base = 'absolute w-3 h-3 transform -translate-x-1/2 -translate-y-1/2 border';
    
    switch (op.status) {
      case 'hostile':
        return `${base} bg-red-500/50 border-red-500 ${blinkState ? 'opacity-100' : 'opacity-50'}`;
      case 'alert':
        return `${base} bg-yellow-500/50 border-yellow-500 ${blinkState ? 'opacity-100' : 'opacity-70'}`;
      case 'active':
      case 'deployed':
        return `${base} bg-green-500/50 border-green-500`;
      case 'monitoring':
        return `${base} bg-orange-500/30 border-orange-500 ${blinkState ? 'opacity-80' : 'opacity-40'}`;
      default:
        return `${base} bg-green-500/30 border-green-500/50`;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'hostile': return <span className="text-red-500">HOSTILE</span>;
      case 'alert': return <span className="text-yellow-500">ALERT</span>;
      case 'active': return <span className="text-green-400">ACTIVE</span>;
      case 'deployed': return <span className="text-green-400">DEPLOYED</span>;
      case 'monitoring': return <span className="text-orange-500">MONITORING</span>;
      default: return <span className="text-green-500/60">SECURE</span>;
    }
  };

  return (
    <div className="owl-panel" data-testid="operations-map">
      <div className="owl-panel-header">
        <span className="text-xs uppercase tracking-wider flex items-center gap-2">
          <Map size={14} /> Live Operations Map
        </span>
        <span className="text-xs text-green-500/60 flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full bg-green-500 ${blinkState ? 'opacity-100' : 'opacity-50'}`}></span>
          LIVE
        </span>
      </div>
      <div className="owl-panel-content p-2">
        {/* Map container */}
        <div className="relative h-48 border border-green-500/30 bg-black/80 overflow-hidden">
          {/* Grid overlay */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(53, 226, 121, 0.3) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(53, 226, 121, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
          
          {/* World outline (simplified) */}
          <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M10,30 Q20,20 35,25 T50,20 T70,25 T85,30 L90,50 Q85,60 75,55 T60,60 T45,65 T30,60 Q20,55 15,45 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-green-500"
            />
            <path
              d="M55,70 Q65,65 75,70 T85,75 L80,85 Q70,80 60,82 T50,80 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-green-500"
            />
          </svg>

          {/* Operation markers */}
          {operations.map((op) => (
            <div
              key={op.id}
              className={getMarkerStyle(op)}
              style={{ left: `${op.x}%`, top: `${op.y}%` }}
              title={op.name}
            >
              {op.type === 'hostile' && (
                <AlertTriangle size={8} className="text-red-500 absolute -top-3 -left-1" />
              )}
            </div>
          ))}

          {/* Coordinate display */}
          <div className="absolute bottom-1 right-1 text-[8px] text-green-500/40 font-mono">
            GRID: GLOBAL-OWL-7
          </div>
        </div>

        {/* Legend */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          {operations.slice(0, 6).map((op) => (
            <div key={op.id} className="flex items-center gap-2">
              {op.type === 'hostile' ? (
                <Target size={10} className="text-red-500" />
              ) : (
                <div className={`w-2 h-2 ${op.status === 'alert' ? 'bg-yellow-500' : op.status === 'hostile' ? 'bg-red-500' : 'bg-green-500'}`} />
              )}
              <span className="truncate">{op.name}</span>
              <span className="ml-auto">{getStatusLabel(op.status)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OperationsMap;
