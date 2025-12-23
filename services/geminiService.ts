import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODEL_NAME, GEMINI_TEXT_MODEL_NAME } from "../constants";

// Helper to strip base64 header if present
const cleanBase64 = (data: string) => {
  return data.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
};

const getMimeType = (data: string) => {
    const match = data.match(/^data:(image\/[a-zA-Z]+);base64,/);
    return match ? match[1] : 'image/png';
}

export const generateImageContent = async (
  prompt: string,
  base64InputImage?: string,
  aspectRatio: string = "1:1"
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const parts: any[] = [];

  // If there is an input image, this is an Edit/Transformation request
  if (base64InputImage) {
    parts.push({
      inlineData: {
        mimeType: getMimeType(base64InputImage),
        data: cleanBase64(base64InputImage),
      },
    });
  }

  // Add the text prompt
  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio
        }
      }
    });

    // Parse response to find the image
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates returned from Gemini.");
    }

    const contentParts = candidates[0].content.parts;
    let generatedImageBase64: string | null = null;

    for (const part of contentParts) {
      if (part.inlineData && part.inlineData.data) {
        generatedImageBase64 = part.inlineData.data;
        break; 
      }
    }

    if (!generatedImageBase64) {
        // Fallback: Check if there is text explaining why it failed or just text output
        const textPart = contentParts.find(p => p.text);
        if (textPart) {
            throw new Error(`Model returned text instead of image: ${textPart.text}`);
        }
        throw new Error("No image data found in response.");
    }

    return `data:image/png;base64,${generatedImageBase64}`;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate image.");
  }
};

export const enhancePromptWithAI = async (originalPrompt: string): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API Key is missing.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: GEMINI_TEXT_MODEL_NAME,
            contents: `Actúa como un experto en ingeniería de prompts (instrucciones) para generación de imágenes con IA.
            Mejora la siguiente descripción proporcionada por el usuario para que sea más detallada, visual y artística. 
            Mantén el idioma original de la descripción. 
            No añadas explicaciones, solo devuelve el prompt mejorado.
            
            Descripción original: "${originalPrompt}"`,
        });
        
        return response.text?.trim() || originalPrompt;
    } catch (error) {
        console.error("Error enhancing prompt:", error);
        return originalPrompt; // Fallback to original on error
    }
};
