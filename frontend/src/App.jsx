import { ConfiguratorProvider } from './context/ConfiguratorContext'
import Scene from './components/viewer3d/Scene'
import OptionsPanel from './components/configurator/OptionsPanel'
import './styles/panel.css'

const LANDING_PAGE_URL = 'https://westcoast-trailer-configurator.vercel.app'

function App() {
  return (
    <ConfiguratorProvider>
      <div className="configurator-layout">
        <div className="scene-container">
          <Scene />
        </div>
        <OptionsPanel />

        <a
          href={LANDING_PAGE_URL}
          className="back-button"
        >
          ← Back to West Coast
        </a>
      </div>
    </ConfiguratorProvider>
  )
}

export default App