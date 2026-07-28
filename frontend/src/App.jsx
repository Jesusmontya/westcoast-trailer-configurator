import { ConfiguratorProvider } from './context/ConfiguratorContext'
import Scene from './components/viewer3d/Scene'
import OptionsPanel from './components/configurator/OptionsPanel'
import './styles/panel.css'

function App() {
  return (
    <ConfiguratorProvider>
      <div className="configurator-layout">
        <div className="scene-container">
          <Scene />
        </div>
        <OptionsPanel />
      </div>
    </ConfiguratorProvider>
  )
}

export default App