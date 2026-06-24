import { useState, useEffect, useRef } from 'react';
import './App.css';

// SVG Icons
const LogoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </svg>
);

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const VolumeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

const StopIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" />
  </svg>
);

const AlertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
);

// Predefined sentences
const PRACTICE_CATEGORIES = [
  {
    id: 'daily',
    name: '🗣️ Daily Conversations',
    items: [
      "Hello! How are you doing today? I hope everything is going well.",
      "Could you please tell me how to get to the nearest subway station?",
      "Would you like to grab a cup of coffee and talk about our weekend plans?",
      "I'm sorry for the delay, but I got stuck in heavy traffic on the highway.",
      "It is a beautiful day outside! The sun is shining and the breeze is cool."
    ]
  },
  {
    id: 'business',
    name: '💼 Business & Travel',
    items: [
      "I would appreciate your feedback on the presentation slides before the client meeting.",
      "Could you please confirm the departure time for our flight to London tomorrow morning?",
      "We need to find a sustainable solution that satisfies both our partners and our budget constraints.",
      "Thank you for taking the time to discuss this business opportunity with us today.",
      "Please let me know if you are available for a brief follow-up call at three PM."
    ]
  },
  {
    id: 'twisters',
    name: '😜 Tongue Twisters',
    items: [
      "She sells seashells by the seashore. The shells she sells are surely seashells.",
      "Peter Piper picked a peck of pickled peppers. A peck of pickled peppers Peter Piper picked.",
      "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
      "I saw Susie sitting in a shoe shine shop. Where she shines she sits, and where she sits she shines.",
      "Red lorries, yellow lorries, red lorries, yellow lorries."
    ]
  },
  {
    id: 'stories',
    name: '📖 Short Stories',
    items: [
      "Once upon a time, a tiny mouse made friends with a massive lion. One day, the lion was caught in a hunter's net. The little mouse chewed through the ropes to set the lion free.",
      "A clever crow found a pitcher with a little water at the bottom. He dropped small pebbles into the pitcher one by one, until the water rose to the top and he could drink.",
      "The tortoise and the hare had a race. The hare was so confident of winning that he took a nap halfway through. The slow and steady tortoise kept walking and won the race."
    ]
  }
];

