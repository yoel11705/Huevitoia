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

const prompt = ai.definePrompt({
  name: 'generateRecipePrompt',
  input: {schema: GenerateRecipeInputSchema},
  output: {schema: GenerateRecipeOutputSchema},
  prompt: `You are a recipe creation AI. Given a list of ingredients, a cuisine style, a maximum preparation time, and optional dietary preferences, you will generate a recipe that fits these constraints. The entire output, including the recipe name, ingredients, and instructions, MUST be in Spanish.

Ingredients: {{{ingredients}}}
Cuisine Style: {{{cuisine}}}
Max Prep Time: {{{maxPrepTime}}} minutes
{{#if preferences}}
Dietary Preferences/Allergies: {{{preferences}}}
{{/if}}

Generate a recipe that adheres to all the user's constraints. The output must be in Spanish.

Recipe Name:
Ingredients:
Instructions:
`,
});

const generateRecipeFlow = ai.defineFlow(
  {
    name: 'generateRecipeFlow',
    inputSchema: GenerateRecipeInputSchema,
    outputSchema: GenerateRecipeOutputSchema.extend({ imageUrl: z.string() }),
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("Failed to generate recipe.");
    }

    // Generate an image in parallel
    const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `A delicious-looking, professionally photographed image of a dish called "${output.recipeName}"`,
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });

    const imageUrl = media?.url || `https://placehold.co/600x400.png`;

    return {...output, imageUrl };
  }
);
