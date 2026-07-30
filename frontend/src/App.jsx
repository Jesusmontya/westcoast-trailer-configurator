import { ConfiguratorProvider, useConfigurator } from './context/ConfiguratorContext'
import Scene from './components/viewer3d/Scene'
import OptionsPanel from './components/configurator/OptionsPanel'
import './styles/panel.css'

const LANDING_PAGE_URL = 'https://westcoast-trailer-configurator-tdlm.vercel.app'

function ViewToggle() {
  const { viewMode, setViewMode } = useConfigurator()
  return (
    <button
      onClick={() => setViewMode(viewMode === 'side' ? 'top' : 'side')}
      className="view-toggle-button"
    >
      {viewMode === 'side' ? '⬆ Top view' : '↔ Side view'}
    </button>
  )
}

function AppContent() {
  function handleBackClick(e) {
    e.preventDefault()
    window.location.href = LANDING_PAGE_URL
  }

  return (
    <div className="configurator-layout">
      <div className="scene-container">
        <Scene />
      </div>
      <OptionsPanel />

      <button onClick={handleBackClick} className="back-button" style={{ zIndex: 9999 }}>
        ← Back to West Coast
      </button>

      <div style={{ position: 'fixed', top: 24, left: 220, zIndex: 9999 }}>
        <ViewToggle />
      </div>
    </div>
  )
}

function App() {
  return (
    <ConfiguratorProvider>
      <AppContent />
    </ConfiguratorProvider>
  )
}

export default App