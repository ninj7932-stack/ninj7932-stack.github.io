import React, { useState } from 'react';
import { Skull, AlertTriangle, Shield, Eye, ChevronDown, ChevronUp } from 'lucide-react';

const RivalFactions = () => {
  const [expandedFaction, setExpandedFaction] = useState(null);

  const factions = [
    {
      id: 'ordo-divinus',
      name: 'Ordo Divinus',
      alias: 'OD',
      threatLevel: 'CRITICAL',
      status: 'ACTIVE THREAT',
      description: 'A fanatical religious cult that believes anomalies are divine manifestations. They seek to collect and worship anomalous entities, often conducting dangerous rituals that result in civilian casualties.',
      operations: [
        'Ritual site located near ████████, Germany',
        'Attempted acquisition of SCP-████ from Foundation custody',
        'Responsible for the ████████ incident resulting in 47 casualties'
      ],
      knownMembers: [
        { name: 'High Priest "Seraphim"', role: 'Leader', status: 'At Large' },
        { name: 'Acolyte ████████', role: 'Operations', status: 'Neutralized' },
        { name: 'Brother "Malachi"', role: 'Recruitment', status: 'At Large' }
      ],
      advisory: 'ENGAGE WITH EXTREME CAUTION. OD operatives are known to use anomalous artifacts in combat. Do not attempt solo engagements.',
      image: 'https://images.unsplash.com/photo-1661115111416-024117fe1326?w=400'
    },
    {
      id: 'sons-of-allfather',
      name: 'Sons of the Allfather',
      alias: 'SoTA',
      threatLevel: 'HIGH',
      status: 'MONITORING',
      description: 'A militant neo-pagan organization that believes in using anomalies to "purify" humanity. They operate primarily in Northern Europe and have connections to extremist groups.',
      operations: [
        'Active recruitment in Scandinavian countries',
        'Underground facility suspected in ████████, Norway',
        'Known to possess at least 3 anomalous artifacts'
      ],
      knownMembers: [
        { name: 'Jarl "Fenrir"', role: 'Warlord', status: 'At Large' },
        { name: 'Skald "Raven"', role: 'Propaganda', status: 'At Large' },
        { name: 'Berserker ████████', role: 'Enforcement', status: 'Captured' }
      ],
      advisory: 'Members are heavily armed and trained in guerrilla tactics. Coordinate with local authorities before engagement.',
      image: null
    },
    {
      id: 'scp-foundation',
      name: 'SCP Foundation',
      alias: 'The Foundation',
      threatLevel: 'COMPLEX',
      status: 'NON-HOSTILE',
      description: 'The largest organization dedicated to containing anomalies. While not directly hostile to OWL, their methods of containment and treatment of Class-D personnel remain a primary concern for our operations.',
      operations: [
        'Global network of containment sites',
        'Collaboration protocol established via Mortician Wing',
        'Ongoing monitoring of Foundation ethics violations'
      ],
      knownMembers: [
        { name: 'O5 Council', role: 'Leadership', status: 'Unknown' },
        { name: 'The Administrator', role: 'Overseer', status: 'Unknown' },
        { name: 'Site-416 Director', role: 'Local Authority', status: 'Monitored' }
      ],
      advisory: 'Maintain professional relations. Report any ethics violations through proper channels. Do not compromise Masquerade operatives.',
      image: null
    },
    {
      id: 'goc',
      name: 'Global Occult Coalition',
      alias: 'GOC / UNGOC',
      threatLevel: 'MODERATE',
      status: 'FORMER AFFILIATION',
      description: 'The organization from which the Order originated. The GOC prioritizes destruction of anomalies over study or containment. Our founders departed due to disagreements with their methods.',
      operations: [
        'UN-sanctioned anomaly elimination operations',
        'Known to destroy beneficial anomalies without assessment',
        'Active surveillance of OWL activities'
      ],
      knownMembers: [
        { name: 'Assessment Team ████', role: 'Field Ops', status: 'Active' },
        { name: 'Strike Team "Hammer"', role: 'Elimination', status: 'Active' },
        { name: 'Liaison Officer ████████', role: 'Diplomacy', status: 'Contact' }
      ],
      advisory: 'Exercise caution. Some GOC personnel remain sympathetic to our cause. Do not reveal operational details.',
      image: null
    }
  ];

  const getThreatColor = (level) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-500 border-red-500';
      case 'HIGH': return 'text-orange-500 border-orange-500';
      case 'MODERATE': return 'text-yellow-500 border-yellow-500';
      default: return 'text-green-500 border-green-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'At Large': return 'text-red-500';
      case 'Neutralized': return 'text-green-500';
      case 'Captured': return 'text-yellow-500';
      default: return 'text-green-500/60';
    }
  };

  return (
    <div className="space-y-6" data-testid="rival-factions">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-wider mb-2 flex items-center justify-center gap-3">
          <Skull size={24} /> RIVAL FACTION DOSSIERS
        </h2>
        <p className="text-green-500/60 text-sm">Intelligence database on known hostile and monitored organizations</p>
      </div>

      {/* Warning Banner */}
      <div className="border border-red-500/50 bg-red-500/10 p-4 flex items-center gap-3">
        <AlertTriangle className="text-red-500 shrink-0" size={20} />
        <div className="text-sm">
          <span className="text-red-500 font-bold">CLASSIFIED INTELLIGENCE</span>
          <span className="text-red-400"> - This information is restricted to E3+ clearance. Unauthorized disclosure is punishable under OWL Regulation 7.4.</span>
        </div>
      </div>

      {/* Faction Cards */}
      <div className="space-y-4">
        {factions.map((faction) => (
          <div key={faction.id} className="owl-panel" data-testid={`faction-${faction.id}`}>
            <div 
              className="owl-panel-header cursor-pointer"
              onClick={() => setExpandedFaction(expandedFaction === faction.id ? null : faction.id)}
            >
              <div className="flex items-center gap-3">
                <Skull size={16} className={getThreatColor(faction.threatLevel).split(' ')[0]} />
                <span className="font-bold">{faction.name}</span>
                <span className="text-xs text-green-500/60">({faction.alias})</span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs border px-2 py-0.5 ${getThreatColor(faction.threatLevel)}`}>
                  {faction.threatLevel}
                </span>
                {expandedFaction === faction.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {expandedFaction === faction.id && (
              <div className="p-4 space-y-4 border-t border-green-500/20">
                {/* Status & Image */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="text-xs text-green-500/60 mb-1">STATUS</div>
                    <div className={`text-sm font-bold ${faction.status === 'ACTIVE THREAT' ? 'text-red-500' : 'text-yellow-500'}`}>
                      {faction.status}
                    </div>
                  </div>
                  {faction.image && (
                    <div className="w-24 h-24 border border-green-500/30 overflow-hidden">
                      <img src={faction.image} alt={faction.name} className="w-full h-full object-cover opacity-70 grayscale" />
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <div className="text-xs text-green-500/60 mb-1">OVERVIEW</div>
                  <p className="text-sm text-green-500/80">{faction.description}</p>
                </div>

                {/* Known Operations */}
                <div>
                  <div className="text-xs text-green-500/60 mb-2">KNOWN OPERATIONS</div>
                  <ul className="space-y-1">
                    {faction.operations.map((op, idx) => (
                      <li key={idx} className="text-xs flex items-start gap-2">
                        <ChevronDown size={12} className="shrink-0 mt-0.5 rotate-[-90deg]" />
                        <span>{op}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Known Members */}
                <div>
                  <div className="text-xs text-green-500/60 mb-2">KNOWN PERSONNEL</div>
                  <table className="owl-table">
                    <thead>
                      <tr>
                        <th>Designation</th>
                        <th>Role</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faction.knownMembers.map((member, idx) => (
                        <tr key={idx}>
                          <td>{member.name}</td>
                          <td className="text-green-500/60">{member.role}</td>
                          <td className={getStatusColor(member.status)}>{member.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Advisory */}
                <div className="border border-yellow-500/30 bg-yellow-500/5 p-3">
                  <div className="text-xs text-yellow-500 font-bold mb-1 flex items-center gap-2">
                    <Shield size={12} /> OPERATIONAL ADVISORY
                  </div>
                  <p className="text-xs text-yellow-500/80">{faction.advisory}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="text-center text-xs text-green-500/40 py-4">
        Last Updated: {new Date().toISOString().split('T')[0]} | Intelligence Division | Report discrepancies to O2+
      </div>
    </div>
  );
};

export default RivalFactions;
