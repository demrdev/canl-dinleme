// Advanced Audio Processing Engine
// Ultra-sensitive sound detection and AI classification system

class AdvancedAudioProcessor {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.source = null;
        this.stream = null;
        
        // AI Classification
        this.soundClassifier = new SoundClassificationEngine();
        this.distanceEstimator = new DistanceEstimator();
        this.directionDetector = new DirectionDetector();
        
        // Detection modes
        this.detectionModes = {
            near: { range: [0, 5], sensitivity: 2.0, filter: 'highpass' },
            medium: { range: [5, 20], sensitivity: 1.0, filter: 'bandpass' },
            far: { range: [20, 50], sensitivity: 0.5, filter: 'lowpass' },
            all: { range: [0, 100], sensitivity: 0.8, filter: 'none' },
            ai: { range: 'adaptive', sensitivity: 'auto', filter: 'smart' }
        };
        
        this.currentMode = 'medium';
        this.maxAmplification = 500;
    }
    
    async initialize(sampleRate = 96000) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioContext = new AudioContext({ 
            sampleRate: sampleRate,
            latencyHint: 'interactive'
        });
        
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
        
        return true;
    }
}

// AI Sound Classification Engine
class SoundClassificationEngine {
    constructor() {
        this.categories = {
            human: { sounds: ['speech', 'whisper', 'breathing', 'crying', 'laughing', 'coughing'], confidence: 0 },
            animal: { sounds: ['dog', 'cat', 'bird', 'insect'], confidence: 0 },
            vehicle: { sounds: ['car', 'motorcycle', 'truck', 'airplane'], confidence: 0 },
            nature: { sounds: ['wind', 'rain', 'thunder', 'water'], confidence: 0 },
            music: { sounds: ['instrument', 'singing', 'rhythm'], confidence: 0 },
            emergency: { sounds: ['alarm', 'siren', 'glass_breaking', 'scream'], confidence: 0 },
            mechanical: { sounds: ['machine', 'tool', 'appliance'], confidence: 0 },
            electronic: { sounds: ['phone', 'notification', 'beep'], confidence: 0 }
        };
        
        this.mfccExtractor = new MFCCExtractor();
        this.patternMatcher = new PatternMatcher();
    }
    
    classify(frequencyData, timeData) {
        // Extract features
        const features = this.extractFeatures(frequencyData, timeData);
        
        // Calculate confidence for each category
        Object.keys(this.categories).forEach(category => {
            const confidence = this.calculateConfidence(features, category);
            this.categories[category].confidence = confidence;
        });
        
        // Return most likely category
        return this.getMostLikelyCategory();
    }
    
    extractFeatures(frequencyData, timeData) {
        const features = {
            spectralCentroid: this.calculateSpectralCentroid(frequencyData),
            spectralRolloff: this.calculateSpectralRolloff(frequencyData),
            spectralBandwidth: this.calculateSpectralBandwidth(frequencyData),
            zeroCrossingRate: this.calculateZeroCrossingRate(timeData),
            mfcc: this.mfccExtractor.extract(frequencyData),
            energy: this.calculateEnergy(timeData),
            spectralFlux: this.calculateSpectralFlux(frequencyData),
            harmonicRatio: this.calculateHarmonicRatio(frequencyData)
        };
        
        return features;
    }
    
    calculateSpectralCentroid(data) {
        let sum = 0, weightedSum = 0;
        for (let i = 0; i < data.length; i++) {
            sum += data[i];
            weightedSum += i * data[i];
        }
        return sum > 0 ? weightedSum / sum : 0;
    }
    
    calculateSpectralRolloff(data, threshold = 0.85) {
        const totalEnergy = data.reduce((a, b) => a + b, 0);
        const rolloffThreshold = totalEnergy * threshold;
        let cumulativeEnergy = 0;
        
        for (let i = 0; i < data.length; i++) {
            cumulativeEnergy += data[i];
            if (cumulativeEnergy >= rolloffThreshold) {
                return i / data.length;
            }
        }
        return 1;
    }
    
    calculateSpectralBandwidth(data) {
        const centroid = this.calculateSpectralCentroid(data);
        let sum = 0, weightedSum = 0;
        
        for (let i = 0; i < data.length; i++) {
            const diff = i - centroid;
            weightedSum += data[i] * diff * diff;
            sum += data[i];
        }
        
        return sum > 0 ? Math.sqrt(weightedSum / sum) : 0;
    }
    
    calculateZeroCrossingRate(timeData) {
        let crossings = 0;
        for (let i = 1; i < timeData.length; i++) {
            if ((timeData[i] >= 0) !== (timeData[i - 1] >= 0)) {
                crossings++;
            }
        }
        return crossings / timeData.length;
    }
    
