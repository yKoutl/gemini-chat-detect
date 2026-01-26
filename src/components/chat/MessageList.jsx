import React, { useRef, useEffect } from 'react';
import { User, Bot, MessageSquarePlus } from 'lucide-react';
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
