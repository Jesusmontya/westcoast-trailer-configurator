import GalleryPage from './components/gallery/GalleryPage'

const LANDING_PAGE_URL = 'https://westcoast-trailer-configurator.vercel.app'

function App() {
  function handleBackClick(e) {
    e.preventDefault()
    window.location.href = LANDING_PAGE_URL
  }

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={handleBackClick} className="back-link">
        ← Back to All Custom Trailers
      </button>

      <GalleryPage />
    </div>
  )
}

export default App