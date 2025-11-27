
import {genkit} from 'genkit';
import {googleAI as googleAIGenAI} from '@genkit-ai/google-genai';

// By removing the apiVersion override, the plugin will use the correct stable API.
export const googleAI = googleAIGenAI();

export const ai = genkit({
  plugins: [googleAI],
  model: 'googleai/gemini-1.5-flash',
});
