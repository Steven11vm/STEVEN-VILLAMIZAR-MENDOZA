'use client';

import { Assistant } from '@/types/assistant';
import { FiEdit, FiTrash2, FiSettings } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import styles from './AssistantCard.module.css';

interface AssistantCardProps {
  assistant: Assistant;
  onEdit: (assistant: Assistant) => void;
  onDelete: (id: string) => void;
}

export default function AssistantCard({
  assistant,
  onEdit,
  onDelete,
}: AssistantCardProps) {
  const router = useRouter();

  const handleTrain = () => {
    router.push(`/${assistant.id}`);
  };

  return (
    <div className={styles.card} role="article" aria-label={`Asistente ${assistant.name}`}>
      <div className={styles.content}>
        <div className={styles.headerSection}>
          <h3 className={styles.name}>{assistant.name}</h3>
          <div className={styles.statusIndicator} aria-hidden="true" />
        </div>
        <div className={styles.metadata}>
          <span className={styles.badge} aria-label={`Idioma: ${assistant.language}`}>
            <strong>Idioma:</strong> {assistant.language}
          </span>
          <span className={styles.badge} aria-label={`Tono: ${assistant.tone}`}>
            <strong>Tono:</strong> {assistant.tone}
          </span>
        </div>
      </div>
      <div className={styles.actions} role="group" aria-label="Acciones del asistente">
        <button
          className={styles.actionButton}
          onClick={() => onEdit(assistant)}
          aria-label={`Editar asistente ${assistant.name}`}
          title="Editar"
          type="button"
        >
          <FiEdit size={18} aria-hidden="true" />
          <span className={styles.buttonLabel}>Editar</span>
        </button>
        <button
          className={styles.actionButton}
          onClick={handleTrain}
          aria-label={`Entrenar asistente ${assistant.name}`}
          title="Entrenar"
          type="button"
        >
          <FiSettings size={18} aria-hidden="true" />
          <span className={styles.buttonLabel}>Entrenar</span>
        </button>
        <button
          className={`${styles.actionButton} ${styles.danger}`}
          onClick={() => onDelete(assistant.id)}
          aria-label={`Eliminar asistente ${assistant.name}`}
          title="Eliminar"
          type="button"
        >
          <FiTrash2 size={18} aria-hidden="true" />
          <span className={styles.buttonLabel}>Eliminar</span>
        </button>
      </div>
    </div>
  );
}

