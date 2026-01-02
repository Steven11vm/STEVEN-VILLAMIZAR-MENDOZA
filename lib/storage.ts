import { Assistant } from '@/types/assistant';

const STORAGE_KEY = 'ai-assistants';

/**
 * Obtiene todos los asistentes del localStorage
 */
export function getAssistants(): Assistant[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error al leer asistentes del localStorage:', error);
    return [];
  }
}

/**
 * Guarda todos los asistentes en el localStorage
 */
export function saveAssistants(assistants: Assistant[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assistants));
  } catch (error) {
    console.error('Error al guardar asistentes en localStorage:', error);
  }
}

/**
 * Obtiene un asistente por su ID
 */
export function getAssistantById(id: string): Assistant | null {
  const assistants = getAssistants();
  return assistants.find(a => a.id === id) || null;
}

/**
 * Guarda o actualiza un asistente
 */
export function saveAssistant(assistant: Assistant): void {
  const assistants = getAssistants();
  const index = assistants.findIndex(a => a.id === assistant.id);
  
  if (index >= 0) {
    assistants[index] = assistant;
  } else {
    assistants.push(assistant);
  }
  
  saveAssistants(assistants);
}

/**
 * Elimina un asistente por su ID
 */
export function deleteAssistant(id: string): void {
  const assistants = getAssistants();
  const filtered = assistants.filter(a => a.id !== id);
  saveAssistants(filtered);
}

/**
 * Genera un ID único para un nuevo asistente
 */
export function generateId(): string {
  return `assistant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

