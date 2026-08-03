import { useState } from 'react'
import '../../styles/gallery.css'

export default function CustomBuildModal({ onClose }) {
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [idea, setIdea] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    // TODO: conectar a Supabase — insert en leads (source: "custom_request", notes: idea)
    setSubmitted(true)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Let's build something custom</h2>
            <p className="modal-subtitle">WE'LL REPLY WITHIN 24 HOURS</p>
          </div>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>

        {!submitted ? (
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
            <p className="modal-textarea-label">What are you thinking? (optional)</p>
            <textarea
              placeholder="e.g. a bigger coffee trailer with a walk-up window..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className="modal-textarea"
            />
            <button type="submit" className="modal-submit">
              Send →
            </button>
          </form>
        ) : (
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