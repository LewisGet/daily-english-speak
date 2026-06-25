import { useState, useEffect, useRef } from 'react';
import './App.css';

// Utilities
import { PRACTICE_CATEGORIES } from './utils/constants';
import { alignOriginalAndSpokenWords } from './utils/alignment';
import { convertRawTextToTokens } from './utils/textParser';

// Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { ReadingBoard } from './components/ReadingBoard';
import { ScoreCard } from './components/ScoreCard';
import { ReaderSettings } from './components/ReaderSettings';
import { SpeechPractice } from './components/SpeechPractice';

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
    const parsedTokens = convertRawTextToTokens(text);
    setTokens(parsedTokens);
    tokensRef.current = parsedTokens;
  }, [text]);

  // Load available speech synthesis voices
  const loadVoices = () => {
    const allVoices = window.speechSynthesis.getVoices();
    // Filter to English voices primarily
    const enVoices = allVoices.filter(v => v.lang.startsWith('en'));
    setVoices(enVoices);
    voicesRef.current = enVoices;
    
    if (enVoices.length === 0 || selectedVoiceNameRef.current) {
      return;
    }
    
    const defaultVoice = enVoices.find(v => v.name.includes('Google') && v.lang.includes('US'))
                         || enVoices.find(v => v.lang.includes('US'))
                         || enVoices.find(v => v.lang.includes('GB'))
                         || enVoices[0];
    setSelectedVoiceName(defaultVoice.name);
    selectedVoiceNameRef.current = defaultVoice.name;
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
    if (!SpeechRecognition) {
      setRecognitionSupported(false);
      return;
    }

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
      evaluateSpokenTranscriptAgainstOriginal(transcript);
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
  }, []);

  // Compare spoken text vs original sentence tokens
  const evaluateSpokenTranscriptAgainstOriginal = (transcript) => {
    setSpokenText(transcript);
    const currentTokens = tokensRef.current;
    const wordTokens = currentTokens.filter(t => t.isWord);
    if (wordTokens.length === 0) {
      return;
    }
    
    // Clean and split strings into words (lowercase, alphanumeric only)
    const wordTokensClean = wordTokens.map(t => t.text.toLowerCase().replace(/[^a-z0-9]/g, ''));
    const spokenWords = transcript.toLowerCase().split(/\s+/).map(w => w.replace(/[^a-z0-9]/g, '')).filter(w => w.length > 0);
    
    const matchedOriginalIndicesSet = alignOriginalAndSpokenWords(wordTokensClean, spokenWords);
    
    // Assign evaluation feedback (correct/incorrect) to each token
    const newEvaluated = {};
    let wordIndexCount = 0;
    
    currentTokens.forEach((token, index) => {
      if (!token.isWord) {
        return;
      }
      const isMatched = matchedOriginalIndicesSet.has(wordIndexCount);
      newEvaluated[index] = isMatched ? 'correct' : 'incorrect';
      wordIndexCount++;
    });
    
    setEvaluatedTokens(newEvaluated);
    
    const score = Math.round((matchedOriginalIndicesSet.size / wordTokens.length) * 100);
    setAccuracy(score);
  };

  // Handle Text-To-Speech (TTS)
  const toggleTextToSpeechPlayback = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentWordIndex(-1);
      return;
    }
    
    if (isListening) {
      toggleSpeechRecognitionListening(); // stop listening
    }
    
    // Clear evaluation highlights when listening to TTS
    setEvaluatedTokens({});
    setAccuracy(null);
    setClickedWord(null);
    setIsSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voiceObj = voices.find(v => v.name === selectedVoiceName);
    if (voiceObj) {
      utterance.voice = voiceObj;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    // Boundary highlights words as they are read
    utterance.onboundary = (event) => {
      if (event.name !== 'word') {
        return;
      }
      const charIndex = event.charIndex;
      const currentTokens = tokensRef.current;
      const matchIndex = currentTokens.findIndex(
        (token) => charIndex >= token.startIndex && charIndex < token.endIndex
      );
      if (matchIndex === -1) {
        return;
      }
      setCurrentWordIndex(matchIndex);
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
  const playSingleWordPronunciation = (token) => {
    if (!token.isWord) {
      return;
    }
    
    setClickedWord(token);
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(token.text);
    const voiceObj = voices.find(v => v.name === selectedVoiceName);
    if (voiceObj) {
      utterance.voice = voiceObj;
    }
    utterance.rate = 0.75; // Slower rate for pronunciation drilling
    utterance.pitch = pitch;
    
    window.speechSynthesis.speak(utterance);
  };

  // Handle Speech Recognition listening
  const toggleSpeechRecognitionListening = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentWordIndex(-1);
    }
    
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Safari or Microsoft Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      return;
    }
    
    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
    }
  };

  // Change selected practicing item
  const selectPracticeExercise = (categoryIndex, itemIndex, sentenceText) => {
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
  const loadCustomPracticeText = (e) => {
    e.preventDefault();
    if (!customText.trim()) {
      return;
    }
    
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

  return (
    <div className={`app-container ${isLightMode ? 'light-mode' : ''}`}>
      <Header 
        isLightMode={isLightMode} 
        onToggleTheme={() => setIsLightMode(!isLightMode)} 
      />

      <main className="app-main">
        <Sidebar
          selectedCategory={selectedCategory}
          selectedItemIndex={selectedItemIndex}
          onSelectSentence={selectPracticeExercise}
          customText={customText}
          setCustomText={setCustomText}
          onCustomTextSubmit={loadCustomPracticeText}
        />

        <section className="practice-panel">
          <ReadingBoard
            tokens={tokens}
            isSpeaking={isSpeaking}
            currentWordIndex={currentWordIndex}
            evaluatedTokens={evaluatedTokens}
            onWordClick={playSingleWordPronunciation}
            clickedWord={clickedWord}
            setClickedWord={setClickedWord}
          />

          <ScoreCard 
            accuracy={accuracy} 
            spokenText={spokenText} 
          />

          <div className="dashboard-grid">
            <ReaderSettings
              voices={voices}
              selectedVoiceName={selectedVoiceName}
              setSelectedVoiceName={setSelectedVoiceName}
              rate={rate}
              setRate={setRate}
              pitch={pitch}
              setPitch={setPitch}
              isSpeaking={isSpeaking}
              onSpeak={toggleTextToSpeechPlayback}
            />

            <SpeechPractice
              recognitionSupported={recognitionSupported}
              isListening={isListening}
              onListen={toggleSpeechRecognitionListening}
              accuracy={accuracy}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
