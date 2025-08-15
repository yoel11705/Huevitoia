
"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChefHat, UtensilsCrossed, Sparkles, User, Bot, Info, Send, CornerDownLeft, Salad, Soup, Globe, Timer, LogOut, BookMarked, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateRecipeAction } from './actions';
import { saveRecipe as saveRecipeAction } from './my-recipes/actions';
import type { GenerateRecipeOutput } from "@/ai/flows/recipe-schemas";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

type RecipeResult = GenerateRecipeOutput & { imageUrl: string };

type Message = {
  id: number;
  sender: 'user' | 'bot';
  content: string | React.ReactNode;
  icon?: React.ReactNode;
  recipeData?: RecipeResult;
};

type ConversationStage = 'start' | 'get_preferences' | 'get_ingredients' | 'get_cuisine' | 'get_time' | 'generating' | 'done' | 'error';

const initialMessages: Message[] = [
  { id: 1, sender: 'bot', content: '¡Hola! Soy HuevitoIa. Estoy aquí para ayudarte a crear una receta deliciosa con los ingredientes que tienes en casa.', icon: <Salad /> },
  { id: 2, sender: 'bot', content: 'Primero, ¿tienes alguna alergia o preferencia dietética? (ej. vegetariano, sin gluten, alergia a los frutos secos). Si no tienes ninguna, solo escribe "ninguna".', icon: <Salad /> },
];

