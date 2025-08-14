"use server";

import { generateRecipe } from "@/ai/flows/generate-recipe";
import type { GenerateRecipeInput, GenerateRecipeOutput } from "@/ai/flows/generate-recipe";

export async function generateRecipeAction(input: GenerateRecipeInput): Promise<{ data: GenerateRecipeOutput | null; error: string | null }> {
  try {
    const result = await generateRecipe(input);
    if (!result.recipeName || !result.ingredients || !result.instructions) {
      console.error("AI returned incomplete data:", result);
      return { data: null, error: "The AI returned an incomplete recipe. Please try again with more specific ingredients." };
    }
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { data: null, error: `Failed to generate recipe: ${errorMessage}` };
  }
}
