import React from 'react';
import { VolumeIcon, StopIcon } from './Icons';

export const ReaderSettings = ({
  voices,
  selectedVoiceName,
  setSelectedVoiceName,
  rate,
  setRate,
  pitch,
  setPitch,
  isSpeaking,
  onSpeak
}) => {
  return (
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
            onClick={onSpeak}
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
  );
};
