import { StyleOption, OptionItem, AspectRatioOption } from './types';

// Usando Gemini 2.5 Flash Image ("Nano Banana")
export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-image';
// Usando Gemini 3 Flash para mejorar textos
export const GEMINI_TEXT_MODEL_NAME = 'gemini-3-flash-preview';

export const APP_STYLES: StyleOption[] = [
  {
    id: 'none',
    label: 'Realista (Estándar)',
    promptModifier: 'photorealistic, 8k, highly detailed, sharp focus, raw photo',
    description: 'Fotografía pura y nítida'
  },
  {
    id: 'cinematic',
    label: 'Cine Moderno',
    promptModifier: 'cinematic movie scene, anamorphic lens, teal and orange grading, depth of field, motion picture look, atmospheric',
    description: 'Look de película de Hollywood'
  },
  {
    id: 'cyberpunk',
    label: 'Cyberpunk / Neón',
    promptModifier: 'cyberpunk aesthetic, neon lights, rain-slicked streets, futuristic, high contrast, vibrant magenta and cyan, blade runner style',
    description: 'Futurista, neón y oscuro'
  },
  {
    id: 'analog',
    label: 'Analógico Retro',
    promptModifier: 'analog photography, 35mm film, vintage kodak portra 400, film grain, light leaks, nostalgic, soft colors',
    description: 'Estilo vintage de los 90s'
  },
  {
    id: 'studio-portrait',
    label: 'Retrato de Estudio',
    promptModifier: 'professional studio photography, grey background, rim lighting, softbox, high fashion, vogue style, sharp details',
    description: 'Profesional y limpio'
  },
  {
    id: 'architectural',
    label: 'Arquitectura',
    promptModifier: 'architectural photography, wide angle, straight lines, interior design magazine style, modern, minimalist, bright',
    description: 'Espacios y estructuras'
  },
  {
    id: 'fantasy-art',
    label: 'Arte de Fantasía',
    promptModifier: 'digital fantasy art, ethereal, magical atmosphere, detailed environment, rpg style, concept art, masterpiece',
    description: 'Mágico y etéreo'
  },
  {
    id: 'anime',
    label: 'Anime Premium',
    promptModifier: 'high quality anime style, makoto shinkai vibe, detailed background, vibrant clouds, 2D animation, cel shaded',
    description: 'Animación japonesa detallada'
  },
  {
    id: '3d-clay',
    label: '3D Plastilina',
    promptModifier: '3d clay render, plasticine texture, cute, soft lighting, diorama look, stop motion style, playful',
    description: 'Estilo Stop-Motion suave'
  },
  {
    id: 'isometric',
    label: 'Mundo Isométrico',
    promptModifier: 'isometric view, 3d render, low poly, cute, miniature world, clean edges, unreal engine 5',
    description: 'Miniaturas 3D'
  },
  {
    id: 'watercolor',
    label: 'Acuarela Suave',
    promptModifier: 'watercolor painting, soft brush strokes, pastel colors, artistic, paper texture, wet on wet technique',
    description: 'Artístico y delicado'
  },
  {
    id: 'sketch',
    label: 'Boceto a Lápiz',
    promptModifier: 'pencil sketch, charcoal drawing, rough lines, graphite texture, monochrome, artistic draft',
    description: 'Dibujo a mano alzada'
  }
];

// Opciones de Encuadre (Composición)
export const FRAMING_OPTIONS: OptionItem[] = [
  { id: 'default', label: 'Automático', promptText: '' },
  { id: 'wide', label: 'Gran Angular (Wide)', promptText: 'wide angle lens, 16mm, expansive view' },
  { id: 'medium', label: 'Plano Medio', promptText: 'medium shot, waist up, 50mm lens' },
  { id: 'closeup', label: 'Primer Plano', promptText: 'close-up shot, detailed face, emotion' },
  { id: 'macro', label: 'Macro (Detalle)', promptText: 'macro photography, 100mm lens, microscopic details, extreme close-up' },
  { id: 'overhead', label: 'Cenital (Flat Lay)', promptText: 'flat lay, overhead view, top-down shot, 90 degree angle' }
];

