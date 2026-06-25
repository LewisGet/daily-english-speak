import React from 'react';
import { PRACTICE_CATEGORIES } from '../utils/constants';

export const Sidebar = ({
  selectedCategory,
  selectedItemIndex,
  onSelectSentence,
  customText,
  setCustomText,
  onCustomTextSubmit
}) => {
  return (
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
                    onClick={() => onSelectSentence(catIdx, itemIdx, item)}
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
        <form onSubmit={onCustomTextSubmit} className="custom-input-area">
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
  );
};
