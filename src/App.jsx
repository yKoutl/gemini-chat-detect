import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Settings, Trash2, Sun, Moon, Mail, X, RefreshCw, Heart, Key, MessageSquarePlus, Palette } from 'lucide-react';
import { marked } from 'marked';

// --- CONFIGURACIÓN Y TRADUCCIONES ---
const TRANSLATIONS = {
  es: {
    welcomeTitle: "Nos Planét Chat",
    welcomeText: "Interfaz modal diseñada para probar tu integración API.",
    enterBtn: "Iniciar Chat",
    developedBy: "Diseñado por",
    chatTitle: "Gemini Chat",
    chatSubtitle: "Integración API",
    clearChat: "Limpiar",
    settings: "Ajustes",
    apiKeyLabel: "CLAVE API",
    modelLabel: "MODELO",
    accentColorLabel: "COLOR DE ACENTO", // NUEVO
    detectBtn: "Detectar",
    feedbackTitle: "Comentarios",
    feedbackSubtitle: "Ayúdanos a mejorar",
    namePlaceholder: "Nombre",
    emailPlaceholder: "Correo electrónico",
    commentPlaceholder: "Tu opinión...",
    sendFeedback: "Enviar",
    inputPlaceholder: "Escribe tu mensaje...",
    systemRole: "Eres un asistente útil y preciso. Responde en Español.",
    errorKey: "Configura tu API Key primero.",
    errorModel: "Sin modelos disponibles.",
    successFeedback: "¡Enviado!",
    tutTitle: "Configuración Rápida",
    tutStep1: "Obtén tu API Key de Google",
    tutStep2: "Abre el menú de Ajustes",
    tutStep3: "Pega la clave y detecta",
    tutBtn: "¡Entendido!",
    fabTooltip: "Danos tu opinión"
  },
  en: {
    welcomeTitle: "Nos Planét Chat",
    welcomeText: "Modal interface designed to test your API integration.",
    enterBtn: "Start Chat",
    developedBy: "Designed by",
    chatTitle: "Gemini Chat",
    chatSubtitle: "API Integration",
    clearChat: "Clear",
    settings: "Settings",
    apiKeyLabel: "API KEY",
    modelLabel: "MODEL",
    accentColorLabel: "ACCENT COLOR", // NUEVO
    detectBtn: "Detect",
    feedbackTitle: "Feedback",
    feedbackSubtitle: "Help us improve",
    namePlaceholder: "Name",
    emailPlaceholder: "Email address",
    commentPlaceholder: "Your thoughts...",
    sendFeedback: "Send",
    inputPlaceholder: "Type your message...",
    systemRole: "You are a helpful assistant. Answer in English.",
    errorKey: "Please set your API Key first.",
    errorModel: "No models available.",
    successFeedback: "Sent!",
    tutTitle: "Quick Setup",
    tutStep1: "Get your Google API Key",
    tutStep2: "Open Settings menu",
    tutStep3: "Paste key & detect",
    tutBtn: "Got it!",
    fabTooltip: "Give feedback"
  }
};

// Paleta de colores predefinida
const COLORS = [
  { id: 'purple', value: '#7F5AF0', label: 'Violeta' },
  { id: 'blue', value: '#3B82F6', label: 'Azul' },
  { id: 'green', value: '#10B981', label: 'Verde' },
  { id: 'orange', value: '#F97316', label: 'Naranja' },
  { id: 'pink', value: '#EC4899', label: 'Rosa' },
  { id: 'gold', value: '#8C7851', label: 'Dorado' },
];

// Mensaje inicial constante para restaurarlo al limpiar
const INITIAL_MSG = { role: 'model', text: '👋 ¡Hola! Soy Gemini. Configura tu API Key para empezar.' };

// --- COMPONENTE FONDO (DEFINIDO AFUERA PARA EVITAR RE-RENDER) ---
const Background = React.memo(() => (
  <div className="squares-bg">
    {[...Array(10)].map((_, i) => <span key={i} className="square"></span>)}
  </div>
));

