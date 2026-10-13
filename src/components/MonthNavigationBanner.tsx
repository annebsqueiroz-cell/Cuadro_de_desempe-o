import React from 'react';
import { Calendar, History, Sparkles, RefreshCw, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { formatMonthLabel } from '../utils/date';

interface MonthNavigationBannerProps {
  selectedMonth: string;
  onSelectMonth: (monthKey: string) => void;
  septemberStickersCount: number;
  octoberStickersCount: number;
  onOpenRestoreModal: () => void;
}

export const MonthNavigationBanner: React.FC<MonthNavigationBannerProps> = ({
  selectedMonth,
  onSelectMonth,
  septemberStickersCount,
  octoberStickersCount,
  onOpenRestoreModal,
}) => {
  const isSeptember = selectedMonth === '2026-09';
  const isOctober = selectedMonth === '2026-10';

  return (
    <div className="bg-white border-2 border-red-200/90 rounded-2xl p-4 sm:p-5 mb-6 shadow-sm no-print relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left side: Quick Month Tabs */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-red-600" />
              <span>Navegación Rápida entre Meses</span>
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* September 2026 Tab */}
            <button
              type="button"
              onClick={() => onSelectMonth('2026-09')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xs ${
                isSeptember
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/25 ring-2 ring-red-400 ring-offset-1'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <History className={`w-4 h-4 ${isSeptember ? 'text-amber-300' : 'text-slate-500'}`} />
              <span>Septiembre 2026</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  isSeptember ? 'bg-red-800 text-amber-200' : 'bg-red-100 text-red-700'
                }`}
              >
                {septemberStickersCount} actividades ⭐
              </span>
            </button>

            {/* October 2026 Tab */}
            <button
              type="button"
              onClick={() => onSelectMonth('2026-10')}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xs ${
                isOctober
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/25 ring-2 ring-red-400 ring-offset-1'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Calendar className={`w-4 h-4 ${isOctober ? 'text-amber-300' : 'text-slate-500'}`} />
              <span>Octubre 2026</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  isOctober ? 'bg-red-800 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {octoberStickersCount} {octoberStickersCount === 1 ? 'actividad' : 'actividades'} (Actual)
              </span>
            </button>
          </div>
        </div>

        {/* Right side: Reassuring message & Restore Action */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {isSeptember ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm px-3.5 py-2 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Septiembre Activo:</strong> Todas tus <strong>{septemberStickersCount} actividades</strong> del mes pasado están restauradas y seguras.
              </span>
            </div>
          ) : isOctober ? (
            <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm px-3.5 py-2 rounded-xl flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Octubre (Mes Actual):</strong> Tienes <strong>{septemberStickersCount} actividades en Septiembre</strong>.
              </span>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm px-3.5 py-2 rounded-xl">
              Viendo <strong>{formatMonthLabel(selectedMonth)}</strong>
            </div>
          )}

          {/* Restore / Replicate CTA button */}
          <button
            type="button"
            onClick={onOpenRestoreModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs sm:text-sm shadow-sm shadow-red-600/20 active:scale-98 transition-all cursor-pointer shrink-0"
            title="Copiar las actividades de Septiembre a Octubre"
          >
            <RefreshCw className="w-4 h-4 text-amber-300" />
            <span>Restaurar / Copiar a Octubre</span>
          </button>
        </div>
      </div>
    </div>
  );
};
