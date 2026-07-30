import { useConfigurator } from '../../context/ConfiguratorContext'

function FloorPlanMiniMap() {
  const { size, selectedItems, positions } = useConfigurator()
  const { floorFt } = size
  const svgW = 260
  const svgH = (floorFt.depth / floorFt.width) * svgW

  return (
    <svg width={svgW} height={svgH} style={styles.svg}>
      <rect x={0} y={0} width={svgW} height={svgH} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" />
      {selectedItems.map((item) => {
        const pos = positions[item.id]
        if (!pos) return null
        const x = (pos.x / floorFt.width) * svgW
        const y = (pos.z / floorFt.depth) * svgH
        const w = (item.footprintFt.w / floorFt.width) * svgW
        const h = (item.footprintFt.d / floorFt.depth) * svgH
        return (
          <g key={item.id}>
            <rect x={x} y={y} width={w} height={h} fill={item.color} opacity={0.85} rx={2} />
            <text x={x + w / 2} y={y + h / 2 + 3} fontSize="9" fill="#1c1917" textAnchor="middle">
              {item.icon}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function StepSummary() {
  const {
    size,
    selectedItems,
    totalPrice,
    notes,
    name,
    setName,
    phone,
    setPhone,
    submitting,
    submitted,
    submitError,
    submitLead,
  } = useConfigurator()

  const monthlyEstimate = Math.round(totalPrice / 48)

  function handleSubmit(e) {
    e.preventDefault()
    submitLead()
  }

  if (submitted) {
    return (
      <div style={styles.successBox}>
        <p style={styles.successTitle}>Thanks{name ? `, ${name}` : ''}!</p>
        <p style={styles.successText}>
          We'll be in touch within 24 hours — excited to build this with you.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h2 style={styles.heading}>Your quote</h2>

      <p style={styles.mapLabel}>Your layout</p>
      <FloorPlanMiniMap />

      <div style={styles.breakdown}>
        <div style={styles.breakdownRow}>
          <span>{size.label} trailer</span>
          <span>${size.basePrice.toLocaleString()}</span>
        </div>
        {selectedItems.map((item) => (
          <div key={item.id} style={styles.breakdownRow}>
            <span>{item.icon} {item.label}</span>
            <span>+${item.price.toLocaleString()}</span>
          </div>
        ))}
        <div style={styles.totalRow}>
          <span>Total</span>
          <span>${totalPrice.toLocaleString()}</span>
        </div>
        <p style={styles.financing}>
          As low as ${monthlyEstimate.toLocaleString()}/mo with flexible financing
        </p>
      </div>

      {notes && (
        <div style={styles.notesPreview}>
          <p style={styles.notesLabel}>Your notes:</p>
          <p style={styles.notesText}>{notes}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Full name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
        <input
          type="tel"
          placeholder="Phone number"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={styles.input}
        />

        {submitError && <p style={styles.errorText}>Something went wrong. Please try again.</p>}

        <button type="submit" disabled={submitting} style={styles.submitButton}>
          {submitting ? '...' : 'Get my quote →'}
        </button>
        <p style={styles.disclaimer}>No commitment — just your quote.</p>
      </form>
    </div>
  )
}

const styles = {
  heading: { fontSize: '20px', color: '#fff', margin: '0 0 12px' },
  mapLabel: { fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', margin: '0 0 8px' },
  svg: { display: 'block', marginBottom: '16px', borderRadius: '8px' },
  breakdown: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
  },
  breakdownRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.7)',
    padding: '4px 0',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '16px',
    fontWeight: 700,
    color: '#2ecc71',
    borderTop: '1px solid rgba(255,255,255,0.15)',
    marginTop: '8px',
    paddingTop: '8px',
  },
  financing: { fontSize: '11px', color: '#f1c40f', marginTop: '8px', marginBottom: 0 },
  notesPreview: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
    padding: '10px',
    marginBottom: '16px',
  },
  notesLabel: { fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: '0 0 4px' },
  notesText: { fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: 0 },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    padding: '10px 12px',
    color: '#fff',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
  },
  submitButton: {
    marginTop: '6px',
    padding: '14px',
    background: '#e63946',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  disclaimer: { fontSize: '11px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', margin: '4px 0 0' },
  errorText: { fontSize: '12px', color: '#e63946', margin: 0 },
  successBox: { padding: '20px 0', textAlign: 'center' },
  successTitle: { fontSize: '18px', color: '#fff', fontWeight: 600, margin: '0 0 8px' },
  successText: { fontSize: '14px', color: 'rgba(255,255,255,0.6)', margin: 0 },
}