
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Lightbulb, BrainCircuit, Bot } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";


export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
            <Link href="/" passHref>
                <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Recipe Generator
                </Button>
            </Link>
        </div>

        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-gray-800">How HuevitoChef AI Works</h1>
          <p className="mt-4 text-lg text-muted-foreground">Unveiling the magic behind your personalized recipes.</p>
        </header>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="p-4 bg-secondary rounded-full mb-4">
              <Lightbulb className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-headline font-semibold mb-2">1. You Provide the Clues</h2>
            <p className="text-muted-foreground">The process starts with you! You enter the ingredients you have, your dietary preferences (like allergies or "vegetarian"), the cuisine style you're craving, and your maximum prep time.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-4 bg-secondary rounded-full mb-4">
              <BrainCircuit className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-headline font-semibold mb-2">2. We Instruct the AI</h2>
            <p className="text-muted-foreground">Your input is bundled into a specific set of instructions, called a "prompt," which is sent to Google's powerful Gemini AI model. We essentially tell the AI: "Act as a world-class chef and create a unique recipe using these exact details."</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-4 bg-secondary rounded-full mb-4">
              <Bot className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-headline font-semibold mb-2">3. The AI Gets Creative</h2>
            <p className="text-muted-foreground">The Gemini model, trained on a vast universe of text including countless recipes and culinary books, understands the relationships between ingredients and cooking techniques. It generates a brand new recipe—complete with a name, ingredient list, and instructions—that fits your request perfectly.</p>
          </div>
        </div>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">The "Prompt" is Key</CardTitle>
            <CardDescription>
              The magic is in the details. The prompt is carefully engineered to ensure the AI's output is structured, relevant, and useful. It's not just a simple question; it's a command that guides the AI's creative process. The core of this logic lives in the file <code className="bg-muted text-muted-foreground px-1 py-0.5 rounded text-sm">src/ai/flows/generate-recipe.ts</code> in our application's code.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