// Opciones de Ángulo
export const ANGLE_OPTIONS: OptionItem[] = [
  { id: 'default', label: 'Nivel de Ojos', promptText: 'eye level shot' },
  { id: 'low', label: 'Contrapicado (Héroe)', promptText: 'low angle shot, looking up, imposing, heroic' },
  { id: 'high', label: 'Picado (Superior)', promptText: 'high angle shot, looking down, vulnerable' },
  { id: 'dutch', label: 'Plano Holandés (Inclinado)', promptText: 'dutch angle, tilted frame, dynamic, uneasy' },
  { id: 'drone', label: 'Aéreo / Dron', promptText: 'aerial photography, drone shot, bird\'s eye view' }
];

// Opciones de Iluminación
export const LIGHTING_OPTIONS: OptionItem[] = [
  { id: 'default', label: 'Natural / Balanceada', promptText: 'natural lighting, balanced exposure' },
  { id: 'golden', label: 'Hora Dorada', promptText: 'golden hour, warm sunset light, sun flares, soft backlight' },
  { id: 'studio', label: 'Estudio Softbox', promptText: 'professional studio lighting, softbox, three-point lighting' },
  { id: 'rembrandt', label: 'Rembrandt (Dramática)', promptText: 'rembrandt lighting, moody, chiaroscuro, artistic shadows' },
  { id: 'neon', label: 'Neón Cyberpunk', promptText: 'neon lighting, pink and blue rim lights, dark environment' },
  { id: 'volumetric', label: 'Volumétrica (Rayos)', promptText: 'volumetric lighting, god rays, atmospheric haze, dusty beams' },
  { id: 'flat', label: 'Plana (Sin sombras)', promptText: 'flat lighting, even illumination, low contrast' }
];

// Opciones de Color (Color Grading)
export const COLOR_OPTIONS: OptionItem[] = [
  { id: 'default', label: 'Natural', promptText: '' },
  { id: 'bw', label: 'Blanco y Negro Noir', promptText: 'black and white photography, film noir, high contrast, monochrome' },
  { id: 'vibrant', label: 'Vibrante / Saturado', promptText: 'vibrant colors, high saturation, colorful, pop' },
  { id: 'pastel', label: 'Pastel / Suave', promptText: 'pastel color palette, desaturated, soft tones, dreamy' },
  { id: 'teal-orange', label: 'Teal & Orange (Cine)', promptText: 'teal and orange color grading, cinematic colors, complementary colors' },
  { id: 'vintage', label: 'Sepia / Vintage', promptText: 'sepia tone, vintage colors, faded look, warm wash' },
  { id: 'muted', label: 'Desaturado / Moody', promptText: 'muted colors, desaturated, melancholic, cool tones' }
];

// Opciones de Textura / Film Stock
export const TEXTURE_OPTIONS: OptionItem[] = [
  { id: 'default', label: 'Digital Limpio', promptText: 'clean digital sensor, no grain, sharp' },
  { id: 'film-grain', label: 'Grano de Película', promptText: 'film grain, noise, textured, analog feel' },
  { id: 'polaroid', label: 'Polaroid Instantánea', promptText: 'polaroid aesthetic, soft focus, vintage instant film' },
  { id: 'vhs', label: 'VHS / Glitch', promptText: 'vhs aesthetic, glitch art, chromatic aberration, scanlines' },
  { id: 'matte', label: 'Acabado Mate', promptText: 'matte finish, soft texture, low contrast' }
];

// Opciones de Aspect Ratio
export const ASPECT_RATIO_OPTIONS: AspectRatioOption[] = [
  { id: '1:1', label: 'Cuadrado', value: '1:1', icon: 'aspect-square' },
  { id: '3:4', label: 'Retrato (3:4)', value: '3:4', icon: 'aspect-[3/4]' },
  { id: '4:3', label: 'Paisaje (4:3)', value: '4:3', icon: 'aspect-[4/3]' },
  { id: '9:16', label: 'Historia (9:16)', value: '9:16', icon: 'aspect-[9/16]' },
  { id: '16:9', label: 'Cine (16:9)', value: '16:9', icon: 'aspect-video' },
];