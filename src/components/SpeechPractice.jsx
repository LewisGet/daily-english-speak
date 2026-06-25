import React from 'react';
import { AlertIcon } from './Icons';

export const SpeechPractice = ({
  recognitionSupported,
  isListening,
  onListen,
  accuracy
}) => {
  return (
    <div className="card speech-practice-card">
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
            onClick={onListen}
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
  );
};
