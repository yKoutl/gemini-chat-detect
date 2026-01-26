import React from 'react';
import { Send } from 'lucide-react';
import Button from '../shared/Button';

const ChatInput = ({ input, onInputChange, onKeyDown, onSend, isLoading, placeholder }) => {
    return (
        <footer className="p-5 border-t shrink-0" style={{ borderColor: 'var(--stroke)' }}>
            <div className="relative flex items-end gap-3">
                <textarea
                    value={input}
                    onChange={onInputChange}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                    className="input-field w-full rounded-xl p-3 pr-12 resize-none shadow-sm text-sm transition-all"
                    rows="1"
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                    onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                />
                <Button
                    onClick={onSend}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 bottom-2 p-2 rounded-lg shadow-md"
                >
                    <Send size={20} />
                </Button>
            </div>
        </footer>
    );
};

export default ChatInput;
