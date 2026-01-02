'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Assistant } from '@/types/assistant';
import { getAssistantById, saveAssistant } from '@/lib/storage';
import { simulateResponse, SIMULATED_RESPONSES } from '@/lib/responses';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import Alert from '@/components/ui/Alert';
import { FiArrowLeft, FiSend, FiRotateCcw } from 'react-icons/fi';
import styles from './page.module.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

export default function TrainingPage() {
  const params = useParams();
  const router = useRouter();
  const assistantId = params.id as string;

  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [trainingData, setTrainingData] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  useEffect(() => {
    loadAssistant();
  }, [assistantId]);

  useEffect(() => {
    if (assistant) {
      setTrainingData(assistant.trainingData || '');
    }
  }, [assistant]);

  const loadAssistant = () => {
    const loaded = getAssistantById(assistantId);
    if (!loaded) {
      router.push('/');
      return;
    }
    setAssistant(loaded);
  };

  const handleSaveTraining = () => {
    if (!assistant) return;

    const updated: Assistant = {
      ...assistant,
      trainingData: trainingData.trim(),
    };

    saveAssistant(updated);
    setAssistant(updated);
    setAlert({
      type: 'success',
      message: 'Datos de entrenamiento guardados correctamente',
    });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !assistant || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const responseText = await simulateResponse(
        SIMULATED_RESPONSES,
        assistant.responseLength
      );

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        text: responseText,
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error al simular respuesta:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!assistant) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Button variant="ghost" onClick={() => router.push('/')} size="sm">
            <FiArrowLeft size={18} />
            Volver
          </Button>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{assistant.name}</h1>
            <div className={styles.assistantMeta}>
              <span className={styles.metaBadge}>{assistant.language}</span>
              <span className={styles.metaBadge}>{assistant.tone}</span>
            </div>
          </div>
          <div style={{ width: '80px' }} />
        </div>
      </header>

      <main className={styles.main}>
        {alert && (
          <div className={styles.alertContainer}>
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        <div className={styles.content}>
          {/* Sección de Entrenamiento */}
          <section className={styles.trainingSection}>
            <h2 className={styles.sectionTitle}>Entrenamiento del asistente</h2>
            <p className={styles.sectionDescription}>
              Ingresa las reglas y contexto para entrenar al asistente. Los datos se guardan localmente.
            </p>
            <div className={styles.trainingForm}>
              <Textarea
                id="training"
                label="Datos de entrenamiento"
                value={trainingData}
                onChange={(e) => setTrainingData(e.target.value)}
                placeholder="Ej: Ayudas a resolver problemas técnicos de manera clara y paso a paso. Siempre confirma que el usuario haya entendido antes de continuar."
                rows={12}
              />
              <Button variant="primary" onClick={handleSaveTraining} size="lg">
                Guardar
              </Button>
            </div>
          </section>

          {/* Sección de Chat Simulado */}
          <section className={styles.chatSection}>
            <div className={styles.chatHeader}>
              <h2 className={styles.sectionTitle}>Chat Simulado</h2>
              <Button variant="ghost" onClick={handleResetChat} size="sm">
                <FiRotateCcw size={18} />
                Reiniciar
              </Button>
            </div>
            <p className={styles.sectionDescription}>
              Prueba el asistente con mensajes simulados. Las respuestas tienen un delay de 1-2 segundos.
            </p>

            <div className={styles.chatContainer}>
              <div className={styles.messages}>
                {messages.length === 0 ? (
                  <div className={styles.emptyChat}>
                    <p>Las interacciones con el asistente se mostrarán aquí...</p>
                    <p className={styles.emptyHint}>Escribe un mensaje para comenzar</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`${styles.message} ${
                        message.sender === 'user' ? styles.userMessage : styles.assistantMessage
                      }`}
                    >
                      <div className={styles.messageContent}>
                        <p className={styles.messageText}>{message.text}</p>
                        <span className={styles.messageTime}>
                          {message.timestamp.toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className={`${styles.message} ${styles.assistantMessage} ${styles.typing}`}>
                    <div className={styles.messageContent}>
                      <div className={styles.loadingDots} aria-label="Escribiendo">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.chatInput}>
                <Textarea
                  id="message"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe un mensaje..."
                  rows={3}
                  disabled={isLoading}
                />
                <Button
                  variant="primary"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="lg"
                >
                  <FiSend size={18} />
                  Enviar
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

