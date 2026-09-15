import React from 'react';
import { RefreshCw, Palette } from 'lucide-react';
import Button from '../shared/Button';
import Input from '../shared/Input';
import { COLORS } from '../../constants/colors';

const SettingsDrawer = ({
    show,
    t,
    apiKey,
    onApiKeyChange,
    availableModels,
    selectedModel,
    onModelSelect,
    onFetchModels,
    testMessage,
    accentColor,
    onColorChange
}) => {
    return (
        <div className={`overflow-hidden transition-all duration-300 border-b shrink-0 ${show ? 'max-h-80 opacity-100 p-5' : 'max-h-0 opacity-0 p-0 border-none'}`} style={{ backgroundColor: 'var(--bg-color)', borderColor: 'var(--stroke)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold opacity-60 mb-1 block">{t.apiKeyLabel}</label>
                    <Input
                        type="password"
                        value={apiKey}
                        onChange={onApiKeyChange}
                        className="p-2"
                        placeholder="AIzaSy... o AQ.Ab..."
                    />
                    <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-xs mt-1 underline opacity-70 hover:opacity-100 block text-right">Get API Key</a>
                </div>
                <div>
                    <label className="text-xs font-bold opacity-60 mb-1 block">{t.modelLabel}</label>
                    <div className="flex gap-2">
                        <select value={selectedModel} onChange={onModelSelect} className="input-field flex-1 p-2 rounded-lg text-sm">
                            {availableModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                        </select>
                        <Button onClick={onFetchModels} className="px-3 rounded-lg text-sm flex items-center gap-1">
                            {t.detectBtn} <RefreshCw size={14} />
                        </Button>
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
                            onClick={() => onColorChange(color.value)}
                            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${accentColor === color.value ? 'scale-110 ring-2 ring-offset-2 ring-[var(--headline)]' : ''}`}
                            style={{ backgroundColor: color.value, borderColor: 'transparent' }}
                            title={color.label}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SettingsDrawer;
