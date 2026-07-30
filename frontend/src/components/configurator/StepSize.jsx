import { useConfigurator, SIZES } from '../../context/ConfiguratorContext'

export default function StepSize() {
  const { sizeId, setSizeId } = useConfigurator()

  return (
    <div>
      <h2 style={styles.heading}>Choose your size</h2>
      <p style={styles.subheading}>You can change this anytime.</p>

      <div style={styles.list}>
        {SIZES.map((s) => (
          <label
            key={s.id}
            style={{
              ...styles.card,
              borderColor: sizeId === s.id ? '#e63946' : 'rgba(255,255,255,0.1)',
            }}
          >
            <input
              type="radio"
              name="size"
              checked={sizeId === s.id}
              onChange={() => setSizeId(s.id)}
              style={{ marginRight: '10px' }}
            />
            <div>
              <div style={styles.cardHeader}>
                <span style={styles.cardName}>{s.label}</span>
                <span style={styles.cardPrice}>${s.basePrice.toLocaleString()}</span>
              </div>
              <p style={styles.tagline}>{s.tagline}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}

const styles = {
  heading: { fontSize: '20px', color: '#fff', margin: '0 0 4px' },
  subheading: { fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '0 0 20px' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  card: {
    display: 'flex',
    alignItems: 'flex-start',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '14px',
    cursor: 'pointer',
  },
  cardHeader: { display: 'flex', justifyContent: 'space-between', gap: '12px' },
  cardName: { color: '#fff', fontSize: '15px', fontWeight: 600 },
  cardPrice: { color: '#f1c40f', fontSize: '13px' },
  tagline: { color: 'rgba(255,255,255,0.5)', fontSize: '12px', margin: '4px 0 0' },
}