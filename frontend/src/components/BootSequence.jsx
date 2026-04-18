import React, { useState, useEffect, useCallback } from 'react';
import { playBootBeep, playTyping, playStatic, playSuccess } from '../utils/sounds';

const BootSequence = ({ onComplete, soundEnabled }) => {
  const [lines, setLines] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [operativeId, setOperativeId] = useState('');
  const [clearanceCode, setClearanceCode] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [accessDenied, setAccessDenied] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const bootMessages = [
    { text: '> INITIALIZING OWL-SYS v4.16.2...', delay: 0 },
    { text: '> LOADING KERNEL MODULES...', delay: 400 },
    { text: '> ESTABLISHING SECURE CONNECTION...', delay: 800 },
    { text: '> CONNECTING TO SITE-416...', delay: 1200 },
    { text: '> VERIFYING ENCRYPTION PROTOCOLS...', delay: 1600 },
    { text: '> SCANNING FOR ANOMALOUS INTERFERENCE...', delay: 2000 },
    { text: '> ████████████████████████████████', delay: 2400 },
    { text: '> [CLASSIFIED DATA BLOCK DETECTED]', delay: 2600 },
    { text: '> CLEARANCE VERIFICATION REQUIRED...', delay: 3000 },
    { text: '', delay: 3400 },
    { text: '═══════════════════════════════════════════════════', delay: 3600 },
    { text: '', delay: 3800 },
    { text: '  ██████╗ ██╗    ██╗██╗     ', delay: 4000 },
    { text: ' ██╔═══██╗██║    ██║██║     ', delay: 4100 },
    { text: ' ██║   ██║██║ █╗ ██║██║     ', delay: 4200 },
    { text: ' ██║   ██║██║███╗██║██║     ', delay: 4300 },
    { text: ' ╚██████╔╝╚███╔███╔╝███████╗', delay: 4400 },
    { text: '  ╚═════╝  ╚══╝╚══╝ ╚══════╝', delay: 4500 },
    { text: '', delay: 4700 },
    { text: '  ORDER OF THE WHITE LOTUS', delay: 4900 },
    { text: '  MASQUERADE INITIATIVE ACCESS TERMINAL', delay: 5200 },
    { text: '', delay: 5500 },
    { text: '═══════════════════════════════════════════════════', delay: 5700 },
    { text: '', delay: 5900 },
    { text: '  "BE INFORMED. BE ENLIGHTENED."', delay: 6100 },
    { text: '           - The Merchant, Founder', delay: 6500 },
    { text: '', delay: 6900 },
    { text: '> WARNING: UNAUTHORIZED ACCESS WILL BE LOGGED', delay: 7200 },
    { text: '> WARNING: ALL ACTIVITIES ARE MONITORED', delay: 7600 },
    { text: '> THREAT LEVEL: [ELEVATED]', delay: 8000 },
    { text: '', delay: 8400 },
    { text: '> SYSTEM READY. AWAITING AUTHENTICATION...', delay: 8800 },
  ];

  useEffect(() => {
    if (soundEnabled) {
      playStatic(300);
    }

    bootMessages.forEach(({ text, delay }) => {
      setTimeout(() => {
        if (soundEnabled && text.startsWith('>')) {
          playTyping();
        }
        setLines(prev => [...prev, text]);
      }, delay);
    });

    // Start loading bar
    const loadingInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(loadingInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    // Show login after boot sequence
    setTimeout(() => {
      setShowLogin(true);
      if (soundEnabled) playBootBeep();
    }, 9500);

    return () => clearInterval(loadingInterval);
  }, [soundEnabled]);

  const handleLogin = useCallback((e) => {
    e.preventDefault();
    
    if (!operativeId || !clearanceCode) {
      setAccessDenied(true);
      if (soundEnabled) playStatic(200);
      setTimeout(() => setAccessDenied(false), 1000);
      return;
    }

    // Simulate failed attempts for immersion
    if (loginAttempts < 1) {
      setLoginAttempts(prev => prev + 1);
      setAccessDenied(true);
      if (soundEnabled) playStatic(300);
      setTimeout(() => setAccessDenied(false), 1500);
      return;
    }

    // Success on second attempt
    setLoginSuccess(true);
    if (soundEnabled) playSuccess();
    
    setTimeout(() => {
      onComplete({
        operativeId,
        clearanceLevel: determineClearanceLevel(clearanceCode),
        loginTime: new Date().toISOString()
      });
    }, 2000);
  }, [operativeId, clearanceCode, loginAttempts, onComplete, soundEnabled]);

  const determineClearanceLevel = (code) => {
    const lowerCode = code.toLowerCase();
    if (lowerCode.includes('o3') || lowerCode.includes('taskmaster') || lowerCode.includes('director')) {
      return 'O3 - TASK MASTER';
    }
    if (lowerCode.includes('o2') || lowerCode.includes('captain')) {
      return 'O2 - CAPTAIN';
    }
    if (lowerCode.includes('o1')) {
      return 'O1 - LIEUTENANT';
    }
    if (lowerCode.includes('e8') || lowerCode.includes('first sergeant')) {
      return 'E8 - FIRST SERGEANT';
    }
    if (lowerCode.includes('e5') || lowerCode.includes('staff')) {
      return 'E5 - STAFF SERGEANT';
    }
    return 'E1 - OPERATIVE';
  };

  return (
    <div className="fixed inset-0 bg-[#020202] z-50 overflow-hidden crt-screen" data-testid="boot-sequence">
      <div className="crt-scanlines"></div>
      
      <div className="h-full flex flex-col items-center justify-center p-4 screen-flicker">
        {/* Boot text output */}
        <div className="w-full max-w-2xl mb-8 font-mono text-xs sm:text-sm">
          <div className="h-[300px] overflow-hidden">
            {lines.map((line, index) => (
              <div 
                key={index} 
                className={`fade-in ${line.includes('WARNING') ? 'text-red-500' : 'text-green-500'}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {line || '\u00A0'}
              </div>
            ))}
          </div>
        </div>

        {/* Loading bar */}
        {!showLogin && (
          <div className="w-full max-w-md" data-testid="loading-bar">
            <div className="text-green-500 text-xs mb-2 text-center">
              SYSTEM INITIALIZATION: {loadingProgress}%
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
          <div className="w-full max-w-md border border-green-500/50 p-6 bg-black/80" data-testid="login-form">
            <div className="text-center mb-6">
              <div className="text-green-500 text-lg font-bold mb-2">
                AUTHENTICATION REQUIRED
              </div>
              <div className="text-green-500/60 text-xs">
                Enter credentials to access terminal
              </div>
            </div>

            {accessDenied && (
              <div className="text-center mb-4 access-denied-flash" data-testid="access-denied">
                <div className="text-2xl font-bold">ACCESS DENIED</div>
                <div className="text-xs mt-1">INVALID CREDENTIALS - ATTEMPT LOGGED</div>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-green-500 text-xs mb-1 uppercase tracking-wider">
                  Operative ID
                </label>
                <input
                  type="text"
                  value={operativeId}
                  onChange={(e) => setOperativeId(e.target.value)}
                  className="terminal-input w-full"
                  placeholder="Enter ID..."
                  autoComplete="off"
                  data-testid="operative-id-input"
                />
              </div>
              <div className="mb-6">
                <label className="block text-green-500 text-xs mb-1 uppercase tracking-wider">
                  Clearance Code
                </label>
                <input
                  type="password"
                  value={clearanceCode}
                  onChange={(e) => setClearanceCode(e.target.value)}
                  className="terminal-input w-full"
                  placeholder="Enter code..."
                  autoComplete="off"
                  data-testid="clearance-code-input"
                />
              </div>
              <button
                type="submit"
                className="owl-btn w-full pulse-glow"
                data-testid="login-submit-btn"
              >
                AUTHENTICATE
              </button>
            </form>

            <div className="mt-4 text-center text-green-500/40 text-xs">
              Login attempts: {loginAttempts}/3
            </div>
          </div>
        )}

        {/* Login success */}
        {loginSuccess && (
          <div className="text-center" data-testid="login-success">
            <div className="text-green-500 text-2xl font-bold mb-2 text-glow">
              ACCESS GRANTED
            </div>
            <div className="text-green-500 text-sm">
              Welcome, Operative. Initializing dashboard...
            </div>
            <div className="mt-4 text-green-500/60 text-xs">
              Clearance Level: {determineClearanceLevel(clearanceCode)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BootSequence;
