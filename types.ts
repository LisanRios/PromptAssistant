export interface StyleOption {
  id: string;
  label: string;
  promptModifier: string; // El texto en inglés que se añade al prompt
  description: string;
}

export interface OptionItem {
  id: string;
  label: string;
  promptText: string;
}

export interface AspectRatioOption {
  id: string;
  label: string;
  value: string; // Valor para la API (ej: "16:9")
  icon: string; // Representación visual simple
}

export interface GeneratedImage {
  id: string;
  imageUrl: string; // Data URL
  prompt: string;
  styleId: string;
  framingId?: string;
  angleId?: string;
  lightingId?: string;
  colorId?: string; // Nuevo
  textureId?: string; // Nuevo
  aspectRatio?: string;
  timestamp: number;
  mode: 'generate' | 'edit';
}

export enum AppMode {
  GENERATE = 'GENERATE',
  EDIT = 'EDIT'
}

export interface GenerationResult {
  imageUrl: string | null;
  error?: string;
}