import React, { useState } from 'react';
import { X, Trash2, Calendar, Award, Star, Plus, CheckCircle2, School, Pencil } from 'lucide-react';
import { StudentStats, Student, Turma } from '../types';
import { formatDateTime } from '../utils/date';
import { EmojiSelector } from './EmojiSelector';

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: StudentStats | null;
  monthlyGoal: number;
  turmas?: Turma[];
  onOpenAddSticker: (student: Student) => void;
  onDeleteSticker: (stickerId: string) => void;
  onTransferTurma?: (studentId: string, newTurmaId: string) => void;
  onDeleteStudent?: (studentId: string) => void;
  onOpenEditStudent?: (student: Student) => void;
  onUpdateStickerEmoji?: (stickerId: string, newEmoji: string) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  isOpen,
  onClose,
  stats,
  monthlyGoal,
  turmas,
  onOpenAddSticker,
  onDeleteSticker,
  onTransferTurma,
  onDeleteStudent,
  onOpenEditStudent,
  onUpdateStickerEmoji,
}) => {
  const [editingStickerId, setEditingStickerId] = useState<string | null>(null);

  if (!isOpen || !stats) return null;

  const { student, stickers, totalCount } = stats;
  const progressPercent = Math.min(100, Math.round((totalCount / monthlyGoal) * 100));
  const currentTurma = turmas?.find((t) => t.id === student.turmaId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-red-200 shadow-2xl max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-red-50/70 border-b border-red-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base border shadow-2xs ${student.avatarColor}`}
            >
              {student.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{student.name}</h3>
              <p className="text-xs text-slate-500">Historial de Logros del Mes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onOpenEditStudent && (
              <button
                type="button"
                onClick={() => {
                  onOpenEditStudent(student);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-red-700 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                title="Editar datos y clase del alumno"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Editar Alumno</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress & Summary */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          {/* Turma Assignment Selector */}
          {turmas && turmas.length > 0 && onTransferTurma && (
            <div className="mb-3.5 pb-3 border-b border-slate-200/70 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <School className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span className="font-semibold text-slate-700">Clase actual:</span>
              </div>
              <select
                id="select-transfer-turma"
                aria-label="Cambiar clase del alumno"
                value={student.turmaId}
                onChange={(e) => onTransferTurma(student.id, e.target.value)}
                className="text-xs font-semibold text-red-700 bg-white border border-red-200 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-red-500 focus:outline-hidden cursor-pointer"
              >
                {turmas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-600">Progreso de la Meta ({monthlyGoal} stickers)</span>
            <span className="text-red-700 font-bold">{totalCount} / {monthlyGoal} ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-red-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="mt-3 flex items-center justify-between">
            {totalCount >= monthlyGoal ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3.5 h-3.5" /> ¡Meta Cumplida! Calificado para premiación
              </span>
            ) : (
              <span className="text-xs text-slate-500">
                Faltan <strong>{monthlyGoal - totalCount}</strong> actividades para la meta
              </span>
            )}
          </div>
        </div>

        {/* Sticker List */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Stickers Obtenidos ({stickers.length})
            </h4>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAddSticker(student);
              }}
              className="inline-flex items-center gap-1 text-xs font-bold text-red-800 hover:text-red-900 bg-red-100 hover:bg-red-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Registrar Actividad</span>
            </button>
          </div>

          {stickers.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Star className="w-8 h-8 mx-auto mb-1.5 opacity-40 text-red-400" />
              <p className="text-xs">Ningún sticker registrado en este mes todavía.</p>
            </div>
          ) : (
            stickers.map((stk) => (
              <div
                key={stk.id}
                className="p-3 rounded-xl border border-slate-200 bg-white hover:border-red-200 hover:bg-red-50/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingStickerId(editingStickerId === stk.id ? null : stk.id)}
                      className="text-2xl w-9 h-9 rounded-lg bg-slate-50 hover:bg-red-50 hover:scale-110 flex items-center justify-center border border-slate-200 transition-all cursor-pointer shadow-2xs"
                      title="Haga clic para cambiar el emoji de este sticker"
                    >
                      {stk.emoji}
                    </button>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{stk.activityTitle}</div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="font-semibold text-slate-700">{stk.label}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDateTime(stk.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {onUpdateStickerEmoji && (
                      <button
                        type="button"
                        onClick={() => setEditingStickerId(editingStickerId === stk.id ? null : stk.id)}
                        className="px-2 py-1 text-[11px] font-semibold text-slate-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer border border-slate-200"
                        title="Cambiar emoji de este sticker"
                      >
                        Cambiar Emoji
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onDeleteSticker(stk.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar este sticker"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Inline Emoji Selector if open */}
                {editingStickerId === stk.id && onUpdateStickerEmoji && (
                  <div className="mt-3 pt-3 border-t border-slate-100 animate-in fade-in">
                    <EmojiSelector
                      selectedEmoji={stk.emoji}
                      onSelectEmoji={(newEmoji) => {
                        onUpdateStickerEmoji(stk.id, newEmoji);
                        setEditingStickerId(null);
                      }}
                      title="Elija el nuevo emoji para este sticker:"
                      description="Haga clic en uno de los modelos o escriba cualquier emoji de su teclado."
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer with Delete and Close */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          {onDeleteStudent ? (
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`¿Desea eliminar al alumno ${student.name} de esta clase?`)) {
                  onDeleteStudent(student.id);
                  onClose();
                }
              }}
              className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Eliminar Alumno</span>
            </button>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
