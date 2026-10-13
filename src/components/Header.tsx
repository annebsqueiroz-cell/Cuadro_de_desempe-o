import React from 'react';
import { Award, Volume2, VolumeX, Printer, UserPlus, Settings, Calendar, Plus, GraduationCap, CloudCheck, Cloud, RefreshCw, LogIn, LogOut, User } from 'lucide-react';
import { Turma, UserAccount } from '../types';
import { getMonthOptions, formatMonthLabel } from '../utils/date';
import { CompassLogo } from './CompassLogo';

interface HeaderProps {
  currentTurma?: Turma;
  turmas: Turma[];
  selectedTurmaId: string;
  onSelectTurma: (turmaId: string) => void;
  selectedMonth: string;
  onSelectMonth: (monthKey: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHighlight: () => void;
  onOpenAddStudent: () => void;
  onOpenAddTurma?: () => void;
  onOpenSettings: () => void;
  topStudentName?: string;
  topStudentStars?: number;
  firestoreStatus?: 'connected' | 'syncing' | 'offline';
  currentUser?: UserAccount | null;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTurma,
  turmas,
  selectedTurmaId,
  onSelectTurma,
  selectedMonth,
  onSelectMonth,
  soundEnabled,
  onToggleSound,
  onOpenHighlight,
  onOpenAddStudent,
  onOpenAddTurma,
  onOpenSettings,
  topStudentName,
  topStudentStars,
  firestoreStatus = 'connected',
  currentUser,
  onOpenAuthModal,
  onLogout,
}) => {
  const monthOptions = getMonthOptions();

  const handlePrint = () => {
    window.print();
  };

  const isAllView = selectedTurmaId === 'all';

  return (
    <header className="bg-white border-b border-red-200/90 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Brand & Turma Info */}
          <div className="flex items-start gap-3">
            <CompassLogo size="md" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Cuadro de Desempeño
                </h1>
                <span className="bg-red-50 text-red-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-red-200">
                  Rincón Hispano
                </span>

                {/* Firestore Cloud Sync Badge */}
                {firestoreStatus === 'connected' && (
                  <span
                    id="badge-firestore-status"
                    className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200/90 shadow-2xs"
                    title="Todos los datos están guardados permanentemente en Google Cloud Firestore"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <CloudCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Firestore Activo</span>
                  </span>
                )}

                {firestoreStatus === 'syncing' && (
                  <span
                    id="badge-firestore-status"
                    className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-amber-200 shadow-2xs"
                    title="Guardando cambios en tiempo real en Firestore..."
                  >
                    <RefreshCw className="w-3 h-3 text-amber-600 animate-spin" />
                    <span>Guardando en la nube...</span>
                  </span>
                )}

                {firestoreStatus === 'offline' && (
                  <span
                    id="badge-firestore-status"
                    className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-slate-200"
                    title="Conexión offline. Los cambios se guardarán al reconectar."
                  >
                    <Cloud className="w-3.5 h-3.5 text-slate-400" />
                    <span>Modo Offline</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 mt-1 flex-wrap">
                {isAllView || !currentTurma ? (
                  <>
                    <span className="font-semibold text-red-700">Rincón Hispano</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-medium text-slate-700">Panel con Todas las Clases Agrupadas</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 font-medium">{turmas.length} {turmas.length === 1 ? 'clase registrada' : 'clases registradas'}</span>
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-red-700">{currentTurma.schoolName}</span>
                    <span className="text-slate-300">•</span>
                    <span className="font-medium text-slate-700">{currentTurma.name}</span>
                    <span className="text-slate-300">•</span>
                    <span>{currentTurma.teacherName}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Controls & Highlight CTA */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Turma Switcher */}
            <div className="flex items-center gap-1.5">
              <select
                id="select-turma"
                aria-label="Seleccionar Clase"
                value={selectedTurmaId}
                onChange={(e) => onSelectTurma(e.target.value)}
                className="text-xs sm:text-sm font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg px-3 py-2 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-red-500 shadow-2xs"
              >
                <option value="all">📑 Todas las Clases ({turmas.length})</option>
                {turmas.map((t) => (
                  <option key={t.id} value={t.id}>
                    📍 {t.name}
                  </option>
                ))}
              </select>

              {onOpenAddTurma && (
                <button
                  id="btn-quick-add-turma"
                  type="button"
                  onClick={onOpenAddTurma}
                  title="Crear Nueva Clase"
                  className="p-2 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 transition-colors shadow-2xs cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Month Selector */}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 gap-1.5 shadow-2xs">
              <Calendar className="w-4 h-4 text-red-600 shrink-0" />
              <select
                id="select-month"
                aria-label="Seleccionar Mes"
                value={selectedMonth}
                onChange={(e) => onSelectMonth(e.target.value)}
                className="text-xs sm:text-sm font-semibold text-slate-800 bg-transparent border-0 cursor-pointer focus:outline-hidden"
              >
                {monthOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sound toggle */}
            <button
              id="btn-toggle-sound"
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? 'Sonido activado (las estrellitas reproducen audio)' : 'Sonido desactivado'}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-red-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Print Board */}
            <button
              id="btn-print-board"
              type="button"
              onClick={handlePrint}
              title="Imprimir cuadro del mes para colgar en el aula"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Imprimir</span>
            </button>

            {/* Settings */}
            <button
              id="btn-open-settings"
              type="button"
              onClick={onOpenSettings}
              title="Configurar datos de la clase y metas"
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs cursor-pointer"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Add Student */}
            <button
              id="btn-open-add-student"
              type="button"
              onClick={onOpenAddStudent}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 transition-colors shadow-2xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Añadir Alumno</span>
            </button>

            {/* Monthly Highlight CTA Button */}
            <button
              id="btn-open-highlight-modal"
              type="button"
              onClick={onOpenHighlight}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all shadow-sm shadow-red-600/20 active:scale-98 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Destacado del Mes</span>
              {topStudentName && (
                <span className="hidden xl:inline-block bg-red-800/80 text-white text-[11px] px-2 py-0.5 rounded-full">
                  ⭐ {topStudentName}
                </span>
              )}
            </button>

            {/* User Account / Login pill */}
            {currentUser ? (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-xl px-2.5 py-1.5 shadow-2xs">
                <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs shrink-0">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-800 leading-tight flex items-center gap-1">
                    <span>{currentUser.name}</span>
                    {currentUser.username === 'aqueiroz' && (
                      <span className="text-[10px] px-1 py-0.2 rounded-full bg-red-100 text-red-800 font-bold">Maestra</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">
                    @{currentUser.username}
                  </div>
                </div>
                {onOpenAuthModal && (
                  <button
                    type="button"
                    onClick={onOpenAuthModal}
                    id="btn-user-account"
                    title="Alternar de cuenta o ver login"
                    className="ml-1 p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-white transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuthModal}
                id="btn-login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-2xs cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-amber-300" />
                <span>Entrar (Login)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
