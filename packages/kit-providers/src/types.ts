export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface Brief {
  name: string;
  description: string;
  advanced?: Record<string, JsonValue>;
}

export interface Prompts {
  recraftLogoPrompt: string;
  fluxMoodboardPrompts: [string, string, string];
  gptBentoPrompt: string;
  suggestedColors: string[];
  brandPersonality: string[];
}

export interface GeneratedImage {
  data: Uint8Array;
  contentType: string;
  filename: string;
  sourceUrl?: string;
  metadata?: Record<string, JsonValue>;
}

export interface UploadedAsset {
  url: string;
  key: string;
  name: string;
  size: number;
}
