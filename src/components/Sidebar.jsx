import React from 'react';
import { PRACTICE_CATEGORIES } from '../utils/constants';
import { CloseIcon } from './Icons';

export const Sidebar = ({
  isOpen,
  onClose,
  selectedCategory,
  selectedItemIndex,
  onSelectSentence,
  customText,
  setCustomText,
  onCustomTextSubmit
}) => {
  return (
    <>
      {/* Backdrop overlay for drawer */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <section className={`sidebar-drawer ${isOpen ? 'open' : ''}`}>
        {/* Drawer Header with Close Button */}
        <div className="drawer-header">
          <h2 className="drawer-title">Exercise List</h2>
          <button 
            className="btn-icon btn-close-drawer" 
            onClick={onClose}
            aria-label="Close exercises menu"
            title="Close Menu"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="drawer-content">
          {/* Custom text card */}
          <div className="card">
            <h2 className="card-title">✍️ Custom Material</h2>
            <form 
              onSubmit={(e) => {
                onCustomTextSubmit(e);
                onClose(); // Auto-close sidebar on custom text loading
              }} 
              className="custom-input-area"
            >
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
                        onClick={() => {
                          onSelectSentence(catIdx, itemIdx, item);
                          onClose(); // Auto-close sidebar on sentence selection
                        }}
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
        </div>
      </section>
    </>
  );
};
