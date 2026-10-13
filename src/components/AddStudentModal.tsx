import React, { useState, useEffect } from 'react';
import { X, UserPlus, Plus } from 'lucide-react';
import { Turma } from '../types';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  turmas: Turma[];
  defaultTurmaId?: string;
  onAddStudent: (name: string, turmaId: string) => void;
  onOpenCreateTurma?: () => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
  turmas,
  defaultTurmaId,
  onAddStudent,
  onOpenCreateTurma,
}) => {
  const [name, setName] = useState('');
  const [selectedTurmaId, setSelectedTurmaId] = useState<string>(() => {
    return defaultTurmaId || turmas[0]?.id || '';
  });

  useEffect(() => {
    if (defaultTurmaId && defaultTurmaId !== 'all') {
      setSelectedTurmaId(defaultTurmaId);
    } else if (turmas[0]?.id) {
      setSelectedTurmaId(turmas[0].id);
    }
  }, [defaultTurmaId, turmas, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !selectedTurmaId) return;
    onAddStudent(name.trim(), selectedTurmaId);
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-red-200 shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-5 bg-red-50/70 border-b border-red-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-bold text-slate-900">Añadir Nuevo Alumno</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label htmlFor="input-new-student-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Nombre Completo del Alumno(a)
            </label>
            <input
              id="input-new-student-name"
              type="text"
              placeholder="Ej: Sofía Morales, Carlos Gómez..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden text-slate-900"
              autoFocus
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="select-student-turma" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Clase / Grupo
              </label>
              {onOpenCreateTurma && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCreateTurma();
                  }}
                  className="text-xs font-bold text-red-700 hover:text-red-800 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Nueva Clase</span>
                </button>
              )}
            </div>
            <select
              id="select-student-turma"
              value={selectedTurmaId}
              onChange={(e) => setSelectedTurmaId(e.target.value)}
              className="w-full text-sm font-medium rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden text-slate-900 cursor-pointer"
              required
            >
              {turmas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.schoolName})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              El alumno aparecerá directamente en la tabla correspondiente a esta clase.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              id="btn-confirm-add-student"
              type="submit"
              className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              Añadir a la Clase
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
