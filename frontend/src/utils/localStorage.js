// LocalStorage utility for OWL Case Files

const CASE_FILES_KEY = 'owl_case_files';
const INCIDENT_LOGS_KEY = 'owl_incident_logs';
const USER_SESSION_KEY = 'owl_user_session';

// Initial sample case files with OWL lore
const initialCaseFiles = [
  {
    id: 'OWL-001',
    title: 'The Messenger Manifestation',
    operativeName: 'Director ████████',
    date: '20██-05-██',
    classification: 'KETER',
    description: 'Entity designated "The Messenger" manifested at OWL HQ. Tall humanoid figure with pitch-black skin, devoid of facial features. Exhibits omnipresence capabilities. Initial contact resulted in widespread psychic influence on lower-ranking personnel causing [REDACTED]. High Command successfully negotiated terms with the entity. Full details remain classified at O4+ clearance.',
    attachments: ['AUDIO_LOG_001.wav [CORRUPTED]', 'CCTV_FOOTAGE_REDACTED.mp4'],
    redacted: true,
    createdAt: '2024-05-15T00:00:00.000Z'
  },
  {
    id: 'OWL-002',
    title: 'Site-416 Infiltration Report',
    operativeName: 'Agent "Whisper"',
    date: '20██-08-██',
    classification: 'EUCLID',
    description: 'Masquerade operative successfully embedded within Foundation Site-416 as Level 2 Researcher. Intel gathered on SCP-████ containment procedures. Evidence of unethical testing on Class-D personnel documented. Recommend immediate extraction before quarterly security review. Note: Agent reports unusual activity in Sector-7 - possible anomalous interference with communications equipment.',
    attachments: ['SITE_416_FLOORPLAN.pdf', 'PERSONNEL_ROSTER.xlsx [PARTIAL]'],
    redacted: false,
    createdAt: '2024-08-22T00:00:00.000Z'
  },
  {
    id: 'OWL-003',
    title: 'Endbringer Project - Phase 3 Results',
    operativeName: 'Dr. ████ "Mortician" ████████',
    date: '20██-11-██',
    classification: 'THAUMIEL',
    description: 'Collaboration with Anderson Robotics yields significant advancement. Mortality rate reduced to ██%. Stimulant regulation protocols finalized. Anomalous armor enhancements performing within expected parameters. Subjects retain cognitive function and loyalty. [REDACTED] variant remains under O5 review - casualty rate of 100% deemed acceptable only for terminal deployment scenarios. Iron Lotus Battalion expansion authorized.',
    attachments: ['ENDBRINGER_SCHEMATICS.dwg [CLASSIFIED]', 'TRIAL_RESULTS_REDACTED.pdf'],
    redacted: true,
    createdAt: '2024-11-03T00:00:00.000Z'
  },
  {
    id: 'OWL-004',
    title: 'Ordo Divinus Encounter - Operation Fallen Star',
    operativeName: 'Captain "Icarus"',
    date: '20██-02-██',
    classification: 'KETER',
    description: 'Ground Team Division engaged hostile forces identified as Ordo Divinus during routine patrol near [REDACTED]. Enemy combatants displayed anomalous capabilities consistent with previous reports. Three operatives KIA. Recovered artifact currently under Mortician Wing analysis. Warning: OD operatives appear to possess intel on OWL safe house locations. Security protocol upgrade recommended.',
    attachments: ['COMBAT_LOG_TRANSCRIPT.txt', 'ARTIFACT_PHOTOS_01-05.zip'],
    redacted: false,
    createdAt: '2025-02-14T00:00:00.000Z'
  }
];

