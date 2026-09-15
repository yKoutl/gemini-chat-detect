import React, { useRef, useEffect } from 'react';
import { User, Bot, MessageSquarePlus } from 'lucide-react';
import BotIcon from '../../assets/bot nos planet v2.png';
import { marked } from 'marked';
import Button from '../shared/Button';

const MessageList = ({ messages, isLoading, t, onOpenFeedback }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const renderMarkdown = (text) => {
        try { return { __html: marked.parse(text) }; }
        catch (e) { return { __html: text }; }
    };

    return (
        <div className="flex-1 overflow-y-auto p-5 space-y-6 relative">
            {messages.map((msg, i) => (
                <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center mt-1 overflow-hidden"
                        style={{
                            background: msg.role === 'user' ? 'var(--button)' : 'var(--highlight)',
                            color: msg.role === 'user' ? 'var(--button-text)' : '#fff'
                        }}>
                        {msg.role === 'user' ? <User size={20} /> : <img src={BotIcon} alt="Bot" className="w-full h-full object-cover" />}
                    </div>
                    <div className={`p-4 rounded-2xl max-w-[85%] text-sm md:text-base shadow-sm ${msg.role === 'user' ? 'rounded-tr-none' : 'rounded-tl-none'}`}
                        style={{
                            background: msg.role === 'user' ? 'var(--button)' : 'var(--bg-color)',
                            color: msg.role === 'user' ? 'var(--button-text)' : 'var(--paragraph)',
                            border: msg.role === 'model' ? '1px solid var(--stroke)' : 'none'
                        }}>
                        {msg.image && (
                            <div className="mb-2">
                                <span className="text-[10px] font-bold opacity-80 block mb-1">📄 Factura Adjunta:</span>
                                <img src={msg.image} alt="Factura adjunta" className="max-h-56 rounded-lg border border-black/10 object-contain shadow-sm bg-black/10 p-1" />
                            </div>
                        )}
                        {msg.role === 'model' ? (
                            <div className="prose prose-sm max-w-none overflow-x-auto" dangerouslySetInnerHTML={renderMarkdown(msg.text)} />
                        ) : (
                            <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        )}
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden" style={{ background: 'var(--highlight)', color: '#fff' }}>
                        <img src={BotIcon} alt="Bot" className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 rounded-2xl rounded-tl-none border flex items-center h-12" style={{ borderColor: 'var(--stroke)', background: 'var(--bg-color)' }}>
                        <div className="dot-flashing ml-2"></div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />

            {/* FLOATING FEEDBACK BUTTON (FAB) */}
            <Button
                onClick={onOpenFeedback}
                className="absolute bottom-6 right-6 p-3 rounded-full shadow-lg z-20 hover:scale-110 transition-transform"
                title={t.fabTooltip}
            >
                <MessageSquarePlus size={24} />
            </Button>
        </div>
    );
};

export default MessageList;
