import React, { useState } from 'react';
import { BookOpen, Search, Lock, Eye, FileText, AlertTriangle } from 'lucide-react';

const IntelDatabase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);

  const entries = [
    {
      id: 'INT-001',
      title: 'The Merchant - Founder Dossier',
      classification: 'O4+',
      category: 'PERSONNEL',
      date: '20██-03-██',
      restricted: true,
      summary: 'Complete biographical data and operational history of Director ████████ "Merchant", founder of the Order of the White Lotus.',
      content: '[ACCESS RESTRICTED TO O4+ CLEARANCE]\n\nOriginal UNGOC designation: ████████\nDefection date: May 20██\nCurrent status: [UNKNOWN]\nLast known location: ████████████████\n\nThe Merchant departed from active leadership following the discovery of civilian casualties during early operations. His current whereabouts remain unknown, though some operatives report occasional communications...'
    },
    {
      id: 'INT-002',
      title: 'The Messenger - Entity Profile',
      classification: 'O3+',
      category: 'ANOMALY',
      date: '20██-05-██',
      restricted: true,
      summary: 'Comprehensive analysis of the anomalous entity known as "The Messenger" that appeared during the Order\'s restructuring.',
      content: 'ENTITY DESIGNATION: The Messenger\nTHREAT LEVEL: UNDEFINED\n\nPHYSICAL DESCRIPTION:\n- Tall humanoid figure (est. 2.5m)\n- Pitch-black skin composition\n- No discernible facial features\n- Appears to manifest at will\n\nCAPABILITIES:\n- Omnipresence (confirmed on multiple cameras simultaneously)\n- Psychic influence on unprotected personnel\n- Communication through unknown means\n\nNOTES: High Command negotiated terms with this entity. Details remain classified at O5 level. Personnel experiencing visions should report immediately.'
    },
    {
      id: 'INT-003',
      title: 'Site-416 - Foundation Facility Report',
      classification: 'E3+',
      category: 'FACILITY',
      date: '20██-08-██',
      restricted: false,
      summary: 'Comprehensive intelligence report on SCP Foundation Site-416, including layout, personnel, and containment information.',
      content: 'FACILITY: Site-416\nLOCATION: ████████, [REDACTED]\nPURPOSE: Humanoid containment and research\n\nKNOWN DEPARTMENTS:\n- Containment Division\n- Research & Development\n- Security Department\n- Medical Bay\n- Class-D Processing\n\nSECURITY LEVEL: High\n\nNOTES: Mortician Wing personnel have been granted Level 3 access for collaborative research. Masquerade operatives are embedded in multiple departments. Report unusual activity through secure channels.'
    },
    {
      id: 'INT-004',
      title: 'Endbringer Project - Technical Overview',
      classification: 'O2+',
      category: 'PROJECT',
      date: '20██-11-██',
      restricted: true,
      summary: 'Technical specifications and development history of the Endbringer armor system used by Iron Lotus Battalion.',
      content: '[PARTIAL DECLASSIFICATION - O2+ CLEARANCE]\n\nPROJECT CODENAME: Endbringer\nDEVELOPMENT: Mortician Wing + Anderson Robotics\n\nOVERVIEW:\nThe Endbringer system is an advanced combat exoskeleton incorporating anomalous technology. Designed to enhance operative capabilities while maintaining cognitive function.\n\nSPECIFICATIONS:\n- Armor rating: ████████\n- Strength enhancement: ███%\n- Integrated weapons: [CLASSIFIED]\n- Stimulant system: Regulated\n\nMORTALITY RATE: Reduced to ██% (Phase 3)\n\nWARNING: Unauthorized access to Endbringer equipment is punishable by termination.'
    },
    {
      id: 'INT-005',
      title: 'Operation Fallen Star - After Action Report',
      classification: 'E4+',
      category: 'OPERATION',
      date: '20██-02-██',
      restricted: false,
      summary: 'Detailed report on the engagement with Ordo Divinus forces and artifact recovery mission.',
      content: 'OPERATION: Fallen Star\nDATE: 20██-02-██\nLOCATION: [REDACTED], Germany\nCOMMANDER: Captain "Icarus"\n\nMISSION SUMMARY:\nGround Team Division patrol encountered hostile Ordo Divinus forces near a suspected ritual site. Engagement resulted in recovery of anomalous artifact designated OWL-ART-019.\n\nCASUALTIES:\n- 3 KIA (Ground Team)\n- 7 enemy combatants neutralized\n\nARTIFACT STATUS:\nCurrently under Mortician Wing analysis. Preliminary findings suggest connections to [REDACTED].\n\nRECOMMENDATIONS:\n- Increase security at nearby safe houses\n- Deploy additional reconnaissance assets\n- Request Iron Lotus support for follow-up operations'
    },
    {
      id: 'INT-006',
      title: 'OWL Rank Structure - Official Guide',
      classification: 'E1+',
      category: 'REFERENCE',
      date: '20██-01-██',
      restricted: false,
      summary: 'Complete breakdown of Order of the White Lotus rank structure and promotion requirements.',
      content: 'ORDER OF THE WHITE LOTUS - RANK STRUCTURE\n\nENLISTED RANKS (E1-E8):\n[E1] Entry Level - Post-tryout\n[E2] Enlightened Operative\n[E3] Enlightened First Class Operative\n[E4] Enlightened Senior Operative\n[E5] Enlightened Staff Sergeant (NCO)\n[E6] Enlightened Technical Sergeant\n[E7] Enlightened Master Sergeant\n[E8] First Sergeant of The Order\n\nOFFICER RANKS (O1-O6):\n[O1] Enlightened Second Lieutenant\n[O2] Enlightened First Lieutenant\n[O3] Enlightened Captain\n[O4] Enlightened Major\n[O5] Assistant Director / Lieutenant Colonel\n[O6] Director / Colonel\n\nPROMOTION REQUIREMENTS:\n- Training sessions attendance\n- Deployment participation\n- Specialized training completion\n- Officer recommendation (O1+)'
    }
  ];

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryColor = (category) => {
    switch (category) {
      case 'PERSONNEL': return 'text-blue-400 border-blue-400';
      case 'ANOMALY': return 'text-red-400 border-red-400';
      case 'FACILITY': return 'text-green-400 border-green-400';
      case 'PROJECT': return 'text-purple-400 border-purple-400';
      case 'OPERATION': return 'text-orange-400 border-orange-400';
      default: return 'text-green-500 border-green-500';
    }
  };

  return (
    <div className="space-y-6" data-testid="intel-database">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-wider mb-2 flex items-center justify-center gap-3">
          <BookOpen size={24} /> INTEL DATABASE
        </h2>
        <p className="text-green-500/60 text-sm">Classified intelligence repository</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500/50" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search intel database..."
          className="owl-input pl-9"
          data-testid="intel-search"
        />
      </div>

      {/* Selected Entry Detail */}
      {selectedEntry && (
        <div className="owl-panel" data-testid="intel-detail">
          <div className="owl-panel-header">
            <span className="text-xs font-mono">{selectedEntry.id}</span>
            <button onClick={() => setSelectedEntry(null)} className="text-green-500/60 hover:text-green-500">
              ✕
            </button>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">{selectedEntry.title}</h3>
              <span className={`text-xs border px-2 py-0.5 ${getCategoryColor(selectedEntry.category)}`}>
                {selectedEntry.category}
              </span>
            </div>
            <div className="flex gap-4 text-xs text-green-500/60">
              <span>Classification: <span className="text-yellow-500">{selectedEntry.classification}</span></span>
              <span>Date: {selectedEntry.date}</span>
            </div>
            {selectedEntry.restricted && (
              <div className="flex items-center gap-2 text-red-500 text-xs">
                <Lock size={12} />
                <span>RESTRICTED ACCESS - CLEARANCE VERIFICATION REQUIRED</span>
              </div>
            )}
            <div className="border-t border-green-500/20 pt-4">
              <pre className={`text-sm whitespace-pre-wrap font-mono leading-relaxed ${selectedEntry.restricted ? 'text-green-500/70' : ''}`}>
                {selectedEntry.content}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Entries List */}
      <div className="space-y-2">
        {filteredEntries.map((entry) => (
          <div 
            key={entry.id}
            className="owl-panel cursor-pointer hover:border-green-500/50 transition-colors"
            onClick={() => setSelectedEntry(entry)}
            data-testid={`intel-${entry.id}`}
          >
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-xs font-mono text-green-500/60">{entry.id}</div>
                <div>
                  <div className="font-bold text-sm flex items-center gap-2">
                    {entry.restricted && <Lock size={12} className="text-yellow-500" />}
                    {entry.title}
                  </div>
                  <div className="text-xs text-green-500/60 mt-1">{entry.summary.substring(0, 80)}...</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs border px-2 py-0.5 ${getCategoryColor(entry.category)}`}>
                  {entry.category}
                </span>
                <Eye size={14} className="text-green-500/40" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-12 text-green-500/60">
          <FileText size={48} className="mx-auto mb-4 opacity-50" />
          <p>No matching intel records found.</p>
        </div>
      )}

      {/* Footer */}
      <div className="border border-yellow-500/30 bg-yellow-500/5 p-4 flex items-start gap-3">
        <AlertTriangle className="text-yellow-500 shrink-0" size={16} />
        <p className="text-xs text-yellow-500/80">
          Access to certain documents may be restricted based on your clearance level. 
          Attempting to access restricted documents without proper authorization will be logged and reported.
        </p>
      </div>
    </div>
  );
};

export default IntelDatabase;
