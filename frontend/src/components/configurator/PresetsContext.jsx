import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { DEFAULT_PRESETS } from '../../data/defaultPresets';

export const PresetsContext = createContext();

export function PresetsContextProvider({ children }) {
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const loadPresets = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: supabaseError } = await supabase
          .from('presets')
          .select('*');

        if (supabaseError) throw supabaseError;

        if (data && data.length > 0) {
          setPresets(data);
          setIsOffline(false);
        } else {
          setPresets(DEFAULT_PRESETS);
          setIsOffline(false);
        }
      } catch (err) {
        console.error('Error cargando presets:', err);
        setPresets(DEFAULT_PRESETS);
        setError('No se pudieron cargar los presets, usando valores por defecto');
        setIsOffline(true);
      } finally {
        setLoading(false);
      }
    };

    loadPresets();
  }, []);

  const retryLoadPresets = async () => {
    setLoading(true);
    try {
      const { data, error: supabaseError } = await supabase
        .from('presets')
        .select('*');

      if (supabaseError) throw supabaseError;

      if (data && data.length > 0) {
        setPresets(data);
        setError(null);
        setIsOffline(false);
      }
    } catch (err) {
      console.error('Reintento falló:', err);
      setError('Aún hay problemas de conexión, usando valores locales');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    presets,
    loading,
    error,
    isOffline,
    retryLoadPresets,
  };

  return (
    <PresetsContext.Provider value={value}>
      {children}
    </PresetsContext.Provider>
  );
}