    calculateEnergy(timeData) {
        return timeData.reduce((sum, val) => sum + val * val, 0) / timeData.length;
    }
    
    calculateSpectralFlux(data) {
        if (!this.previousSpectrum) {
            this.previousSpectrum = new Float32Array(data.length);
        }
        
        let flux = 0;
        for (let i = 0; i < data.length; i++) {
            const diff = data[i] - this.previousSpectrum[i];
            flux += diff > 0 ? diff * diff : 0;
        }
        
        this.previousSpectrum.set(data);
        return Math.sqrt(flux);
    }
    
    calculateHarmonicRatio(data) {
        // Find fundamental frequency
        let maxBin = 0, maxValue = 0;
        for (let i = 1; i < data.length / 2; i++) {
            if (data[i] > maxValue) {
                maxValue = data[i];
                maxBin = i;
            }
        }
        
        // Check for harmonics
        let harmonicEnergy = 0, totalEnergy = 0;
        for (let h = 1; h <= 5; h++) {
            const bin = maxBin * h;
            if (bin < data.length) {
                harmonicEnergy += data[bin];
            }
        }
        
        for (let i = 0; i < data.length; i++) {
            totalEnergy += data[i];
        }
        
        return totalEnergy > 0 ? harmonicEnergy / totalEnergy : 0;
    }
    
    calculateConfidence(features, category) {
        // Category-specific pattern matching
        let confidence = 0;
        
        switch(category) {
            case 'human':
                // Human voice typically 85-255 Hz fundamental, with formants
                if (features.spectralCentroid > 50 && features.spectralCentroid < 200) {
                    confidence += 30;
                }
                if (features.harmonicRatio > 0.3) {
                    confidence += 20;
                }
                if (features.zeroCrossingRate > 0.02 && features.zeroCrossingRate < 0.1) {
                    confidence += 25;
                }
                break;
                
            case 'animal':
                // Animal sounds have irregular patterns
                if (features.spectralFlux > 10) {
                    confidence += 25;
                }
                if (features.spectralBandwidth > 100) {
                    confidence += 25;
                }
                break;
                
            case 'vehicle':
                // Vehicles have low-frequency dominance
                if (features.spectralCentroid < 100) {
                    confidence += 35;
                }
                if (features.energy > 0.5) {
                    confidence += 25;
                }
                break;
                
            case 'nature':
                // Nature sounds are broadband
                if (features.spectralRolloff > 0.7) {
                    confidence += 30;
                }
                if (features.spectralBandwidth > 150) {
                    confidence += 30;
                }
                break;
                
            case 'music':
                // Music has strong harmonic structure
                if (features.harmonicRatio > 0.5) {
                    confidence += 40;
                }
                if (features.spectralCentroid > 100 && features.spectralCentroid < 500) {
                    confidence += 30;
                }
                break;
                
            case 'emergency':
                // Emergency sounds have specific frequency patterns
                if (features.spectralCentroid > 200 && features.spectralCentroid < 400) {
                    confidence += 35;
                }
                if (features.energy > 0.7) {
                    confidence += 35;
                }
                break;
        }
        
        // Add MFCC-based confidence
        if (features.mfcc) {
            confidence += this.mfccBasedConfidence(features.mfcc, category);
        }
        
        return Math.min(confidence, 100);
    }
    
    mfccBasedConfidence(mfcc, category) {
        // Simplified MFCC pattern matching
        const patterns = {
            human: [1.2, -0.5, 0.3, -0.2],
            animal: [0.8, 0.2, -0.3, 0.5],
            vehicle: [-0.5, 0.8, 0.2, -0.1],
            nature: [0.3, 0.3, 0.3, 0.3],
            music: [0.9, -0.2, 0.4, -0.3],
            emergency: [1.5, -0.8, 0.2, -0.4]
        };
        
        if (!patterns[category]) return 0;
        
        const pattern = patterns[category];
        let similarity = 0;
        
        for (let i = 0; i < Math.min(mfcc.length, pattern.length); i++) {
            similarity += 1 - Math.abs(mfcc[i] - pattern[i]);
        }
        
        return (similarity / pattern.length) * 20;
    }
    
    getMostLikelyCategory() {
        let maxConfidence = 0;
        let bestCategory = 'unknown';
        
        Object.entries(this.categories).forEach(([category, data]) => {
            if (data.confidence > maxConfidence) {
                maxConfidence = data.confidence;
                bestCategory = category;
            }
        });
        
        return {
            category: bestCategory,
            confidence: maxConfidence,
            allConfidences: { ...this.categories }
        };
    }
}

// MFCC Extractor
class MFCCExtractor {
    constructor(numCoefficients = 13) {
        this.numCoefficients = numCoefficients;
        this.melFilterBank = this.createMelFilterBank();
    }
    
