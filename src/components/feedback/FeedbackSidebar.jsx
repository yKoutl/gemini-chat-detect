import React from 'react';
import { X } from 'lucide-react';
import Button from '../shared/Button';
import Input from '../shared/Input';

const FeedbackSidebar = ({ show, t, onClose, name, onNameChange, email, onEmailChange, comment, onCommentChange, onSubmit, feedbackSent }) => {
    return (
        <>
            <div className={`overlay absolute inset-0 z-20 transition-opacity duration-300 ${show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
            <div className={`feedback-sidebar absolute top-0 right-0 h-full w-full max-w-[320px] z-30 p-6 flex flex-col transition-transform duration-300 ${show ? 'translate-x-0 shadow-2xl' : 'translate-x-full invisible'}`}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl">{t.feedbackTitle}</h3>
                    <Button onClick={onClose} variant="icon" className="p-1"><X size={24} /></Button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <p className="text-sm mb-4 opacity-70 leading-relaxed">{t.feedbackSubtitle}</p>

                    <Input
                        type="text"
                        className="p-3"
                        placeholder={t.namePlaceholder}
                        value={name}
                        onChange={onNameChange}
                    />
                    <Input
                        type="email"
                        className="p-3"
                        placeholder={t.emailPlaceholder}
                        value={email}
                        onChange={onEmailChange}
                    />

                    <Input
                        isTextArea
                        className="h-32 p-3 resize-none mb-4"
                        placeholder={t.commentPlaceholder}
                        value={comment}
                        onChange={onCommentChange}
                    />

                    <Button onClick={onSubmit} disabled={!comment.trim()} className="w-full py-3 rounded-lg font-bold">
                        {feedbackSent ? t.successFeedback : t.sendFeedback}
                    </Button>
                </div>
                <div className="mt-auto pt-4 text-center opacity-40 text-xs border-t" style={{ borderColor: 'var(--stroke)' }}>
                    &copy; 2026 Nos Planet
                </div>
            </div>
        </>
    );
};

export default FeedbackSidebar;