const hasLetters = (text: string) => /[a-zA-Z]/.test(text);

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [userInput, setUserInput] = useState('');
  const [stage, setStage] = useState<ConversationStage>('get_preferences');
  const [recipeData, setRecipeData] = useState({
    preferences: '',
    ingredients: '',
    cuisine: '',
    maxPrepTime: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage: Message = { id: Date.now(), sender: 'user', content: userInput };
    setMessages(prev => [...prev, userMessage]);
    
    const currentInput = userInput;
    setUserInput('');
    
    processUserInput(currentInput);
  };

  const processUserInput = async (input: string) => {
    let nextStage: ConversationStage = stage;
    let botMessageContent: string | null = null;
    let botIcon: React.ReactNode = null;
    let updatedRecipeData = { ...recipeData };

    switch (stage) {
      case 'get_preferences':
        if (!hasLetters(input)) {
            botMessageContent = "Por favor, introduce preferencias válidas o escribe 'ninguna'.";
            nextStage = 'get_preferences';
        } else {
            updatedRecipeData.preferences = input;
            botMessageContent = "¡Entendido! Ahora, por favor, dime qué ingredientes tienes. Sepáralos por comas (ej. pollo, arroz, brócoli).";
            botIcon = <Soup />;
            nextStage = 'get_ingredients';
        }
        break;
      
      case 'get_ingredients':
        if (!hasLetters(input)) {
            botMessageContent = "Parece que eso no son ingredientes. Por favor, introduce una lista de ingredientes válidos.";
            nextStage = 'get_ingredients';
        } else {
            updatedRecipeData.ingredients = input;
            botMessageContent = "Perfecto. ¿Qué estilo de cocina te apetece? (ej. Mexicana, Italiana, Asiática, o 'cualquiera')";
            botIcon = <Globe />;
            nextStage = 'get_cuisine';
        }
        break;

      case 'get_cuisine':
         if (!hasLetters(input)) {
            botMessageContent = "Por favor, introduce un estilo de cocina válido o escribe 'cualquiera'.";
            nextStage = 'get_cuisine';
        } else {
            updatedRecipeData.cuisine = input;
            botMessageContent = "¡Suena bien! Por último, ¿cuál es el tiempo máximo de preparación en minutos? (ej. 30)";
            botIcon = <Timer />;
            nextStage = 'get_time';
        }
        break;
      
      case 'get_time':
        const time = parseInt(input, 10);
        if (isNaN(time) || time <= 0) {
            botMessageContent = "Por favor, introduce un número válido para los minutos. ¿Cuánto tiempo tienes?";
            nextStage = 'get_time';
        } else {
            updatedRecipeData.maxPrepTime = time;
            nextStage = 'generating';
            setIsLoading(true);
            generateAndSaveRecipe(updatedRecipeData);
        }
        break;
    }
    
    setRecipeData(updatedRecipeData);

    if (botMessageContent) {
        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', content: botMessageContent!, icon: botIcon }]);
            setStage(nextStage);
        }, 500);
    }
    
    if (nextStage === 'generating' && !botMessageContent) {
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', content: "¡Genial! Estoy buscando la receta perfecta para ti. Esto puede tardar un momento...", icon: <Sparkles className="animate-pulse" /> }]);
    }
  };

  const generateAndSaveRecipe = async (data: typeof recipeData) => {
    const result = await generateRecipeAction({
        preferences: data.preferences === 'ninguna' ? '' : data.preferences,
        ingredients: data.ingredients,
        cuisine: data.cuisine,
        maxPrepTime: data.maxPrepTime,
    });

    setIsLoading(false);

    if (result.error || !result.data) {
        setMessages(prev => [...prev, { id: Date.now() + 2, sender: 'bot', content: `Hubo un error: ${result.error || 'No se pudo generar la receta.'}. ¿Quieres intentarlo de nuevo?`, icon: <ChefHat /> }]);
        setStage('error');
    } else {
        const recipeResult = result.data as RecipeResult;
        
        // Auto-save the recipe to history
        if (user) {
            await saveRecipeAction(recipeResult, user.uid);
        }

        setMessages(prev => [...prev, { id: Date.now() + 2, sender: 'bot', content: "¡Aquí tienes tu receta!", icon: <UtensilsCrossed />, recipeData: recipeResult }]);
        setStage('done');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const startOver = () => {
    setMessages(initialMessages);
    setStage('get_preferences');
    setRecipeData({ preferences: '', ingredients: '', cuisine: '', maxPrepTime: 0 });
  }

  const RecipeCard = ({ recipe }: { recipe: RecipeResult }) => (
      <Card className="shadow-lg animate-in fade-in-50">
          <CardHeader>
              <CardTitle className="font-headline text-3xl">{recipe.recipeName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
              {recipe.imageUrl && (
                  <div className="relative w-full aspect-video rounded-md overflow-hidden">
                      <Image
                          src={recipe.imageUrl}
                          alt={recipe.recipeName}
                          fill
                          style={{objectFit: "cover"}}
                          data-ai-hint="food recipe"
                      />
                  </div>
              )}
              <div>
                  <h3 className="font-headline text-xl font-semibold mb-3 border-b pb-2">Ingredientes</h3>
                  <p className="whitespace-pre-wrap text-muted-foreground">{recipe.ingredients}</p>
              </div>
              <div>
                  <h3 className="font-headline text-xl font-semibold mb-3 border-b pb-2">Instrucciones</h3>
                  <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{recipe.instructions}</p>
              </div>
          </CardContent>
      </Card>
  );

  return (
    <div className="flex flex-col h-screen bg-secondary/40">
       <header className="text-center p-4 border-b bg-background flex justify-between items-center">
        <div></div>
        <div className="flex flex-col items-center">
          <div className="inline-block bg-primary p-2 rounded-full mb-2 shadow-md">
            <ChefHat className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-gray-800">HuevitoIa</h1>
          <p className="text-sm text-muted-foreground">Tu asistente de cocina personal.</p>
        </div>
        <div className="flex gap-2">
           {user && (
             <>
                <Link href="/my-recipes" passHref>
                  <Button variant="outline" size="icon" aria-label="Historial de recetas">
                      <History />
                  </Button>
                </Link>
                <Button variant="outline" onClick={handleLogout}>
                    <LogOut className="mr-2" />
                    Salir
                </Button>
             </>
           )}
        </div>
      </header>
      
      <main ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-end gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.sender === 'bot' && (
              <Avatar className="h-10 w-10 border-2 border-primary/50">
                <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot size={20} />
                </AvatarFallback>
              </Avatar>
            )}
            <div className={`max-w-md lg:max-w-xl rounded-2xl px-4 py-3 shadow ${message.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-background text-foreground rounded-bl-none'}`}>
                 {message.recipeData ? (
                     <RecipeCard recipe={message.recipeData} />
                 ) : (
                     <p className="text-sm leading-relaxed">{message.content}</p>

                 )}
            </div>
             {message.sender === 'user' && (
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                    <User size={20} />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
            <div className="flex items-end gap-3 justify-start">
                 <Avatar className="h-10 w-10 border-2 border-primary/50">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot size={20} />
                    </AvatarFallback>
                </Avatar>
                <div className="max-w-md lg:max-w-xl rounded-2xl px-4 py-3 shadow bg-background text-foreground rounded-bl-none">
                   <div className="flex items-center gap-2">
                     <p className="text-sm">Creando tu receta...</p>
                     <Sparkles className="h-4 w-4 animate-pulse" />
                   </div>
                </div>
            </div>
        )}
      </main>

      <footer className="p-4 bg-background border-t">
        <div className="container mx-auto">
          {stage === 'done' || stage === 'error' ? (
             <Button onClick={startOver} className="w-full">
                <Sparkles className="mr-2" />
                Crear una nueva receta
             </Button>
          ) : (
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Escribe tu respuesta aquí..."
                autoFocus
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={isLoading || !userInput.trim()}>
                <Send />
              </Button>
            </form>
          )}
           <div className="text-center mt-3">
             <Link href="/about" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1">
                <Info size={12} />
                ¿Cómo funciona esto?
             </Link>
           </div>
        </div>
      </footer>
    </div>
  );
}
