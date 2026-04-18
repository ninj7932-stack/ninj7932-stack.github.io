// Sound effects utility for OWL Terminal - Softer, lighter sounds
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
};

// Generate a soft beep sound
export const playBeep = (frequency = 600, duration = 30, volume = 0.03) => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine'; // Softer sine wave instead of square
    gainNode.gain.value = volume;
    
    // Soft fade out
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration / 1000);
  } catch (e) {
    console.log('Audio not available');
  }
};

// Terminal key press sound - very subtle
export const playKeyPress = () => {
  playBeep(400 + Math.random() * 100, 15, 0.015);
};

// Boot sequence beep - soft
export const playBootBeep = () => {
  playBeep(330, 80, 0.04);
};

// Success sound - gentle chime
export const playSuccess = () => {
  playBeep(523, 100, 0.05); // C5
  setTimeout(() => playBeep(659, 100, 0.05), 80); // E5
  setTimeout(() => playBeep(784, 150, 0.05), 160); // G5
};

// Error/Denied sound - soft low tone
export const playError = () => {
  playBeep(220, 150, 0.05);
  setTimeout(() => playBeep(196, 200, 0.04), 150);
};

// Static noise - very subtle
export const playStatic = (duration = 300) => {
  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * (duration / 1000);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.02;
    }
    
    const source = ctx.createBufferSource();
    const gainNode = ctx.createGain();
    
    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    gainNode.gain.value = 0.02;
    
    // Fade out
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    
    source.start();
  } catch (e) {
    console.log('Audio not available');
  }
};

// Warning - gentle alert
export const playWarning = () => {
  playBeep(440, 100, 0.04);
  setTimeout(() => playBeep(349, 100, 0.03), 120);
};

// Click sound - soft
export const playClick = () => {
  playBeep(800, 10, 0.025);
};

// Typing sound (for boot sequence) - very subtle
export const playTyping = () => {
  playBeep(500 + Math.random() * 200, 8, 0.01);
};

// Dramatic welcome sound
export const playWelcome = () => {
  // Rising chord
  playBeep(261, 200, 0.04); // C4
  setTimeout(() => playBeep(329, 200, 0.04), 100); // E4
  setTimeout(() => playBeep(392, 200, 0.04), 200); // G4
  setTimeout(() => playBeep(523, 300, 0.06), 300); // C5
};
