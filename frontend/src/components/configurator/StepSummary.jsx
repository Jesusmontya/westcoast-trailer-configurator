import { useContext } from 'react';
import { BuildContext } from '../../context/BuildContext';
import { ConfiguratorUIContext } from '../../context/ConfiguratorUIContext';
import { PriceBreakdown } from './PriceBreakdown';
import { TrailerMiniMap } from './TrailerMiniMap';
import { validateLeadData } from '../../utils/validation';
import { supabase } from '../../services/supabase';

export function StepSummary() {
  const {
    trailerSize,
    equipmentList,
    acPosition,
    notes,
    saveDraftToLocal,
    resetBuild,
  } = useContext(BuildContext);

  const { goToStep, setSubmissionStatus, setSubmissionError, submissionStatus } =
    useContext(ConfiguratorUIContext);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleValidateField = (field) => {
    const { validateName, validatePhone, validateEmail } = require('../utils/validation');
    let error = null;

    if (field === 'name') {
      const result = validateName(formData.name);
      error = result.error;
    } else if (field === 'phone') {
      const result = validatePhone(formData.phone);
      error = result.error;
    } else if (field === 'email') {
      const result = validateEmail(formData.email);
      error = result.error;
    }

    if (error) {
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const leadData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      trailerSize,
      equipmentList,
    };

    const validation = validateLeadData(leadData);
    if (!validation.valid) {
      setErrors({ submit: validation.error });
      return;
    }

    setSubmissionStatus('sending');
    setSubmissionError(null);

    try {
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .insert([
          {
            name: formData.name,
            phone: formData.phone,
            email: formData.email || null,
            source: 'configurator',
            trailer_type: trailerSize,
            language: 'es',
            attended: false,
          },
        ])
        .select();

      if (leadError) throw leadError;

      const leadId = leadData[0].id;

      const { error: buildError } = await supabase.from('builds').insert([
        {
          lead_id: leadId,
          trailer_size: trailerSize,
          equipment_list: equipmentList,
          ac_position: acPosition,
          notes: notes,
          total_price: calculateTotal(),
        },
      ]);

      if (buildError) throw buildError;

      setSubmissionStatus('success');
      localStorage.removeItem('trailer-draft');
      resetBuild();

      setTimeout(() => {
        window.location.href = '/thank-you';
      }, 2000);
    } catch (err) {
      console.error('Error enviando:', err);
      setSubmissionStatus('error');
      setSubmissionError(err.message || 'Error al enviar. Intenta de nuevo.');
    }
  };

  const calculateTotal = () => {
    const { calculatePricing } = require('../utils/pricing');
    const pricing = calculatePricing(trailerSize, equipmentList);
    return pricing.total || 0;
  };

  return (
    <div className="step-summary">
      <div className="step-header">
        <h2>Resumen de tu Configuracion</h2>
        <p>Verifica todo antes de enviar tu solicitud</p>
      </div>

      <div className="summary-grid">
        <div className="summary-section">
          <h3>Tu Trailer</h3>
          <TrailerMiniMap trailerSize={trailerSize} equipmentList={equipmentList} />
          <div className="summary-info">
            <p>
              <strong>Tamaño:</strong> {trailerSize}
            </p>
            <p>
              <strong>Equipos:</strong> {equipmentList.length} items
            </p>
            {acPosition && (
              <p>
                <strong>A/C:</strong> Posicion {acPosition}
              </p>
            )}
            {notes && (
              <p>
                <strong>Notas:</strong> {notes}
              </p>
            )}
          </div>
          <button className="btn-edit" onClick={() => goToStep(3)}>
            Editar Equipos
          </button>
        </div>

        <div className="summary-section">
          <PriceBreakdown trailerSize={trailerSize} equipmentList={equipmentList} />
        </div>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <h3>Tus Datos de Contacto</h3>

        <div className="form-group">
          <label htmlFor="name">Nombre Completo *</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            onBlur={() => handleValidateField('name')}
            className={errors.name ? 'error' : ''}
            placeholder="Tu nombre"
            required
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Teléfono *</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            onBlur={() => handleValidateField('phone')}
            className={errors.phone ? 'error' : ''}
            placeholder="+1 (702) 123-4567"
            required
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email (Opcional)</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={() => handleValidateField('email')}
            className={errors.email ? 'error' : ''}
            placeholder="tu@email.com"
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        {errors.submit && (
          <div className="form-error">
            <p>{errors.submit}</p>
          </div>
        )}

        <button
          type="submit"
          className="btn-submit"
          disabled={submissionStatus === 'sending'}
        >
          {submissionStatus === 'sending' ? 'Enviando...' : 'Enviar Solicitud'}
        </button>
      </form>

      {submissionStatus === 'success' && (
        <div className="success-banner">
          <div className="checkmark">✓</div>
          <h4>Solicitud Recibida</h4>
          <p>Nos pondremos en contacto en 24 horas. Redireccionando...</p>
        </div>
      )}

      {submissionStatus === 'error' && (
        <div className="error-banner">
          <p>{submissionError}</p>
          <button onClick={() => setSubmissionStatus('idle')}>Reintentar</button>
        </div>
      )}
    </div>
  );
}