    createMelFilterBank(numFilters = 26, fftSize = 2048, sampleRate = 48000) {
        const melScale = freq => 2595 * Math.log10(1 + freq / 700);
        const invMelScale = mel => 700 * (Math.pow(10, mel / 2595) - 1);
        
        const minMel = melScale(0);
        const maxMel = melScale(sampleRate / 2);
        const melPoints = [];
        
        for (let i = 0; i <= numFilters + 1; i++) {
            melPoints.push(invMelScale(minMel + i * (maxMel - minMel) / (numFilters + 1)));
        }
        
        const filterBank = [];
        for (let i = 1; i <= numFilters; i++) {
            const filter = new Float32Array(fftSize / 2);
            const startFreq = melPoints[i - 1];
            const centerFreq = melPoints[i];
            const endFreq = melPoints[i + 1];
            
            for (let j = 0; j < fftSize / 2; j++) {
                const freq = j * sampleRate / fftSize;
                
                if (freq >= startFreq && freq <= centerFreq) {
                    filter[j] = (freq - startFreq) / (centerFreq - startFreq);
                } else if (freq >= centerFreq && freq <= endFreq) {
                    filter[j] = (endFreq - freq) / (endFreq - centerFreq);
                }
            }
            
            filterBank.push(filter);
        }
        
        return filterBank;
    }
    
    extract(frequencyData) {
        const melEnergies = [];
        
        // Apply mel filter bank
        this.melFilterBank.forEach(filter => {
            let energy = 0;
            for (let i = 0; i < Math.min(frequencyData.length, filter.length); i++) {
                energy += frequencyData[i] * filter[i];
            }
            melEnergies.push(Math.log(energy + 1e-10));
        });
        
        // Apply DCT to get MFCCs
        const mfccs = [];
        for (let i = 0; i < this.numCoefficients; i++) {
            let sum = 0;
            for (let j = 0; j < melEnergies.length; j++) {
                sum += melEnergies[j] * Math.cos(i * (j + 0.5) * Math.PI / melEnergies.length);
            }
            mfccs.push(sum);
        }
        
        return mfccs;
    }
}

// Pattern Matcher
class PatternMatcher {
    constructor() {
        this.patterns = new Map();
        this.initializePatterns();
    }
    
    initializePatterns() {
        // Define sound patterns
        this.patterns.set('dog_bark', {
            frequency: [200, 800],
            duration: [100, 500],
            repetition: true
        });
        
        this.patterns.set('siren', {
            frequency: [400, 1200],
            modulation: 'sweep',
            duration: [2000, 5000]
        });
        
        // Add more patterns...
    }
    
    match(features) {
        let bestMatch = null;
        let bestScore = 0;
        
        this.patterns.forEach((pattern, name) => {
            const score = this.calculateMatchScore(features, pattern);
            if (score > bestScore) {
                bestScore = score;
                bestMatch = name;
            }
        });
        
        return { pattern: bestMatch, confidence: bestScore };
    }
    
    calculateMatchScore(features, pattern) {
        let score = 0;
        // Pattern matching logic
        return score;
    }
}

// Distance Estimator
class DistanceEstimator {
    constructor() {
        this.calibrationData = {
            referenceLevel: -20, // dB at 1 meter
            attenuationRate: 6, // dB per distance doubling
            frequencyWeights: new Map()
        };
    }
    
    estimateDistance(frequencyData, timeData) {
        // Calculate RMS energy
        const rms = Math.sqrt(timeData.reduce((sum, val) => sum + val * val, 0) / timeData.length);
        const dB = 20 * Math.log10(rms + 1e-10);
        
        // Apply inverse square law
        const distanceFromLevel = Math.pow(10, (this.calibrationData.referenceLevel - dB) / 20);
        
        // Frequency-based correction
        const frequencyCorrection = this.getFrequencyCorrection(frequencyData);
        
        // Environmental factors
        const environmentalFactor = this.getEnvironmentalFactor();
        
        // Final distance estimation
        const distance = distanceFromLevel * frequencyCorrection * environmentalFactor;
        
        return {
            distance: Math.round(distance * 10) / 10,
            confidence: this.calculateConfidence(dB, frequencyData),
            unit: 'meters'
        };
    }
    
    getFrequencyCorrection(frequencyData) {
        // High frequencies attenuate faster with distance
        const highFreqEnergy = this.calculateHighFrequencyEnergy(frequencyData);
        const lowFreqEnergy = this.calculateLowFrequencyEnergy(frequencyData);
        
        const ratio = highFreqEnergy / (lowFreqEnergy + 1e-10);
        
        // More high frequency = closer
        if (ratio > 0.5) return 0.8;
        if (ratio > 0.3) return 1.0;
        if (ratio > 0.1) return 1.2;
        return 1.5;
    }
    
