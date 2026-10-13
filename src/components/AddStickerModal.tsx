import React, { useState, useEffect } from 'react';
import { X, Sparkles, Plus, Check } from 'lucide-react';
import { Student, StickerOption, Turma } from '../types';
import { AVAILABLE_STICKERS, QUICK_ACTIVITY_SUGGESTIONS } from '../data/stickers';

interface AddStickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  turmas?: Turma[];
  initialStudentId?: string;
  onAddSticker: (studentId: string, emoji: string, label: string, activityTitle: string) => void;
}

export const AddStickerModal: React.FC<AddStickerModalProps> = ({
  isOpen,
  onClose,
  students,
  turmas,
  initialStudentId,
  onAddSticker,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('⭐');
  const [selectedLabel, setSelectedLabel] = useState<string>('Estrella Dorada');
  const [activityTitle, setActivityTitle] = useState<string>('');
  const [customEmojiInput, setCustomEmojiInput] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<'todos' | 'estrellas' | 'actividades' | 'logros' | 'elogios'>('todos');

  useEffect(() => {
    if (initialStudentId) {
      setSelectedStudentId(initialStudentId);
    } else if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }
  }, [initialStudentId, students]);

  if (!isOpen) return null;

  const filteredStickers = activeCategory === 'todos' 
    ? AVAILABLE_STICKERS 
    : AVAILABLE_STICKERS.filter(s => s.category === activeCategory);

  const handleSelectSticker = (stk: StickerOption) => {
    setSelectedEmoji(stk.emoji);
    setSelectedLabel(stk.label);
  };

  const handleApplyCustomEmoji = () => {
    if (customEmojiInput.trim()) {
      setSelectedEmoji(customEmojiInput.trim());
      setSelectedLabel('Sticker Personalizado');
      setCustomEmojiInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;

    const finalTitle = activityTitle.trim() || 'Actividad Entregada';
    onAddSticker(selectedStudentId, selectedEmoji, selectedLabel, finalTitle);
    setActivityTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-red-200 shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-red-50/70 border-b border-red-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedEmoji}</span>
            <div>
              <h3 className="text-base font-bold text-slate-900">Registrar Estrellita / Sticker</h3>
              <p className="text-xs text-slate-500">Reconozca la entrega de actividades del alumno</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Select Student */}
          <div>
            <label htmlFor="select-modal-student" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Alumno(a)
            </label>
            <select
              id="select-modal-student"
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full text-sm font-semibold rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              required
            >
              {turmas && turmas.length > 0 ? (
                turmas.map((t) => {
                  const turmaStudents = students.filter((s) => s.turmaId === t.id);
                  if (turmaStudents.length === 0) return null;
                  return (
                    <optgroup key={t.id} label={`${t.name} (${t.schoolName})`}>
                      {turmaStudents.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name}
                        </option>
                      ))}
                    </optgroup>
                  );
                })
              ) : (
                students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Emoji / Sticker Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Elija el Emoji / Sticker
              </span>
              <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                Seleccionado: {selectedEmoji} {selectedLabel}
              </span>
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-100 text-xs">
              {(['todos', 'estrellas', 'actividades', 'logros', 'elogios'] as const).map((cat) => {
                const categoryLabels: Record<string, string> = {
                  todos: 'Todos',
                  estrellas: 'Estrellas',
                  actividades: 'Actividades',
                  logros: 'Logros',
                  elogios: 'Elogios',
                };
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-colors shrink-0 ${
                      activeCategory === cat
                        ? 'bg-red-600 text-white font-bold'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {categoryLabels[cat] || cat}
                  </button>
                );
              })}
            </div>

            {/* Sticker Grid */}
            <div className="grid grid-cols-5 gap-2 mt-3 max-h-36 overflow-y-auto p-1">
              {filteredStickers.map((stk) => {
                const isSelected = selectedEmoji === stk.emoji && selectedLabel === stk.label;
                return (
                  <button
                    key={`${stk.emoji}-${stk.label}`}
                    type="button"
                    onClick={() => handleSelectSticker(stk)}
                    className={`h-11 rounded-xl flex items-center justify-center text-xl transition-all relative ${
                      isSelected
                        ? 'bg-red-50 border-2 border-red-600 scale-105 shadow-xs'
                        : 'bg-slate-50 hover:bg-red-50/50 border border-slate-200 hover:border-red-300'
                    }`}
                    title={stk.label}
                  >
                    <span>{stk.emoji}</span>
                    {isSelected && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Emoji Input */}
            <div className="mt-2.5 flex items-center gap-2">
              <input
                type="text"
                maxLength={4}
                placeholder="Otro emoji (ej: 🥇, 🎈, 🐱)"
                value={customEmojiInput}
                onChange={(e) => setCustomEmojiInput(e.target.value)}
                className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-red-500 w-44"
              />
              <button
                type="button"
                onClick={handleApplyCustomEmoji}
                disabled={!customEmojiInput.trim()}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-semibold text-slate-700 disabled:opacity-40 transition-colors"
              >
                Usar este
              </button>
            </div>
          </div>

          {/* Activity Description */}
          <div>
            <label htmlFor="input-activity-title" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Nombre de la Actividad o Motivo
            </label>
            <input
              id="input-activity-title"
              type="text"
              placeholder="Ej: Lección de Español, Lectura, Diálogo, Vocabulario..."
              value={activityTitle}
              onChange={(e) => setActivityTitle(e.target.value)}
              className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden text-slate-900"
            />

            {/* Quick suggestions chips */}
            <div className="mt-2">
              <span className="text-[11px] text-slate-400 block mb-1">Sugerencias rápidas:</span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_ACTIVITY_SUGGESTIONS.slice(0, 6).map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setActivityTitle(sug)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-red-50 hover:bg-red-100 text-red-900 border border-red-200 transition-colors"
                  >
                    + {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              id="btn-confirm-add-sticker"
              type="submit"
              className="px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-600/20 transition-all flex items-center gap-1.5 transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>¡Fijar en el Cuadro!</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
