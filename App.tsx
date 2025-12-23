import React, { useState, useRef, useEffect } from 'react';
import { generateImageContent, enhancePromptWithAI } from './services/geminiService';
import { 
  APP_STYLES, 
  FRAMING_OPTIONS, 
  ANGLE_OPTIONS, 
  LIGHTING_OPTIONS,
  COLOR_OPTIONS,
  TEXTURE_OPTIONS,
  ASPECT_RATIO_OPTIONS,
  GEMINI_MODEL_NAME 
} from './constants';
import { StyleOption, GeneratedImage, AppMode } from './types';
import { SparklesIcon, DownloadIcon, PhotoIcon, MagicWandIcon, ArrowPathIcon } from './components/Icons';

// --- Sub-Components ---

const Header: React.FC = () => (
  <header className="flex items-center justify-between py-6 px-4 md:px-8 border-b border-gray-100 bg-white sticky top-0 z-50 bg-opacity-90 backdrop-blur-md">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
        <SparklesIcon className="w-5 h-5" />
      </div>
      <h1 className="text-xl font-bold tracking-tight text-gray-900">PromptAssistant</h1>
    </div>
    <div className="flex items-center gap-2">
      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full border border-yellow-200">
        Nano Banana
      </span>
      <span className="hidden md:inline text-xs text-gray-400 font-mono">
        {GEMINI_MODEL_NAME}
      </span>
    </div>
  </header>
);

interface HistoryThumbnailProps {
  image: GeneratedImage;
  isActive: boolean;
  onClick: () => void;
}

const HistoryThumbnail: React.FC<HistoryThumbnailProps> = ({ 
  image, 
  isActive, 
  onClick 
}) => (
  <button
    onClick={onClick}
    className={`relative group flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all duration-200 ${
      isActive ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-2' : 'border-transparent hover:border-gray-300'
    }`}
  >
    <img 
      src={image.imageUrl} 
      alt={image.prompt} 
      className="w-full h-full object-cover" 
    />
    {image.mode === 'edit' && (
      <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full shadow-sm ring-1 ring-white" title="Imagen Editada" />
    )}
  </button>
);

interface StyleCardProps {
  style: StyleOption;
  isSelected: boolean;
  onSelect: () => void;
}

const StyleCard: React.FC<StyleCardProps> = ({ 
  style, 
  isSelected, 
  onSelect 
}) => (
  <button
    onClick={onSelect}
    className={`flex flex-col items-start p-3 rounded-xl border transition-all duration-200 text-left w-full h-full min-h-[80px] ${
      isSelected 
        ? 'border-gray-900 bg-gray-50 shadow-md ring-1 ring-gray-900' 
        : 'border-gray-200 hover:border-gray-400 hover:bg-white hover:shadow-sm bg-white'
    }`}
  >
    <div className="flex items-center justify-between w-full mb-2">
      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-gray-900' : 'border-gray-300'}`}>
        {isSelected && <div className="w-2 h-2 bg-gray-900 rounded-full" />}
      </div>
    </div>
    <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">{style.label}</h3>
    <p className="text-[10px] text-gray-500 leading-tight line-clamp-2">{style.description}</p>
  </button>
);

// --- Main App ---

