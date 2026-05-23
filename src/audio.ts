class SynthAudio {
  ctx: AudioContext | null = null;
  bgOsc: OscillatorNode | null = null;
  bgGain: GainNode | null = null;
  isMuted: boolean = false;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.toggleBackgroundMusic(false);
    } else {
      this.toggleBackgroundMusic(true);
    }
    return this.isMuted;
  }

  playCorrectSound() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, t); // C5
    osc.frequency.setValueAtTime(659.25, t + 0.1); // E5
    osc.frequency.setValueAtTime(783.99, t + 0.2); // G5
    osc.frequency.setValueAtTime(1046.50, t + 0.3); // C6
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(t);
    osc.stop(t + 0.5);
  }

  playWrongSound() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.linearRampToValueAtTime(100, t + 0.3);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(t);
    osc.stop(t + 0.3);
  }

  playAchievementSound() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, t); // A4
    osc.frequency.setValueAtTime(554.37, t + 0.15); // C#5
    osc.frequency.setValueAtTime(659.25, t + 0.3); // E5
    osc.frequency.setValueAtTime(880, t + 0.45); // A5
    osc.frequency.setValueAtTime(1108.73, t + 0.6); // C#6
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 0.05);
    gain.gain.linearRampToValueAtTime(0.4, t + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 1.2);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(t);
    osc.stop(t + 1.2);
  }

  toggleBackgroundMusic(play: boolean) {
    if (this.isMuted) play = false;
    this.init();
    if (!this.ctx) return;

    if (play && !this.bgOsc) {
      this.bgOsc = this.ctx.createOscillator();
      this.bgGain = this.ctx.createGain();
      
      this.bgOsc.type = 'sine';
      
      // Simple LFO for frequency to create an ambient pad effect
      const lfo = this.ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.2; // slow modulation
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.value = 10;
      
      this.bgOsc.frequency.value = 220; // A3
      lfo.connect(lfoGain);
      lfoGain.connect(this.bgOsc.frequency);
      
      this.bgGain.gain.value = 0.05; // very quiet
      
      this.bgOsc.connect(this.bgGain);
      this.bgGain.connect(this.ctx.destination);
      
      this.bgOsc.start();
      lfo.start();
    } else if (!play && this.bgOsc && this.bgGain) {
      const t = this.ctx.currentTime;
      this.bgGain.gain.linearRampToValueAtTime(0.01, t + 0.5);
      setTimeout(() => {
        if (this.bgOsc) {
          try {
            this.bgOsc.stop();
          } catch(e){}
          this.bgOsc.disconnect();
          this.bgOsc = null;
        }
        if (this.bgGain) {
          this.bgGain.disconnect();
          this.bgGain = null;
        }
      }, 600);
    }
  }
}

export const audioSystem = new SynthAudio();