// --- COMPONENTE PRINCIPAL DEL CHAT ---
function GeminiChat() {
  // Estados de la UI
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('es');
  const t = TRANSLATIONS[language];

  // Nuevo Estado: Color de Acento
  const [accentColor, setAccentColor] = useState('#7F5AF0');

  // Estados de Feedback & Likes
  const [showFeedback, setShowFeedback] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(342);

  // Estados del Chat y API
  const [messages, setMessages] = useState([INITIAL_MSG]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [availableModels, setAvailableModels] = useState([{ id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' }]);
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const [showSettings, setShowSettings] = useState(false);
  const [testMessage, setTestMessage] = useState('');

  const messagesEndRef = useRef(null);

  // Cargar Datos al inicio
  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) setApiKey(storedKey);

    const storedColor = localStorage.getItem('gemini_accent_color');
    if (storedColor) setAccentColor(storedColor);
  }, []);

  // Scroll automático
  useEffect(() => {
    if (!showWelcome && !showTutorial) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, showWelcome, showTutorial]);

  // Manejo de pantallas iniciales
  const handleStart = () => {
    setShowWelcome(false);
    setShowTutorial(true);
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    setShowSettings(true);
  };

  // Cambiar Color
  const handleColorChange = (color) => {
    setAccentColor(color);
    localStorage.setItem('gemini_accent_color', color);
  };

  // Lógica de Feedback Actualizada
  const handleFeedbackSubmit = () => {
    if (!comment.trim()) return; // Mínimo requerimos el comentario
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setComment('');
      setName('');
      setEmail('');
      setShowFeedback(false);
    }, 1500);
  };

  // Manejo de Me Gusta con Contador
  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => !isLiked ? prev + 1 : prev - 1);
  };

  // Manejo de Limpiar Chat (Protegiendo mensaje inicial)
  const handleClearChat = () => {
    if (confirm("¿Deseas limpiar la conversación?")) {
      setMessages([INITIAL_MSG]);
    }
  };

  // Lógica API Gemini
  const fetchAvailableModels = async () => {
    if (!apiKey) { setTestMessage(t.errorKey); return; }
    setTestMessage('...');
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message);

      const validModels = data.models?.filter(m => m.supportedGenerationMethods.includes('generateContent'))
        .map(m => ({ id: m.name.replace('models/', ''), name: m.displayName }));

      if (validModels?.length) {
        setAvailableModels(validModels);
        setSelectedModel(validModels[0].id);
        setTestMessage(`✓ ${validModels.length}`);
      } else { throw new Error(t.errorModel); }
    } catch (error) { setTestMessage('Error'); }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!apiKey) { setShowSettings(true); return; }

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.slice(-10).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const payload = {
        contents: [...history, { role: 'user', parts: [{ text: userMessage.text }] }],
        systemInstruction: { parts: [{ text: t.systemRole }] }
      };

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message);

      const botText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (botText) setMessages(prev => [...prev, { role: 'model', text: botText }]);
      else throw new Error("No text");

    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: `❌ ${error.message}` }]);
    } finally { setIsLoading(false); }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMarkdown = (text) => {
    try { return { __html: marked.parse(text) }; }
    catch (e) { return { __html: text }; }
  };

  return (
    <div
      className={`app-wrapper ${darkMode ? 'dark-mode' : ''} w-full h-full min-h-screen flex items-center justify-center relative overflow-hidden font-inter transition-colors duration-500`}
      style={{
        '--button': accentColor,
        '--highlight': accentColor,
        '--square-color': accentColor,
        '--tertiary': accentColor,
      }}
    >

      {/* Estilos encapsulados para el componente */}
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                
                .font-inter { font-family: 'Inter', sans-serif; }

                :root {
                    /* DÍA (AJUSTADO: Tonos más oscuros/suaves) */
                    --bg-color: #E2DBD5;
                    --card-bg: #F5F2EF;
                    --headline: #020826;
                    --paragraph: #5E5035;
                    /* Estos valores serán sobrescritos por el estilo inline si se selecciona color */
                    --button: #8C7851;
                    --button-text: #FFFFFE;
                    --stroke: #D1C7B7;
                    --highlight: #8C7851;
                    --secondary: #DBCAB0;
                    --tertiary: #F25042;
                    --input-bg: #FCFAF9;
                    --shadow-color: rgba(2, 8, 38, 0.1);
                    --square-color: #8C7851;
                }

                .dark-mode {
                    /* NOCHE */
                    --bg-color: #16161A;
                    --card-bg: #242629;
                    --headline: #FFFFFE;
                    --paragraph: #94A1B2;
                    --button: #7F5AF0;
                    --button-text: #FFFFFE;
                    --stroke: #2a2a2e;
                    --highlight: #7F5AF0;
                    --secondary: #72757E;
                    --tertiary: #2CB67D;
                    --input-bg: #16161A;
                    --shadow-color: rgba(0, 0, 0, 0.5);
                    --square-color: #2CB67D;
                }

                .app-wrapper {
                    background-color: var(--bg-color);
                    color: var(--paragraph);
                }

                .modal-container {
                    background-color: var(--card-bg);
                    border: 1px solid var(--stroke);
                    box-shadow: 0 20px 50px -12px var(--shadow-color);
                }

                h1, h2, h3, h4, .text-headline { color: var(--headline); }
                
                .btn-primary {
                    background-color: var(--button);
                    color: var(--button-text);
                    transition: transform 0.2s, opacity 0.2s, background-color 0.3s;
                }
                .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
                .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

                .btn-icon {
                    color: var(--paragraph);
                    transition: background-color 0.2s;
                    border-radius: 8px;
                }
                .btn-icon:hover { background-color: var(--secondary); color: var(--headline); }
                .btn-icon.active { color: var(--tertiary); }

                .input-field {
                    background-color: var(--input-bg);
                    border: 1px solid var(--stroke);
                    color: var(--headline);
                }
                .input-field:focus {
                    outline: none;
                    border-color: var(--highlight);
                    box-shadow: 0 0 0 3px var(--secondary);
                }

                /* Markdown Styles */
                .prose strong { color: inherit; font-weight: 700; }
                .prose pre { 
                    background: var(--bg-color); 
                    border: 1px solid var(--stroke);
                    padding: 1rem; 
                    border-radius: 12px;
                    overflow-x: auto;
                }
                .prose code { 
                    color: var(--tertiary); 
                    background: rgba(127, 90, 240, 0.1); 
                    padding: 2px 4px; 
                    border-radius: 4px; 
                    font-family: monospace;
                }
                .dark-mode .prose code { background: rgba(44, 182, 125, 0.15); }

                /* Animations */
                .squares-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
                .square {
                    position: absolute; display: block;
                    width: 20px; height: 20px;
                    background: var(--square-color);
                    opacity: 0.15; /* Increased opacity */
                    animation: float 20s infinite linear;
                    bottom: -150px; border-radius: 20%;
                    transition: background-color 0.5s ease;
                }
                .square:nth-child(1) { left: 25%; width: 80px; height: 80px; animation-delay: 0s; }
                .square:nth-child(2) { left: 10%; width: 20px; height: 20px; animation-delay: 2s; animation-duration: 12s; }
                .square:nth-child(3) { left: 70%; width: 20px; height: 20px; animation-delay: 4s; }
                .square:nth-child(4) { left: 40%; width: 60px; height: 60px; animation-delay: 0s; animation-duration: 18s; }
                .square:nth-child(5) { left: 65%; width: 20px; height: 20px; animation-delay: 0s; }
                .square:nth-child(6) { left: 75%; width: 110px; height: 110px; animation-delay: 3s; }
                .square:nth-child(7) { left: 35%; width: 150px; height: 150px; animation-delay: 7s; }
                .square:nth-child(8) { left: 50%; width: 25px; height: 25px; animation-delay: 15s; animation-duration: 45s; }
                .square:nth-child(9) { left: 20%; width: 15px; height: 15px; animation-delay: 2s; animation-duration: 35s; }
                .square:nth-child(10) { left: 85%; width: 150px; height: 150px; animation-delay: 0s; animation-duration: 11s; }
                
                @keyframes float {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0.05; }
                    50% { opacity: 0.2; }
                    100% { transform: translateY(-1000px) rotate(720deg); opacity: 0; }
                }

                .tutorial-modal {
                    background: var(--card-bg);
                    border: 1px solid var(--stroke);
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                }
                
                /* ESTILO SIDEBAR */
                .feedback-sidebar {
                    background: var(--card-bg);
                    border-left: 1px solid var(--stroke);
                    box-shadow: -5px 0 25px rgba(0,0,0,0.1);
                }
                
                .overlay {
                    background: rgba(0,0,0,0.5);
                }

                .dot-flashing {
                    position: relative; width: 6px; height: 6px; border-radius: 5px; 
                    background-color: var(--button); color: var(--button);
                    animation: dot-flashing 1s infinite linear alternate; animation-delay: 0.5s;
                }
                .dot-flashing::before, .dot-flashing::after {
                    content: ""; display: inline-block; position: absolute; top: 0;
                    width: 6px; height: 6px; border-radius: 5px; 
                    background-color: var(--button); color: var(--button);
                    animation: dot-flashing 1s infinite alternate;
                }
                .dot-flashing::before { left: -10px; animation-delay: 0s; }
                .dot-flashing::after { left: 10px; animation-delay: 1s; }
                @keyframes dot-flashing { 0% { opacity: 1; } 50%, 100% { opacity: 0.2; } }
            `}</style>

      <Background />

      {/* WELCOME SCREEN */}
      {showWelcome && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="modal-container items-center justify-center text-center p-8 max-w-md w-full animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto" style={{ background: 'var(--stroke)', color: 'var(--highlight)' }}>
              <Bot size={40} />
            </div>
            <h1 className="text-3xl font-bold mb-3">{t.welcomeTitle}</h1>
            <p className="mb-8 opacity-80">{t.welcomeText}</p>
            <button onClick={handleStart} className="btn-primary px-8 py-3 rounded-xl font-semibold shadow-lg text-lg w-full sm:w-auto">
              {t.enterBtn}
            </button>
            <div className="mt-8 text-sm opacity-50 font-medium">
              {t.developedBy} <span style={{ color: 'var(--tertiary)' }}>nos planet</span>
            </div>
          </div>
        </div>
      )}

      {/* TUTORIAL MODAL */}
      {showTutorial && (
        <>
          <div className="absolute inset-0 z-40 bg-black/50 transition-opacity duration-300"></div>
          <div className="tutorial-modal z-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm rounded-2xl p-6 animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center mb-3" style={{ background: 'var(--secondary)', color: 'var(--highlight)' }}>
                <Key size={24} />
              </div>
              <h2 className="text-xl font-bold">{t.tutTitle}</h2>
            </div>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: 'var(--button)', color: 'var(--button-text)' }}>1</span>
                <p className="text-sm">{t.tutStep1}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: 'var(--button)', color: 'var(--button-text)' }}>2</span>
                <p className="text-sm">{t.tutStep2} <Settings size={14} className="inline ml-1" /></p>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: 'var(--button)', color: 'var(--button-text)' }}>3</span>
                <p className="text-sm">{t.tutStep3}</p>
              </div>
            </div>
            <button onClick={closeTutorial} className="btn-primary w-full py-3 rounded-xl font-bold">
              {t.tutBtn}
            </button>
          </div>
        </>
      )}

      {/* MAIN APP CONTAINER */}
      <div className={`modal-container w-[95%] max-w-[1000px] h-[90vh] max-h-[800px] rounded-3xl flex flex-col relative z-10 transition-all duration-300 ${showWelcome ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>

        {/* HEADER */}
        <header className="flex justify-between items-center p-5 border-b shrink-0" style={{ borderColor: 'var(--stroke)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--stroke)', color: 'var(--highlight)' }}>
              <Bot />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">{t.chatTitle}</h2>
              <p className="text-xs opacity-60 font-medium">{t.chatSubtitle}</p>
            </div>
          </div>
          <div className="flex gap-1 items-center">
            <button onClick={handleLikeToggle} className={`btn-icon px-2 py-1 flex items-center gap-1.5 ${isLiked ? 'active' : ''}`} title="Me gusta">
              <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
              <span className="text-xs font-bold font-mono">{likeCount}</span>
            </button>

            <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 opacity-50"></div>

            <button onClick={() => setLanguage(l => l === 'es' ? 'en' : 'es')} className="btn-icon p-2 font-bold text-xs">{language.toUpperCase()}</button>
            <button onClick={() => setDarkMode(!darkMode)} className="btn-icon p-2">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={handleClearChat} className="btn-icon p-2"><Trash2 size={20} /></button>
            <button onClick={() => setShowSettings(!showSettings)} className="btn-icon p-2" style={{ color: showSettings ? 'var(--highlight)' : '' }}><Settings size={20} /></button>

            <button onClick={() => setShowFeedback(true)} className="btn-icon p-2"><Mail size={20} /></button>
          </div>
        </header>

        {/* SETTINGS DRAWER */}
        <div className={`overflow-hidden transition-all duration-300 border-b shrink-0 ${showSettings ? 'max-h-80 opacity-100 p-5' : 'max-h-0 opacity-0 p-0 border-none'}`} style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--stroke)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold opacity-60 mb-1 block">{t.apiKeyLabel}</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => { setApiKey(e.target.value); localStorage.setItem('gemini_api_key', e.target.value); }}
                className="input-field w-full p-2 rounded-lg text-sm"
                placeholder="AIzaSy..."
              />
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-xs mt-1 underline opacity-70 hover:opacity-100 block text-right">Get API Key</a>
            </div>
            <div>
              <label className="text-xs font-bold opacity-60 mb-1 block">{t.modelLabel}</label>
              <div className="flex gap-2">
                <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="input-field flex-1 p-2 rounded-lg text-sm">
                  {availableModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <button onClick={fetchAvailableModels} className="btn-primary px-3 rounded-lg text-sm flex items-center gap-1">
                  {t.detectBtn} <RefreshCw size={14} />
                </button>
              </div>
              <span className="text-xs mt-1 block font-bold" style={{ color: 'var(--tertiary)' }}>{testMessage}</span>
            </div>
          </div>
          {/* SECCIÓN DE COLOR */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--stroke)' }}>
            <label className="text-xs font-bold opacity-60 mb-2 block flex items-center gap-1">
              <Palette size={14} /> {t.accentColorLabel}
            </label>
            <div className="flex gap-3 flex-wrap">
              {COLORS.map((color) => (
                <button
                  key={color.id}
                  onClick={() => handleColorChange(color.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${accentColor === color.value ? 'scale-110 ring-2 ring-offset-2 ring-[var(--headline)]' : ''}`}
                  style={{ backgroundColor: color.value, borderColor: 'transparent' }}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CHAT MESSAGES */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 relative">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1"
                style={{
                  background: msg.role === 'user' ? 'var(--button)' : 'var(--highlight)',
                  color: msg.role === 'user' ? 'var(--button-text)' : '#fff'
                }}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`p-4 rounded-2xl max-w-[80%] text-sm md:text-base shadow-sm ${msg.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'}`}
                style={{
                  background: msg.role === 'user' ? 'var(--button)' : 'var(--bg-color)',
                  color: msg.role === 'user' ? 'var(--button-text)' : 'var(--paragraph)',
                  border: msg.role === 'model' ? '1px solid var(--stroke)' : 'none'
                }}>
                {msg.role === 'model' ? (
                  <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={renderMarkdown(msg.text)} />
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--highlight)', color: '#fff' }}><Bot size={20} /></div>
              <div className="p-4 rounded-2xl rounded-tl-none border flex items-center h-12" style={{ borderColor: 'var(--stroke)', background: 'var(--bg-color)' }}>
                <div className="dot-flashing ml-2"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />

          {/* FLOATING FEEDBACK BUTTON (FAB) */}
          <button
            onClick={() => setShowFeedback(true)}
            className="absolute bottom-6 right-6 btn-primary p-3 rounded-full shadow-lg z-20 hover:scale-110 transition-transform"
            title={t.fabTooltip}
          >
            <MessageSquarePlus size={24} />
          </button>
        </div>

        {/* INPUT AREA */}
        <footer className="p-5 border-t shrink-0" style={{ borderColor: 'var(--stroke)' }}>
          <div className="relative flex items-end gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.inputPlaceholder}
              className="input-field w-full rounded-xl p-3 pr-12 resize-none shadow-sm text-sm transition-all"
              rows="1"
              style={{ minHeight: '48px', maxHeight: '120px' }}
              onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="btn-primary absolute right-2 bottom-2 p-2 rounded-lg shadow-md"
            >
              <Send size={20} />
            </button>
          </div>
        </footer>

        {/* FEEDBACK SIDEBAR (SLIDES FROM RIGHT) */}
        <div className={`overlay absolute inset-0 z-20 transition-opacity duration-300 ${showFeedback ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setShowFeedback(false)}></div>
        <div className={`feedback-sidebar absolute top-0 right-0 h-full w-full max-w-[320px] z-30 p-6 flex flex-col transition-transform duration-300 ${showFeedback ? 'translate-x-0 shadow-2xl' : 'translate-x-full invisible'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl">{t.feedbackTitle}</h3>
            <button onClick={() => setShowFeedback(false)} className="btn-icon p-1"><X size={24} /></button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <p className="text-sm mb-4 opacity-70 leading-relaxed">{t.feedbackSubtitle}</p>

            <input
              type="text"
              className="input-field w-full p-3 rounded-lg text-sm mb-3 outline-none focus:ring-2 focus:ring-[var(--highlight)] transition-all"
              placeholder={t.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              className="input-field w-full p-3 rounded-lg text-sm mb-3 outline-none focus:ring-2 focus:ring-[var(--highlight)] transition-all"
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <textarea
              className="input-field w-full h-32 p-3 rounded-lg resize-none mb-4 text-sm outline-none focus:ring-2 focus:ring-[var(--highlight)] transition-all"
              placeholder={t.commentPlaceholder}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>

            <button onClick={handleFeedbackSubmit} disabled={!comment.trim()} className="btn-primary w-full py-3 rounded-lg font-bold">
              {feedbackSent ? t.successFeedback : t.sendFeedback}
            </button>
          </div>
          <div className="mt-auto pt-4 text-center opacity-40 text-xs border-t" style={{ borderColor: 'var(--stroke)' }}>
            &copy; 2026 Nos Planet
          </div>
        </div>

      </div>
    </div>
  );
}

// --- APP WRAPPER PARA VITE ---
function App() {
  return <GeminiChat />;
}

export default App;