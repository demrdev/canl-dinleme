# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a professional live listening and sound amplification Progressive Web App (PWA) - an alternative to iPhone's Live Listen feature. The app provides real-time audio processing with advanced voice isolation, multiple sound modes, and AI-powered noise reduction capabilities.

## Key Technologies & Architecture

### Core Technologies
- **Web Audio API**: Main audio processing engine
- **getUserMedia API**: Microphone access
- **PWA**: Installable web app with offline capabilities
- **No backend**: Purely client-side, no audio data is stored or transmitted

### Audio Processing Pipeline
1. **Input Stage**: MediaStreamSource from getUserMedia
2. **Voice Isolation Engine**: Custom filters for human voice frequencies (85-255 Hz male, 165-265 Hz female)
3. **Filter Chain**: Bandpass → Low/High Shelf → Noise Gate → Compressor → Gain
4. **Output Stage**: AudioContext.destination with real-time visualization

### Key Audio Classes
- `VoiceIsolationEngine`: Handles voice frequency isolation with male/female voice filters
- `SpectralNoiseReducer`: Implements spectral subtraction for noise reduction
- Multiple audio modes with specific configurations (normal, voice, meeting, outdoor, music, elderly)

## Development Commands

### Local Development Server
```bash
# Start local HTTPS server (required for microphone access)
python3 -m http.server 8000

# Access at http://localhost:8000
```

### Deployment to GitHub Pages
```bash
# The repository is configured for GitHub Pages
git add -A
git commit -m "Your commit message"
git push origin main

# Site will be available at: https://demrdev.github.io/canl-dinleme
```

### Mobile Testing via Ngrok
```bash
# Use the included script for easy mobile testing
./github-yukle.sh
```

## Critical Implementation Details

### Security Requirements
- **HTTPS Required**: Microphone API only works over HTTPS or localhost
- **No Data Storage**: All audio processing is real-time, nothing is recorded or transmitted
- **Permission Handling**: Robust microphone permission request and error handling

### Browser Compatibility
- Primary support: Chrome, Safari, Firefox, Edge
- iOS-specific handling for suspended AudioContext
- Fallback mechanisms for older browsers

### Performance Considerations
- **Adaptive FFT Size**: 2048 for normal, 1024 for battery saver mode
- **Sample Rate**: 48kHz for low latency mode, 44.1kHz standard
- **Processing Latency**: Target ~10ms with optimized configuration

### Audio Processing Features
1. **6 Specialized Modes**: Each with specific frequency ranges and processing parameters
2. **4 Voice Focus Features**: Voice isolation, noise reduction, speech enhancement, direction focus
3. **Real-time Indicators**: Clarity percentage, noise level (dB), gain display
4. **Visual Feedback**: Frequency spectrum visualization with color-coded ranges

## File Structure

- `index.html`: Main application with all features
- `index-pro.html`: Development version (identical to index.html)
- `mobil-canli-dinleme.html`: Legacy mobile-specific version
- `manifest.json`: PWA configuration
- `github-yukle.sh`: Deployment helper script

## Important Audio Configuration Values

### Frequency Ranges by Mode
- **Normal**: 20-20000 Hz
- **Voice**: 85-8000 Hz (optimized for speech)
- **Meeting**: 100-6000 Hz (multi-speaker optimization)
- **Outdoor**: 200-5000 Hz (wind noise reduction)
- **Music**: 20-20000 Hz (full spectrum)
- **Elderly**: 500-4000 Hz (clarity boost)

### Compression Ratios
- Range: 1:1 to 12:1 based on mode
- Voice modes use higher compression (0.8-0.9)
- Music mode uses minimal compression (0.3)

### Noise Gate Thresholds
- Range: -60dB to -35dB depending on environment
- Outdoor mode: -35dB (aggressive)
- Music mode: -60dB (minimal gating)