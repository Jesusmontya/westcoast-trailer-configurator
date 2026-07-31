import React, { createContext, useState, useCallback } from 'react';

export const BuildContext = createContext();

export function BuildContextProvider({ children }) {
  const [trailerSize, setTrailerSize] = useState(null);
  const [equipmentList, setEquipmentList] = useState([]);
  const [acPosition, setAcPosition] = useState('center');
  const [focusedEquipmentId, setFocusedEquipmentId] = useState(null);
  const [collisions, setCollisions] = useState({});
  const [notes, setNotes] = useState('');

  const addEquipment = useCallback((equipmentId) => {
    const newPiece = {
      id: `${equipmentId}_${Date.now()}`,
      equipmentId,
      x: 0,
      z: 0,
    };
    setEquipmentList((prev) => [...prev, newPiece]);
    return newPiece.id;
  }, []);

  const moveEquipment = useCallback((pieceId, x, z) => {
    setEquipmentList((prev) =>
      prev.map((p) => (p.id === pieceId ? { ...p, x, z } : p))
    );
  }, []);

  const removeEquipment = useCallback((pieceId) => {
    setEquipmentList((prev) => prev.filter((p) => p.id !== pieceId));
    if (focusedEquipmentId === pieceId) setFocusedEquipmentId(null);
  }, [focusedEquipmentId]);

  const setEquipmentCollision = useCallback((pieceId, hasCollision) => {
    setCollisions((prev) => ({ ...prev, [pieceId]: hasCollision }));
  }, []);

  const resetBuild = useCallback(() => {
    setTrailerSize(null);
    setEquipmentList([]);
    setAcPosition('center');
    setFocusedEquipmentId(null);
    setCollisions({});
    setNotes('');
  }, []);

  const saveDraftToLocal = useCallback(() => {
    const draft = {
      trailerSize,
      equipmentList,
      acPosition,
      notes,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('trailer-draft', JSON.stringify(draft));
  }, [trailerSize, equipmentList, acPosition, notes]);

  const loadDraftFromLocal = useCallback(() => {
    const draft = localStorage.getItem('trailer-draft');
    if (draft) {
      const { trailerSize: size, equipmentList: equip, acPosition: ac, notes: n } = JSON.parse(draft);
      setTrailerSize(size);
      setEquipmentList(equip || []);
      setAcPosition(ac || 'center');
      setNotes(n || '');
      return true;
    }
    return false;
  }, []);

  const value = {
    trailerSize,
    equipmentList,
    acPosition,
    focusedEquipmentId,
    collisions,
    notes,
    setTrailerSize,
    setAcPosition,
    setFocusedEquipmentId,
    setNotes,
    addEquipment,
    moveEquipment,
    removeEquipment,
    setEquipmentCollision,
    resetBuild,
    saveDraftToLocal,
    loadDraftFromLocal,
  };

  return (
    <BuildContext.Provider value={value}>
      {children}
    </BuildContext.Provider>
  );
}