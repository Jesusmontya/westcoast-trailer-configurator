import React, { useContext, useRef, useState } from 'react';
import { ConfiguratorUIContext } from '../../context/ConfiguratorUIContext';
import '../../styles/OnboardingOverlay.css';

export function OnboardingOverlay() {
  const { showOnboarding, uploadedVideoUrl, closeOnboarding, setUploadedVideoUrl } =
    useContext(ConfiguratorUIContext);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  if (!showOnboarding) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file.type.startsWith('video/')) {
      alert('Por favor, sube un archivo de video (MP4, WebM, etc)');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert('El video es muy grande (maximo 50MB). Comprimelo e intenta de nuevo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const videoUrl = e.target.result;
      setUploadedVideoUrl(videoUrl);
      localStorage.setItem('onboarding-video', videoUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleChangeVideo = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <button className="close-btn" onClick={closeOnboarding}>
          x
        </button>

        <h2>Tutorial: Como Usar el Configurador 3D</h2>

        {uploadedVideoUrl ? (
          <div className="video-container">
            <video
              src={uploadedVideoUrl}
              controls
              autoPlay
              className="tutorial-video"
            />
            <p className="video-description">
              Tu video tutorial esta listo. Haz click en "Entendido, empezar" para comenzar a
              configurar tu trailer.
            </p>
            <button className="btn-change" onClick={handleChangeVideo}>
              Cambiar Video
            </button>
          </div>
        ) : (
          <div
            className={`drop-zone ${dragActive ? 'active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="drop-icon">↓</div>
            <h3>Arrastra tu Video Aqui</h3>
            <p>o haz click para seleccionar</p>
            <p className="file-requirements">MP4, WebM, Maximo 50MB</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />

        <div className="onboarding-actions">
          {!uploadedVideoUrl && (
            <button className="btn-select" onClick={() => fileInputRef.current?.click()}>
              Seleccionar Archivo
            </button>
          )}
          <button className="btn-done" onClick={closeOnboarding}>
            {uploadedVideoUrl ? 'Entendido, Empezar' : 'Saltar Tutorial'}
          </button>
        </div>
      </div>
    </div>
  );
}