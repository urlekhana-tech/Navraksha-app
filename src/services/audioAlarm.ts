class MaritimeAlarmService {
  private audioCtx: AudioContext | null = null;
  private oscillator1: OscillatorNode | null = null;
  private oscillator2: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private intervalId: any = null;
  private isAlarmPlaying: boolean = false;

  private initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public playSosAlarm(): boolean {
    try {
      this.initContext();
      if (!this.audioCtx) return false;
      if (this.isAlarmPlaying) return true;

      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0.35, this.audioCtx.currentTime);
      this.gainNode.connect(this.audioCtx.destination);

      this.oscillator1 = this.audioCtx.createOscillator();
      this.oscillator1.type = 'sawtooth';
      this.oscillator1.frequency.setValueAtTime(460, this.audioCtx.currentTime);
      this.oscillator1.connect(this.gainNode);
      this.oscillator1.start();

      this.oscillator2 = this.audioCtx.createOscillator();
      this.oscillator2.type = 'triangle';
      this.oscillator2.frequency.setValueAtTime(920, this.audioCtx.currentTime);
      this.oscillator2.connect(this.gainNode);
      this.oscillator2.start();

      let toggle = false;
      this.intervalId = setInterval(() => {
        if (!this.audioCtx || !this.oscillator1 || !this.oscillator2) return;
        const now = this.audioCtx.currentTime;
        toggle = !toggle;
        if (toggle) {
          this.oscillator1.frequency.setValueAtTime(620, now);
          this.oscillator2.frequency.setValueAtTime(980, now);
        } else {
          this.oscillator1.frequency.setValueAtTime(440, now);
          this.oscillator2.frequency.setValueAtTime(800, now);
        }
      }, 400);

      this.isAlarmPlaying = true;
      return true;
    } catch (e) {
      console.error('Audio siren error:', e);
      return false;
    }
  }

  public stopAlarm(): void {
    try {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
      if (this.oscillator1) {
        this.oscillator1.stop();
        this.oscillator1.disconnect();
        this.oscillator1 = null;
      }
      if (this.oscillator2) {
        this.oscillator2.stop();
        this.oscillator2.disconnect();
        this.oscillator2 = null;
      }
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }
      this.isAlarmPlaying = false;
    } catch (e) {
      console.warn('Stop alarm issue:', e);
    }
  }

  public isPlaying(): boolean {
    return this.isAlarmPlaying;
  }
}

export const maritimeAlarm = new MaritimeAlarmService();
