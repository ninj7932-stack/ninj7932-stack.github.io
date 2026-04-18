import React, { useState, useEffect } from 'react';
import { Radio, AlertTriangle } from 'lucide-react';
import { getIncidentLogs } from '../utils/localStorage';

const IncidentLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setLogs(getIncidentLogs());
    
    // Refresh logs periodically
    const interval = setInterval(() => {
      setLogs(getIncidentLogs());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getLogStyle = (type) => {
    switch (type) {
      case 'warning':
        return 'text-red-500';
      case 'classified':
        return 'text-yellow-500';
      case 'system':
        return 'text-green-400';
      default:
        return 'text-green-500/80';
    }
  };

  const getLogIcon = (type) => {
    if (type === 'warning') {
      return <AlertTriangle size={10} className="text-red-500" />;
    }
    return null;
  };

  return (
    <div className="owl-panel" data-testid="incident-logs">
      <div className="owl-panel-header">
        <span className="text-xs uppercase tracking-wider flex items-center gap-2">
          <Radio size={14} /> Incident Logs
        </span>
        <span className="text-xs text-green-500/60 animate-pulse">LIVE</span>
      </div>
      <div className="owl-panel-content h-64 overflow-hidden">
        <div className="space-y-2 text-xs font-mono">
          {logs.map((log, index) => (
            <div 
              key={log.id || index}
              className={`flex items-start gap-2 ${getLogStyle(log.type)} fade-in`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {getLogIcon(log.type)}
              <span className="text-green-500/50 shrink-0">{log.timestamp}</span>
              <span className={log.type === 'classified' ? 'redacted-block' : ''}>
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IncidentLogs;
