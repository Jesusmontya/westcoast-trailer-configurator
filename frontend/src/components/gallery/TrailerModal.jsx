import { useState, useEffect, useRef } from 'react'
import TrailerScanViewer from '../scan/TrailerScanViewer'
import '../../styles/gallery.css'

export default function TrailerModal({ trailer, onClose }) {
  const [showSoftPrompt, setShowSoftPrompt] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => setShowSoftPrompt(true), 15000)
    return () => clearTimeout(timerRef.current)
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: conectar a Supabase — insert en leads (source: "gallery", trailer: trailer.id)
    setSubmitted(true)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{trailer.name}</h2>
            <p className="modal-subtitle">
              {trailer.category} · FROM ${trailer.priceFrom.toLocaleString()}
            </p>
          </div>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>

        <div className="viewer-wrapper">
          <TrailerScanViewer
            modelUrl={trailer.modelUrl}
            rotationFix={trailer.rotationFix}
            cameraAngles={trailer.cameraAngles}
          />

          {!showForm && (
            <button className="cta-button" onClick={() => setShowForm(true)}>
              Interested? Get a quote →
            </button>
          )}

          {showSoftPrompt && !showForm && !submitted && (
            <div className="soft-prompt">
              <p className="soft-prompt-text">
                Like what you see? Leave your info and we'll help you make it yours.
              </p>
              <button className="soft-prompt-button" onClick={() => setShowForm(true)}>
                Get info →
              </button>
              <button className="soft-prompt-dismiss" onClick={() => setShowSoftPrompt(false)}>
                ✕
              </button>
            </div>
          )}
        </div>

        {showForm && !submitted && (
          <form onSubmit={handleSubmit} className="modal-form">
            <input
              type="text"
              placeholder="Full name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="modal-input"
            />
            <input
              type="tel"
              placeholder="Phone number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="modal-input"
            />
            <button type="submit" className="modal-submit">
              Send →
            </button>
          </form>
        )}

        {submitted && (
          <div className="modal-success">
            <div className="modal-success-icon">✓</div>
            <p className="modal-success-text">
              Thanks{name ? `, ${name}` : ''}! We'll be in touch within 24 hours.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}