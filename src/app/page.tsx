"use client";

import { useState } from 'react';
import Image from 'next/image';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ChefHat, UtensilsCrossed, Sparkles, Soup, Globe, Timer, AlertTriangle, Salad } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { GenerateRecipeOutput } from "@/ai/flows/generate-recipe";
import { generateRecipeAction } from './actions';

const formSchema = z.object({
  ingredients: z.string().min(10, {
    message: "Please list at least a few ingredients.",
  }),
  cuisine: z.string(),
  maxPrepTime: z.coerce.number().positive({
    message: "Time must be a positive number.",
  }).max(240, { message: "Let's be realistic, under 4 hours."}),
  preferences: z.string().optional(),
});

export default function Home() {
  const [recipe, setRecipe] = useState<GenerateRecipeOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredients: "",
      cuisine: "Anything",
      maxPrepTime: 30,
      preferences: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecipe(null);
    setError(null);
    
    const result = await generateRecipeAction(values);

    if (result.error) {
      setError(result.error);
    } else {
      setRecipe(result.data);
    }
    setIsLoading(false);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <div className="inline-block bg-primary p-4 rounded-full mb-4 shadow-md">
          <ChefHat className="h-12 w-12 text-primary-foreground" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-headline text-gray-800">HuevitoChef</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          No idea what to cook? Give me your ingredients and I'll whip up a delicious recipe for you in seconds.
        </p>
      </header>

      <main className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Create Your Recipe</CardTitle>
            <CardDescription>Tell us what you have and what you're in the mood for.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="ingredients"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-semibold"><Soup size={18} /> Ingredients</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., chicken breast, tomatoes, onions, garlic, olive oil"
                          className="min-h-[120px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        List ingredients you have, separated by commas.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 font-semibold"><Salad size={18} /> Allergies or Preferences</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., vegetarian, no nuts, gluten-free"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        List any dietary restrictions or preferences.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cuisine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-semibold"><Globe size={18} /> Cuisine Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a cuisine" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Anything">Anything</SelectItem>
                            <SelectItem value="Mexican">Mexican</SelectItem>
                            <SelectItem value="Italian">Italian</SelectItem>
                            <SelectItem value="Asian">Asian</SelectItem>
                            <SelectItem value="American">American</SelectItem>
                            <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxPrepTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-semibold"><Timer size={18} /> Max Prep Time (min)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" disabled={isLoading} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg py-6">
                  {isLoading ? 'Generating...' : 'Generate Recipe'}
                  <UtensilsCrossed className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="flex flex-col">
          {isLoading && (
            <Card className="shadow-lg flex-grow">
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent className="space-y-8">
                 <Skeleton className="w-full h-[200px] rounded-md" />
                <div>
                  <Skeleton className="h-6 w-1/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div>
                  <Skeleton className="h-6 w-1/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
            </Card>
          )}

          {error && (
             <Alert variant="destructive" className="flex-grow">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {recipe && (
             <Card className="shadow-lg animate-in fade-in-50 flex-grow">
                <CardHeader>
                  <CardTitle className="font-headline text-3xl">{recipe.recipeName}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Generated just for you by HuevitoChef AI.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {recipe.imageUrl && (
                    <div className="relative w-full aspect-video rounded-md overflow-hidden">
                       <Image
                          src={recipe.imageUrl}
                          alt={recipe.recipeName}
                          layout="fill"
                          objectFit="cover"
                          data-ai-hint="food recipe"
                        />
                    </div>
                  )}
                  <div>
                    <h3 className="font-headline text-xl font-semibold mb-3 border-b pb-2">Ingredients</h3>
                    <p className="whitespace-pre-wrap text-muted-foreground">{recipe.ingredients}</p>
                  </div>
                  <div>
                    <h3 className="font-headline text-xl font-semibold mb-3 border-b pb-2">Instructions</h3>
                    <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{recipe.instructions}</p>
                  </div>
                </CardContent>
              </Card>
          )}

          {!isLoading && !recipe && !error && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed rounded-lg bg-card">
              <div className="p-4 bg-secondary rounded-full mb-4">
                <ChefHat className="w-16 h-16 text-muted-foreground/50" />
              </div>
              <h3 className="text-2xl font-semibold font-headline text-muted-foreground">Ready to Cook?</h3>
              <p className="text-muted-foreground mt-2 max-w-xs">Your delicious, AI-generated recipe will appear here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
