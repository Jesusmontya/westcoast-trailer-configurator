import { useConfigurator } from '../../context/ConfiguratorContext'
import StepIndicator from './StepIndicator'
import StepPreset from './StepPreset'
import StepSize from './StepSize'
import StepEquipment from './StepEquipment'
import StepSummary from './StepSummary'
import '../../styles/panel.css'

export default function OptionsPanel() {
  const { step, nextStep, prevStep, submitted } = useConfigurator()

  return (
    <div className="glass-panel">
      <StepIndicator />

      {step === 1 && <StepPreset />}
      {step === 2 && <StepSize />}
      {step === 3 && <StepEquipment />}
      {step === 4 && <StepSummary />}

      {!submitted && (
        <div style={styles.navRow}>
          {step > 1 && (
            <button onClick={prevStep} style={styles.backButton}>
              ← Back
            </button>
          )}
          {step < 4 && (
            <button onClick={nextStep} style={styles.nextButton}>
              Next →
            </button>
          )}
        </div>
      )}
    </div>
  )
}

const styles = {
  navRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  backButton: {
    padding: '10px 16px',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '13px',
    cursor: 'pointer',
  },
  nextButton: {
    marginLeft: 'auto',
    padding: '10px 20px',
    background: '#e63946',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
}