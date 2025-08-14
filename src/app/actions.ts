"use server";

import { generateRecipe } from "@/ai/flows/generate-recipe";
import type { GenerateRecipeInput, GenerateRecipeOutput } from "@/ai/flows/generate-recipe";

export async function generateRecipeAction(input: GenerateRecipeInput): Promise<{ data: GenerateRecipeOutput | null; error: string | null }> {
  try {
    const result = await generateRecipe(input);
    if (!result.recipeName || !result.ingredients || !result.instructions || !result.imageUrl) {
      console.error("AI returned incomplete data:", result);
      return { data: null, error: "La IA devolvió una receta incompleta. Por favor, inténtalo de nuevo con ingredientes más específicos." };
    }
    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "Ocurrió un error desconocido.";
    return { data: null, error: `Error al generar la receta: ${errorMessage}` };
  }
}
