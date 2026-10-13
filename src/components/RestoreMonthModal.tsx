import React, { useState } from 'react';
import { X, RefreshCw, Calendar, CheckCircle2, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { Turma, Student, StickerRecord } from '../types';
import confetti from 'canvas-confetti';

interface RestoreMonthModalProps {
  isOpen: boolean;
  onClose: () => void;
  turmas: Turma[];
  students: Student[];
  stickers: StickerRecord[];
  onConfirmRestore: (sourceMonth: string, targetMonth: string, targetTurmaId: string) => Promise<void>;
  currentSelectedTurmaId: string;
}

export const RestoreMonthModal: React.FC<RestoreMonthModalProps> = ({
  isOpen,
  onClose,
  turmas,
  students,
  stickers,
  onConfirmRestore,
  currentSelectedTurmaId,
}) => {
  const [selectedTurmaId, setSelectedTurmaId] = useState<string>(
    currentSelectedTurmaId !== 'all' ? currentSelectedTurmaId : 'all'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [restoredCount, setRestoredCount] = useState(0);

  if (!isOpen) return null;

  const sourceMonth = '2026-09';
  const targetMonth = '2026-10';

  // Count stickers available in September 2026
  const sourceStickers = stickers.filter((s) => s.monthKey === sourceMonth);
  const stickersToCopy =
    selectedTurmaId === 'all'
      ? sourceStickers
      : sourceStickers.filter((s) => {
          const student = students.find((std) => std.id === s.studentId);
          return student && student.turmaId === selectedTurmaId;
        });

  const handleRestore = async () => {
    setIsProcessing(true);
    try {
      await onConfirmRestore(sourceMonth, targetMonth, selectedTurmaId);
      setRestoredCount(stickersToCopy.length);
      setIsSuccess(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      console.error('Error restaurando actividades:', err);
      alert('Ocurrió un error al restaurar las actividades. Intente nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-linear-to-r from-red-600 to-rose-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white font-bold">
              <RefreshCw className="w-5 h-5 text-amber-300 animate-spin-reverse" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Restaurar Actividades a Octubre</h2>
              <p className="text-xs text-red-100">
                Copiar estrellitas y actividades de Septiembre 2026 a Octubre 2026
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {isSuccess ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">¡Actividades Restauradas con Éxito!</h3>
              <p className="text-sm text-slate-600">
                Se han copiado <strong>{restoredCount} actividades</strong> a Octubre de 2026.
              </p>
            </div>
          ) : (
            <>
              {/* Info Callout */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm leading-relaxed space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-800">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>¿Qué hace esta función?</span>
                </div>
                <p>
                  Tus <strong>166 actividades de Septiembre de 2026</strong> están intactas y guardadas en la base de datos.
                  Esta herramienta copiará esas actividades a <strong>Octubre de 2026</strong> para que tus alumnos las
                  tengan registradas en el mes actual sin perder las originales.
                </p>
              </div>

              {/* Source -> Target Visual */}
              <div className="grid grid-cols-5 items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs font-semibold">
                <div className="col-span-2 p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[11px] text-slate-500 block">Origen:</span>
                  <span className="text-slate-800 font-bold">Septiembre 2026</span>
                  <span className="block text-[10px] text-red-600 font-bold mt-0.5">
                    {sourceStickers.length} actividades
                  </span>
                </div>
                <div className="flex justify-center text-slate-400">
                  <ArrowRight className="w-5 h-5 text-red-600" />
                </div>
                <div className="col-span-2 p-2 bg-red-50 rounded-lg border border-red-200 shadow-2xs">
                  <span className="text-[11px] text-red-700 block">Destino:</span>
                  <span className="text-red-900 font-bold">Octubre 2026</span>
                  <span className="block text-[10px] text-red-700 font-bold mt-0.5">
                    +{stickersToCopy.length} actividades
                  </span>
                </div>
              </div>

              {/* Turma Scope selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ¿Para qué clases deseas restaurar las actividades?
                </label>
                <select
                  value={selectedTurmaId}
                  onChange={(e) => setSelectedTurmaId(e.target.value)}
                  className="w-full text-sm font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-red-500 shadow-2xs"
                >
                  <option value="all">📑 Todas las Clases ({sourceStickers.length} actividades de Septiembre)</option>
                  {turmas.map((t) => {
                    const count = sourceStickers.filter((stk) => {
                      const st = students.find((s) => s.id === stk.studentId);
                      return st && st.turmaId === t.id;
                    }).length;
                    return (
                      <option key={t.id} value={t.id}>
                        📍 {t.name} ({count} actividades de Septiembre)
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleRestore}
                  disabled={isProcessing || stickersToCopy.length === 0}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-red-600/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Restaurando...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Confirmar y Restaurar a Octubre ({stickersToCopy.length})</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
