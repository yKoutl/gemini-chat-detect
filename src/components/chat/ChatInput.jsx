import React, { useRef } from 'react';
import { Send, FileText, X } from 'lucide-react';
import Button from '../shared/Button';

const ChatInput = ({ input, onInputChange, onKeyDown, onSend, isLoading, placeholder, selectedImage, onImageSelect, onImageRemove, t }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result;
            const base64Data = result.split(',')[1];
            onImageSelect({
                file,
                name: file.name,
                mimeType: file.type || 'image/jpeg',
                preview: result,
                base64: base64Data
            });
        };
        reader.readAsDataURL(file);
    };

    return (
        <footer className="p-4 border-t shrink-0 flex flex-col gap-2" style={{ borderColor: 'var(--stroke)' }}>
            {/* Vista Previa de Imagen de Factura Adjunta */}
            {selectedImage && (
                <div className="flex items-center gap-2 bg-slate-500/10 p-2 rounded-xl border border-[var(--stroke)] w-fit max-w-full animate-in fade-in duration-200">
                    <img src={selectedImage.preview} alt="Factura adjunta" className="w-10 h-10 object-cover rounded-lg border border-[var(--stroke)]" />
                    <div className="text-xs truncate max-w-[200px]">
                        <span className="font-bold block truncate">{selectedImage.name}</span>
                        <span className="text-[10px] opacity-70">📄 Imagen de Factura Lista</span>
                    </div>
                    <button type="button" onClick={onImageRemove} className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors ml-1">
                        <X size={16} />
                    </button>
                </div>
            )}

            <div className="relative flex items-center gap-2">
                {/* Input de archivo oculto */}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                />

                {/* Botón para Adjuntar Imagen de Factura */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 rounded-xl border border-[var(--stroke)] hover:bg-slate-500/10 transition-all flex items-center justify-center text-xs font-bold gap-1.5 shrink-0"
                    title={t?.uploadInvoiceBtn || "Subir Factura"}
                    style={{ color: 'var(--paragraph)' }}
                >
                    <FileText size={18} style={{ color: 'var(--button)' }} />
                    <span className="hidden sm:inline">{t?.uploadInvoiceBtn || "Subir Factura"}</span>
                </button>

                <div className="relative flex-1 flex items-center">
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
                        disabled={(!input.trim() && !selectedImage) || isLoading}
                        className="absolute right-2 p-2 rounded-lg shadow-md"
                    >
                        <Send size={18} />
                    </Button>
                </div>
            </div>
        </footer>
    );
};

export default ChatInput;
