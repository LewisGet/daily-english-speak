# 🗣️ English Speak Practice & Pronunciation Partner

A premium, modern React application built to help learners practice English speaking, listening, and pronunciation. It utilizes the native browser **Web Speech API** for Text-to-Speech (TTS) reading and Speech Recognition (voice input evaluation).

## ✨ Features

- **📖 Reading Board**: Click on any word to hear its pronunciation in isolation at a slower speed (`0.75x`) to master syllables.
- **🔊 Text-to-Speech (TTS) with Highlighting**: 
  - Highlights words dynamically *in real time* as they are read aloud.
  - Adjust speed rate (`0.5x` to `2.0x`) and voice pitch.
  - Select from a list of local English speaker voices (US, UK, Australia, etc.).
- **🎙️ Speech Practice & Accuracy Scoring**:
  - Record your voice reading sentences aloud.
  - Dynamic visual voice wave animation when recording.
  - Generates an **Accuracy Score Gauge** showing the percentage of correctly pronounced words.
  - **Dynamic Word Feedback Alignment**: Uses a dynamic programming word alignment algorithm to highlight correctly spoken words in **green** and missed/incorrect words in **red**.
- **📚 Curated Exercises & Custom Input**:
  - Pre-loaded categories: *Daily Conversations*, *Business & Travel*, *Tongue Twisters*, and *Short Stories*.
  - Paste any custom text/article to practice with it immediately.
- **🌗 Dark / Light Mode Support**: Glassmorphic styling adapts gracefully to both dark and light modes.

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js and NPM installed.

### Installation

1. Install project dependencies:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`.

### 🌐 Browser Support

- **Text-to-Speech (SpeechSynthesis)**: Supported in all modern browsers (Chrome, Edge, Safari, Firefox).
- **Speech Recognition (SpeechRecognition)**: Supported in Google Chrome, Safari, and Microsoft Edge. *Note: Brave browser and Firefox do not support voice input out-of-the-box.*

## 🛠️ Technology Stack

- **Framework**: React (Vite)
- **Styling**: Vanilla CSS (CSS Custom Properties, Glassmorphism, animations)
- **Speech Engines**: Web Speech API (`window.speechSynthesis` and `webkitSpeechRecognition`)
- **Alignment Engine**: Levenshtein-based DP LCS word alignment for pronunciation feedback.
