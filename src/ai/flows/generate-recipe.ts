'use server';
/**
 * @fileOverview Generates a recipe based on a list of ingredients, style preferences, and other user inputs.
 *
 * - generateRecipe - A function that generates a recipe.
 * - GenerateRecipeInput - The input type for the generateRecipe function.
 * - GenerateRecipeOutput - The return type for the generateRecipe function.
 */

import {ai} from '@/ai/genkit';
import { GenerateRecipeInputSchema, GenerateRecipeOutputSchema } from './recipe-schemas';
import type { GenerateRecipeInput, GenerateRecipeOutput } from './recipe-schemas';
import { z } from 'genkit';

export { type GenerateRecipeInput, type GenerateRecipeOutput };

export async function generateRecipe(input: GenerateRecipeInput): Promise<GenerateRecipeOutput & { imageUrl: string }> {
  const result = await generateRecipeFlow(input);
  return result;
}

const recipePrompt = ai.definePrompt({
    name: 'recipePrompt',
    input: { schema: GenerateRecipeInputSchema },
    output: { schema: GenerateRecipeOutputSchema },
    prompt: `You are a recipe creation AI. Given a list of ingredients, a cuisine style, a maximum preparation time, and optional dietary preferences, your task is to generate a recipe that fits these constraints.

The user has provided the following:
- Ingredients: {{{ingredients}}}
- Cuisine Style: {{{cuisine}}}
- Max Prep Time: {{{maxPrepTime}}} minutes
{{#if preferences}}- Dietary Preferences/Allergies: {{{preferences}}}{{/if}}

Please generate a creative and delicious recipe based on this information. The entire output, including the recipe name, ingredients, and instructions, MUST be in Spanish.
`,
});


const generateRecipeFlow = ai.defineFlow(
  {
    name: 'generateRecipeFlow',
    inputSchema: GenerateRecipeInputSchema,
    outputSchema: GenerateRecipeOutputSchema.extend({ imageUrl: z.string() }),
  },
  async input => {
    
    // First, generate the recipe text content.
    const { output: recipeOutput } = await recipePrompt(input);

    if (!recipeOutput) {
      throw new Error("Failed to generate recipe text.");
    }

    // In parallel, generate an image for the recipe.
    const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `A delicious-looking, professionally photographed image of a dish called "${recipeOutput.recipeName}"`,
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });

    const imageUrl = media?.url || `https://placehold.co/600x400.png`;

    return {...recipeOutput, imageUrl };
  }
);
