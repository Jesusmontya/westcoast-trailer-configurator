import React, { useContext, useEffect } from 'react';
import { BuildContextProvider, BuildContext } from './context/BuildContext';
import { ConfiguratorUIContextProvider, ConfiguratorUIContext } from './context/ConfiguratorUIContext';
import { PresetsContextProvider } from './context/PresetsContext';
// import { Scene } from './components/viewer3d/Scene';
import { OptionsPanel } from './components/configurator/OptionsPanel';
import { OnboardingOverlay } from './components/configurator/OnboardingOverlay';
import { StepIndicator } from './components/configurator/StepIndicator';
import './App.css';

function AppContent() {
  const { loadDraftFromLocal, saveDraftToLocal } = useContext(BuildContext);
  const { currentStep, cameraView, toggleCameraView, goToStep } = useContext(ConfiguratorUIContext);

  useEffect(() => {
    const hasDraft = loadDraftFromLocal();
    if (hasDraft) {
      console.log('Draft cargado desde localStorage');
    }
  }, [loadDraftFromLocal]);

  useEffect(() => {
    saveDraftToLocal();
  }, [saveDraftToLocal]);

  const handleBackToHome = () => {
    if (window.confirm('Volver al inicio? Perderás tu configuracion actual.')) {
      window.location.href = '/';
    }
  };

  return (
    <div className="app-container">
      <OnboardingOverlay />

      <header className="app-header">
        <div className="header-left">
          <button className="btn-home" onClick={handleBackToHome}>
            Inicio
          </button>
        </div>

        <div className="header-center">
          <StepIndicator currentStep={currentStep} totalSteps={4} />
        </div>

        <div className="header-right">
          {currentStep >= 2 && (
            <button className="btn-camera" onClick={toggleCameraView}>
              {cameraView === 'side' ? 'Vista Superior' : 'Vista Lateral'}
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        <div className="viewer-container">
          {currentStep >= 2 && {/* <Scene /> */}}
        </div>

        <aside className="panel-container">
          <OptionsPanel />
        </aside>
      </main>

      <footer className="app-footer">
        <p>West Coast Trailers - Configurador 3D</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <PresetsContextProvider>
      <BuildContextProvider>
        <ConfiguratorUIContextProvider>
          <AppContent />
        </ConfiguratorUIContextProvider>
      </BuildContextProvider>
    </PresetsContextProvider>
  );
}