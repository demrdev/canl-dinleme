// HEARTBEAT DETECTION DEMO - EDUCATIONAL PURPOSE ONLY
// WARNING: This is NOT a medical device and should NOT be used for medical diagnosis
// For actual medical monitoring, consult healthcare professionals

class HeartbeatDetectionDemo {
    constructor() {
        this.sampleRate = 48000;
        this.bufferSize = 4096;
        this.isEducationalDemo = true;
        
        // Heartbeat detection parameters
        this.heartbeatParams = {
            minBPM: 40,
            maxBPM: 200,
            fetalMinBPM: 110,
            fetalMaxBPM: 180,
            adultMinBPM: 50,
            adultMaxBPM: 120
        };
        
        // Filters for different frequency ranges
        this.filters = {
            lowFreq: { min: 20, max: 200 },  // Heart sounds
            fetalRange: { min: 30, max: 250 }, // Fetal simulation
            adultRange: { min: 20, max: 150 }  // Adult simulation
        };
        
        this.detectedBeats = [];
        this.bpmHistory = [];
        this.confidenceScore = 0;

        // Peak consolidation parameters (merge S1-S2 into one beat)
        this.minBeatSeparationSec = 0.08; // 80 ms
        this.maxBeatSeparationSec = 0.20; // 200 ms
    }
    
    // EDUCATIONAL DEMO - Rhythm Detection Algorithm
    detectRhythmicPatterns(audioData) {
        // This is a simplified educational demonstration
        // Real medical devices use specialized hardware and algorithms

        const rawPeaks = this.findPeaks(audioData);
        const peaks = this.consolidateBeats(rawPeaks);
        const intervals = this.calculateIntervals(peaks);
        const bpm = this.calculateBPM(intervals);
        
        return {
            bpm: bpm,
            confidence: this.calculateConfidence(intervals),
            type: this.classifyHeartRate(bpm),
            warning: "DEMO ONLY - Not for medical use"
        };
    }

    // Merge closely spaced peak pairs (S1/S2) into single beats
    consolidateBeats(peaks) {
        if (!peaks || peaks.length === 0) return [];

        const minSep = this.minBeatSeparationSec;
        const maxSep = this.maxBeatSeparationSec;
        const consolidated = [];

        let i = 0;
        while (i < peaks.length) {
            const p = peaks[i];
            // Look ahead to see if there's a close pair (S1-S2)
            if (i + 1 < peaks.length) {
                const next = peaks[i + 1];
                const dt = next.time - p.time;
                if (dt >= minSep && dt <= maxSep) {
                    // Treat as one beat at the stronger of the two
                    const stronger = next.value > p.value ? next : p;
                    consolidated.push(stronger);
                    i += 2;
                    continue;
                }
            }
            consolidated.push(p);
            i += 1;
        }
        return consolidated;
    }
    
    // Find peaks in audio signal (simplified for demo)
    findPeaks(data) {
        const peaks = [];
        const threshold = this.calculateDynamicThreshold(data);
        
        for (let i = 1; i < data.length - 1; i++) {
            if (data[i] > threshold && 
                data[i] > data[i-1] && 
                data[i] > data[i+1]) {
                peaks.push({
                    index: i,
                    value: data[i],
                    time: i / this.sampleRate
                });
            }
        }
        
        return peaks;
    }
    
    // Calculate dynamic threshold
    calculateDynamicThreshold(data) {
        const mean = data.reduce((a, b) => a + Math.abs(b), 0) / data.length;
        const stdDev = Math.sqrt(
            data.reduce((sq, n) => sq + Math.pow(Math.abs(n) - mean, 2), 0) / data.length
        );
        return mean + stdDev * 1.5;
    }
    
    // Calculate intervals between peaks
    calculateIntervals(peaks) {
        const intervals = [];
        for (let i = 1; i < peaks.length; i++) {
            intervals.push(peaks[i].time - peaks[i-1].time);
        }
        return intervals;
    }
    
    // Calculate BPM from intervals
    calculateBPM(intervals) {
        if (intervals.length === 0) return 0;
        
        // Remove outliers
        const filtered = this.removeOutliers(intervals);
        if (filtered.length === 0) return 0;
        
        const avgInterval = filtered.reduce((a, b) => a + b, 0) / filtered.length;
        const bpm = 60 / avgInterval;
        
        // Constrain to reasonable range
        return Math.max(this.heartbeatParams.minBPM, 
               Math.min(this.heartbeatParams.maxBPM, Math.round(bpm)));
    }
    
