import React from 'react';

/**
 * Returns a CSS class name representing the score category.
 * Uses early returns to map ranges.
 */
const determineScoreColorClass = (score) => {
  if (score >= 85) {
    return 'excellent';
  }
  if (score >= 60) {
    return 'good';
  }
  return 'needs-practice';
};

/**
 * Generates custom feedback headings and text descriptions tailored to the accuracy score.
 * Uses early returns.
 */
const generateFeedbackMessageByScore = (score) => {
  if (score === 100) {
    return { 
      title: '🌟 Perfect Pronunciation!', 
      desc: 'Absolutely flawless reading. Excellent speed and speech clarity!' 
    };
  }
  if (score >= 85) {
    return { 
      title: '🎉 Outstanding Work!', 
      desc: 'Great accent and articulation. You spoke almost every word correctly!' 
    };
  }
  if (score >= 60) {
    return { 
      title: '👍 Good Effort!', 
      desc: 'Solid attempt! Listen to the reading again and focus on the highlighted words in red.' 
    };
  }
  return { 
    title: '💪 Keep Practicing!', 
    desc: 'A few words were missed. Tap on them to listen, practice individually, and try again!' 
  };
};

export const ScoreCard = ({ accuracy, spokenText }) => {
  if (accuracy === null) {
    return null;
  }

  // Compute radial SVG parameters for accuracy circular gauge
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (accuracy / 100) * circumference;

  const scoreColorClass = determineScoreColorClass(accuracy);
  const feedback = generateFeedbackMessageByScore(accuracy);

  return (
    <div className="card score-card">
      <div className="score-radial">
        <svg className="radial-svg">
          <circle className="radial-bg" cx="55" cy="55" r={radius} />
          <circle
            className={`radial-progress ${scoreColorClass}`}
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
        <h3 className="score-title">{feedback.title}</h3>
        <p className="score-desc">{feedback.desc}</p>
        {spokenText && (
          <div className="spoken-transcript">
            <span>What we heard:</span> "{spokenText}"
          </div>
        )}
      </div>
    </div>
  );
};
