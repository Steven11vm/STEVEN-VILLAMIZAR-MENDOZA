'use client';

import { useState, useEffect } from 'react';
import { Assistant, Language, Tone } from '@/types/assistant';
import { generateId } from '@/lib/storage';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import styles from './CreateEditModal.module.css';

interface CreateEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assistant: Assistant) => void;
  assistant?: Assistant | null;
}

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'Español', label: 'Español' },
  { value: 'Inglés', label: 'Inglés' },
  { value: 'Portugués', label: 'Portugués' },
];

const TONES: { value: Tone; label: string }[] = [
  { value: 'Formal', label: 'Formal' },
  { value: 'Casual', label: 'Casual' },
  { value: 'Profesional', label: 'Profesional' },
  { value: 'Amigable', label: 'Amigable' },
];

export default function CreateEditModal({
  isOpen,
  onClose,
  onSave,
  assistant,
}: CreateEditModalProps) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Paso 1: Datos básicos
  const [name, setName] = useState('');
  const [language, setLanguage] = useState<Language | ''>('');
  const [tone, setTone] = useState<Tone | ''>('');

  // Paso 2: Configuración de respuestas
  const [shortLength, setShortLength] = useState(30);
  const [mediumLength, setMediumLength] = useState(50);
  const [longLength, setLongLength] = useState(20);
  const [audioEnabled, setAudioEnabled] = useState(false);

  useEffect(() => {
    if (assistant) {
      setName(assistant.name);
      setLanguage(assistant.language);
      setTone(assistant.tone);
      setShortLength(assistant.responseLength.short);
      setMediumLength(assistant.responseLength.medium);
      setLongLength(assistant.responseLength.long);
      setAudioEnabled(assistant.audioEnabled);
    } else {
      // Resetear formulario para creación
      setName('');
      setLanguage('');
      setTone('');
      setShortLength(30);
      setMediumLength(50);
      setLongLength(20);
      setAudioEnabled(false);
    }
    setStep(1);
    setErrors({});
  }, [assistant, isOpen]);

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (name.trim().length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!language) {
      newErrors.language = 'El idioma es requerido';
    }

    if (!tone) {
      newErrors.tone = 'El tono es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const total = shortLength + mediumLength + longLength;
    const newErrors: Record<string, string> = {};

    if (total !== 100) {
      newErrors.responseLength = `La suma debe ser 100%. Actual: ${total}%`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
      setErrors({});
    }
  };

  const handleBack = () => {
    setStep(1);
    setErrors({});
  };

  const handleSave = () => {
    if (!validateStep2()) {
      return;
    }

    const assistantData: Assistant = {
      id: assistant?.id || generateId(),
      name: name.trim(),
      language: language as Language,
      tone: tone as Tone,
      responseLength: {
        short: shortLength,
        medium: mediumLength,
        long: longLength,
      },
      audioEnabled,
      rules: assistant?.rules,
      trainingData: assistant?.trainingData,
    };

    onSave(assistantData);
    onClose();
  };

  const handleLengthChange = (
    type: 'short' | 'medium' | 'long',
    value: number
  ) => {
    const numValue = Math.max(0, Math.min(100, value));
    const currentTotal = shortLength + mediumLength + longLength;
    const currentValue =
      type === 'short' ? shortLength : type === 'medium' ? mediumLength : longLength;
    const diff = numValue - currentValue;

    if (type === 'short') {
      setShortLength(numValue);
      // Ajustar los otros valores proporcionalmente
      const remaining = 100 - numValue;
      const otherTotal = mediumLength + longLength;
      if (otherTotal > 0) {
        setMediumLength(Math.round((mediumLength / otherTotal) * remaining));
        setLongLength(remaining - Math.round((mediumLength / otherTotal) * remaining));
      }
    } else if (type === 'medium') {
      setMediumLength(numValue);
      const remaining = 100 - numValue;
      const otherTotal = shortLength + longLength;
      if (otherTotal > 0) {
        setShortLength(Math.round((shortLength / otherTotal) * remaining));
        setLongLength(remaining - Math.round((shortLength / otherTotal) * remaining));
      }
    } else {
      setLongLength(numValue);
      const remaining = 100 - numValue;
      const otherTotal = shortLength + mediumLength;
      if (otherTotal > 0) {
        setShortLength(Math.round((shortLength / otherTotal) * remaining));
        setMediumLength(remaining - Math.round((shortLength / otherTotal) * remaining));
      }
    }
  };

  const total = shortLength + mediumLength + longLength;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={assistant ? 'Editar Asistente' : 'Crear Asistente'}
      size="lg"
    >
      <div className={styles.modalContent}>
        {/* Indicador de pasos */}
        <div className={styles.steps}>
          <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>
            <div className={styles.stepNumber}>1</div>
            <span className={styles.stepLabel}>Datos Básicos</span>
          </div>
          <div className={styles.stepLine} />
          <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>
            <div className={styles.stepNumber}>2</div>
            <span className={styles.stepLabel}>Configuración</span>
          </div>
        </div>

        {/* Paso 1: Datos básicos */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Datos Básicos del Asistente</h3>
            <div className={styles.form}>
              <Input
                id="name"
                label="Nombre del asistente"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Soporte Técnico"
                required
                error={errors.name}
              />

              <Select
                id="language"
                label="Idioma"
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                options={LANGUAGES}
                required
                error={errors.language}
              />

              <Select
                id="tone"
                label="Tono/Personalidad"
                value={tone}
                onChange={(e) => setTone(e.target.value as Tone)}
                options={TONES}
                required
                error={errors.tone}
              />
            </div>
          </div>
        )}

        {/* Paso 2: Configuración de respuestas */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Configuración de Respuestas</h3>
            <div className={styles.form}>
              <div className={styles.responseLengthSection}>
                <label className={styles.sectionLabel}>
                  Longitud de las respuestas (requerido)
                </label>
                <div className={styles.lengthInputs}>
                  <div className={styles.lengthInput}>
                    <label htmlFor="short">Cortas (%)</label>
                    <input
                      id="short"
                      type="number"
                      min="0"
                      max="100"
                      value={shortLength}
                      onChange={(e) =>
                        handleLengthChange('short', parseInt(e.target.value) || 0)
                      }
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.lengthInput}>
                    <label htmlFor="medium">Medianas (%)</label>
                    <input
                      id="medium"
                      type="number"
                      min="0"
                      max="100"
                      value={mediumLength}
                      onChange={(e) =>
                        handleLengthChange('medium', parseInt(e.target.value) || 0)
                      }
                      className={styles.numberInput}
                    />
                  </div>
                  <div className={styles.lengthInput}>
                    <label htmlFor="long">Largas (%)</label>
                    <input
                      id="long"
                      type="number"
                      min="0"
                      max="100"
                      value={longLength}
                      onChange={(e) =>
                        handleLengthChange('long', parseInt(e.target.value) || 0)
                      }
                      className={styles.numberInput}
                    />
                  </div>
                </div>
                <div className={styles.total}>
                  <strong>Total: {total}%</strong>
                  {total !== 100 && (
                    <span className={styles.error}>
                      La suma debe ser exactamente 100%
                    </span>
                  )}
                </div>
                {errors.responseLength && (
                  <span className={styles.errorMessage}>{errors.responseLength}</span>
                )}
              </div>

              <div className={styles.checkboxSection}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={audioEnabled}
                    onChange={(e) => setAudioEnabled(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span>Habilitar respuestas de audio</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Botones de navegación */}
        <div className={styles.actions}>
          {step === 1 ? (
            <div className={styles.actionGroup}>
              <Button variant="secondary" onClick={onClose}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleNext}>
                Siguiente
              </Button>
            </div>
          ) : (
            <div className={styles.actionGroup}>
              <Button variant="secondary" onClick={handleBack}>
                Atrás
              </Button>
              <Button variant="primary" onClick={handleSave} disabled={total !== 100}>
                Guardar
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

