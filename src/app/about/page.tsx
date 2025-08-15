
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
                    Volver al Generador de Recetas
                </Button>
            </Link>
        </div>

        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-gray-800">Cómo Funciona HuevitoIa</h1>
          <p className="mt-4 text-lg text-muted-foreground">Descubriendo la magia detrás de tus recetas personalizadas.</p>
        </header>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="p-4 bg-secondary rounded-full mb-4">
              <Lightbulb className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-headline font-semibold mb-2">1. Tú Proporcionas las Pistas</h2>
            <p className="text-muted-foreground">¡El proceso comienza contigo! Ingresas los ingredientes que tienes, tus preferencias dietéticas (como alergias o "vegetariano"), el estilo de cocina que se te antoja y tu tiempo máximo de preparación.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-4 bg-secondary rounded-full mb-4">
              <BrainCircuit className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-headline font-semibold mb-2">2. Instruimos a la IA</h2>
            <p className="text-muted-foreground">Tu información se agrupa en un conjunto específico de instrucciones, llamado "prompt", que se envía al potente modelo de IA Gemini de Google. Esencialmente, le decimos a la IA: "Actúa como un chef de clase mundial y crea una receta única usando estos detalles exactos".</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="p-4 bg-secondary rounded-full mb-4">
              <Bot className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-xl font-headline font-semibold mb-2">3. La IA se Pone Creativa</h2>
            <p className="text-muted-foreground">El modelo Gemini, entrenado en un vasto universo de texto que incluye innumerables recetas y libros de cocina, comprende las relaciones entre ingredientes y técnicas de cocina. Genera una receta completamente nueva, con nombre, lista de ingredientes e instrucciones, que se ajusta perfectamente a tu solicitud.</p>
          </div>
        </div>

        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">La "Instrucción" (Prompt) es Clave</CardTitle>
            <CardDescription>
              La magia está en los detalles. El prompt está cuidadosamente diseñado para garantizar que el resultado de la IA sea estructurado, relevante y útil. No es solo una simple pregunta; es una orden que guía el proceso creativo de la IA. El núcleo de esta lógica reside en el archivo <code className="bg-muted text-muted-foreground px-1 py-0.5 rounded text-sm">src/ai/flows/generate-recipe.ts</code> en el código de nuestra aplicación.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
