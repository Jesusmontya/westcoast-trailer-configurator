import { useConfigurator, SIZES, INTERIOR_ITEMS } from '../../context/ConfiguratorContext'

export default function StepPreset() {
  const { presets, selectedPresetId, applyPreset, startFromScratch, nextStep } = useConfigurator()

  function estimatePrice(preset) {
    const size = SIZES.find((s) => s.id === preset.size)
    const itemsTotal = preset.equipment.reduce((sum, id) => {
      const item = INTERIOR_ITEMS.find((i) => i.id === id)
      return sum + (item ? item.price : 0)
    }, 0)
    return (size ? size.basePrice : 0) + itemsTotal
  }

  function handleSelect(preset) {
    applyPreset(preset)
    nextStep()
  }

  function handleScratch() {
    startFromScratch()
    nextStep()
  }

  return (
    <div>
      <h2 style={styles.heading}>Pick a starting point</h2>
      <p style={styles.subheading}>You can adjust everything after.</p>

      <div style={styles.list}>
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handleSelect(preset)}
            style={{
              ...styles.card,
              borderColor: selectedPresetId === preset.id ? '#e63946' : 'rgba(255,255,255,0.1)',
            }}
          >
            <div style={styles.cardHeader}>
              <span style={styles.cardName}>{preset.name}</span>
              <span style={styles.cardPrice}>from ${estimatePrice(preset).toLocaleString()}</span>
            </div>
            <div style={styles.tagRow}>
              {preset.equipment.map((id) => {
                const item = INTERIOR_ITEMS.find((i) => i.id === id)
                return item ? (
                  <span key={id} style={styles.tag}>
                    {item.label}
                  </span>
                ) : null
              })}
            </div>
          </button>
        ))}

        <button onClick={handleScratch} style={styles.scratchCard}>
          Start from scratch
        </button>
      </div>
    </div>
  )
}

const styles = {
  heading: { fontSize: '20px', color: '#fff', margin: '0 0 4px' },
  subheading: { fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '0 0 20px' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  card: {
    textAlign: 'left',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '14px',
    cursor: 'pointer',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  cardName: { color: '#fff', fontSize: '14px', fontWeight: 600 },
  cardPrice: { color: '#f1c40f', fontSize: '13px' },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  tag: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.6)',
    background: 'rgba(255,255,255,0.08)',
    padding: '3px 8px',
    borderRadius: '999px',
  },
  scratchCard: {
    textAlign: 'center',
    background: 'transparent',
    border: '1px dashed rgba(255,255,255,0.25)',
    borderRadius: '12px',
    padding: '14px',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '13px',
    cursor: 'pointer',
  },
}