import React from 'react';

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
