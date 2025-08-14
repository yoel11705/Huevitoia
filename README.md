# Huevitoia

Este proyecto fue creado con Firebase Studio. Es una aplicación de Next.js que utiliza IA para generar recetas basadas en los ingredientes que tienes en casa.

## Cómo ejecutarlo localmente

Para ejecutar este proyecto en tu máquina local, sigue estos pasos:

### Prerrequisitos

Asegúrate de tener [Node.js](https://nodejs.org/) (versión 20 o superior) instalado en tu computadora.

### 1. Instalar dependencias

Navega a la carpeta del proyecto en tu terminal y ejecuta el siguiente comando para instalar todas las librerías necesarias:

```bash
npm install
```

### 2. Configurar las variables de entorno

La aplicación necesita una clave de API de Google para usar el modelo Gemini.

1.  Crea una copia del archivo `.env.example` en la raíz del proyecto.
2.  Renombra la copia a `.env`.
3.  Abre el nuevo archivo `.env` y añade tu clave de API de Google AI Studio. Puedes obtener una gratis [aquí](https://aistudio.google.com/app/apikey).

Tu archivo `.env` debería verse así:

```
GEMINI_API_KEY="TU_API_KEY_AQUI"
```

### 3. Ejecutar la aplicación

Una vez que las dependencias estén instaladas y las variables de entorno configuradas, puedes iniciar el servidor de desarrollo con:

```bash
npm run dev
```

Abre [http://localhost:9002](http://localhost:9002) en tu navegador para ver la aplicación en acción.

## Cómo funciona

Esta aplicación usa un modelo de IA de Google (Gemini) para generar las recetas.
1.  **Tú proporcionas los datos:** Ingresas ingredientes, preferencias, estilo de cocina y tiempo.
2.  **Se instruye a la IA:** Tu información se envía a Gemini con una instrucción clara (un "prompt") para que actúe como un chef experto.
3.  **La IA crea la receta:** Gemini utiliza su vasto conocimiento para generar una receta única que se ajuste a tus necesidades.

Puedes aprender más en la página `/about` de la aplicación.
