import { ConfiguratorProvider } from './context/ConfiguratorContext'
import Scene from './components/viewer3d/Scene'
import OptionsPanel from './components/configurator/OptionsPanel'
import './styles/panel.css'

const LANDING_PAGE_URL = 'https://westcoast-trailer-configurator-tdlm.vercel.app'

function App() {
  function handleBackClick(e) {
    e.preventDefault()
    e.stopPropagation()
    window.location.href = LANDING_PAGE_URL
  }

  return (
    <ConfiguratorProvider>
      <div className="configurator-layout">
        <div className="scene-container">
          <Scene />
        </div>
        <OptionsPanel />

        <button
          onClick={handleBackClick}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="back-button"
          style={{ zIndex: 9999 }}
        >
          ← Back to West Coast
        </button>
      </div>
    </ConfiguratorProvider>
  )
}

export default App