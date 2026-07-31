import React, { useContext } from 'react';
import { ConfiguratorUIContext } from '../../context/ConfiguratorUIContext';
import { StepIndicator } from './StepIndicator';
import { StepPreset } from './StepPreset';
import { StepSize } from './StepSize';
import { StepEquipment } from './StepEquipment';
import { StepSummary } from './StepSummary';
import '../../styles/OptionsPanel.css';

export function OptionsPanel() {
  const { currentStep } = useContext(ConfiguratorUIContext);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepPreset />;
      case 2:
        return <StepSize />;
      case 3:
        return <StepEquipment />;
      case 4:
        return <StepSummary />;
      default:
        return <StepPreset />;
    }
  };

  return (
    <div className="options-panel">
      <div className="panel-header">
        <StepIndicator currentStep={currentStep} totalSteps={4} />
      </div>

      <div className="panel-content">
        {renderStep()}
      </div>
    </div>
  );
}