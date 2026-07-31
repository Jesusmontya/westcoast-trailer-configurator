import React from 'react';
import '../../styles/StepIndicator.css';

export function StepIndicator({ currentStep, totalSteps = 4 }) {
  return (
    <div className="step-indicator">
      <span className="step-label">
        Paso {currentStep} de {totalSteps}
      </span>
      <div className="step-dots">
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <div
            key={idx}
            className={`dot ${idx + 1 === currentStep ? 'active' : ''} ${
              idx + 1 < currentStep ? 'completed' : ''
            }`}
          />
        ))}
      </div>
    </div>
  );
}