    // Remove statistical outliers
    removeOutliers(data) {
        if (data.length < 3) return data;
        
        const sorted = [...data].sort((a, b) => a - b);
        const q1 = sorted[Math.floor(sorted.length * 0.25)];
        const q3 = sorted[Math.floor(sorted.length * 0.75)];
        const iqr = q3 - q1;
        
        return data.filter(x => x >= q1 - 1.5 * iqr && x <= q3 + 1.5 * iqr);
    }
    
    // Calculate confidence score
    calculateConfidence(intervals) {
        if (intervals.length < 3) return 0;
        
        // Check rhythm regularity
        const stdDev = this.calculateStdDev(intervals);
        const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const cv = stdDev / mean; // Coefficient of variation
        
        // Lower CV means more regular rhythm
        const confidence = Math.max(0, Math.min(100, (1 - cv) * 100));
        
        return Math.round(confidence);
    }
    
    // Calculate standard deviation
    calculateStdDev(data) {
        const mean = data.reduce((a, b) => a + b, 0) / data.length;
        const squaredDiffs = data.map(x => Math.pow(x - mean, 2));
        const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / data.length;
        return Math.sqrt(avgSquaredDiff);
    }
    
    // Classify heart rate (DEMO purposes)
    classifyHeartRate(bpm) {
        if (bpm >= this.heartbeatParams.fetalMinBPM && 
            bpm <= this.heartbeatParams.fetalMaxBPM) {
            return {
                type: "Possible Fetal Range (DEMO)",
                color: "#10b981",
                message: "120-160 BPM range detected - EDUCATIONAL DEMO ONLY"
            };
        } else if (bpm >= this.heartbeatParams.adultMinBPM && 
                   bpm <= this.heartbeatParams.adultMaxBPM) {
            return {
                type: "Adult Range (DEMO)",
                color: "#3b82f6",
                message: "60-100 BPM range detected - EDUCATIONAL DEMO ONLY"
            };
        } else {
            return {
                type: "Unusual Range (DEMO)",
                color: "#f59e0b",
                message: "Unusual BPM detected - EDUCATIONAL DEMO ONLY"
            };
        }
    }
    
    // Enhanced low-frequency filter for heartbeat sounds (tuned for fetal)
    createHeartbeatFilter(audioContext, sourceNode) {
        // Multiple bandpass filters for heart sound components
        const filters = [];

        // Fetal S1 emphasis ~60-90 Hz (phone mics roll off <50Hz)
        const s1Filter = audioContext.createBiquadFilter();
        s1Filter.type = 'bandpass';
        s1Filter.frequency.value = 75;
        s1Filter.Q.value = 3.5;

        // Fetal S2 emphasis ~90-120 Hz
        const s2Filter = audioContext.createBiquadFilter();
        s2Filter.type = 'bandpass';
        s2Filter.frequency.value = 105;
        s2Filter.Q.value = 3.5;

        // Optional third band to catch higher components ~130-160 Hz
        const s3Filter = audioContext.createBiquadFilter();
        s3Filter.type = 'bandpass';
        s3Filter.frequency.value = 140;
        s3Filter.Q.value = 3.0;

        // Low frequency enhancement
        const lowShelf = audioContext.createBiquadFilter();
        lowShelf.type = 'lowshelf';
        lowShelf.frequency.value = 200;
        lowShelf.gain.value = 9;

        // High frequency suppression
        const highShelf = audioContext.createBiquadFilter();
        highShelf.type = 'highshelf';
        highShelf.frequency.value = 500;
        highShelf.gain.value = -12;

        // Narrow 50 Hz notch (mains hum) – keep very narrow to preserve S2
        const notch50 = audioContext.createBiquadFilter();
        notch50.type = 'notch';
        notch50.frequency.value = 50;
        notch50.Q.value = 25;

        // Connect filters in parallel and sum
        const merger = audioContext.createChannelMerger(3);
        sourceNode.connect(s1Filter);
        sourceNode.connect(s2Filter);
        sourceNode.connect(s3Filter);
        s1Filter.connect(merger, 0, 0);
        s2Filter.connect(merger, 0, 1);
        s3Filter.connect(merger, 0, 2);

        const gainNode = audioContext.createGain();
        gainNode.gain.value = 20; // High but safer amplification

        merger.connect(notch50);
        notch50.connect(lowShelf);
        lowShelf.connect(highShelf);
        highShelf.connect(gainNode);

        return gainNode;
    }
    
