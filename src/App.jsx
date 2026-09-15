import React, { useState, useEffect } from 'react';
import { Bot, Key, Settings } from 'lucide-react';
import BotIcon from './assets/bot nos planet v2.png';

// Components
import Button from './components/shared/Button';
import Modal from './components/shared/Modal';
import Card from './components/shared/Card';
import Background from './components/layout/Background';

import ChatHeader from './components/chat/ChatHeader';
import MessageList from './components/chat/MessageList';
import ChatInput from './components/chat/ChatInput';

import SettingsDrawer from './components/settings/SettingsDrawer';
import FeedbackSidebar from './components/feedback/FeedbackSidebar';

// Constants
import { TRANSLATIONS } from './constants/translations';

// Initial Message
const INITIAL_MSG = { role: 'model', text: '👋 ¡Hola! Soy Gemini. Configura tu API Key para empezar.' };

function GeminiChat() {
  // --- STATE MANAGEMENT ---

  // UI States
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('es');
  const t = TRANSLATIONS[language];
  const [accentColor, setAccentColor] = useState('#10B981');

  // Feedback & Likes
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ name: '', email: '', comment: '' });
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(342);

  // Chat & API
  const [messages, setMessages] = useState([INITIAL_MSG]);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [availableModels, setAvailableModels] = useState([
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash (Recomendado)' },
    { id: 'gemini-1.5-flash-latest', name: 'Gemini 1.5 Flash (Latest)' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' }
  ]);
  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash');
  const [showSettings, setShowSettings] = useState(false);
  const [testMessage, setTestMessage] = useState('');

  // --- EFFECTS ---
  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) setApiKey(storedKey);

    const storedColor = localStorage.getItem('gemini_accent_color');
    if (storedColor) setAccentColor(storedColor);

    const storedLiked = localStorage.getItem('chat_liked') === 'true';
    const storedCount = parseInt(localStorage.getItem('chat_like_count') || '342', 10);
    setIsLiked(storedLiked);
    setLikeCount(storedCount);
  }, []);

  useEffect(() => {
    localStorage.setItem('chat_liked', isLiked);
    localStorage.setItem('chat_like_count', likeCount);
  }, [isLiked, likeCount]);

  // Sync Dark Mode to Body for consistent background
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // --- HANDLERS ---
  const handleStart = () => { setShowWelcome(false); setShowTutorial(true); };
  const closeTutorial = () => { setShowTutorial(false); setShowSettings(true); };

  const handleColorChange = (color) => {
    setAccentColor(color);
    localStorage.setItem('gemini_accent_color', color);
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackData.comment.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setFeedbackData({ name: '', email: '', comment: '' });
      setShowFeedback(false);
    }, 1500);
  };

  const handleLikeToggle = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikeCount(prev => prev + 1);
      setIsLiked(true);
    }
  };

  const confirmClearChat = () => {
    setMessages([INITIAL_MSG]);
    setShowDeleteConfirm(false);
  };

  const fetchAvailableModels = async () => {
    const cleanKey = apiKey.trim();
    if (!cleanKey) { setTestMessage(t.errorKey); return; }
    setTestMessage('Detectando...');
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`);
      const data = await response.json();
      if (!response.ok) {
        if (data.error?.reason === 'SERVICE_DISABLED' || data.error?.message?.includes('disabled')) {
          throw new Error('⚠️ API deshabilitada en Google Cloud Console');
        }
        if (data.error?.reason === 'API_KEY_SERVICE_BLOCKED' || data.error?.message?.includes('blocked')) {
          throw new Error('⚠️ Método ListModels bloqueado en tu API Key');
        }
        throw new Error(data.error?.message || 'Error de conexión');
      }

      const validModels = data.models?.filter(m => m.supportedGenerationMethods.includes('generateContent'))
        .map(m => ({ id: m.name.replace('models/', ''), name: m.displayName }));

      if (validModels?.length) {
        setAvailableModels(validModels);
        const preferred = validModels.find(m => m.id === 'gemini-3.6-flash') ||
                          validModels.find(m => m.id === 'gemini-2.0-flash') ||
                          validModels.find(m => m.id === 'gemini-1.5-flash-latest') ||
                          validModels[0];
        if (preferred) setSelectedModel(preferred.id);
        setTestMessage(`✓ ${validModels.length} modelos detectados`);
      } else { throw new Error(t.errorModel); }
    } catch (error) { setTestMessage(error.message || 'Error'); }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;
    const cleanKey = apiKey.trim();
    if (!cleanKey) { setShowSettings(true); return; }

    const defaultInvoicePrompt = "Analiza detenidamente esta imagen de factura o comprobante de pago. Extrae y organiza toda la información relevante en una tabla estructurada en Markdown: RUC/DNI, Emisor/Razón Social, N° de Comprobante, Fecha de Emisión, Detalle de Productos/Servicios (Descripción, Cantidad, Precio Unitario, Subtotal), IGV y Total General.";
    const userPromptText = input.trim() || (selectedImage ? defaultInvoicePrompt : '');

    const userMessage = { 
      role: 'user', 
      text: userPromptText,
      image: selectedImage ? selectedImage.preview : null 
    };

    const imageToProcess = selectedImage;
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const history = messages.slice(-10).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const currentParts = [];
      if (imageToProcess) {
        currentParts.push({
          inlineData: {
            mimeType: imageToProcess.mimeType,
            data: imageToProcess.base64
          }
        });
      }
      currentParts.push({ text: userPromptText });

      const payload = {
        contents: [...history, { role: 'user', parts: currentParts }],
        systemInstruction: { parts: [{ text: t.systemRole }] }
      };

      let response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${cleanKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': cleanKey
        },
        body: JSON.stringify(payload)
      });

      let data = await response.json();

      // Reintento automático si el modelo seleccionado no existe, está descontinuado o saturado
      if (!response.ok && (
        data.error?.message?.includes('not found') ||
        data.error?.message?.includes('not supported') ||
        data.error?.message?.includes('high demand') ||
        data.error?.message?.includes('no longer available') ||
        response.status === 503 ||
        response.status === 429
      )) {
        const fallbackModel = selectedModel === 'gemini-2.0-flash' ? 'gemini-1.5-flash-latest' : 'gemini-2.0-flash';
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${fallbackModel}:generateContent?key=${cleanKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': cleanKey
          },
          body: JSON.stringify(payload)
        });
        data = await response.json();
      }

      if (!response.ok) {
        if (data.error?.reason === 'SERVICE_DISABLED' || data.error?.message?.includes('disabled')) {
          throw new Error('La API de Gemini está deshabilitada en tu proyecto de Google Cloud. Habilítala desde Google Cloud Console.');
        }
        if (data.error?.message?.includes('high demand')) {
          throw new Error('El modelo está experimentando alta demanda. Intenta de nuevo en unos segundos.');
        }
        throw new Error(data.error?.message || 'Error en la petición');
      }

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
      <Background />

      {/* --- MODALS --- */}

      {/* Welcome Screen */}
      {showWelcome && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="modal-container items-center justify-center text-center p-8 max-w-md w-full animate-in fade-in zoom-in duration-300 rounded-2xl">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 mx-auto overflow-hidden border-2 border-[var(--stroke)]">
              <img src={BotIcon} alt="Bot" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-bold mb-3">{t.welcomeTitle}</h1>
            <p className="mb-8 opacity-80">{t.welcomeText}</p>
            <Button onClick={handleStart} className="px-8 py-3 rounded-xl font-semibold shadow-lg text-lg w-full sm:w-auto">
              {t.enterBtn}
            </Button>
            <div className="mt-8 text-sm opacity-50 font-medium">
              {t.developedBy} <span style={{ color: 'var(--tertiary)' }}>nos planet</span>
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Modal */}
      <Modal isOpen={showTutorial} onClose={closeTutorial} className="max-w-sm p-6">
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
        <Button onClick={closeTutorial} className="w-full py-3 rounded-xl font-bold">
          {t.tutBtn}
        </Button>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Eliminar conversación" className="max-w-sm p-4">
        <p className="mb-6 opacity-80">¿Estás seguro de que deseas borrar todo el historial? Esta acción no se puede deshacer.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded-lg">Cancelar</Button>
          <Button onClick={confirmClearChat} className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white">Eliminar</Button>
        </div>
      </Modal>

      {/* --- MAIN APP CONTAINER --- */}
      <Card className={`w-[95%] max-w-[1000px] h-[90vh] max-h-[800px] transition-all duration-300 ${showWelcome ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`} noPadding>

        <ChatHeader
          t={t}
          isLiked={isLiked}
          likeCount={likeCount}
          onLikeToggle={handleLikeToggle}
          language={language}
          onLanguageToggle={() => setLanguage(l => l === 'es' ? 'en' : 'es')}
          darkMode={darkMode}
          onThemeToggle={() => setDarkMode(!darkMode)}
          onClearChat={() => setShowDeleteConfirm(true)}
          showSettings={showSettings}
          onSettingsToggle={() => setShowSettings(!showSettings)}
          onFeedbackOpen={() => setShowFeedback(true)}
        />

        <SettingsDrawer
          show={showSettings}
          t={t}
          apiKey={apiKey}
          onApiKeyChange={(e) => { setApiKey(e.target.value); localStorage.setItem('gemini_api_key', e.target.value); }}
          availableModels={availableModels}
          selectedModel={selectedModel}
          onModelSelect={(e) => setSelectedModel(e.target.value)}
          onFetchModels={fetchAvailableModels}
          testMessage={testMessage}
          accentColor={accentColor}
          onColorChange={handleColorChange}
        />

        <MessageList
          messages={messages}
          isLoading={isLoading}
          t={t}
          onOpenFeedback={() => setShowFeedback(true)}
        />

        <ChatInput
          input={input}
          onInputChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onSend={handleSend}
          isLoading={isLoading}
          placeholder={t.inputPlaceholder}
          selectedImage={selectedImage}
          onImageSelect={setSelectedImage}
          onImageRemove={() => setSelectedImage(null)}
          t={t}
        />

        <FeedbackSidebar
          show={showFeedback}
          t={t}
          onClose={() => setShowFeedback(false)}
          name={feedbackData.name}
          onNameChange={(e) => setFeedbackData({ ...feedbackData, name: e.target.value })}
          email={feedbackData.email}
          onEmailChange={(e) => setFeedbackData({ ...feedbackData, email: e.target.value })}
          comment={feedbackData.comment}
          onCommentChange={(e) => setFeedbackData({ ...feedbackData, comment: e.target.value })}
          onSubmit={handleFeedbackSubmit}
          feedbackSent={feedbackSent}
        />

      </Card>
    </div>
  );
}

function App() {
  return <GeminiChat />;
}

export default App;