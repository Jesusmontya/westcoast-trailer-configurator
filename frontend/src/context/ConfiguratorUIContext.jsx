import React, { createContext, useState, useCallback } from 'react';

export const ConfiguratorUIContext = createContext();

export function ConfiguratorUIContextProvider({ children }) {
  const [currentStep, setCurrentStep] = useState(1); // 1, 2, 3, 4
  const [cameraView, setCameraView] = useState('side'); // "side" | "top"
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState('idle'); // "idle" | "sending" | "success" | "error"
  const [submissionError, setSubmissionError] = useState(null);
  const [selectedPresetId, setSelectedPresetId] = useState(null);
  const [panelOpen, setPanelOpen] = useState(true); // mobile
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMode, setEditMode] = useState(null); // null | "size" | "equipment"

  const goToStep = useCallback((step) => {
    if (step >= 1 && step <= 4) {
      setCurrentStep(step);
      setShowEditModal(false);
    }
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  }, []);

  const toggleCameraView = useCallback(() => {
    setCameraView((prev) => (prev === 'side' ? 'top' : 'side'));
  }, []);

  const closeOnboarding = useCallback(() => {
    setShowOnboarding(false);
    localStorage.setItem('onboarding-seen', 'true');
  }, []);

  const resetUIState = useCallback(() => {
    setCurrentStep(1);
    setCameraView('side');
    setShowOnboarding(true);
    setSubmissionStatus('idle');
    setSubmissionError(null);
    setSelectedPresetId(null);
    setEditMode(null);
  }, []);

  const value = {
    // Estado
    currentStep,
    cameraView,
    showOnboarding,
    uploadedVideoUrl,
    submissionStatus,
    submissionError,
    selectedPresetId,
    panelOpen,
    showEditModal,
    editMode,
    // Setters
    setCameraView,
    setShowOnboarding,
    setUploadedVideoUrl,
    setSubmissionStatus,
    setSubmissionError,
    setSelectedPresetId,
    setPanelOpen,
    setShowEditModal,
    setEditMode,
    // Acciones
    goToStep,
    nextStep,
    prevStep,
    toggleCameraView,
    closeOnboarding,
    resetUIState,
  };

  return (
    <ConfiguratorUIContext.Provider value={value}>
      {children}
    </ConfiguratorUIContext.Provider>
  );
}