    // Autocorrelation for periodicity detection
    autocorrelate(buffer) {
        const SIZE = buffer.length;
        const MAX_SAMPLES = Math.floor(SIZE / 2);
        let best_offset = -1;
        let best_correlation = 0;
        let rms = 0;
        
        // Calculate RMS
        for (let i = 0; i < SIZE; i++) {
            rms += buffer[i] * buffer[i];
        }
        rms = Math.sqrt(rms / SIZE);
        
        if (rms < 0.01) return -1; // Not enough signal
        
        // Autocorrelation
        for (let offset = Math.floor(this.sampleRate / this.heartbeatParams.maxBPM); 
             offset < Math.floor(this.sampleRate / this.heartbeatParams.minBPM); 
             offset++) {
            let correlation = 0;
            
            for (let i = 0; i < MAX_SAMPLES; i++) {
                correlation += Math.abs((buffer[i]) - (buffer[i + offset]));
            }
            
            correlation = 1 - (correlation / MAX_SAMPLES);
            
            if (correlation > best_correlation) {
                best_correlation = correlation;
                best_offset = offset;
            }
        }
        
        if (best_correlation > 0.5) {
            return this.sampleRate / best_offset;
        }
        
        return -1;
    }
    
    // Envelope detection for heartbeat pulses
    envelopeDetection(data) {
        const envelope = new Float32Array(data.length);
        const attackTime = 0.005; // 5ms
        const releaseTime = 0.05; // 50ms
        
        const attack = Math.exp(-1 / (this.sampleRate * attackTime));
        const release = Math.exp(-1 / (this.sampleRate * releaseTime));
        
        let env = 0;
        for (let i = 0; i < data.length; i++) {
            const input = Math.abs(data[i]);
            
            if (input > env) {
                env = input + (env - input) * attack;
            } else {
                env = input + (env - input) * release;
            }
            
            envelope[i] = env;
        }
        
        return envelope;
    }
    
    // Generate visual heartbeat waveform
    generateHeartbeatVisualization(bpm, canvas) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, width, height);
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        for (let x = 0; x < width; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        for (let y = 0; y < height; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        // Draw heartbeat waveform
        if (bpm > 0) {
            const beatInterval = 60 / bpm; // seconds per beat
            const pixelsPerSecond = width / 3; // Show 3 seconds
            const pixelsPerBeat = pixelsPerSecond * beatInterval;
            
            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            let x = 0;
            while (x < width) {
                // Baseline
                ctx.moveTo(x, height / 2);
                ctx.lineTo(x + pixelsPerBeat * 0.1, height / 2);
                
                // P wave
                ctx.quadraticCurveTo(
                    x + pixelsPerBeat * 0.15, height / 2 - 10,
                    x + pixelsPerBeat * 0.2, height / 2
                );
                
                // QRS complex
                ctx.lineTo(x + pixelsPerBeat * 0.25, height / 2 + 5);
                ctx.lineTo(x + pixelsPerBeat * 0.3, height / 2 - 40);
                ctx.lineTo(x + pixelsPerBeat * 0.35, height / 2 + 20);
                ctx.lineTo(x + pixelsPerBeat * 0.4, height / 2);
                
                // T wave
                ctx.quadraticCurveTo(
                    x + pixelsPerBeat * 0.5, height / 2 - 15,
                    x + pixelsPerBeat * 0.6, height / 2
                );
                
                // Rest of baseline
                ctx.lineTo(x + pixelsPerBeat, height / 2);
                
                x += pixelsPerBeat;
            }
            
            ctx.stroke();
        }
        
        // Draw BPM text
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(`${bpm} BPM`, 10, 30);
        
        // Draw warning
        ctx.fillStyle = '#ef4444';
        ctx.font = '12px Arial';
        ctx.fillText('DEMO ONLY - NOT FOR MEDICAL USE', 10, height - 10);
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeartbeatDetectionDemo;
}
