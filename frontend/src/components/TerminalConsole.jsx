import React, { useState, useRef, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import { playKeyPress, playBeep } from '../utils/sounds';

const TerminalConsole = ({ soundEnabled, user }) => {
  const [history, setHistory] = useState([
    { type: 'system', text: 'OWL-SYS Terminal v4.16.2 - Type "help" for available commands' },
    { type: 'system', text: `Session initialized for operative: ${user?.operativeId || 'UNKNOWN'}` },
  ]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const outputRef = useRef(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  const commands = {
    help: () => ({
      type: 'info',
      text: `Available commands:
  help          - Display this help message
  status        - Show system status
  whoami        - Display current user info
  clear         - Clear terminal
  time          - Show current time
  threat        - Check threat level
  operatives    - List active operatives
  logs          - Show recent incident logs
  motto         - Display the Order's motto
  messenger     - Access Messenger files [RESTRICTED]
  sectors       - List operational sectors
  version       - Show system version`
    }),
    status: () => ({
      type: 'success',
      text: `SYSTEM STATUS:
  Network:      SECURE
  Encryption:   AES-256 ACTIVE
  Threat Level: ELEVATED
  Uptime:       47d 12h 33m
  Memory:       2.4GB / 8GB
  CPU Load:     23%
  Active Conn:  147`
    }),
    whoami: () => ({
      type: 'info',
      text: `Operative ID: ${user?.operativeId || 'UNKNOWN'}
Clearance:    ${user?.clearanceLevel || 'E1 - OPERATIVE'}
Login Time:   ${new Date(user?.loginTime).toLocaleString() || 'N/A'}
Session ID:   ${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    }),
    clear: () => {
      setHistory([]);
      return null;
    },
    time: () => ({
      type: 'info',
      text: `Current Time: ${new Date().toLocaleString()}
Server Time:  ${new Date().toISOString()}
Timezone:     UTC+0 (Site-416)`
    }),
    threat: () => ({
      type: 'warning',
      text: `THREAT ASSESSMENT:
  Level:        ELEVATED (3/5)
  Hostile GoIs: Ordo Divinus, Sons of the Allfather
  Recent:       OD activity near Site-416 perimeter
  Advisory:     Maintain heightened security protocols
  Last Update:  ${new Date().toLocaleTimeString()}`
    }),
    operatives: () => ({
      type: 'info',
      text: `ACTIVE OPERATIVES: 47
  Ground Team Division:     28
  Iron Lotus Battalion:     8
  Mortician Wing:           6
  Masquerade Initiative:    5

[ROSTER ACCESS REQUIRES O2+ CLEARANCE]`
    }),
    logs: () => ({
      type: 'info',
      text: `RECENT INCIDENT LOGS:
  03:42:17 [ALERT] Unauthorized access attempt - Sector 7
  03:41:55 [INFO] Operative "Shadow" checked in
  03:40:22 [SYSTEM] Encryption protocols updated
  03:38:09 [ALERT] Anomalous activity - Outpost Jericho
  03:35:44 [INFO] Strike Team Alpha - Mission complete`
    }),
    motto: () => ({
      type: 'success',
      text: `
  "BE INFORMED. BE ENLIGHTENED."
            - The Merchant, Founder

  Against All Odds We Endure.`
    }),
    messenger: () => ({
      type: 'error',
      text: `[ACCESS DENIED]
  ERROR: CLEARANCE INSUFFICIENT
  Required: O4+ (Board of Directors)
  Your Level: ${user?.clearanceLevel || 'E1'}

  This incident has been logged.
  File: THE_MESSENGER_DOSSIER.owl [RESTRICTED]`
    }),
    sectors: () => ({
      type: 'info',
      text: `OPERATIONAL SECTORS:
  Sector 1:  Administration      [SECURE]
  Sector 2:  Research Labs       [SECURE]
  Sector 3:  Armory              [SECURE]
  Sector 4:  Barracks            [SECURE]
  Sector 5:  Medical Bay         [SECURE]
  Sector 6:  Communications      [SECURE]
  Sector 7:  ████████████        [ALERT]
  Sector 8:  Vehicle Bay         [SECURE]`
    }),
    version: () => ({
      type: 'info',
      text: `OWL-SYS Terminal
  Version:    4.16.2
  Build:      20██-██-██
  Protocol:   MASQUERADE-7
  Encryption: AES-256-GCM
  Auth:       OWL-CERT-2024`
    }),
  };

  const handleCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    if (!trimmedCmd) return;

    setHistory(prev => [...prev, { type: 'input', text: `OWL-SYS> ${cmd}` }]);
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);

    if (commands[trimmedCmd]) {
      const result = commands[trimmedCmd]();
      if (result) {
        setHistory(prev => [...prev, result]);
      }
    } else {
      setHistory(prev => [...prev, {
        type: 'error',
        text: `Command not recognized: "${trimmedCmd}"
Type "help" for available commands.`
      }]);
    }
  };

  const handleKeyDown = (e) => {
    if (soundEnabled) playKeyPress();

    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const getTextColor = (type) => {
    switch (type) {
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      case 'success': return 'text-green-400';
      case 'input': return 'text-green-300';
      default: return 'text-green-500/80';
    }
  };

  return (
    <div className="owl-panel" data-testid="terminal-console">
      <div className="owl-panel-header">
        <span className="text-xs uppercase tracking-wider flex items-center gap-2">
          <Terminal size={14} /> Command Terminal
        </span>
        <span className="text-xs text-green-500/60">OWL-SYS v4.16.2</span>
      </div>
      <div className="bg-black/90">
        <div 
          ref={outputRef}
          className="h-64 overflow-y-auto p-4 font-mono text-xs"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((item, index) => (
            <div key={index} className={`${getTextColor(item.type)} whitespace-pre-wrap mb-1`}>
              {item.text}
            </div>
          ))}
        </div>
        <div className="border-t border-green-500/30 p-2 flex items-center gap-2">
          <span className="text-green-500 text-xs">OWL-SYS&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-green-400 font-mono text-xs"
            placeholder="Enter command..."
            autoComplete="off"
            data-testid="terminal-input"
          />
        </div>
      </div>
    </div>
  );
};

export default TerminalConsole;
