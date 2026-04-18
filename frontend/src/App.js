import React, { useState, useEffect } from 'react';
import './App.css';
import BootSequence from './components/BootSequence';
import Dashboard from './components/Dashboard';
import { getUserSession, setUserSession, clearUserSession } from './utils/localStorage';

function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [user, setUser] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    // Check for existing session
    const session = getUserSession();
    if (session) {
      setUser(session);
      setIsBooting(false);
    }
  }, []);

  const handleBootComplete = (userData) => {
    setUser(userData);
    setUserSession(userData);
    setIsBooting(false);
  };

  const handleLogout = () => {
    clearUserSession();
    setUser(null);
    setIsBooting(true);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  return (
    <div className="App">
      {/* CRT Scanlines overlay - always visible */}
      <div className="crt-scanlines"></div>

      {isBooting ? (
        <BootSequence 
          onComplete={handleBootComplete} 
          soundEnabled={soundEnabled}
        />
      ) : (
        <Dashboard 
          user={user} 
          onLogout={handleLogout}
          soundEnabled={soundEnabled}
          toggleSound={toggleSound}
        />
      )}
    </div>
  );
}

export default App;
