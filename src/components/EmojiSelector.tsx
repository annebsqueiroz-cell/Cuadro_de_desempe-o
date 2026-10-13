import React, { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';

export const POPULAR_STAR_EMOJIS = [
  '⭐', '🌟', '✨', '💫', '🚀', '🏆', '🎖️', '🥇',
  '🎯', '🎨', '📚', '💖', '👏', '🌈', '👑', '🦄',
  '💎', '🔥', '💯', '🎈', '🦉', '🐾', '🍦', '🍕'
];

interface EmojiSelectorProps {
  selectedEmoji: string;
  onSelectEmoji: (emoji: string) => void;
  title?: string;
  description?: string;
}

export const EmojiSelector: React.FC<EmojiSelectorProps> = ({
  selectedEmoji,
  onSelectEmoji,
  title = 'Elija el Emoji de la Estrella / Recompensa',
  description = 'Seleccione uno de los modelos o escriba cualquier emoji de su teclado',
}) => {
  const [customInput, setCustomInput] = useState('');

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onSelectEmoji(customInput.trim());
      setCustomInput('');
    }
  };

  return (
    <div className="space-y-2.5">
      {(title || description) && (
        <div>
          {title && (
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              {title}
            </label>
          )}
          {description && (
            <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>
          )}
        </div>
      )}

      {/* Preset Emojis Grid */}
      <div className="grid grid-cols-8 sm:grid-cols-12 gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
        {POPULAR_STAR_EMOJIS.map((emoji) => {
          const isSelected = selectedEmoji === emoji;
          return (
            <button
              key={emoji}
              type="button"
              onClick={() => onSelectEmoji(emoji)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all transform hover:scale-120 active:scale-95 cursor-pointer relative ${
                isSelected
                  ? 'bg-red-100 ring-2 ring-red-600 shadow-xs'
                  : 'bg-white hover:bg-slate-100 border border-slate-200/80 shadow-2xs'
              }`}
              title={`Seleccionar ${emoji}`}
            >
              <span>{emoji}</span>
              {isSelected && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-600 text-white flex items-center justify-center text-[8px]">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Custom Emoji Input */}
      <form onSubmit={handleApplyCustom} className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Escriba o pegue CUALQUIER emoji aquí (ej: 🦊, ⚡, 🌺)..."
            className="w-full text-xs rounded-xl border border-slate-300 p-2 pr-8 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden text-slate-900"
            maxLength={10}
          />
          {customInput.trim() && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm pointer-events-none">
              {customInput.trim()}
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={!customInput.trim()}
          className="px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
        >
          Usar Emoji
        </button>
      </form>

      {/* Current Selection Highlight */}
      <div className="flex items-center justify-between px-2.5 py-1.5 bg-red-50/70 border border-red-200 rounded-xl text-xs">
        <span className="text-slate-600 font-medium">Emoji actualmente en uso:</span>
        <span className="font-bold text-red-700 flex items-center gap-1.5 text-sm">
          <span className="text-lg">{selectedEmoji}</span>
          <span className="text-xs font-semibold">({selectedEmoji})</span>
        </span>
      </div>
    </div>
  );
};
