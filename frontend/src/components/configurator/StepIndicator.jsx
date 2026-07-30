import { useConfigurator } from '../../context/ConfiguratorContext'

const STEP_LABELS = ['Start', 'Size', 'Equipment', 'Quote']

export default function StepIndicator() {
  const { step, goToStep } = useConfigurator()

  return (
    <div style={styles.wrapper}>
      <div style={styles.row}>
        {[1, 2, 3, 4].map((n) => (
          <button
            key={n}
            onClick={() => goToStep(n)}
            style={{
              ...styles.dot,
              background: n === step ? '#e63946' : n < step ? 'rgba(230,57,70,0.4)' : 'rgba(255,255,255,0.15)',
            }}
            aria-label={`Go to step ${n}`}
          />
        ))}
      </div>
      <p style={styles.label}>
        Step {step} of 4 — {STEP_LABELS[step - 1]}
      </p>
    </div>
  )
}

const styles = {
  wrapper: { marginBottom: '20px' },
  row: { display: 'flex', gap: '8px', marginBottom: '8px' },
  dot: {
    flex: 1,
    height: '4px',
    borderRadius: '2px',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
  },
  label: { fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 },
}