
import {z} from 'genkit';

export const GenerateRecipeInputSchema = z.object({
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

export const GenerateRecipeOutputSchema = z.object({
  recipeName: z.string().describe('The name of the generated recipe.'),
  ingredients: z
    .string()
    .describe('A list of ingredients required for the recipe.'),
  instructions: z.string().describe('The cooking instructions for the recipe.'),
});
export type GenerateRecipeOutput = z.infer<typeof GenerateRecipeOutputSchema>;
