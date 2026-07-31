import { useConfigurator, INTERIOR_ITEMS } from '../../context/ConfiguratorContext'

export default function FocusedItemControls() {
  const { focusedItemId, setFocusedItemId, nudgeItem } = useConfigurator()

  if (!focusedItemId) return null

  const item = INTERIOR_ITEMS.find((i) => i.id === focusedItemId)
  if (!item) return null

  return (
    <div style={styles.wrapper}>
      <div style={styles.label}>
        {item.icon} {item.label}
      </div>
      <div style={styles.grid}>
        <span />
        <button style={styles.arrow} onClick={() => nudgeItem(focusedItemId, 'up')}>↑</button>
        <span />
        <button style={styles.arrow} onClick={() => nudgeItem(focusedItemId, 'left')}>←</button>
        <button style={styles.doneButton} onClick={() => setFocusedItemId(null)}>✕</button>
        <button style={styles.arrow} onClick={() => nudgeItem(focusedItemId, 'right')}>→</button>
        <span />
        <button style={styles.arrow} onClick={() => nudgeItem(focusedItemId, 'down')}>↓</button>
        <span />
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    position: 'fixed',
    bottom: 24,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 9999,
    background: 'rgba(30,30,30,0.85)',
    backdropFilter: 'blur(12px)',
    borderRadius: '16px',
    padding: '14px 18px',
    border: '1px solid rgba(255,255,255,0.15)',
    textAlign: 'center',
  },
  label: { color: '#fff', fontSize: '13px', fontWeight: 600, marginBottom: '10px', fontFamily: 'Arial, sans-serif' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 36px)',
    gridTemplateRows: 'repeat(3, 36px)',
    gap: '4px',
  },
  arrow: {
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
  },
  doneButton: {
    background: '#e63946',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px',
    cursor: 'pointer',
  },
}