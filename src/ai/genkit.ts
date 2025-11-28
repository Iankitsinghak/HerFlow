
import {genkit} from 'genkit';
import {googleAI as googleAIGenAI} from '@genkit-ai/google-genai';

// By removing the apiVersion override, the plugin will use the correct stable API.
export const googleAI = googleAIGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const ai = genkit({
  plugins: [googleAI],
  model: 'googleai/gemini-2.5-flash',
});
