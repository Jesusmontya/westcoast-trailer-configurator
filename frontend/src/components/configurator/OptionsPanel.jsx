import { SIZES, INTERIOR_ITEMS, useConfigurator } from '../../context/ConfiguratorContext'
import '../../styles/panel.css'

export default function OptionsPanel() {
  const { sizeId, setSizeId, selectedItemIds, toggleItem, totalPrice } = useConfigurator()

  return (
    <div className="glass-panel">
      <h2 className="panel-heading">Arma tu trailer</h2>

      <section className="panel-section">
        <h3 className="panel-subheading">1. Elige el tamaño</h3>
        {SIZES.map((s) => (
          <label key={s.id} className="option-row">
            <input
              type="radio"
              name="size"
              checked={sizeId === s.id}
              onChange={() => setSizeId(s.id)}
            />
            <span className="option-label">{s.label}</span>
            <span className="option-price">${s.basePrice.toLocaleString()}</span>
          </label>
        ))}
      </section>

      <section className="panel-section">
        <h3 className="panel-subheading">2. Agrega equipo interior</h3>
        {INTERIOR_ITEMS.map((item) => (
          <label key={item.id} className="option-row">
            <input
              type="checkbox"
              checked={selectedItemIds.includes(item.id)}
              onChange={() => toggleItem(item.id)}
            />
            <span className="option-label">{item.label}</span>
            <span className="option-price">+${item.price.toLocaleString()}</span>
          </label>
        ))}
      </section>

      <div className="total-box">
        <span className="total-label">Total estimado</span>
        <span className="total-value">${totalPrice.toLocaleString()}</span>
      </div>

      <button className="quote-button">Generar cotización</button>
    </div>
  )
}