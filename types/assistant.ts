export interface Assistant {
  id: string;
  name: string;
  language: 'Español' | 'Inglés' | 'Portugués';
  tone: 'Formal' | 'Casual' | 'Profesional' | 'Amigable';
  responseLength: {
    short: number;
    medium: number;
    long: number;
  };
  audioEnabled: boolean;
  rules?: string;
  trainingData?: string;
}

export type Language = 'Español' | 'Inglés' | 'Portugués';
export type Tone = 'Formal' | 'Casual' | 'Profesional' | 'Amigable';

