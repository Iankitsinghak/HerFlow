
import {genkit} from 'genkit';
import {googleAI as googleAIGenAI} from '@genkit-ai/google-genai';

export const googleAI = googleAIGenAI();

export const ai = genkit({
  plugins: [googleAI],
  model: 'gemini-pro',
});
