import React, { useState } from 'react';
import { Target, Trophy, CheckCircle2, Award, Sparkles, Layers, Pencil, Star, Check, X } from 'lucide-react';
import { Turma, StudentStats } from '../types';
import { formatMonthLabel } from '../utils/date';
import { EmojiSelector } from './EmojiSelector';

interface MonthlyGoalBannerProps {
  turma: Turma;
  selectedMonth: string;
  studentStats: StudentStats[];
  onOpenHighlight: () => void;
  onOpenSettings?: () => void;
  onUpdateGoal?: (turmaId: string, newGoal: number) => void;
  onUpdateStarEmoji?: (turmaId: string, newEmoji: string) => void;
  isAllTurmas?: boolean;
  totalTurmasCount?: number;
}

export const MonthlyGoalBanner: React.FC<MonthlyGoalBannerProps> = ({
  turma,
  selectedMonth,
  studentStats,
  onOpenHighlight,
  onOpenSettings,
  onUpdateGoal,
  onUpdateStarEmoji,
  isAllTurmas = false,
  totalTurmasCount = 1,
}) => {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(turma?.monthlyGoal || 8);
  const [isEditingEmoji, setIsEditingEmoji] = useState(false);

  const totalStickersInMonth = studentStats.reduce((acc, s) => acc + s.totalCount, 0);
  const currentGoal = turma?.monthlyGoal || 8;
  const currentEmoji = turma?.starEmoji || '⭐';
  const studentsReachedGoal = studentStats.filter((s) => s.totalCount >= currentGoal);
  const topStudent = studentStats.length > 0 && studentStats[0].totalCount > 0 ? studentStats[0] : null;

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateGoal && turma?.id) {
      onUpdateGoal(turma.id, Math.max(1, tempGoal));
    }
    setIsEditingGoal(false);
  };

  const handleSelectEmoji = (newEmoji: string) => {
    if (onUpdateStarEmoji && turma?.id) {
      onUpdateStarEmoji(turma.id, newEmoji);
    }
    setIsEditingEmoji(false);
  };

  return (
    <div className="bg-white border border-red-200 rounded-2xl p-4 sm:p-5 mb-6 shadow-sm no-print relative">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Monthly Goal & Reward Details */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-red-600/20">
            {isAllTurmas ? <Layers className="w-5 h-5" /> : <Target className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-0.5 rounded-md border border-red-200">
                {isAllTurmas ? `Panel General de ${formatMonthLabel(selectedMonth)}` : `Meta de ${formatMonthLabel(selectedMonth)}`}
              </span>

              {/* Number of activities with Quick Edit */}
              {!isAllTurmas && turma && (
                <div className="inline-flex items-center gap-1.5">
                  <span className="text-xs text-slate-800 font-bold bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 flex items-center gap-1">
                    <span>🎯 Meta: {currentGoal} actividades</span>
                  </span>
                  {onUpdateGoal && (
                    <button
                      type="button"
                      onClick={() => {
                        setTempGoal(currentGoal);
                        setIsEditingGoal(true);
                      }}
                      className="px-2 py-0.5 rounded-md bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Editar el número de actividades de la meta"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Editar Meta</span>
                    </button>
                  )}
                </div>
              )}

              {/* Custom Star Emoji with Quick Edit */}
              {!isAllTurmas && turma && (
                <div className="inline-flex items-center gap-1">
                  <span className="text-xs text-slate-800 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                    <span>Estrella:</span>
                    <span className="text-base leading-none">{currentEmoji}</span>
                  </span>
                  {onUpdateStarEmoji && (
                    <button
                      type="button"
                      onClick={() => setIsEditingEmoji(true)}
                      className="px-2 py-0.5 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Editar el emoji de la estrella para cualquiera que desee"
                    >
                      <Pencil className="w-3 h-3" />
                      <span>Cambiar Emoji</span>
                    </button>
                  )}
                </div>
              )}

              {isAllTurmas && (
                <span className="text-xs text-slate-600 font-medium">
                  {totalTurmasCount} {totalTurmasCount === 1 ? 'clase activa' : 'clases activas'} • {studentStats.length} alumnos registrados
                </span>
              )}
            </div>

            <p className="text-sm font-semibold text-slate-800 mt-1.5 flex items-center gap-1.5 flex-wrap">
              <span className="text-red-600 font-bold">🎁 Premio del Mes:</span>
              <span className="text-slate-700 font-normal">
                {isAllTurmas
                  ? 'Cada clase tiene su premio y certificado de honor individual.'
                  : turma.monthlyRewardDescription}
              </span>
            </p>
          </div>
        </div>

        {/* Right: Key Monthly Stats */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-3">
          {/* Total Activities */}
          <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
            <span className="block text-[11px] font-medium text-slate-500">Total de Entregas</span>
            <span className="text-base font-bold text-slate-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
              {totalStickersInMonth}
            </span>
          </div>

          {/* Qualified for award */}
          <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 shadow-2xs">
            <span className="block text-[11px] font-medium text-slate-500">Cumplieron la Meta</span>
            <span className="text-base font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {studentsReachedGoal.length} / {studentStats.length}
            </span>
          </div>

          {/* Current Leader */}
          {topStudent && (
            <button
              id="btn-banner-current-leader"
              type="button"
              onClick={onOpenHighlight}
              className="bg-amber-50 hover:bg-amber-100/80 px-3 py-2 rounded-xl border border-amber-300 text-left transition-colors cursor-pointer group shadow-2xs"
              title="Haga clic para ver la premiación y certificado de este alumno"
            >
              <span className="block text-[11px] font-bold text-amber-800 flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-600" />
                {isAllTurmas ? 'Destacado General' : 'Destacado de la Clase'}
              </span>
              <span className="text-sm font-bold text-slate-900 group-hover:text-red-700 transition-colors">
                {topStudent.student.name} ({topStudent.totalCount} {currentEmoji})
              </span>
            </button>
          )}

          {/* Award Button */}
          <button
            id="btn-banner-ceremony"
            type="button"
            onClick={onOpenHighlight}
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-red-600/20 transition-all cursor-pointer active:scale-98"
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>Ver Premiación</span>
          </button>
        </div>
      </div>

      {/* Modal / Popover: Edit Monthly Goal */}
      {isEditingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-red-200 shadow-2xl p-5 max-w-sm w-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-red-600" />
                <h4 className="text-sm font-bold text-slate-900">Editar Meta de Actividades</h4>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingGoal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Número de actividades para cumplir la meta
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setTempGoal((prev) => Math.max(1, prev - 1))}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-lg font-bold flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={tempGoal}
                    onChange={(e) => setTempGoal(parseInt(e.target.value, 10) || 1)}
                    className="flex-1 text-center font-black text-xl py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden text-slate-900"
                    autoFocus
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setTempGoal((prev) => prev + 1)}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-lg font-bold flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 text-center">
                  Los alumnos con {tempGoal} o más actividades entregadas recibirán el premio del mes.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingGoal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Guardar Meta</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal / Popover: Edit Star Emoji */}
      {isEditingEmoji && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-red-200 shadow-2xl p-5 max-w-md w-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentEmoji}</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Editar Emoji de la Estrella</h4>
                  <p className="text-xs text-slate-500">Elija cualquier emoji que desee para la clase</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingEmoji(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <EmojiSelector
              selectedEmoji={currentEmoji}
              onSelectEmoji={handleSelectEmoji}
              title="Seleccione o escriba cualquier emoji:"
              description="Puede hacer clic en uno de los modelos o escribir cualquier emoji de su teclado."
            />

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsEditingEmoji(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
