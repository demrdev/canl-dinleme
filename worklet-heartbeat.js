class HeartbeatEnvelopeProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();
    this.sr = (options && options.processorOptions && options.processorOptions.sampleRate) || sampleRate || 48000;
    // Envelope detector constants
    const attackTime = 0.005;
    const releaseTime = 0.05;
    this.attack = Math.exp(-1 / (this.sr * attackTime));
    this.release = Math.exp(-1 / (this.sr * releaseTime));
    this.env = 0;
    // Downsample factor to reduce postMessage traffic
    this.ds = 128; // ~375 posts/sec /128 -> ~3 kHz -> 64-sample chunk ~= 21ms
    this.accum = [];
    this.accumTarget = 64; // send ~64 samples per message
    this.port.postMessage({ type: 'init', rate: this.sr / this.ds });
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || input.length === 0) return true;
    const ch = input[0];
    const ds = this.ds;
    let sum = 0;
    let count = 0;
    for (let i = 0; i < ch.length; i++) {
      const x = Math.abs(ch[i]);
      if (x > this.env) this.env = x + (this.env - x) * this.attack; else this.env = x + (this.env - x) * this.release;
      // accumulate for downsampled average
      sum += this.env; count++;
      if (count === ds) {
        this.accum.push(sum / ds);
        sum = 0; count = 0;
        if (this.accum.length >= this.accumTarget) {
          this.port.postMessage({ type: 'envelope', data: new Float32Array(this.accum) });
          this.accum.length = 0;
        }
      }
    }
    return true;
  }
}

registerProcessor('heartbeat-envelope-processor', HeartbeatEnvelopeProcessor);

