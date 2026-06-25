import React from 'react';

/**
 * Determines the visual styling class for a word token based on current speaking and evaluation states.
 * Uses early returns to avoid nested if-else statements.
 */
const determineTokenHighlightClass = (isSpeaking, currentWordIndex, index, evaluatedTokens) => {
  if (isSpeaking && currentWordIndex === index) {
    return 'speaking-active';
  }
  if (evaluatedTokens[index]) {
    return `feedback-${evaluatedTokens[index]}`;
  }
  return '';
};

export const ReadingBoard = ({
  tokens,
  isSpeaking,
  currentWordIndex,
  evaluatedTokens,
  onWordClick,
  clickedWord,
  setClickedWord
}) => {
  return (
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
          
          const highlightClass = determineTokenHighlightClass(
            isSpeaking,
            currentWordIndex,
            index,
            evaluatedTokens
          );
          
          return (
            <span
              key={index}
              className={`word-span ${highlightClass}`}
              onClick={() => onWordClick(token)}
            >
              {token.text}
            </span>
          );
        })}
      </div>

      {/* Micro details on clicked word */}
      {clickedWord && (
        <div className="word-helper">
          <div className="helper-speak-btn" onClick={() => onWordClick(clickedWord)}>
            🔊
          </div>
          <div className="helper-text">
            Focused word: <span className="helper-word">"{clickedWord.text.replace(/[^a-zA-Z0-9']/g, '')}"</span>. Practice pronouncing this word by whispering or speaking it in isolation.
          </div>
          <button 
            className="sentence-item-btn" 
            style={{ padding: '4px 8px', fontSize: '12px', width: 'auto' }} 
            onClick={() => setClickedWord(null)}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
