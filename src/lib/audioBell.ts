/**
 * 🔔 Native Web Audio Temple Bell Chime
 * Synthesizes a soothing bronze temple bell chime using harmonic overtone physics.
 * Zero external audio assets required.
 */

export function playTempleBellChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    const now = ctx.currentTime;
    // Harmonic frequencies of a sacred Indian bronze bell (Fundamental 432 Hz)
    const harmonics = [
      { freq: 432, gain: 0.35, decay: 2.2 },
      { freq: 864, gain: 0.18, decay: 1.6 },
      { freq: 1296, gain: 0.10, decay: 1.1 },
      { freq: 1728, gain: 0.04, decay: 0.8 }
    ];
    
    harmonics.forEach(({ freq, gain, decay }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      
      gainNode.gain.setValueAtTime(gain, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + decay);
    });
  } catch (err) {
    // Ignore if audio permissions are restricted
  }
}

/**
 * 🪔 Grand 108 Mala Completion Chime
 * Celebratory double harmonic bell resonance signifying completion of 108 sacred chants.
 */
export function playMalaCompletionChime() {
  if (typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    const ring = (timeOffset: number, baseFreq: number, volume: number) => {
      const now = ctx.currentTime + timeOffset;
      const harmonics = [
        { freq: baseFreq, gain: volume * 0.4, decay: 2.8 },
        { freq: baseFreq * 2, gain: volume * 0.22, decay: 2.2 },
        { freq: baseFreq * 3, gain: volume * 0.12, decay: 1.6 },
        { freq: baseFreq * 4, gain: volume * 0.05, decay: 1.1 }
      ];

      harmonics.forEach(({ freq, gain, decay }) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gainNode.gain.setValueAtTime(gain, now);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + decay);
      });
    };

    // First stroke (432 Hz - fundamental)
    ring(0, 432, 1.0);
    // Second joyful stroke (540 Hz - major third harmonic overtone)
    ring(0.28, 540, 1.1);
  } catch (err) {
    // Ignore audio permission errors
  }
}

/**
 * 📿 Native Mobile Haptic Bead Pulse
 * Emulates the tactile physical click of a prayer mala bead.
 */
export function triggerBeadHaptic(isMilestone: boolean = false) {
  if (typeof window === 'undefined' || !('navigator' in window)) return;
  try {
    if (navigator.vibrate) {
      if (isMilestone) {
        // Double celebratory pulse on completing 108 or milestones
        navigator.vibrate([20, 60, 35]);
      } else {
        // Gentle single bead click
        navigator.vibrate(12);
      }
    }
  } catch {
    // Graceful fallback for non-supported browsers
  }
}
