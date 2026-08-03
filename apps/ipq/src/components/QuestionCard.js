import React from 'react';

const QuestionCard = ({ question, index, value, onChange }) => {
  return (
    <div className="question-item">
      <div className="question-number">Question {question.id}</div>
      <div className="question-text">{question.text}</div>
      <div className="scale-container">
        <div className="scale-label">{question.leftAnchor}</div>
        <div className="scale-options">
          {[1, 2, 3, 4, 5, 6, 7].map((scaleValue) => (
            <div key={scaleValue} className="scale-item">
              <div className="scale-number">{scaleValue}</div>
              <input
                type="radio"
                name={`question_${question.id}`}
                value={scaleValue}
                checked={value === String(scaleValue)}
                onChange={(e) => onChange(index, e.target.value)}
                className="radio-input"
              />
            </div>
          ))}
        </div>
        <div className="scale-label">{question.rightAnchor}</div>
      </div>
    </div>
  );
};

export default QuestionCard;