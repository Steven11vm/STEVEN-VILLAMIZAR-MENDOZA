import { Assistant } from '@/types/assistant';
import { saveAssistant, getAssistants } from './storage';

/**
 * Función opcional para inicializar datos de ejemplo
 * Solo se ejecuta si no hay asistentes en el localStorage
 */
export function seedInitialData() {
  if (typeof window === 'undefined') return;
  
  const existing = getAssistants();
  if (existing.length > 0) return;

  const exampleAssistant: Assistant = {
    id: 'assistant-example-1',
    name: 'Soporte Técnico',
    language: 'Español',
    tone: 'Amigable',
    responseLength: {
      short: 20,
      medium: 30,
      long: 50,
    },
    audioEnabled: false,
    rules: 'Ayudas a resolver problemas técnicos de manera clara y paso a paso. Siempre confirma que el usuario haya entendido antes de continuar.',
    trainingData: 'Ayudas a resolver problemas técnicos de manera clara y paso a paso. Siempre confirma que el usuario haya entendido antes de continuar.',
  };

  saveAssistant(exampleAssistant);
}