    calculateHighFrequencyEnergy(data) {
        const startBin = Math.floor(data.length * 0.5);
        let energy = 0;
        for (let i = startBin; i < data.length; i++) {
            energy += data[i];
        }
        return energy / (data.length - startBin);
    }
    
    calculateLowFrequencyEnergy(data) {
        const endBin = Math.floor(data.length * 0.1);
        let energy = 0;
        for (let i = 0; i < endBin; i++) {
            energy += data[i];
        }
        return energy / endBin;
    }
    
    getEnvironmentalFactor() {
        // Could be adjusted based on detected environment type
        return 1.0;
    }
    
    calculateConfidence(dB, frequencyData) {
        // Higher signal level = more confident
        let confidence = Math.min(100, Math.max(0, (dB + 60) * 2));
        
        // Adjust based on signal clarity
        const snr = this.estimateSNR(frequencyData);
        confidence *= (snr / 100);
        
        return Math.round(confidence);
    }
    
    estimateSNR(data) {
        // Simple SNR estimation
        const sorted = [...data].sort((a, b) => b - a);
        const signal = sorted.slice(0, 10).reduce((a, b) => a + b, 0) / 10;
        const noise = sorted.slice(-10).reduce((a, b) => a + b, 0) / 10;
        
        return Math.min(100, (signal / (noise + 1e-10)) * 10);
    }
}

// Direction Detector
class DirectionDetector {
    constructor() {
        this.channels = { left: null, right: null };
        this.calibration = {
            speedOfSound: 343, // m/s
            micDistance: 0.17 // Average head width in meters
        };
    }
    
    detectDirection(leftChannelData, rightChannelData) {
        // Calculate interaural time difference (ITD)
        const itd = this.calculateITD(leftChannelData, rightChannelData);
        
        // Calculate interaural level difference (ILD)
        const ild = this.calculateILD(leftChannelData, rightChannelData);
        
        // Combine ITD and ILD for direction estimation
        const angle = this.calculateAngle(itd, ild);
        
        return {
            angle: Math.round(angle),
            direction: this.angleToDirection(angle),
            confidence: this.calculateDirectionConfidence(itd, ild),
            itd: itd,
            ild: ild
        };
    }
    
    calculateITD(leftData, rightData) {
        // Cross-correlation to find time delay
        const maxLag = 50; // samples
        let maxCorr = 0;
        let bestLag = 0;
        
        for (let lag = -maxLag; lag <= maxLag; lag++) {
            let corr = 0;
            for (let i = 0; i < leftData.length - Math.abs(lag); i++) {
                const leftIdx = i + Math.max(0, lag);
                const rightIdx = i + Math.max(0, -lag);
                corr += leftData[leftIdx] * rightData[rightIdx];
            }
            
            if (corr > maxCorr) {
                maxCorr = corr;
                bestLag = lag;
            }
        }
        
        // Convert lag to time difference
        return bestLag / 48000; // Assuming 48kHz sample rate
    }
    
    calculateILD(leftData, rightData) {
        const leftRMS = Math.sqrt(leftData.reduce((sum, val) => sum + val * val, 0) / leftData.length);
        const rightRMS = Math.sqrt(rightData.reduce((sum, val) => sum + val * val, 0) / rightData.length);
        
        return 20 * Math.log10((leftRMS + 1e-10) / (rightRMS + 1e-10));
    }
    
    calculateAngle(itd, ild) {
        // Simplified angle calculation
        // ITD-based angle
        const maxITD = this.calibration.micDistance / this.calibration.speedOfSound;
        const itdAngle = Math.asin(Math.max(-1, Math.min(1, itd / maxITD))) * 180 / Math.PI;
        
        // ILD-based angle (less accurate but helps refine)
        const ildAngle = ild * 3; // Rough approximation
        
        // Weighted combination
        return itdAngle * 0.7 + ildAngle * 0.3;
    }
    
    angleToDirection(angle) {
        if (angle < -67.5) return 'Far Left';
        if (angle < -22.5) return 'Left';
        if (angle < 22.5) return 'Center';
        if (angle < 67.5) return 'Right';
        return 'Far Right';
    }
    
    calculateDirectionConfidence(itd, ild) {
        // Confidence based on consistency between ITD and ILD
        const itdAngle = Math.asin(Math.max(-1, Math.min(1, itd / (this.calibration.micDistance / this.calibration.speedOfSound)))) * 180 / Math.PI;
        const ildAngle = ild * 3;
        
        const consistency = 100 - Math.abs(itdAngle - ildAngle);
        return Math.max(0, Math.min(100, consistency));
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AdvancedAudioProcessor,
        SoundClassificationEngine,
        DistanceEstimator,
        DirectionDetector
    };
}