export default function App() {
  const [prompt, setPrompt] = useState('');
  
  // State for customization
  const [selectedStyleId, setSelectedStyleId] = useState<string>('none');
  const [selectedFraming, setSelectedFraming] = useState<string>('default');
  const [selectedAngle, setSelectedAngle] = useState<string>('default');
  const [selectedLighting, setSelectedLighting] = useState<string>('default');
  const [selectedColor, setSelectedColor] = useState<string>('default');
  const [selectedTexture, setSelectedTexture] = useState<string>('default');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>('1:1');

  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Edit Mode State
  const [mode, setMode] = useState<AppMode>(AppMode.GENERATE);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Aquí se podría cargar el historial desde localStorage
  }, []);

  const handleEnhancePrompt = async () => {
      if (!prompt.trim()) {
          setError("Escribe algo primero para poder mejorarlo.");
          return;
      }
      setIsEnhancing(true);
      setError(null);
      try {
          const enhanced = await enhancePromptWithAI(prompt);
          setPrompt(enhanced);
      } catch (e) {
          setError("No se pudo mejorar el prompt en este momento.");
      } finally {
          setIsEnhancing(false);
      }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() && mode === AppMode.GENERATE) {
      setError("Por favor, ingresa una descripción para tu imagen.");
      return;
    }
    if (mode === AppMode.EDIT && !uploadedImage) {
        setError("Por favor, sube una imagen para editar.");
        return;
    }
    if (mode === AppMode.EDIT && !prompt.trim()) {
        setError("Por favor, describe cómo quieres modificar la imagen.");
        return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // 1. Obtener objetos de configuración
      const style = APP_STYLES.find(s => s.id === selectedStyleId);
      const framing = FRAMING_OPTIONS.find(f => f.id === selectedFraming);
      const angle = ANGLE_OPTIONS.find(a => a.id === selectedAngle);
      const lighting = LIGHTING_OPTIONS.find(l => l.id === selectedLighting);
      const color = COLOR_OPTIONS.find(c => c.id === selectedColor);
      const texture = TEXTURE_OPTIONS.find(t => t.id === selectedTexture);

      // 2. Construir el prompt final
      let finalPrompt = prompt.trim();
      
      const modifiers = [];
      
      // Estructura: Estilo -> Composición -> Iluminación -> Atmósfera -> Técnica
      if (style && style.id !== 'none') modifiers.push(style.promptModifier);
      if (framing && framing.id !== 'default') modifiers.push(framing.promptText);
      if (angle && angle.id !== 'default') modifiers.push(angle.promptText);
      if (lighting && lighting.id !== 'default') modifiers.push(lighting.promptText);
      if (color && color.id !== 'default') modifiers.push(color.promptText);
      if (texture && texture.id !== 'default') modifiers.push(texture.promptText);

      if (modifiers.length > 0) {
        finalPrompt = `${finalPrompt}. ${modifiers.join(', ')}.`;
      }

      // 3. Llamada API
      const imageUrl = await generateImageContent(
          finalPrompt, 
          mode === AppMode.EDIT ? uploadedImage! : undefined,
          selectedAspectRatio
      );
      
      const newImage: GeneratedImage = {
        id: crypto.randomUUID(),
        imageUrl,
        prompt: finalPrompt,
        styleId: selectedStyleId,
        framingId: selectedFraming,
        angleId: selectedAngle,
        lightingId: selectedLighting,
        colorId: selectedColor,
        textureId: selectedTexture,
        aspectRatio: selectedAspectRatio,
        timestamp: Date.now(),
        mode: mode === AppMode.GENERATE ? 'generate' : 'edit'
      };

      setCurrentImage(newImage);
      setHistory(prev => [newImage, ...prev].slice(0, 10));

    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setIsGenerating(false);
    }
  };

  const restoreSession = (image: GeneratedImage) => {
    setCurrentImage(image);
    if (image.aspectRatio) setSelectedAspectRatio(image.aspectRatio);
    // Restaurar el resto si es necesario para una mejor UX
    // if (image.styleId) setSelectedStyleId(image.styleId);
  }

  const handleDownload = () => {
    if (!currentImage) return;
    const link = document.createElement('a');
    link.href = currentImage.imageUrl;
    link.download = `nanoframe-${currentImage.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Por favor sube un archivo de imagen válido.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) { 
        setError("La imagen es demasiado grande. Máximo 5MB.");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 selection:bg-gray-200">
      <Header />

      <main className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 md:p-8 gap-6 md:gap-12">
        
        {/* COLUMNA IZQUIERDA: Controles */}
        <div className="w-full md:w-1/3 flex flex-col gap-6 order-2 md:order-1">
          
          {/* Selector de Modo */}
          <div className="flex p-1 bg-gray-200 rounded-lg self-start">
            <button
                onClick={() => { setMode(AppMode.GENERATE); setError(null); }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${mode === AppMode.GENERATE ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Generar
            </button>
            <button
                onClick={() => { setMode(AppMode.EDIT); setError(null); }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${mode === AppMode.EDIT ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Editar
            </button>
          </div>

          {/* MODO EDICIÓN: Zona de carga */}
          {mode === AppMode.EDIT && (
            <div className="animate-fade-in">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Imagen de Referencia</label>
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative w-full h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden group
                        ${uploadedImage ? 'border-gray-300' : 'border-gray-300 hover:border-gray-400 bg-gray-100 hover:bg-gray-200'}
                    `}
                >
                    {uploadedImage ? (
                        <>
                            <img src={uploadedImage} alt="Upload" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-sm font-medium shadow-sm">Cambiar Imagen</span>
                            </div>
                        </>
                    ) : (
                        <div className="text-center p-4">
                            <PhotoIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <span className="text-sm text-gray-500">Clic para subir imagen</span>
                        </div>
                    )}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        className="hidden" 
                        accept="image/png, image/jpeg, image/webp" 
                    />
                </div>
            </div>
          )}

          {/* Prompt Input & Improve Button */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
                <label htmlFor="prompt" className="text-sm font-semibold text-gray-700">
                    {mode === AppMode.GENERATE ? "Descripción de la Imagen" : "Instrucciones de Edición"}
                </label>
                <button 
                    onClick={handleEnhancePrompt}
                    disabled={isEnhancing || !prompt}
                    className="flex items-center gap-1.5 text-xs text-blue-600 font-medium hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <SparklesIcon className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
                    {isEnhancing ? 'Mejorando...' : 'Mejorar Prompt'}
                </button>
            </div>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={mode === AppMode.GENERATE 
                ? "Una ciudad futurista en una cúpula de cristal en Marte..." 
                : "Añade gafas de sol al perro..."}
              className="w-full p-4 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none resize-none shadow-sm text-gray-800 placeholder:text-gray-400 transition-all min-h-[100px]"
            />
          </div>

          {/* Configuración de Cámara / Pro Mode */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-6">
            
            {/* Aspect Ratio Selector */}
            <div className="space-y-2">
                 <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Formato</label>
                 <div className="grid grid-cols-5 gap-2">
                    {ASPECT_RATIO_OPTIONS.map((ratio) => (
                        <button
                            key={ratio.id}
                            onClick={() => setSelectedAspectRatio(ratio.value)}
                            title={ratio.label}
                            className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                                selectedAspectRatio === ratio.value 
                                ? 'bg-gray-100 border-gray-900 ring-1 ring-gray-900 text-gray-900' 
                                : 'border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600'
                            }`}
                        >
                            <div className={`border-2 border-current rounded-sm w-5 ${
                                ratio.value === '1:1' ? 'h-5' : 
                                ratio.value === '16:9' ? 'h-3' : 
                                ratio.value === '9:16' ? 'h-7' : 
                                ratio.value === '4:3' ? 'h-4' : 'h-6'
                            }`} />
                            <span className="text-[9px] mt-1 font-medium">{ratio.id}</span>
                        </button>
                    ))}
                 </div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Composición</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Encuadre */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">Encuadre</label>
                        <select 
                        value={selectedFraming}
                        onChange={(e) => setSelectedFraming(e.target.value)}
                        className="w-full text-sm p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
                        >
                        {FRAMING_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                        </select>
                    </div>
                    {/* Ángulo */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">Ángulo</label>
                        <select 
                        value={selectedAngle}
                        onChange={(e) => setSelectedAngle(e.target.value)}
                        className="w-full text-sm p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
                        >
                        {ANGLE_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Atmósfera y Acabado</h3>
                <div className="grid grid-cols-1 gap-4">
                     {/* Iluminación */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-600">Iluminación</label>
                        <select 
                        value={selectedLighting}
                        onChange={(e) => setSelectedLighting(e.target.value)}
                        className="w-full text-sm p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
                        >
                        {LIGHTING_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                        </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                         {/* Color Grading */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600">Gradación de Color</label>
                            <select 
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value)}
                            className="w-full text-sm p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
                            >
                            {COLOR_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                        </div>
                         {/* Textura */}
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-600">Textura / Película</label>
                            <select 
                            value={selectedTexture}
                            onChange={(e) => setSelectedTexture(e.target.value)}
                            className="w-full text-sm p-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:outline-none"
                            >
                            {TEXTURE_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

          </div>

          {/* Style Selector Grid */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-3 block">Estilo Artístico</label>
            <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200">
              {APP_STYLES.map((style) => (
                <StyleCard 
                  key={style.id} 
                  style={style} 
                  isSelected={selectedStyleId === style.id} 
                  onSelect={() => setSelectedStyleId(style.id)} 
                />
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 sticky bottom-4 md:static z-10">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-4 rounded-xl font-semibold text-white shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2
                ${isGenerating ? 'bg-gray-800 cursor-wait opacity-80' : 'bg-gray-900 hover:bg-black'}
              `}
            >
              {isGenerating ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  <span>Creando...</span>
                </>
              ) : (
                <>
                  {mode === AppMode.GENERATE ? <SparklesIcon className="w-5 h-5" /> : <MagicWandIcon className="w-5 h-5" />}
                  <span>{mode === AppMode.GENERATE ? 'Generar Imagen' : 'Edición Mágica'}</span>
                </>
              )}
            </button>
            {error && (
              <div className="mt-3 text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Vista Previa e Historial */}
        <div className="w-full md:w-2/3 flex flex-col gap-6 order-1 md:order-2">
          
          {/* Main Preview Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 md:p-3 relative flex flex-col min-h-[500px]">
            <div className="relative flex-grow rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center group w-full h-full">
              
              {isGenerating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 z-10">
                   <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 animate-pulse-slow mb-4 flex items-center justify-center">
                      <SparklesIcon className="w-8 h-8 text-gray-400 animate-pulse" />
                   </div>
                   <p className="text-gray-500 font-medium animate-pulse">Diseñando tu visual...</p>
                </div>
              ) : currentImage ? (
                // Imagen generada con contenedor que respeta el aspect ratio original visualmente
                <div className="w-full h-full flex items-center justify-center p-4">
                    <img 
                        src={currentImage.imageUrl} 
                        alt="Generated output" 
                        className="max-w-full max-h-full object-contain shadow-sm"
                        style={{
                            aspectRatio: currentImage.aspectRatio?.replace(':', '/')
                        }}
                    />
                  {/* Overlay Actions */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <button 
                      onClick={handleDownload}
                      className="bg-white/90 backdrop-blur text-gray-900 p-2.5 rounded-full shadow-lg hover:bg-white transition-transform hover:scale-110 active:scale-95 border border-gray-200"
                      title="Descargar"
                    >
                      <DownloadIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 max-w-sm">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <SparklesIcon className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Listo para Crear</h3>
                  <p className="text-gray-500 mt-2">
                    Escribe una descripción, ajusta la cámara y selecciona un estilo para generar imágenes de alta calidad con Gemini Nano.
                  </p>
                </div>
              )}
            </div>
            
            {/* Prompt Display (Bottom of Preview Card) */}
            {currentImage && !isGenerating && (
                <div className="mt-3 px-1">
                    <p className="text-sm text-gray-600 line-clamp-2">
                        <span className="font-semibold text-gray-900">Prompt:</span> {currentImage.prompt}
                    </p>
                </div>
            )}
          </div>

          {/* History Strip */}
          {history.length > 0 && (
            <div className="w-full">
               <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Sesiones Recientes</h3>
               <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
                 {history.map((item) => (
                   <HistoryThumbnail 
                     key={item.id} 
                     image={item} 
                     isActive={currentImage?.id === item.id} 
                     onClick={() => restoreSession(item)} 
                   />
                 ))}
               </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}