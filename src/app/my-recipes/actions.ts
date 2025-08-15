
"use server";

import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { GenerateRecipeOutput } from '@/ai/flows/recipe-schemas';
import { auth } from '@/lib/firebase';

// Define the type for the recipe data to be saved, including the user ID and image URL
type RecipeToSave = GenerateRecipeOutput & {
  imageUrl: string;
  userId: string;
};

/**
 * Saves a recipe to the user's collection in Firestore.
 * @param recipeData The recipe data to save.
 * @param userId The ID of the user saving the recipe.
 * @returns The ID of the saved document, or null if an error occurred.
 */
export async function saveRecipe(recipeData: GenerateRecipeOutput & { imageUrl: string }, userId: string): Promise<string | null> {
  if (!userId) {
    console.error("User ID is not provided.");
    return null;
  }

  try {
    const recipeToSave: RecipeToSave = {
      ...recipeData,
      userId: userId,
    };

    const docRef = await addDoc(collection(db, "recipes"), recipeToSave);
    console.log("Recipe saved with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    return null;
  }
}

/**
 * Fetches all saved recipes for the currently logged-in user.
 * @returns An array of saved recipes, or null if an error occurred.
 */
export async function getSavedRecipes(userId: string) {
   if (!userId) {
    console.error("User ID is not provided.");
    return null;
  }

  try {
    const q = query(collection(db, "recipes"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const recipes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return recipes;
  } catch (e) {
    console.error("Error fetching documents: ", e);
    return null;
  }
}
