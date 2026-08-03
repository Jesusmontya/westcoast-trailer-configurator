import { useState } from 'react'
import { MOCK_TRAILERS, CATEGORIES } from '../../data/mockTrailers'
import TrailerModal from './TrailerModal'
import CustomBuildModal from './CustomBuildModal'
import '../../styles/gallery.css'

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedTrailer, setSelectedTrailer] = useState(null)
  const [showCustomModal, setShowCustomModal] = useState(false)

  const filtered =
    activeCategory === 'All'
      ? MOCK_TRAILERS
      : MOCK_TRAILERS.filter((t) => t.category === activeCategory)

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <span className="gallery-eyebrow">Real trailers, scanned in 3D</span>
        <h1 className="gallery-title">Explore our trailers</h1>
        <p className="gallery-subtitle">
          Browse what we've built — or tell us your idea and we'll build it from scratch.
        </p>
      </div>

      <div className="filter-row">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="gallery-grid">
        {filtered.map((trailer) => (
          <button
            key={trailer.id}
            className="trailer-card"
            onClick={() => setSelectedTrailer(trailer)}
          >
            <div className="trailer-card-inner">
              <span className="corner-mark tl" />
              <span className="corner-mark br" />
              <div className="card-thumb">🚚</div>
              <div className="card-body">
                <span className="card-category-tag">{trailer.category}</span>
                <p className="card-name">{trailer.name}</p>
                <p className="card-price">
                  From <strong>${trailer.priceFrom.toLocaleString()}</strong>
                </p>
              </div>
            </div>
          </button>
        ))}

        {/* Tarjeta especial: trailers personalizados */}
        <button className="trailer-card" onClick={() => setShowCustomModal(true)}>
          <div className="trailer-card-inner custom-card-inner">
            <span className="custom-card-icon">✏️</span>
            <p className="custom-card-title">Don't see it here?</p>
            <p className="custom-card-text">We build custom trailers too — tell us your idea.</p>
            <span className="custom-card-cta">Start a custom build →</span>
          </div>
        </button>

        {filtered.length === 0 && (
          <p className="empty-state">No trailers in this category yet.</p>
        )}
      </div>

      {selectedTrailer && (
        <TrailerModal trailer={selectedTrailer} onClose={() => setSelectedTrailer(null)} />
      )}

      {showCustomModal && <CustomBuildModal onClose={() => setShowCustomModal(false)} />}
    </div>
  )
}