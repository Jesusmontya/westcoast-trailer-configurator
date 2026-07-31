export function validateName(name) {
  if (!name || name.trim().length < 2) {
    return { valid: false, error: 'Nombre debe tener al menos 2 caracteres' };
  }
  if (!/^[a-zA-ZñáéíóúÑÁÉÍÓÚ\s]+$/.test(name)) {
    return { valid: false, error: 'Nombre solo puede contener letras y espacios' };
  }
  return { valid: true };
}

export function validatePhone(phone) {
  if (!phone) {
    return { valid: false, error: 'Teléfono es requerido' };
  }
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 7 || cleaned.length > 15) {
    return { valid: false, error: 'Teléfono debe tener entre 7 y 15 dígitos' };
  }
  return { valid: true };
}

export function validateEmail(email) {
  if (!email) {
    return { valid: true };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Email no válido' };
  }
  return { valid: true };
}

export function validateLeadData(leadData) {
  const { name, phone, email, trailerSize, equipmentList } = leadData;

  const nameValidation = validateName(name);
  if (!nameValidation.valid) return nameValidation;

  const phoneValidation = validatePhone(phone);
  if (!phoneValidation.valid) return phoneValidation;

  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) return emailValidation;

  if (!trailerSize) {
    return { valid: false, error: 'Debes elegir tamaño de trailer' };
  }

  if (!equipmentList || equipmentList.length === 0) {
    return { valid: false, error: 'Debes agregar al menos un equipo' };
  }

  return { valid: true };
}
