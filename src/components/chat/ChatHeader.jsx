import React from 'react';
import { Bot, Heart, Sun, Moon, Trash2, Settings, Mail } from 'lucide-react';
import Button from '../shared/Button';

const ChatHeader = ({
    t,
    isLiked,
    likeCount,
    onLikeToggle,
    language,
    onLanguageToggle,
    darkMode,
    onThemeToggle,
    onClearChat,
    showSettings,
    onSettingsToggle,
    onFeedbackOpen
}) => {
    return (
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
                <Button onClick={onLikeToggle} variant="icon" className={`px-2 py-1 flex items-center gap-1.5 ${isLiked ? 'active' : ''}`} title="Me gusta">
                    <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                    <span className="text-xs font-bold font-mono">{likeCount}</span>
                </Button>

                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1 opacity-50"></div>

                <Button onClick={onLanguageToggle} variant="icon" className="p-2 font-bold text-xs">{language.toUpperCase()}</Button>
                <Button onClick={onThemeToggle} variant="icon" className="p-2">
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </Button>
                <Button onClick={onClearChat} variant="icon" className="p-2"><Trash2 size={20} /></Button>
                <Button onClick={onSettingsToggle} variant="icon" className="p-2" style={{ color: showSettings ? 'var(--highlight)' : '' }}><Settings size={20} /></Button>

                <Button onClick={onFeedbackOpen} variant="icon" className="p-2"><Mail size={20} /></Button>
            </div>
        </header>
    );
};

export default ChatHeader;
