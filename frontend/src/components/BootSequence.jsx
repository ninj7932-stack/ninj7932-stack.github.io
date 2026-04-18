import React, { useState, useEffect, useCallback } from 'react';
import { playBootBeep, playTyping, playStatic, playSuccess, playError, playWelcome } from '../utils/sounds';

const BootSequence = ({ onComplete, onEnlisting, soundEnabled }) => {
  const [lines, setLines] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [operativeId, setOperativeId] = useState('');
  const [clearanceCode, setClearanceCode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [welcomeSubtext, setWelcomeSubtext] = useState('');

  const bootMessages = [
    { text: '> INITIALIZING OWL-SYS v4.16.2...', delay: 0 },
    { text: '> LOADING SECURE MODULES...', delay: 300 },
    { text: '> ESTABLISHING ENCRYPTED CONNECTION...', delay: 600 },
    { text: '> CONNECTING TO MASQUERADE NETWORK...', delay: 900 },
    { text: '> VERIFYING SECURITY PROTOCOLS...', delay: 1200 },
    { text: '> SCANNING FOR HOSTILE INTERFERENCE...', delay: 1500 },
    { text: '> ████████████████████████████████', delay: 1800 },
    { text: '> [CLASSIFIED DATA BLOCK DETECTED]', delay: 2000 },
    { text: '', delay: 2300 },
    { text: '═══════════════════════════════════════════════════════════════', delay: 2500 },
    { text: '', delay: 2700 },
    { text: '   ▄██████▄   ▄█     █▄   ▄█       ', delay: 2900 },
    { text: '  ███    ███ ███     ███ ███       ', delay: 3000 },
    { text: '  ███    ███ ███     ███ ███       ', delay: 3100 },
    { text: '  ███    ███ ███     ███ ███       ', delay: 3200 },
    { text: '  ███    ███ ███     ███ ███       ', delay: 3300 },
    { text: '  ███    ███ ███     ███ ███       ', delay: 3400 },
    { text: '  ███    ███ ███ ▄█▄ ███ ███▌    ▄', delay: 3500 },
    { text: '   ▀██████▀   ▀███▀███▀  █████▄▄██', delay: 3600 },
    { text: '', delay: 3800 },
    { text: '   ORDER OF THE WHITE LOTUS', delay: 4000 },
    { text: '   MASQUERADE INITIATIVE - SECURE ACCESS TERMINAL', delay: 4300 },
    { text: '', delay: 4600 },
    { text: '═══════════════════════════════════════════════════════════════', delay: 4800 },
    { text: '', delay: 5000 },
    { text: '   "BE INFORMED. BE ENLIGHTENED."', delay: 5200 },
    { text: '              — The Merchant, Founder', delay: 5500 },
    { text: '', delay: 5800 },
    { text: '> WARNING: UNAUTHORIZED ACCESS WILL BE LOGGED AND TRACED', delay: 6100 },
    { text: '> WARNING: ALL ACTIVITIES ARE MONITORED BY MASQUERADE INTEL', delay: 6400 },
    { text: '> OPERATIONAL STATUS: ACTIVE', delay: 6700 },
    { text: '', delay: 7000 },
    { text: '> SYSTEM READY — AUTHENTICATION REQUIRED...', delay: 7300 },
  ];

  useEffect(() => {
    if (soundEnabled) {
      playStatic(200);
    }

    bootMessages.forEach(({ text, delay }) => {
      setTimeout(() => {
        if (soundEnabled && text.startsWith('>')) {
          playTyping();
        }
        setLines(prev => [...prev, text]);
      }, delay);
    });

    const loadingInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          return 100;
        }
        return prev + 3;
      });
    }, 80);

    setTimeout(() => {
      setShowLogin(true);
      if (soundEnabled) playBootBeep();
    }, 8000);

    return () => clearInterval(loadingInterval);
  }, [soundEnabled]);

  const validateAndLogin = useCallback(() => {
    setLoginError('');
    
    // Special case: "Enlisting." opens enlisting page
    if (operativeId.trim() === 'Enlisting.') {
      if (soundEnabled) playSuccess();
      setLoginSuccess(true);
      setWelcomeMessage('WELCOME, FUTURE OPERATIVE');
      setWelcomeSubtext('Preparing enlistment protocols...');
      setTimeout(() => {
        onEnlisting();
      }, 2500);
      return;
    }

    // Special case: "TaskMaster" without rank
    if (operativeId.trim() === 'TaskMaster') {
      if (soundEnabled) playWelcome();
      setLoginSuccess(true);
      setWelcomeMessage('WELCOME TASK MASTER');
      setWelcomeSubtext('Supreme Command Authority Recognized');
      setTimeout(() => {
        onComplete({
          operativeId: 'TaskMaster',
          displayName: 'Task Master',
          rank: 'O5',
          clearanceLevel: '[O5] Task Master',
          isAdmin: true,
          loginTime: new Date().toISOString()
        });
      }, 3000);
      return;
    }

    // Check password
    if (clearanceCode !== 'Endure.') {
      setLoginError('INVALID CLEARANCE CODE');
      if (soundEnabled) playError();
      return;
    }

    // Parse rank from Operative ID - must start with [E1] through [O5]
    const rankMatch = operativeId.match(/^\[(E[1-8]|O[1-5])\]\s*(.+)?$/i);
    
    if (!rankMatch) {
      setLoginError('INVALID FORMAT — Use [RANK] Name (e.g., [E1] Shadow)');
      if (soundEnabled) playError();
      return;
    }

    const rank = rankMatch[1].toUpperCase();
    const name = rankMatch[2]?.trim() || 'Operative';
    const isAdmin = rank === 'O5';

    // Determine welcome message based on rank
    let welcome = '';
    let subtext = '';
    let clearanceDisplay = `[${rank}] ${name}`;
    
    switch (rank) {
      case 'O5':
        welcome = 'WELCOME DIRECTOR';
        subtext = 'Board of Directors Access Granted';
        break;
      case 'O4':
        welcome = 'WELCOME MAJOR';
        subtext = 'Senior Officer Clearance Verified';
        break;
      case 'O3':
        welcome = 'WELCOME CAPTAIN';
        subtext = 'Officer Command Access Granted';
        break;
      case 'O2':
        welcome = 'WELCOME FIRST LIEUTENANT';
        subtext = 'Officer Clearance Verified';
        break;
      case 'O1':
        welcome = 'WELCOME SECOND LIEUTENANT';
        subtext = 'Junior Officer Access Granted';
        break;
      case 'E8':
        welcome = 'WELCOME FIRST SERGEANT';
        subtext = 'Senior NCO Clearance Verified';
        break;
      case 'E7':
        welcome = 'WELCOME MASTER SERGEANT';
        subtext = 'NCO Access Granted';
        break;
      case 'E6':
        welcome = 'WELCOME TECHNICAL SERGEANT';
        subtext = 'NCO Clearance Verified';
        break;
      case 'E5':
        welcome = 'WELCOME STAFF SERGEANT';
        subtext = 'NCO Access Granted';
        break;
      case 'E4':
        welcome = 'WELCOME SENIOR OPERATIVE';
        subtext = 'Enlisted Clearance Verified';
        break;
      case 'E3':
        welcome = 'WELCOME FIRST CLASS OPERATIVE';
        subtext = 'Standard Access Granted';
        break;
      case 'E2':
        welcome = 'WELCOME OPERATIVE';
        subtext = 'Basic Clearance Verified';
        break;
      case 'E1':
        welcome = 'WELCOME OPERATIVE';
        subtext = 'Trainee Access Granted';
        break;
      default:
        welcome = 'WELCOME OPERATIVE';
        subtext = 'Access Granted';
    }

    if (soundEnabled) playWelcome();
    setLoginSuccess(true);
    setWelcomeMessage(welcome);
    setWelcomeSubtext(subtext);

    setTimeout(() => {
      onComplete({
        operativeId: operativeId,
        displayName: name,
        rank: rank,
        clearanceLevel: clearanceDisplay,
        isAdmin: isAdmin,
        loginTime: new Date().toISOString()
      });
    }, 3000);
  }, [operativeId, clearanceCode, onComplete, onEnlisting, soundEnabled]);

  const handleLogin = useCallback((e) => {
    e.preventDefault();
    validateAndLogin();
  }, [validateAndLogin]);

  return (
    <div className="fixed inset-0 bg-[#0a0a0f] z-50 overflow-hidden" data-testid="boot-sequence">
      <div className="crt-scanlines"></div>
      
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `linear-gradient(rgba(212,175,55,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>
      
      <div className="h-full flex flex-col items-center justify-center p-4 relative z-10">
        {/* Boot text output */}
        <div className="w-full max-w-3xl mb-8 font-mono text-sm">
          <div className="h-[320px] overflow-hidden">
            {lines.map((line, index) => (
              <div 
                key={index} 
                className={`text-reveal ${line.includes('WARNING') ? 'text-red-500' : line.includes('ORDER') || line.includes('MASQUERADE') ? 'text-[#d4af37]' : 'text-white/90'}`}
                style={{ 
                  animationDelay: `${index * 30}ms`,
                  fontFamily: "'Share Tech Mono', monospace"
                }}
              >
                {line || '\u00A0'}
              </div>
            ))}
          </div>
        </div>

        {/* Loading bar */}
        {!showLogin && (
          <div className="w-full max-w-md text-center" data-testid="loading-bar">
            <div className="text-white/60 text-xs mb-3 uppercase tracking-[0.3em]" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              System Initialization: {loadingProgress}%
            </div>
            <div className="loading-bar mx-auto">
              <div 
                className="loading-bar-fill"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Login form */}
        {showLogin && !loginSuccess && (
          <div className="w-full max-w-lg border border-[#d4af37]/30 p-8 bg-[#12121a]/90 backdrop-blur-sm border-glow" data-testid="login-form">
            <div className="text-center mb-8">
              <div className="text-[#d4af37] text-2xl font-bold mb-2 tracking-[0.2em]" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                AUTHENTICATION REQUIRED
              </div>
              <div className="text-white/50 text-sm tracking-wider">
                Enter credentials to access the Masquerade Terminal
              </div>
            </div>

            {loginError && (
              <div className="text-center mb-6 p-3 border border-red-500/50 bg-red-500/10" data-testid="access-denied">
                <div className="text-xl font-bold text-red-500 tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  {loginError}
                </div>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-6">
                <label className="owl-label">
                  Operative ID
                </label>
                <input
                  type="text"
                  value={operativeId}
                  onChange={(e) => setOperativeId(e.target.value)}
                  className="terminal-input"
                  placeholder="[E1] YourName"
                  autoComplete="off"
                  data-testid="operative-id-input"
                />
                <div className="text-white/30 text-xs mt-2">
                  Format: [Rank] Name — Example: [E3] Shadow
                </div>
              </div>
              <div className="mb-8">
                <label className="owl-label">
                  Clearance Code
                </label>
                <input
                  type="password"
                  value={clearanceCode}
                  onChange={(e) => setClearanceCode(e.target.value)}
                  className="terminal-input"
                  placeholder="Enter clearance code..."
                  autoComplete="off"
                  data-testid="clearance-code-input"
                />
              </div>
              <button
                type="submit"
                className="owl-btn owl-btn-accent w-full py-4 text-base"
                data-testid="login-submit-btn"
              >
                AUTHENTICATE
              </button>
            </form>
            
            <div className="mt-6 text-center text-white/30 text-xs">
              "Against All Odds We Endure"
            </div>
          </div>
        )}

        {/* Login success - Dramatic welcome */}
        {loginSuccess && (
          <div className="text-center welcome-popup" data-testid="login-success">
            <div className="mb-2 text-[#d4af37] text-sm uppercase tracking-[0.4em]" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              ▬▬▬ ACCESS GRANTED ▬▬▬
            </div>
            <div className="text-white text-5xl md:text-6xl font-bold mb-4 glow-text tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              {welcomeMessage}
            </div>
            <div className="text-white/60 text-lg tracking-[0.2em] uppercase">
              {welcomeSubtext}
            </div>
            <div className="mt-8 flex justify-center gap-2">
              <div className="w-2 h-2 bg-[#d4af37] animate-pulse"></div>
              <div className="w-2 h-2 bg-[#d4af37] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-[#d4af37] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BootSequence;
