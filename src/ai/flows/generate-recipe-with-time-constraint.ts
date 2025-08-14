'use server';
/**
 * @fileOverview Generates a recipe based on provided ingredients, cuisine style, and time constraint.
 *
 * - generateRecipeWithTimeConstraint - A function that generates a recipe based on the input.
 * - GenerateRecipeInput - The input type for the generateRecipeWithTimeConstraint function.
 * - GenerateRecipeOutput - The return type for the generateRecipeWithTimeConstraint function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma-separated list of ingredients available for the recipe.'),
  cuisineStyle: z
    .string()
    .describe(
      'The desired cuisine style for the recipe (e.g., Mexican, Asian, Italian).'n
    ),
  maxPrepTime: z
    .number()
    .describe(
      'The maximum preparation time in minutes that the recipe should take.'
    ),
});
export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;

const GenerateRecipeOutputSchema = z.object({
  recipeName: z.string().describe('The name of the generated recipe.'),
  ingredients: z.string().describe('The list of ingredients required for the recipe.'),
  instructions: z.string().describe('The step-by-step instructions for preparing the recipe.'),
  cuisineStyle: z.string().describe('The cuisine style of the generated recipe.'),
  prepTime: z.number().describe('The estimated preparation time in minutes.'),
});
export type GenerateRecipeOutput = z.infer<typeof GenerateRecipeOutputSchema>;

export async function generateRecipeWithTimeConstraint(
  input: GenerateRecipeInput
): Promise<GenerateRecipeOutput> {
  return generateRecipeWithTimeConstraintFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipeWithTimeConstraintPrompt',
  input: {schema: GenerateRecipeInputSchema},
  output: {schema: GenerateRecipeOutputSchema},
  prompt: `You are a professional chef who specializes in creating recipes based on user-provided ingredients, cuisine styles, and time constraints.

  Create a recipe based on the following information:

  Ingredients: {{{ingredients}}}
  Cuisine Style: {{{cuisineStyle}}}
  Maximum Preparation Time: {{{maxPrepTime}}} minutes

  The recipe should include a list of ingredients, step-by-step instructions, the cuisine style, and an estimated preparation time that does not exceed the specified maximum.

  Make sure the preparation time does not exceed the specified maximum of {{{maxPrepTime}}} minutes.

  Format:
  Recipe Name: [recipe name]
  Ingredients: [ingredient1], [ingredient2], ...
  Instructions: [step1]. [step2]. ...
  Cuisine Style: [cuisine style]
  Prep Time: [prep time] minutes`,
});

const generateRecipeWithTimeConstraintFlow = ai.defineFlow(
  {
    name: 'generateRecipeWithTimeConstraintFlow',
    inputSchema: GenerateRecipeInputSchema,
    outputSchema: GenerateRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
