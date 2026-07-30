import {
  useConfigurator,
  INTERIOR_ITEMS,
  EQUIPMENT_CATEGORIES,
} from '../../context/ConfiguratorContext'

export default function StepEquipment() {
  const {
    selectedItemIds,
    toggleItem,
    isOverCapacity,
    selectedPresetId,
    notes,
    setNotes,
    size,
  } = useConfigurator()

  return (
    <div>
      <h2 style={styles.heading}>Add your equipment</h2>

      <p style={styles.dragHint}>
        💡 Tip: once added, drag equipment pieces around in the 3D view to arrange your kitchen.
      </p>

      {selectedPresetId && (
        <p style={styles.presetNote}>
          Preset loaded — feel free to adjust anything below.
        </p>
      )}

      {isOverCapacity && (
        <p style={styles.warning}>
          This might be tight for a {size.label} trailer — consider a bigger size.
        </p>
      )}

      {EQUIPMENT_CATEGORIES.map((category) => {
        const itemsInCategory = INTERIOR_ITEMS.filter((i) => i.category === category)
        if (itemsInCategory.length === 0) return null

        return (
          <div key={category} style={styles.categoryBlock}>
            <p style={styles.categoryLabel}>{category}</p>
            <div style={styles.cardGrid}>
              {itemsInCategory.map((item) => {
                const isSelected = selectedItemIds.includes(item.id)
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    style={{
                      ...styles.card,
                      borderColor: isSelected ? '#e63946' : 'rgba(255,255,255,0.1)',
                      background: isSelected ? 'rgba(230,57,70,0.12)' : 'rgba(255,255,255,0.05)',
                    }}
                  >
                    <span style={styles.cardIcon}>{item.icon}</span>
                    <span style={styles.cardLabel}>{item.label}</span>
                    <span style={styles.cardPrice}>+${item.price.toLocaleString()}</span>
                    {isSelected && <span style={styles.checkBadge}>✓</span>}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}

      <div style={styles.notesBlock}>
        <p style={styles.categoryLabel}>Anything specific in mind? (optional)</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. extra window on the left side..."
          style={styles.textarea}
        />
      </div>
    </div>
  )
}

const styles = {
  heading: { fontSize: '20px', color: '#fff', margin: '0 0 12px' },
  dragHint: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.6)',
    background: 'rgba(255,255,255,0.05)',
    padding: '10px 12px',
    borderRadius: '8px',
    marginBottom: '16px',
    lineHeight: 1.4,
  },
  presetNote: {
    fontSize: '12px',
    color: '#f1c40f',
    background: 'rgba(241,196,15,0.1)',
    padding: '8px 12px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  warning: {
    fontSize: '12px',
    color: '#e63946',
    background: 'rgba(230,57,70,0.1)',
    padding: '8px 12px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  categoryBlock: { marginBottom: '20px' },
  categoryLabel: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '10px',
  },
  cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' },
  card: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '4px',
    padding: '12px',
    border: '1px solid',
    borderRadius: '10px',
    cursor: 'pointer',
    textAlign: 'left',
  },
  cardIcon: { fontSize: '20px' },
  cardLabel: { fontSize: '12px', color: '#fff', fontWeight: 600, lineHeight: 1.2 },
  cardPrice: { fontSize: '11px', color: '#f1c40f' },
  checkBadge: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    background: '#e63946',
    color: '#fff',
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notesBlock: { marginTop: '20px' },
  textarea: {
    width: '100%',
    minHeight: '70px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    padding: '10px',
    color: '#fff',
    fontSize: '13px',
    fontFamily: 'Arial, sans-serif',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
}