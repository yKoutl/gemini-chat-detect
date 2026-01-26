import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />
            <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none`}>
                <div
                    className={`
            pointer-events-auto
            modal-container w-full
            rounded-2xl shadow-2xl 
            transform transition-all
            animate-in zoom-in-95 fade-in duration-200
            ${className}
          `}
                >
                    {title && (
                        <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: 'var(--stroke)' }}>
                            <h3 className="text-lg font-bold">{title}</h3>
                            <Button onClick={onClose} variant="icon" className="p-1">
                                <X size={20} />
                            </Button>
                        </div>
                    )}

                    <div className="p-0">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal;
