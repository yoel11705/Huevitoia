'use server';
/**
 * @fileOverview Generates a recipe based on a list of ingredients and style preferences.
 *
 * - generateRecipe - A function that generates a recipe.
 * - GenerateRecipeInput - The input type for the generateRecipe function.
 * - GenerateRecipeOutput - The return type for the generateRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma-separated list of ingredients available to use.'),
  cuisine: z
    .string()
    .describe(
      'The desired cuisine style for the recipe (e.g., Mexican, Asian, Italian).'
    ),
  maxPrepTime: z
    .number()
    .describe(
      'The maximum preparation time in minutes that the recipe should take.'
    ),
  preferences: z
    .string()
    .optional()
    .describe('A list of user allergies or dietary preferences. For example: "vegetarian, gluten-free, no nuts".'),
});
export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;

const GenerateRecipeOutputSchema = z.object({
  recipeName: z.string().describe('The name of the generated recipe.'),
  ingredients: z
    .string()
    .describe('A list of ingredients required for the recipe.'),
  instructions: z.string().describe('The cooking instructions for the recipe.'),
  imageUrl: z.string().describe('A URL for an image of the generated dish.'),
});
export type GenerateRecipeOutput = z.infer<typeof GenerateRecipeOutputSchema>;

export async function generateRecipe(input: GenerateRecipeInput): Promise<GenerateRecipeOutput> {
  return generateRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipePrompt',
  input: {schema: GenerateRecipeInputSchema},
  output: {schema: GenerateRecipeOutputSchema},
  prompt: `You are a recipe creation AI. Given a list of ingredients, a cuisine style, a maximum preparation time, and optional dietary preferences, you will generate a recipe that fits these constraints and a URL for an image of the dish.

Ingredients: {{{ingredients}}}
Cuisine Style: {{{cuisine}}}
Max Prep Time: {{{maxPrepTime}}} minutes
{{#if preferences}}
Dietary Preferences/Allergies: {{{preferences}}}
{{/if}}

Generate a recipe that adheres to all the user's constraints. Also, provide a placeholder image URL for the dish from 'https://placehold.co/600x400.png'.

Recipe Name:
Ingredients:
Instructions:
Image URL:`,
});

const generateRecipeFlow = ai.defineFlow(
  {
    name: 'generateRecipeFlow',
    inputSchema: GenerateRecipeInputSchema,
    outputSchema: GenerateRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
