// Sound effects utility for OWL Terminal
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
};

// Generate a beep sound
export const playBeep = (frequency = 800, duration = 50, volume = 0.1) => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'square';
    gainNode.gain.value = volume;
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration / 1000);
  } catch (e) {
    console.log('Audio not available');
  }
};

// Terminal key press sound
export const playKeyPress = () => {
  playBeep(600 + Math.random() * 200, 20, 0.05);
};

// Boot sequence beep
export const playBootBeep = () => {
  playBeep(440, 100, 0.08);
};

// Success sound
export const playSuccess = () => {
  playBeep(880, 100, 0.1);
  setTimeout(() => playBeep(1100, 150, 0.1), 100);
};

// Error/Denied sound
export const playError = () => {
  playBeep(220, 200, 0.15);
  setTimeout(() => playBeep(180, 300, 0.15), 200);
};

// Static noise
export const playStatic = (duration = 500) => {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * (duration / 1000);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.1;
    }
    
    const source = ctx.createBufferSource();
    const gainNode = ctx.createGain();
    
    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    gainNode.gain.value = 0.05;
    
    source.start();
  } catch (e) {
    console.log('Audio not available');
  }
};

// Warning alarm
export const playWarning = () => {
  playBeep(600, 150, 0.1);
  setTimeout(() => playBeep(400, 150, 0.1), 200);
  setTimeout(() => playBeep(600, 150, 0.1), 400);
};

// Click sound
export const playClick = () => {
  playBeep(1000, 15, 0.08);
};

// Typing sound (for boot sequence)
export const playTyping = () => {
  playBeep(800 + Math.random() * 400, 10, 0.03);
};