function App() {
  // Application State
  const [text, setText] = useState(PRACTICE_CATEGORIES[0].items[0]);
  const [tokens, setTokens] = useState([]);
  
  // TTS State
  const [voices, setVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  
  // Speech Recognition State
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [evaluatedTokens, setEvaluatedTokens] = useState({}); // { tokenIndex: 'correct' | 'incorrect' }
  const [accuracy, setAccuracy] = useState(null); // number (0-100) or null
  
  // Navigation & Custom input
  const [selectedCategory, setSelectedCategory] = useState(PRACTICE_CATEGORIES[0].id);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [customText, setCustomText] = useState('');
  
  // Pronunciation detail helper
  const [clickedWord, setClickedWord] = useState(null);
  
  // Theme state
  const [isLightMode, setIsLightMode] = useState(false);

  // References for async events
  const tokensRef = useRef([]);
  const voicesRef = useRef([]);
  const selectedVoiceNameRef = useRef('');
  const recognitionRef = useRef(null);

  // Parse text into word and non-word tokens
  useEffect(() => {
    if (!text) {
      setTokens([]);
      return;
    }
    
    const regex = /(\w+)/g;
    let match;
    let lastIndex = 0;
    const newTokens = [];
    
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        newTokens.push({
          text: text.substring(lastIndex, match.index),
          isWord: false,
          startIndex: lastIndex,
          endIndex: match.index
        });
      }
      newTokens.push({
        text: match[0],
        isWord: true,
        startIndex: match.index,
        endIndex: regex.lastIndex
      });
      lastIndex = regex.lastIndex;
    }
    
    if (lastIndex < text.length) {
      newTokens.push({
        text: text.substring(lastIndex),
        isWord: false,
        startIndex: lastIndex,
        endIndex: text.length
      });
    }
    
    setTokens(newTokens);
    tokensRef.current = newTokens;
  }, [text]);

  // Load available speech synthesis voices
  const loadVoices = () => {
    const allVoices = window.speechSynthesis.getVoices();
    // Filter to English voices primarily
    const enVoices = allVoices.filter(v => v.lang.startsWith('en'));
    setVoices(enVoices);
    voicesRef.current = enVoices;
    
    if (enVoices.length > 0 && !selectedVoiceNameRef.current) {
      const defaultVoice = enVoices.find(v => v.name.includes('Google') && v.lang.includes('US'))
                           || enVoices.find(v => v.lang.includes('US'))
                           || enVoices.find(v => v.lang.includes('GB'))
                           || enVoices[0];
      setSelectedVoiceName(defaultVoice.name);
      selectedVoiceNameRef.current = defaultVoice.name;
    }
  };

  useEffect(() => {
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Update voice name ref
  useEffect(() => {
    selectedVoiceNameRef.current = selectedVoiceName;
  }, [selectedVoiceName]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';
      
      rec.onstart = () => {
        setIsListening(true);
        setSpokenText('');
        setEvaluatedTokens({});
        setAccuracy(null);
      };
      
      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        evaluateSpeech(transcript);
      };
      
      rec.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
        if (event.error === 'no-speech') {
          alert("We didn't hear anything. Please try again, speak clearly and make sure your microphone is working.");
        }
      };
      
      rec.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = rec;
      setRecognitionSupported(true);
    } else {
      setRecognitionSupported(false);
    }
  }, []);

  // Alignment algorithm: Needleman-Wunsch / DP alignment to find matching spoken words
  const alignWords = (originalWords, spokenWords) => {
    const n = originalWords.length;
    const m = spokenWords.length;
    if (n === 0 || m === 0) return new Set();

    // dp[i][j] stores the max score (exact matches)
    const dp = Array(n + 1).fill(null).map(() => Array(m + 1).fill(0));
    const parent = Array(n + 1).fill(null).map(() => Array(m + 1).fill(null));

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        if (originalWords[i - 1] === spokenWords[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
          parent[i][j] = { i: i - 1, j: j - 1, type: 'match' };
        } else {
          if (dp[i - 1][j] >= dp[i][j - 1]) {
            dp[i][j] = dp[i - 1][j];
            parent[i][j] = { i: i - 1, j, type: 'skip_original' };
          } else {
            dp[i][j] = dp[i][j - 1];
            parent[i][j] = { i, j: j - 1, type: 'skip_spoken' };
          }
        }
      }
    }

    const matchedOriginalIndices = new Set();
    let currI = n;
    let currJ = m;
    while (currI > 0 && currJ > 0) {
      const p = parent[currI][currJ];
      if (!p) break;
      if (p.type === 'match') {
        matchedOriginalIndices.add(currI - 1);
        currI = p.i;
        currJ = p.j;
      } else if (p.type === 'skip_original') {
        currI = p.i;
        currJ = p.j;
      } else {
        currJ = p.j;
      }
    }

    return matchedOriginalIndices;
  };

  // Compare spoken text vs original sentence tokens
  const evaluateSpeech = (transcript) => {
    setSpokenText(transcript);
    const currentTokens = tokensRef.current;
    const wordTokens = currentTokens.filter(t => t.isWord);
    if (wordTokens.length === 0) return;
    
    // Clean and split strings into words (lowercase, alphanumeric only)
    const wordTokensClean = wordTokens.map(t => t.text.toLowerCase().replace(/[^a-z0-9]/g, ''));
    const spokenWords = transcript.toLowerCase().split(/\s+/).map(w => w.replace(/[^a-z0-9]/g, '')).filter(w => w.length > 0);
    
    const matchedOriginalIndicesSet = alignWords(wordTokensClean, spokenWords);
    
    // Assign evaluation feedback (correct/incorrect) to each token
    const newEvaluated = {};
    let wordIndexCount = 0;
    
    currentTokens.forEach((token, index) => {
      if (token.isWord) {
        const isMatched = matchedOriginalIndicesSet.has(wordIndexCount);
        newEvaluated[index] = isMatched ? 'correct' : 'incorrect';
        wordIndexCount++;
      }
    });
    
    setEvaluatedTokens(newEvaluated);
    
    const score = Math.round((matchedOriginalIndicesSet.size / wordTokens.length) * 100);
    setAccuracy(score);
  };

  // Handle Text-To-Speech (TTS)
  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentWordIndex(-1);
      return;
    }
    
    if (isListening) {
      handleListen(); // stop listening
    }
    
    // Clear evaluation highlights when listening to TTS
    setEvaluatedTokens({});
    setAccuracy(null);
    setClickedWord(null);
    setIsSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voiceObj = voices.find(v => v.name === selectedVoiceName);
    if (voiceObj) utterance.voice = voiceObj;
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    // Boundary highlights words as they are read
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIndex = event.charIndex;
        const currentTokens = tokensRef.current;
        const matchIndex = currentTokens.findIndex(
          (token) => charIndex >= token.startIndex && charIndex < token.endIndex
        );
        if (matchIndex !== -1) {
          setCurrentWordIndex(matchIndex);
        }
      }
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentWordIndex(-1);
    };
    
    utterance.onerror = (e) => {
      console.error("TTS error:", e);
      setIsSpeaking(false);
      setCurrentWordIndex(-1);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  // Speak a single clicked word slow
  const handleWordClick = (token) => {
    if (!token.isWord) return;
    
    setClickedWord(token);
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(token.text);
    const voiceObj = voices.find(v => v.name === selectedVoiceName);
    if (voiceObj) utterance.voice = voiceObj;
    utterance.rate = 0.75; // Slower rate for pronunciation drilling
    utterance.pitch = pitch;
    
    window.speechSynthesis.speak(utterance);
  };

  // Handle Speech Recognition listening
  const handleListen = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentWordIndex(-1);
    }
    
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.error("Failed to start speech recognition:", err);
        }
      } else {
        alert("Speech recognition is not supported in this browser. Please use Chrome, Safari or Microsoft Edge.");
      }
    }
  };

  // Change selected practicing item
  const handleSelectSentence = (categoryIndex, itemIndex, sentenceText) => {
    setSelectedCategory(PRACTICE_CATEGORIES[categoryIndex].id);
    setSelectedItemIndex(itemIndex);
    setText(sentenceText);
    
    // Clear and stop active actions
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentWordIndex(-1);
    setSpokenText('');
    setEvaluatedTokens({});
    setAccuracy(null);
    setClickedWord(null);
  };

  // Handle custom typed input
  const handleCustomTextSubmit = (e) => {
    e.preventDefault();
    if (!customText.trim()) return;
    
    setSelectedCategory('custom');
    setSelectedItemIndex(0);
    setText(customText);
    
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentWordIndex(-1);
    setSpokenText('');
    setEvaluatedTokens({});
    setAccuracy(null);
    setClickedWord(null);
  };

  // Compute radial SVG parameters for accuracy circular gauge
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = accuracy !== null ? circumference - (accuracy / 100) * circumference : circumference;

  const getScoreColorClass = (score) => {
    if (score >= 85) return 'excellent';
    if (score >= 60) return 'good';
    return 'needs-practice';
  };

  const getFeedbackMessage = (score) => {
    if (score === 100) return { title: '🌟 Perfect Pronunciation!', desc: 'Absolutely flawless reading. Excellent speed and speech clarity!' };
    if (score >= 85) return { title: '🎉 Outstanding Work!', desc: 'Great accent and articulation. You spoke almost every word correctly!' };
    if (score >= 60) return { title: '👍 Good Effort!', desc: 'Solid attempt! Listen to the reading again and focus on the highlighted words in red.' };
    return { title: '💪 Keep Practicing!', desc: 'A few words were missed. Tap on them to listen, practice individually, and try again!' };
  };

  return (
    <div className={`app-container ${isLightMode ? 'light-mode' : ''}`}>
      {/* Header bar */}
      <header className="app-header">
        <div className="header-brand">
          <div className="brand-icon">
            <LogoIcon />
          </div>
          <div className="brand-title">SpeakLearn Partner</div>
        </div>
        <div className="header-controls">
          <button 
            className="btn-icon" 
            onClick={() => setIsLightMode(!isLightMode)} 
            aria-label="Toggle theme"
            title={isLightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {isLightMode ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </header>

      {/* Main app panel */}
      <main className="app-main">
        {/* Left Sidebar */}
        <section className="sidebar">
          {/* Categories select list */}
          <div className="card">
            <h2 className="card-title">📚 Study Exercises</h2>
            <div className="category-group">
              {PRACTICE_CATEGORIES.map((cat, catIdx) => (
                <div key={cat.id}>
                  <div className="category-header">{cat.name}</div>
                  <div className="category-items">
                    {cat.items.map((item, itemIdx) => (
                      <button
                        key={itemIdx}
                        className={`sentence-item-btn ${
                          selectedCategory === cat.id && selectedItemIndex === itemIdx ? 'active' : ''
                        }`}
                        onClick={() => handleSelectSentence(catIdx, itemIdx, item)}
                        title={item}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom text card */}
          <div className="card">
            <h2 className="card-title">✍️ Custom Material</h2>
            <form onSubmit={handleCustomTextSubmit} className="custom-input-area">
              <textarea
                className="custom-textarea"
                placeholder="Paste or type your own English text here to practice speaking..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
              />
              <button type="submit" className="btn-primary" disabled={!customText.trim()}>
                Load Custom Text
              </button>
            </form>
          </div>
        </section>

        {/* Right workspace */}
        <section className="practice-panel">
          {/* Main Reading display area */}
          <div className="card" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
            <h2 className="card-title" style={{ justifyContent: 'space-between' }}>
              <span>📖 Reading Board</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'normal' }}>
                * Click any word to hear its pronunciation.
              </span>
            </h2>
            
            <div className="text-display-box">
              {tokens.map((token, index) => {
                if (!token.isWord) {
                  return (
                    <span key={index} className="word-span non-word">
                      {token.text}
                    </span>
                  );
                }
                
                // Determine highlight style
                let highlightClass = '';
                if (isSpeaking && currentWordIndex === index) {
                  highlightClass = 'speaking-active';
                } else if (evaluatedTokens[index]) {
                  highlightClass = `feedback-${evaluatedTokens[index]}`;
                }
                
                return (
                  <span
                    key={index}
                    className={`word-span ${highlightClass}`}
                    onClick={() => handleWordClick(token)}
                  >
                    {token.text}
                  </span>
                );
              })}
            </div>

            {/* Micro details on clicked word */}
            {clickedWord && (
              <div className="word-helper">
                <div className="helper-speak-btn" onClick={() => handleWordClick(clickedWord)}>
                  🔊
                </div>
                <div className="helper-text">
                  Focused word: <span className="helper-word">"{clickedWord.text.replace(/[^a-zA-Z0-9']/g, '')}"</span>. Practice pronouncing this word by whispering or speaking it in isolation.
                </div>
                <button className="sentence-item-btn" style={{ padding: '4px 8px', fontSize: '12px', width: 'auto' }} onClick={() => setClickedWord(null)}>
                  Dismiss
                </button>
              </div>
            )}
          </div>

          {/* Pronunciation score evaluation card */}
          {accuracy !== null && (
            <div className="card score-card">
              <div className="score-radial">
                <svg className="radial-svg">
                  <circle className="radial-bg" cx="55" cy="55" r={radius} />
                  <circle
                    className={`radial-progress ${getScoreColorClass(accuracy)}`}
                    cx="55"
                    cy="55"
                    r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className="radial-text">
                  {accuracy}%
                  <span className="radial-label">Score</span>
                </div>
              </div>
              <div className="score-feedback">
                <h3 className="score-title">{getFeedbackMessage(accuracy).title}</h3>
                <p className="score-desc">{getFeedbackMessage(accuracy).desc}</p>
                {spokenText && (
                  <div className="spoken-transcript">
                    <span>What we heard:</span> "{spokenText}"
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Controls Dashboard: Speeds & Recording */}
          <div className="dashboard-grid">
            {/* Read Aloud Settings */}
            <div className="card">
              <h2 className="card-title">🔊 Reader Settings</h2>
              <div className="settings-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="voice-select">Voice Speaker</label>
                  <select
                    id="voice-select"
                    className="select-input"
                    value={selectedVoiceName}
                    onChange={(e) => setSelectedVoiceName(e.target.value)}
                  >
                    {voices.map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                    {voices.length === 0 && (
                      <option value="">No English Voices Found</option>
                    )}
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="rate-slider">
                    <span>Speed Rate</span>
                    <span>{rate}x</span>
                  </label>
                  <div className="range-container">
                    <input
                      id="rate-slider"
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      className="range-input"
                      value={rate}
                      onChange={(e) => setRate(parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="pitch-slider">
                    <span>Vocal Pitch</span>
                    <span>{pitch}</span>
                  </label>
                  <div className="range-container">
                    <input
                      id="pitch-slider"
                      type="range"
                      min="0.5"
                      max="1.5"
                      step="0.1"
                      className="range-input"
                      value={pitch}
                      onChange={(e) => setPitch(parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div className="tts-controls">
                  <button
                    className={`btn-control ${isSpeaking ? 'active-play animate-pulse-glow' : ''}`}
                    onClick={handleSpeak}
                  >
                    {isSpeaking ? (
                      <>
                        <StopIcon /> Stop Reading
                      </>
                    ) : (
                      <>
                        <VolumeIcon /> Read Aloud
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Speaking Practice panel */}
            <div className="card">
              <h2 className="card-title">🎙️ Speech Practice</h2>
              <div className="practice-container">
                {!recognitionSupported && (
                  <div className="alert-warning">
                    <AlertIcon />
                    <div>
                      <strong>Mic Recognition Disabled:</strong> Webkit Speech Recognition is not supported by your browser. Use Google Chrome or Apple Safari to enable mic recording.
                    </div>
                  </div>
                )}
                
                <div className="mic-button-outer">
                  <button
                    className={`btn-mic ${isListening ? 'listening animate-pulse-record' : 'idle'}`}
                    onClick={handleListen}
                    disabled={!recognitionSupported}
                    aria-label="Start recording speech"
                    title={isListening ? "Stop listening" : "Start speaking"}
                  >
                    {isListening ? '⏹️' : '🎙️'}
                  </button>
                </div>

                {isListening ? (
                  <div style={{ width: '100%' }}>
                    <div className="status-text animate-pulse-glow" style={{ color: '#ef4444' }}>Listening to your voice...</div>
                    <div className="status-sub">Please read the text aloud clearly.</div>
                    
                    <div className="wave-container">
                      <div className="wave-bar speaking"></div>
                      <div className="wave-bar speaking"></div>
                      <div className="wave-bar speaking"></div>
                      <div className="wave-bar speaking"></div>
                      <div className="wave-bar speaking"></div>
                      <div className="wave-bar speaking"></div>
                      <div className="wave-bar speaking"></div>
                      <div className="wave-bar speaking"></div>
                      <div className="wave-bar speaking"></div>
                      <div className="wave-bar speaking"></div>
                      <div className="wave-bar speaking"></div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="status-text">
                      {accuracy !== null ? 'Evaluation Complete' : 'Ready to Practice'}
                    </div>
                    <div className="status-sub">
                      {accuracy !== null 
                        ? 'View score above. Tap mic to re-record.' 
                        : 'Tap the microphone to practice reading aloud.'}
                    </div>
                    
                    <div className="wave-container">
                      <div className="wave-bar"></div>
                      <div className="wave-bar"></div>
                      <div className="wave-bar"></div>
                      <div className="wave-bar"></div>
                      <div className="wave-bar"></div>
                      <div className="wave-bar"></div>
                      <div className="wave-bar"></div>
                      <div className="wave-bar"></div>
                      <div className="wave-bar"></div>
                      <div className="wave-bar"></div>
                      <div className="wave-bar"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        English Speaking Practice & Pronunciation Partner. Developed using React & Webkit SpeechSynthesis.
      </footer>
    </div>
  );
}

export default App;
