import React, { useState } from 'react';
import { Users, ChevronDown, ChevronUp, Shield } from 'lucide-react';

const PersonnelRoster = () => {
  const [expandedDivision, setExpandedDivision] = useState(null);

  const divisions = [
    {
      id: 'gtd',
      name: 'Ground Team Division',
      count: 28,
      description: 'Primary combat force - offensive and defensive operations',
      personnel: [
        { rank: 'O3', name: 'Captain "Icarus"', status: 'Active', role: 'Division Lead' },
        { rank: 'E7', name: 'MSgt "Warden"', status: 'Active', role: 'Squad Leader' },
        { rank: 'E5', name: 'SSgt "Ghost"', status: 'Deployed', role: 'Fire Team Lead' },
        { rank: 'E4', name: '████████', status: '[CLASSIFIED]', role: '████████' },
      ]
    },
    {
      id: 'ilb',
      name: 'Iron Lotus Battalion',
      count: 8,
      description: 'Elite special operations - Endbringer Project operatives',
      personnel: [
        { rank: 'O2', name: 'Lt "Specter"', status: 'Active', role: 'Battalion Commander' },
        { rank: 'E8', name: 'FSgt "Reaper"', status: 'Active', role: 'Strike Team Alpha' },
        { rank: 'E6', name: 'TSgt "Phantom"', status: 'Deployed', role: 'Strike Team Beta' },
        { rank: 'E5', name: '████████', status: '[REDACTED]', role: 'Endbringer' },
      ]
    },
    {
      id: 'mw',
      name: "Mortician Wing",
      count: 6,
      description: 'Research and medical support - anomaly analysis',
      personnel: [
        { rank: 'O2', name: 'Dr. "Surgeon"', status: 'Active', role: 'Wing Director' },
        { rank: 'E6', name: 'Mortician "Scalpel"', status: 'Active', role: 'Senior Researcher' },
        { rank: 'E4', name: 'Coroner "Needle"', status: 'Lab', role: 'Field Medic' },
        { rank: 'E2', name: 'Apprentice ████', status: 'Training', role: 'Lab Assistant' },
      ]
    },
    {
      id: 'mi',
      name: 'Masquerade Initiative',
      count: 5,
      description: 'Intelligence and infiltration - diplomacy and espionage',
      personnel: [
        { rank: 'O1', name: 'Agent "Echo"', status: 'Embedded', role: 'Initiative Lead' },
        { rank: 'E6', name: 'Agent "Whisper"', status: 'Embedded', role: 'Site-416 Operative' },
        { rank: 'E5', name: 'Agent "Shadow"', status: 'Active', role: 'Intel Analyst' },
        { rank: 'E3', name: 'Agent "████████"', status: '[COMPROMISED]', role: '████████' },
      ]
    }
  ];

  const getStatusColor = (status) => {
    if (status.includes('Active')) return 'text-green-400';
    if (status.includes('Deployed') || status.includes('Embedded')) return 'text-yellow-500';
    if (status.includes('CLASSIFIED') || status.includes('REDACTED') || status.includes('COMPROMISED')) return 'text-red-500';
    return 'text-green-500/60';
  };

  return (
    <div className="owl-panel" data-testid="personnel-roster">
      <div className="owl-panel-header">
        <span className="text-xs uppercase tracking-wider flex items-center gap-2">
          <Users size={14} /> Personnel Roster
        </span>
        <span className="text-xs text-green-500/60">47 Active</span>
      </div>
      <div className="owl-panel-content">
        <div className="space-y-2">
          {divisions.map((division) => (
            <div key={division.id} className="border border-green-500/20">
              <button
                onClick={() => setExpandedDivision(expandedDivision === division.id ? null : division.id)}
                className="w-full p-2 flex items-center justify-between hover:bg-green-500/5 transition-colors"
                data-testid={`division-${division.id}`}
              >
                <div className="flex items-center gap-2">
                  <Shield size={12} className="text-green-500/60" />
                  <span className="text-xs font-bold">{division.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-green-500/60">{division.count} operatives</span>
                  {expandedDivision === division.id ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </div>
              </button>
              
              {expandedDivision === division.id && (
                <div className="p-2 bg-black/50 border-t border-green-500/20">
                  <p className="text-xs text-green-500/60 mb-3">{division.description}</p>
                  <table className="owl-table w-full">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Callsign</th>
                        <th>Status</th>
                        <th>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {division.personnel.map((person, idx) => (
                        <tr key={idx}>
                          <td className="text-yellow-500">{person.rank}</td>
                          <td>{person.name}</td>
                          <td className={getStatusColor(person.status)}>{person.status}</td>
                          <td className="text-green-500/60">{person.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-2 text-xs text-green-500/40 text-center">
                    [FULL ROSTER REQUIRES O2+ CLEARANCE]
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonnelRoster;
