import React from 'react';
import '../../styles/WorkflowWarnings.css';

export function WorkflowWarnings({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="workflow-warnings">
      <h3>Recomendaciones</h3>
      <ul className="warnings-list">
        {recommendations.map((rec, idx) => (
          <li key={idx} className={`warning-item warning-${rec.type}`}>
            <span className="warning-icon">!</span>
            <span className="warning-text">{rec.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
