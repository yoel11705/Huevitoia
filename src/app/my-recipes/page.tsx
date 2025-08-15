
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getSavedRecipes } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { GenerateRecipeOutput } from '@/ai/flows/recipe-schemas';

type SavedRecipe = GenerateRecipeOutput & { id: string; imageUrl: string };

export default function MyRecipesPage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const fetchRecipes = async () => {
        setLoading(true);
        setError(null);
        try {
          const savedRecipes = await getSavedRecipes(user.uid);
          if (savedRecipes) {
            setRecipes(savedRecipes as SavedRecipe[]);
          }
        } catch (err) {
          setError('No se pudieron cargar las recetas.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchRecipes();
    }
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/" passHref>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Generador
            </Button>
          </Link>
        </div>

        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-gray-800">Historial de Recetas</h1>
          <p className="mt-4 text-lg text-muted-foreground">Tu colección personal de creaciones culinarias.</p>
        </header>

        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-8 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="w-full h-48 mb-4" />
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full mt-1" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && <p className="text-center text-destructive">{error}</p>}

        {!loading && !error && recipes.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Aún no has guardado ninguna receta.</p>
             <Link href="/" passHref>
                <Button className="mt-4">Crear una nueva receta</Button>
            </Link>
          </div>
        )}

        {!loading && !error && recipes.length > 0 && (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
            {recipes.map((recipe) => (
              <Card key={recipe.id} className="shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{recipe.recipeName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recipe.imageUrl && (
                    <div className="relative w-full aspect-video rounded-md overflow-hidden">
                      <Image
                        src={recipe.imageUrl}
                        alt={recipe.recipeName}
                        fill
                        style={{ objectFit: 'cover' }}
                        data-ai-hint="food recipe"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-headline text-lg font-semibold mb-2 border-b pb-1">Ingredientes</h3>
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">{recipe.ingredients}</p>
                  </div>
                  <div>
                    <h3 className="font-headline text-lg font-semibold mb-2 border-b pb-1">Instrucciones</h3>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{recipe.instructions}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
