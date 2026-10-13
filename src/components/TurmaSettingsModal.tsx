import React, { useState, useEffect } from 'react';
import { X, Settings, RotateCcw, Trash2, CheckCircle2, GraduationCap, Check } from 'lucide-react';
import { Turma } from '../types';
import { EmojiSelector } from './EmojiSelector';

interface TurmaSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  turma: Turma;
  onSaveTurma: (updatedTurma: Turma) => void;
  onResetData: () => void;
  onDeleteTurma?: (turmaId: string) => void;
  totalTurmasCount?: number;
  studentsInTurmaCount?: number;
}

export const TurmaSettingsModal: React.FC<TurmaSettingsModalProps> = ({
  isOpen,
  onClose,
  turma,
  onSaveTurma,
  onResetData,
  onDeleteTurma,
  totalTurmasCount = 1,
  studentsInTurmaCount = 0,
}) => {
  const [formData, setFormData] = useState<Turma>({ ...turma, starEmoji: turma?.starEmoji || '⭐' });

  useEffect(() => {
    if (turma) {
      setFormData({ ...turma, starEmoji: turma.starEmoji || '⭐' });
    }
  }, [turma, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSaveTurma({
      ...formData,
      name: formData.name.trim(),
      schoolName: formData.schoolName.trim() || 'Rincón Hispano',
      teacherName: formData.teacherName.trim() || 'Maestra Anne',
      monthlyGoal: Math.max(1, formData.monthlyGoal),
      monthlyRewardDescription: formData.monthlyRewardDescription.trim() || 'Certificado de Reconocimiento',
      starEmoji: formData.starEmoji || '⭐',
    });
    onClose();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleDelete = () => {
    if (totalTurmasCount <= 1) {
      alert('Debe tener al menos 1 clase registrada en el sistema.');
      return;
    }

    const confirmMsg = studentsInTurmaCount > 0
      ? `La clase "${turma.name}" tiene ${studentsInTurmaCount} alumno(s). ¿Realmente desea eliminar esta clase? Los alumnos asignados se eliminarán del mural.`
      : `¿Realmente desea eliminar la clase "${turma.name}"?`;

    if (window.confirm(confirmMsg)) {
      if (onDeleteTurma) {
        onDeleteTurma(turma.id);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-red-200 shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 bg-red-50/70 border-b border-red-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Editar Clase: {turma.name}</h3>
              <p className="text-xs text-slate-500">Modifique el nombre, profesor, meta o premio</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Nombre de la Clase
              </label>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 border border-slate-300 rounded text-slate-700 shadow-2xs font-bold">↵ Enter</kbd>
                <span>ou clique no botão para salvar</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onKeyDown={handleInputKeyDown}
                className="flex-1 text-sm font-semibold rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden text-slate-900 shadow-2xs"
                placeholder="Ej: Nivel 1 - Mañana"
                required
                autoFocus
              />
              <button
                type="button"
                onClick={handleSubmit}
                id="btn-save-class-name-inline"
                title="Haga clic aquí para salvar las alteraciones del nombre de la clase (o presione Enter)"
                className="px-3.5 py-2.5 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Check className="w-4 h-4 text-white" />
                <span>Salvar Alterações</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Escuela / Sede
              </label>
              <input
                type="text"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                onKeyDown={handleInputKeyDown}
                className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Nombre del Profesor(a)
              </label>
              <input
                type="text"
                value={formData.teacherName}
                onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                onKeyDown={handleInputKeyDown}
                className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden text-slate-900"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Meta del Mes (Stickers)
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={formData.monthlyGoal}
                onChange={(e) => setFormData({ ...formData, monthlyGoal: parseInt(e.target.value, 10) || 1 })}
                onKeyDown={handleInputKeyDown}
                className="w-full text-sm font-bold rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden text-slate-900"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Premio / Recompensa Prometida
              </label>
              <input
                type="text"
                placeholder="Ej: Certificado Destacado + Obsequio Especial"
                value={formData.monthlyRewardDescription}
                onChange={(e) => setFormData({ ...formData, monthlyRewardDescription: e.target.value })}
                onKeyDown={handleInputKeyDown}
                className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden text-slate-900"
                required
              />
            </div>
          </div>

          {/* Símbolo / Emoji da Estrela Customizável */}
          <div className="pt-2 border-t border-slate-100">
            <EmojiSelector
              selectedEmoji={formData.starEmoji || '⭐'}
              onSelectEmoji={(emoji) => setFormData({ ...formData, starEmoji: emoji })}
              title="Emoji de la Estrella / Recompensa de la Clase"
              description="Elija el emoji predeterminado de las actividades de esta clase (estrellita, trofeo, cohete o cualquier otro emoji)"
            />
          </div>

          {/* Delete Turma option if multiple turmas exist */}
          {onDeleteTurma && totalTurmasCount > 1 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleDelete}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar esta Clase ({turma.name})</span>
              </button>
            </div>
          )}

          {/* Reset / Demo restore & Save Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('¿Desea restaurar los datos de ejemplo iniciales de las clases?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar datos iniciales</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Guardar Clase</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
