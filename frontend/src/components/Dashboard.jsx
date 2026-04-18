import React, { useState, useEffect } from 'react';
import { Terminal, Shield, FileText, Users, Map, Radio, Skull, BookOpen, UserPlus, Volume2, VolumeX, LogOut } from 'lucide-react';
import { getIncidentLogs, addIncidentLog } from '../utils/localStorage';
import { playClick, playWarning } from '../utils/sounds';
import TerminalConsole from './TerminalConsole';
import IncidentLogs from './IncidentLogs';
import PersonnelRoster from './PersonnelRoster';
import OperationsMap from './OperationsMap';
import CaseFiles from './CaseFiles';
import Propaganda from './Propaganda';
import RivalFactions from './RivalFactions';
import Enlistment from './Enlistment';
import IntelDatabase from './IntelDatabase';
import MasqueradeReports from './MasqueradeReports';

const Dashboard = ({ user, onLogout, soundEnabled, toggleSound }) => {
  const [activeSection, setActiveSection] = useState('home');
  const [incidentLogs, setIncidentLogs] = useState([]);
  const [glitchIntensity, setGlitchIntensity] = useState(1);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    setIncidentLogs(getIncidentLogs());
    
    // Log user login
    addIncidentLog(`[INFO] Operative "${user.displayName}" authenticated - Clearance: ${user.clearanceLevel}`, 'info');
    
    // Random warning popup
    const warningInterval = setInterval(() => {
      if (Math.random() > 0.85) {
        setShowWarning(true);
        if (soundEnabled) playWarning();
        setTimeout(() => setShowWarning(false), 3000);
      }
    }, 30000);

    return () => clearInterval(warningInterval);
  }, [user, soundEnabled]);

  const navItems = [
    { id: 'home', label: 'Home', icon: Terminal },
    { id: 'propaganda', label: 'Propaganda', icon: Radio },
    { id: 'intel', label: 'Intel Database', icon: BookOpen },
    { id: 'masquerade', label: 'Masquerade Reports', icon: Shield },
    { id: 'casefiles', label: 'Case Files', icon: FileText },
    { id: 'rivals', label: 'Rival Factions', icon: Skull },
    { id: 'enlistment', label: 'Enlistment', icon: UserPlus },
  ];

  const handleNavClick = (id) => {
    if (soundEnabled) playClick();
    setActiveSection(id);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="lg:col-span-2">
              <TerminalConsole soundEnabled={soundEnabled} user={user} />
            </div>
            <IncidentLogs logs={incidentLogs} />
            <OperationsMap />
            <PersonnelRoster />
            <div className="owl-panel">
              <div className="owl-panel-header">
                <span className="text-sm uppercase tracking-wider flex items-center gap-2">
                  <Shield size={14} /> System Status
                </span>
              </div>
              <div className="owl-panel-content text-sm space-y-3">
                <div className="flex justify-between">
                  <span>Network Status:</span>
                  <span className="text-white">SECURE</span>
                </div>
                <div className="flex justify-between">
                  <span>Threat Level:</span>
                  <span className="text-yellow-500">ELEVATED</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Operatives:</span>
                  <span>47</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending Missions:</span>
                  <span>12</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Security Scan:</span>
                  <span>00:05:23 ago</span>
                </div>
                <div className="flex justify-between">
                  <span>Encryption:</span>
                  <span className="text-white">AES-256</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'propaganda':
        return <Propaganda />;
      case 'intel':
        return <IntelDatabase />;
      case 'masquerade':
        return <MasqueradeReports user={user} />;
      case 'casefiles':
        return <CaseFiles user={user} soundEnabled={soundEnabled} />;
      case 'rivals':
        return <RivalFactions />;
      case 'enlistment':
        return <Enlistment soundEnabled={soundEnabled} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white crt-screen" data-testid="dashboard">
      <div className="crt-scanlines"></div>
      
      {/* Warning popup */}
      {showWarning && (
        <div className="fixed top-4 right-4 z-50 border border-red-500 bg-black p-4 max-w-sm" data-testid="warning-popup">
          <div className="text-red-500 text-sm font-bold mb-1 flex items-center gap-2">
            <Shield size={14} /> SECURITY ALERT
          </div>
          <div className="text-red-400 text-sm">
            Hostile activity detected in Northern sector. All personnel on standby.
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-white/30 bg-black/80 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div 
                className="lotus-emblem w-12 h-12 flex items-center justify-center border border-white text-xl font-bold cursor-pointer"
                onClick={() => {
                  if (soundEnabled) playClick();
                  setGlitchIntensity(prev => prev === 1 ? 2 : 1);
                }}
                data-testid="lotus-emblem"
              >
                白
              </div>
              <div>
                <div className="text-base font-bold tracking-wider">ORDER OF THE WHITE LOTUS</div>
                <div className="text-sm text-white/60">Masquerade Initiative Terminal</div>
              </div>
            </div>

            {/* User info & controls */}
            <div className="flex items-center gap-4">
              <div className="text-right text-sm hidden sm:block">
                <div>Operative: <span className="text-white font-bold">{user.displayName}</span></div>
                <div>Clearance: <span className="text-yellow-500 font-bold">{user.clearanceLevel}</span></div>
              </div>
              <button
                onClick={toggleSound}
                className="owl-btn p-2"
                title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
                data-testid="sound-toggle"
              >
                {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <button
                onClick={() => {
                  if (soundEnabled) playClick();
                  onLogout();
                }}
                className="owl-btn owl-btn-danger p-2"
                title="Logout"
                data-testid="logout-btn"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-white/20 bg-black/60 overflow-x-auto">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-link flex items-center gap-2 whitespace-nowrap ${activeSection === item.id ? 'active' : ''}`}
                data-testid={`nav-${item.id}`}
              >
                <item.icon size={16} />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className={`container mx-auto px-4 py-6 ${glitchIntensity > 1 ? 'glitch' : ''}`} data-text="">
        {renderSection()}
      </main>

      {/* Footer */}
      <footer className="owl-footer mt-8">
        <div className="mb-2">Order of the White Lotus - Against All Odds We Endure</div>
        <div className="text-red-500/60 text-[10px]">
          WARNING: THIS SYSTEM IS FOR AUTHORIZED PERSONNEL ONLY. ALL ACTIVITIES ARE MONITORED AND LOGGED.
          UNAUTHORIZED ACCESS WILL RESULT IN IMMEDIATE TERMINATION OF ACCESS AND POTENTIAL LEGAL ACTION.
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
