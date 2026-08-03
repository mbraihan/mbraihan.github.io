import React from 'react';

const QuestionCard = ({ question, index, value, onChange, scaleOptions }) => {
  return (
    <div className="question-item">
      <div className="question-number">Symptom {question.id}</div>
      <div className="question-text">{question.text}</div>
      <div className="scale-container">
        <div className="scale-options">
          {scaleOptions.map((option) => (
            <div key={option.value} className="scale-item">
              <div className="scale-label">{option.label}</div>
              <input
                type="radio"
                name={`symptom_${question.id}`}
                value={option.value}
                checked={value === String(option.value)}
                onChange={(e) => onChange(index, e.target.value)}
                className="radio-input"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;