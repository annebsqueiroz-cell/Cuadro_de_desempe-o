import React, { useState, useEffect } from 'react';
import { X, UserCheck, Trash2, School, Palette } from 'lucide-react';
import { Student, Turma } from '../types';

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  turmas: Turma[];
  onSaveStudent: (updatedStudent: Student) => void;
  onDeleteStudent?: (studentId: string) => void;
}

const AVATAR_COLOR_PALETTES = [
  { label: 'Rosa', value: 'bg-rose-100 text-rose-700 border-rose-200', preview: 'bg-rose-500' },
  { label: 'Celeste / Azul', value: 'bg-sky-100 text-sky-700 border-sky-200', preview: 'bg-sky-500' },
  { label: 'Verde', value: 'bg-emerald-100 text-emerald-700 border-emerald-200', preview: 'bg-emerald-500' },
  { label: 'Ámbar / Amarillo', value: 'bg-amber-100 text-amber-700 border-amber-200', preview: 'bg-amber-500' },
  { label: 'Púrpura', value: 'bg-purple-100 text-purple-700 border-purple-200', preview: 'bg-purple-500' },
  { label: 'Verde Azulado', value: 'bg-teal-100 text-teal-700 border-teal-200', preview: 'bg-teal-500' },
  { label: 'Índigo / Violeta', value: 'bg-indigo-100 text-indigo-700 border-indigo-200', preview: 'bg-indigo-500' },
  { label: 'Naranja', value: 'bg-orange-100 text-orange-700 border-orange-200', preview: 'bg-orange-500' },
];

export const EditStudentModal: React.FC<EditStudentModalProps> = ({
  isOpen,
  onClose,
  student,
  turmas,
  onSaveStudent,
  onDeleteStudent,
}) => {
  const [name, setName] = useState('');
  const [turmaId, setTurmaId] = useState('');
  const [avatarColor, setAvatarColor] = useState('');
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (student) {
      setName(student.name);
      setTurmaId(student.turmaId);
      setAvatarColor(student.avatarColor);
      setActive(student.active);
    }
  }, [student, isOpen]);

  if (!isOpen || !student) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !turmaId) return;

    onSaveStudent({
      ...student,
      name: name.trim(),
      turmaId,
      avatarColor: avatarColor || student.avatarColor,
      active,
    });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`¿Está seguro de que desea eliminar al alumno(a) "${student.name}" y todos sus stickers? Esta acción no se puede deshacer.`)) {
      if (onDeleteStudent) {
        onDeleteStudent(student.id);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-red-200 shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-red-50/70 border-b border-red-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border shadow-2xs ${avatarColor || student.avatarColor}`}
            >
              {(name || student.name).slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Editar Alumno(a)</h3>
              <p className="text-xs text-slate-500">Actualizar datos y clase</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label htmlFor="edit-student-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Nombre Completo del Alumno
            </label>
            <input
              id="edit-student-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden text-slate-900 font-medium"
              required
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="edit-student-turma" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Clase Asignada
            </label>
            <div className="relative">
              <select
                id="edit-student-turma"
                value={turmaId}
                onChange={(e) => setTurmaId(e.target.value)}
                className="w-full text-sm font-semibold rounded-xl border border-slate-300 p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden text-slate-900 cursor-pointer"
                required
              >
                {turmas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.schoolName})
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Al cambiar la clase, el alumno se moverá de inmediato al cuadro correspondiente.
            </p>
          </div>

          {/* Avatar Color Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-red-600" />
              <span>Color del Ícono / Avatar</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AVATAR_COLOR_PALETTES.map((color) => {
                const isSelected = avatarColor === color.value;
                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setAvatarColor(color.value)}
                    className={`flex items-center gap-2 p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-red-600 ring-2 ring-red-500/30 bg-red-50/50'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full ${color.preview} shrink-0`} />
                    <span className="text-[11px] font-medium text-slate-700 truncate">{color.label.split('/')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active status */}
          <div className="pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded-sm border-slate-300 focus:ring-red-500 cursor-pointer"
              />
              <span>Alumno activo en la clase (visible en listas y cuadros)</span>
            </label>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            {onDeleteStudent ? (
              <button
                type="button"
                onClick={handleDelete}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Eliminar Alumno</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