// Initial incident logs
const initialIncidentLogs = [
  { id: 1, timestamp: '2025-01-15 03:42:17', message: '[ALERT] Unauthorized access attempt detected - Sector 7', type: 'warning' },
  { id: 2, timestamp: '2025-01-15 03:41:55', message: '[INFO] Operative "Shadow" checked in - Status: Active', type: 'info' },
  { id: 3, timestamp: '2025-01-15 03:40:22', message: '[SYSTEM] Encryption protocols updated - All channels secure', type: 'system' },
  { id: 4, timestamp: '2025-01-15 03:38:09', message: '[ALERT] Anomalous activity detected near Research Outpost Jericho', type: 'warning' },
  { id: 5, timestamp: '2025-01-15 03:35:44', message: '[INFO] Iron Lotus Strike Team Alpha - Mission complete', type: 'info' },
  { id: 6, timestamp: '2025-01-15 03:32:18', message: '[CLASSIFIED] ████████████████████████████', type: 'classified' },
  { id: 7, timestamp: '2025-01-15 03:30:00', message: '[SYSTEM] Daily backup initiated - All databases synchronized', type: 'system' },
  { id: 8, timestamp: '2025-01-15 03:28:33', message: '[WARNING] Sons of the Allfather activity spike in Northern Europe', type: 'warning' },
  { id: 9, timestamp: '2025-01-15 03:25:11', message: '[INFO] New Masquerade recruit processed - Clearance: E1', type: 'info' },
  { id: 10, timestamp: '2025-01-15 03:22:47', message: '[ALERT] The Messenger - No current manifestation detected', type: 'system' }
];

// Get case files
export const getCaseFiles = () => {
  try {
    const stored = localStorage.getItem(CASE_FILES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with sample data
    localStorage.setItem(CASE_FILES_KEY, JSON.stringify(initialCaseFiles));
    return initialCaseFiles;
  } catch (e) {
    console.error('Error reading case files:', e);
    return initialCaseFiles;
  }
};

// Save case files
export const saveCaseFiles = (files) => {
  try {
    localStorage.setItem(CASE_FILES_KEY, JSON.stringify(files));
    return true;
  } catch (e) {
    console.error('Error saving case files:', e);
    return false;
  }
};

// Add new case file
export const addCaseFile = (caseFile) => {
  const files = getCaseFiles();
  const newFile = {
    ...caseFile,
    id: `OWL-${String(files.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString()
  };
  files.unshift(newFile);
  saveCaseFiles(files);
  return newFile;
};

// Update case file
export const updateCaseFile = (id, updates) => {
  const files = getCaseFiles();
  const index = files.findIndex(f => f.id === id);
  if (index !== -1) {
    files[index] = { ...files[index], ...updates };
    saveCaseFiles(files);
    return files[index];
  }
  return null;
};

// Delete case file
export const deleteCaseFile = (id) => {
  const files = getCaseFiles();
  const filtered = files.filter(f => f.id !== id);
  saveCaseFiles(filtered);
  return filtered;
};

// Get incident logs
export const getIncidentLogs = () => {
  try {
    const stored = localStorage.getItem(INCIDENT_LOGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    localStorage.setItem(INCIDENT_LOGS_KEY, JSON.stringify(initialIncidentLogs));
    return initialIncidentLogs;
  } catch (e) {
    console.error('Error reading incident logs:', e);
    return initialIncidentLogs;
  }
};

// Add incident log
export const addIncidentLog = (message, type = 'info') => {
  const logs = getIncidentLogs();
  const newLog = {
    id: Date.now(),
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    message,
    type
  };
  logs.unshift(newLog);
  if (logs.length > 50) logs.pop(); // Keep only last 50 logs
  localStorage.setItem(INCIDENT_LOGS_KEY, JSON.stringify(logs));
  return newLog;
};

// User session management
export const getUserSession = () => {
  try {
    const stored = localStorage.getItem(USER_SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
};

export const setUserSession = (session) => {
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(session));
};

export const clearUserSession = () => {
  localStorage.removeItem(USER_SESSION_KEY);
};

// Search case files
export const searchCaseFiles = (query) => {
  const files = getCaseFiles();
  const lowerQuery = query.toLowerCase();
  return files.filter(f => 
    f.title.toLowerCase().includes(lowerQuery) ||
    f.operativeName.toLowerCase().includes(lowerQuery) ||
    f.description.toLowerCase().includes(lowerQuery) ||
    f.id.toLowerCase().includes(lowerQuery)
  );
};
