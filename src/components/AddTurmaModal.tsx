import React, { useState } from 'react';
import { X, GraduationCap, Sparkles } from 'lucide-react';
import { Turma } from '../types';
import { EmojiSelector } from './EmojiSelector';

interface AddTurmaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTurma: (newTurma: Omit<Turma, 'id'>) => void;
  defaultSchoolName?: string;
  defaultTeacherName?: string;
}

export const AddTurmaModal: React.FC<AddTurmaModalProps> = ({
  isOpen,
  onClose,
  onAddTurma,
  defaultSchoolName = 'Rincón Hispano',
  defaultTeacherName = 'Maestra Anne',
}) => {
  const [name, setName] = useState('');
  const [teacherName, setTeacherName] = useState(defaultTeacherName);
  const [schoolName, setSchoolName] = useState(defaultSchoolName);
  const [monthlyGoal, setMonthlyGoal] = useState(8);
  const [monthlyRewardDescription, setMonthlyRewardDescription] = useState('Certificado de Honor + Obsequio Rincón Hispano');
  const [starEmoji, setStarEmoji] = useState('⭐');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddTurma({
      name: name.trim(),
      teacherName: teacherName.trim() || 'Maestra Anne',
      schoolName: schoolName.trim() || 'Rincón Hispano',
      monthlyGoal: Math.max(1, monthlyGoal),
      monthlyRewardDescription: monthlyRewardDescription.trim() || 'Certificado de Reconocimiento',
      starEmoji: starEmoji || '⭐',
    });

    setName('');
    setStarEmoji('⭐');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-red-200 shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-5 bg-red-50/70 border-b border-red-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-bold text-slate-900">Crear Nueva Clase</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label htmlFor="input-new-turma-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Nombre de la Clase
            </label>
            <input
              id="input-new-turma-name"
              type="text"
              placeholder="Ej: Nivel 1 - Mañana, Nivel 2 - Tarde, Kids..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden text-slate-900"
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="input-new-turma-school" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Escuela / Sede
              </label>
              <input
                id="input-new-turma-school"
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full text-sm rounded-xl border border-slate-300 p-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden text-slate-900"
                required
              />
            </div>

            <div>
              <label htmlFor="input-new-turma-teacher" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Profesor(a)
              </label>
              <input
                id="input-new-turma-teacher"
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full text-sm rounded-xl border border-slate-300 p-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden text-slate-900"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="input-new-turma-goal" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Meta Mensual (número de stickers/actividades)
            </label>
            <input
              id="input-new-turma-goal"
              type="number"
              min={1}
              max={50}
              value={monthlyGoal}
              onChange={(e) => setMonthlyGoal(parseInt(e.target.value, 10) || 1)}
              className="w-full text-sm font-bold rounded-xl border border-slate-300 p-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden text-slate-900"
              required
            />
          </div>

          <div>
            <label htmlFor="input-new-turma-reward" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Premio de la Clase en el Mes
            </label>
            <input
              id="input-new-turma-reward"
              type="text"
              placeholder="Ej: Certificado Destacado + Obsequio Especial"
              value={monthlyRewardDescription}
              onChange={(e) => setMonthlyRewardDescription(e.target.value)}
              className="w-full text-sm rounded-xl border border-slate-300 p-2 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden text-slate-900"
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <EmojiSelector
              selectedEmoji={starEmoji}
              onSelectEmoji={setStarEmoji}
              title="Emoji de la Estrella / Recompensa de la Clase"
              description="Elija el emoji predeterminado de las actividades (estrellita, trofeo, etc.)"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              id="btn-confirm-add-turma"
              type="submit"
              className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Registrar Clase</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
