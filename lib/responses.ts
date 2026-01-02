/**
 * Respuestas simuladas para el chat
 * Estas respuestas se seleccionan aleatoriamente según la configuración del asistente
 * Basadas en el ejemplo proporcionado en los requisitos
 */
export const SIMULATED_RESPONSES = [
  // Respuestas cortas (primeras 3)
  "Entendido, ¿en qué más puedo ayudarte?",
  "Perfecto, he registrado esa información.",
  "Claro, con gusto te ayudo con eso.",
  // Respuestas medianas (siguientes 4)
  "Esa es una excelente pregunta. Déjame explicarte...",
  "¿Podrías darme más detalles sobre tu consulta?",
  "Comprendo tu situación. Te voy a ayudar paso a paso.",
  "Excelente, vamos a resolver esto juntos.",
  // Respuestas largas (últimas)
  "Gracias por la información. Ahora puedo ayudarte mejor. Déjame analizar tu caso y proporcionarte una solución adecuada.",
  "Entiendo perfectamente. Déjame darte una solución detallada que te ayudará a resolver este problema de manera efectiva.",
  "Muy bien, he procesado tu solicitud correctamente. Ahora procederé con los siguientes pasos para asegurar que todo funcione como esperas."
];

/**
 * Simula una respuesta del asistente con un delay
 */
export async function simulateResponse(
  responses: string[],
  responseLength: { short: number; medium: number; long: number }
): Promise<string> {
  // Simular delay de 1-2 segundos
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  // Seleccionar respuesta según la distribución configurada
  const random = Math.random() * 100;
  let selectedResponses: string[];
  
  if (random < responseLength.short) {
    // Respuestas cortas (primeras 3)
    selectedResponses = responses.slice(0, 3);
  } else if (random < responseLength.short + responseLength.medium) {
    // Respuestas medianas (siguientes 4)
    selectedResponses = responses.slice(3, 7);
  } else {
    // Respuestas largas (últimas)
    selectedResponses = responses.slice(7);
  }
  
  // Si no hay suficientes respuestas, usar todas
  if (selectedResponses.length === 0) {
    selectedResponses = responses;
  }
  
  // Seleccionar una respuesta aleatoria del grupo
  const randomIndex = Math.floor(Math.random() * selectedResponses.length);
  return selectedResponses[randomIndex] || responses[0];
}

