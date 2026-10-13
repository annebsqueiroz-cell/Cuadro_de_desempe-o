import React, { useState, useEffect } from 'react';
import { Plus, Star, Search, ArrowUpDown, Trash2, Eye, Award, Check, Sparkles, Filter, Settings, Trophy, Pencil, X, Target } from 'lucide-react';
import { StudentStats, StickerRecord, Student, Turma } from '../types';
import { formatDateTime } from '../utils/date';
import { EmojiSelector } from './EmojiSelector';

interface BoardTableProps {
  turma: Turma;
  studentStats: StudentStats[];
  monthlyGoal: number;
  selectedMonthLabel: string;
  onQuickAddStar: (student: Student) => void;
  onOpenAddStickerModal: (student: Student) => void;
  onOpenStudentDetail: (stats: StudentStats) => void;
  onDeleteSticker: (stickerId: string) => void;
  onOpenAddStudent: (turmaId?: string) => void;
  onOpenEditStudent?: (student: Student) => void;
  onOpenHighlight?: (turma: Turma) => void;
  onOpenSettings?: (turma: Turma) => void;
  onUpdateTurmaGoal?: (turmaId: string, newGoal: number) => void;
  onUpdateTurmaStarEmoji?: (turmaId: string, newEmoji: string) => void;
  onUpdateTurmaName?: (turmaId: string, newName: string) => void;
  isAllTurmasView?: boolean;
}

export const BoardTable: React.FC<BoardTableProps> = ({
  turma,
  studentStats,
  monthlyGoal,
  selectedMonthLabel,
  onQuickAddStar,
  onOpenAddStickerModal,
  onOpenStudentDetail,
  onDeleteSticker,
  onOpenAddStudent,
  onOpenEditStudent,
  onOpenHighlight,
  onOpenSettings,
  onUpdateTurmaGoal,
  onUpdateTurmaStarEmoji,
  onUpdateTurmaName,
  isAllTurmasView = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'stars' | 'name'>('stars');
  const [filterGoal, setFilterGoal] = useState<'all' | 'achieved' | 'pending'>('all');
  const [activeTooltipStickerId, setActiveTooltipStickerId] = useState<string | null>(null);

  // Quick edit modal states
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(monthlyGoal);
  const [isEditingEmoji, setIsEditingEmoji] = useState(false);

  // Quick edit class name state
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(turma.name);

  useEffect(() => {
    setTempName(turma.name);
  }, [turma.name]);

  const handleSaveName = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = tempName.trim();
    if (trimmed && onUpdateTurmaName) {
      onUpdateTurmaName(turma.id, trimmed);
    }
    setIsEditingName(false);
  };

  const currentStarEmoji = turma.starEmoji || '⭐';

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateTurmaGoal) {
      onUpdateTurmaGoal(turma.id, Math.max(1, tempGoal));
    }
    setIsEditingGoal(false);
  };

  const handleSelectEmoji = (newEmoji: string) => {
    if (onUpdateTurmaStarEmoji) {
      onUpdateTurmaStarEmoji(turma.id, newEmoji);
    }
    setIsEditingEmoji(false);
  };

  // Filter & sort students
  const filteredStudents = studentStats
    .filter((stat) => {
      const matchesSearch = stat.student.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (filterGoal === 'achieved') return stat.totalCount >= monthlyGoal;
      if (filterGoal === 'pending') return stat.totalCount < monthlyGoal;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.student.name.localeCompare(b.student.name);
      }
      // sort by stars descending, then name ascending
      if (b.totalCount !== a.totalCount) {
        return b.totalCount - a.totalCount;
      }
      return a.student.name.localeCompare(b.student.name);
    });

  return (
    <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden mb-8">
      {/* Turma Header Bar */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center font-bold text-white text-lg shrink-0 shadow-xs">
            🧭
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {isEditingName ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-1.5 flex-wrap">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSaveName();
                      } else if (e.key === 'Escape') {
                        setIsEditingName(false);
                      }
                    }}
                    autoFocus
                    placeholder="Nombre de la clase..."
                    className="px-2.5 py-1 text-sm font-bold text-slate-900 bg-white rounded-lg border-2 border-amber-300 focus:outline-hidden shadow-xs min-w-[200px]"
                  />
                  <button
                    type="submit"
                    id={`btn-save-turma-name-${turma.id}`}
                    title="Aperte para Salvar o nome da classe (ou Enter)"
                    className="px-2.5 py-1 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-lg flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Salvar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    title="Cancelar"
                    className="p-1 text-xs text-white/80 hover:text-white rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {turma.name}
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setTempName(turma.name);
                      setIsEditingName(true);
                    }}
                    id={`btn-edit-turma-name-${turma.id}`}
                    className="p-1 rounded-md bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
                    title="Editar nombre de la clase (con botón Salvar y tecla Enter)"
                  >
                    <Pencil className="w-3 h-3 text-red-100" />
                  </button>
                </div>
              )}
              <span className="text-xs bg-white/20 text-white font-semibold px-2 py-0.5 rounded-full border border-white/25">
                {turma.schoolName}
              </span>
            </div>
            <div className="text-xs text-red-100 mt-1 flex items-center gap-2 flex-wrap">
              <span className="bg-white/15 px-2.5 py-0.5 rounded-md font-medium text-white shadow-2xs">
                Prof(a): {turma.teacherName}
              </span>
              <span>•</span>
              {/* Meta de Atividades com Edição Rápida */}
              <button
                type="button"
                onClick={() => {
                  setTempGoal(monthlyGoal);
                  setIsEditingGoal(true);
                }}
                className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/25 shadow-2xs"
                title="Haga clic para editar el número de actividades de la meta de esta clase"
              >
                <span>🎯 Meta: <strong>{monthlyGoal} actividades</strong></span>
                <Pencil className="w-3 h-3 text-red-200" />
              </button>
              <span>•</span>
              {/* Símbolo da Estrela com Edição Rápida */}
              <button
                type="button"
                onClick={() => setIsEditingEmoji(true)}
                className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-0.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/25 shadow-2xs"
                title="Haga clic para editar el emoji de la estrella para cualquiera que desee"
              >
                <span>Símbolo: <strong className="text-base leading-none">{currentStarEmoji}</strong></span>
                <Pencil className="w-3 h-3 text-red-200" />
              </button>
              <span>•</span>
              <span className="text-red-200">Total: {studentStats.length} {studentStats.length === 1 ? 'alumno' : 'alumnos'}</span>
            </div>
          </div>
        </div>

        {/* Turma Quick Actions */}
        <div className="flex items-center gap-2 flex-wrap no-print">
          {onOpenHighlight && (
            <button
              id={`btn-highlight-turma-${turma.id}`}
              type="button"
              onClick={() => onOpenHighlight(turma)}
              className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/30 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>Destacado del Mes</span>
            </button>
          )}

          {onOpenSettings && (
            <button
              id={`btn-settings-turma-${turma.id}`}
              type="button"
              onClick={() => onOpenSettings(turma)}
              className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Editar datos, profesor y metas de esta clase"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Editar Clase</span>
            </button>
          )}

          <button
            id={`btn-add-student-turma-${turma.id}`}
            type="button"
            onClick={() => onOpenAddStudent(turma.id)}
            className="px-3.5 py-1.5 rounded-lg bg-white text-red-700 hover:bg-red-50 text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir Alumno</span>
          </button>
        </div>
      </div>

      {/* Board Controls Bar */}
      <div className="p-4 sm:p-5 bg-red-50/50 border-b border-red-200/90 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <span className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
            <span>📋 Tabla de la Clase</span>
            <span className="text-xs bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-md border border-red-200">
              {selectedMonthLabel}
            </span>
          </span>
          <span className="text-xs text-slate-500 font-medium">
            ({studentStats.length} {studentStats.length === 1 ? 'alumno' : 'alumnos'})
          </span>
        </div>

        {/* Search, Filter & Sort */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              id="input-search-student"
              type="text"
              placeholder="Buscar alumno..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs sm:text-sm pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-red-500 text-slate-800 placeholder-slate-400 w-36 sm:w-48"
            />
          </div>

          {/* Filter dropdown */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2 py-1 gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="select-filter-goal"
              aria-label="Filtrar por meta"
              value={filterGoal}
              onChange={(e) => setFilterGoal(e.target.value as 'all' | 'achieved' | 'pending')}
              className="text-xs font-medium text-slate-700 bg-transparent border-0 cursor-pointer focus:outline-hidden"
            >
              <option value="all">Todos</option>
              <option value="achieved">Cumplieron la Meta (≥{monthlyGoal})</option>
              <option value="pending">En Progreso (&lt;{monthlyGoal})</option>
            </select>
          </div>

          {/* Sort button */}
          <button
            id="btn-sort-order"
            type="button"
            onClick={() => setSortBy(sortBy === 'stars' ? 'name' : 'stars')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
            title="Alternar orden"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span>{sortBy === 'stars' ? 'Por Estrellas' : 'Por Nombre (A-Z)'}</span>
          </button>
        </div>
      </div>

      {/* Printable Classroom Header (only shows in print mode) */}
      <div className="hidden print-only p-6 border-b border-slate-300 text-center">
        <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-wide">
          Cuadro de Desempeño de la Clase
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Mes de Referencia: {selectedMonthLabel} • Meta de la Clase: {monthlyGoal} actividades
        </p>
      </div>

      {/* Main Board Content */}
      <div className="divide-y divide-slate-100">
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center">
            <Sparkles className="w-8 h-8 text-red-400 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-semibold text-slate-700">No se encontró ningún alumno con estos filtros.</p>
            <p className="text-xs text-slate-500 mt-1">
              Intente cambiar los términos de búsqueda o{' '}
              <button
                type="button"
                onClick={() => onOpenAddStudent(turma.id)}
                className="text-red-700 font-bold hover:underline cursor-pointer"
              >
                registrar un nuevo alumno
              </button>
              .
            </p>
          </div>
        ) : (
          filteredStudents.map((stat) => {
            const hasMetGoal = stat.totalCount >= monthlyGoal;
            const isRank1 = stat.rank === 1 && stat.totalCount > 0;
            const isRank2 = stat.rank === 2 && stat.totalCount > 0;
            const isRank3 = stat.rank === 3 && stat.totalCount > 0;

            return (
              <div
                key={stat.student.id}
                id={`student-row-${stat.student.id}`}
                className="p-3 sm:p-4 hover:bg-red-50/20 transition-colors flex flex-col md:flex-row md:items-center gap-3 justify-between"
              >
                {/* Student Info & Avatar */}
                <div className="flex items-center gap-3 min-w-[200px] sm:min-w-[240px] shrink-0">
                  {/* Rank Badge / Avatar */}
                  <div className="relative">
                    <div
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-bold text-sm border shadow-2xs ${stat.student.avatarColor}`}
                    >
                      {stat.student.name.slice(0, 2).toUpperCase()}
                    </div>
                    {/* Podium rank tag */}
                    {isRank1 && (
                      <span
                        className="absolute -top-1 -right-1 text-sm bg-yellow-400 rounded-full shadow-2xs p-0.5 leading-none"
                        title="¡1.º Lugar en el Mes!"
                      >
                        🥇
                      </span>
                    )}
                    {isRank2 && (
                      <span
                        className="absolute -top-1 -right-1 text-sm bg-slate-300 rounded-full shadow-2xs p-0.5 leading-none"
                        title="¡2.º Lugar en el Mes!"
                      >
                        🥈
                      </span>
                    )}
                    {isRank3 && (
                      <span
                        className="absolute -top-1 -right-1 text-sm bg-amber-600 rounded-full shadow-2xs p-0.5 leading-none"
                        title="¡3.º Lugar en el Mes!"
                      >
                        🥉
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onOpenStudentDetail(stat)}
                        className="text-sm sm:text-base font-bold text-slate-900 hover:text-red-700 transition-colors text-left line-clamp-1"
                        title="Ver historial completo del alumno"
                      >
                        {stat.student.name}
                      </button>
                      {onOpenEditStudent && (
                        <button
                          type="button"
                          onClick={() => onOpenEditStudent(stat.student)}
                          className="text-slate-400 hover:text-red-600 p-0.5 rounded-sm transition-colors cursor-pointer"
                          title={`Editar datos de ${stat.student.name}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500 font-medium">
                        {stat.totalCount} {stat.totalCount === 1 ? 'sticker' : 'stickers'}
                      </span>
                      {hasMetGoal && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded-sm">
                          <Check className="w-2.5 h-2.5" /> Meta Cumplida
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* The Virtual Sticker Wall / Chart Track */}
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 min-h-[52px] flex items-center flex-wrap gap-1.5 relative overflow-visible">
                  {stat.stickers.length === 0 ? (
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium italic px-2 py-1">
                      <span>✨ Esperando primera actividad entregada...</span>
                    </div>
                  ) : (
                    stat.stickers.map((stk) => {
                      const isTooltipOpen = activeTooltipStickerId === stk.id;

                      return (
                        <div key={stk.id} className="relative group">
                          {/* Sticker Badge */}
                          <button
                            type="button"
                            onClick={() => setActiveTooltipStickerId(isTooltipOpen ? null : stk.id)}
                            className="w-8 h-8 sm:w-9 sm:h-9 bg-white border border-slate-200 hover:border-red-400 rounded-lg shadow-2xs flex items-center justify-center text-lg sm:text-xl transition-all transform hover:scale-115 active:scale-95 cursor-pointer relative"
                            title={`${stk.emoji} ${stk.activityTitle} (${formatDateTime(stk.timestamp)})`}
                          >
                            <span>{stk.emoji}</span>
                            <span className="sr-only">{stk.activityTitle}</span>
                          </button>

                          {/* Interactive Popover / Tooltip */}
                          {isTooltipOpen && (
                            <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-slate-900 text-white text-xs rounded-xl p-2.5 shadow-xl border border-slate-700 animate-in fade-in zoom-in-95">
                              <div className="flex items-center justify-between border-b border-slate-700 pb-1.5 mb-1.5">
                                <span className="font-bold text-red-300 flex items-center gap-1">
                                  <span>{stk.emoji}</span>
                                  <span>{stk.label}</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onDeleteSticker(stk.id);
                                    setActiveTooltipStickerId(null);
                                  }}
                                  className="text-rose-400 hover:text-rose-300 p-0.5 rounded-sm"
                                  title="Eliminar sticker (deshacer)"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <p className="text-slate-200 font-medium leading-relaxed">
                                {stk.activityTitle}
                              </p>
                              <span className="block text-[10px] text-slate-400 mt-1">
                                {formatDateTime(stk.timestamp)}
                              </span>
                              {/* Arrow */}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center no-print">
                  {/* Quick Star (+⭐ or custom emoji) Button */}
                  <button
                    id={`btn-quick-star-${stat.student.id}`}
                    type="button"
                    onClick={() => onQuickAddStar(stat.student)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-2xs transition-all active:scale-95 cursor-pointer"
                    title={`Dar 1 ${currentStarEmoji} rápida a ${stat.student.name}`}
                  >
                    <span className="text-sm leading-none">{currentStarEmoji}</span>
                    <span>+ {currentStarEmoji}</span>
                  </button>

                  {/* Choose Emoji / Enter Activity Modal */}
                  <button
                    id={`btn-choose-emoji-${stat.student.id}`}
                    type="button"
                    onClick={() => onOpenAddStickerModal(stat.student)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs transition-colors"
                    title={`Elegir emoji o registrar actividad para ${stat.student.name}`}
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-600" />
                    <span>Otro Emoji</span>
                  </button>

                  {/* History / Detail view */}
                  <button
                    id={`btn-view-details-${stat.student.id}`}
                    type="button"
                    onClick={() => onOpenStudentDetail(stat)}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
                    title="Ver historial detallado"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Edit Student Button */}
                  {onOpenEditStudent && (
                    <button
                      id={`btn-edit-student-${stat.student.id}`}
                      type="button"
                      onClick={() => onOpenEditStudent(stat.student)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-slate-500 transition-colors cursor-pointer"
                      title={`Editar registro y clase de ${stat.student.name}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Board Footer Summary */}
      <div className="p-4 bg-slate-50 border-t border-red-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">Consejo Pedagógico:</span>
          <span>
            Cada estrellita estimula el sentido de logro y la constancia en la entrega de actividades.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Meta cumplida: ≥{monthlyGoal}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-600" /> Total en el cuadro: {studentStats.reduce((a, b) => a + b.totalCount, 0)} stickers
          </span>
        </div>
      </div>

      {/* Modal / Dialog: Edit Monthly Goal for this Turma */}
      {isEditingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-red-200 shadow-2xl p-5 max-w-sm w-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-red-600" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Editar Meta de la Clase</h4>
                  <p className="text-[11px] text-slate-500">{turma.name}</p>
                </div>
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
                  Los alumnos con {tempGoal} o más actividades entregadas en el mes cumplirán la meta de esta clase.
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

      {/* Modal / Dialog: Edit Star Emoji for this Turma */}
      {isEditingEmoji && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-red-200 shadow-2xl p-5 max-w-md w-full">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentStarEmoji}</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Editar Emoji de la Estrella</h4>
                  <p className="text-xs text-slate-500">Clase: {turma.name}</p>
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
              selectedEmoji={currentStarEmoji}
              onSelectEmoji={handleSelectEmoji}
              title="Elija el emoji de la estrella / recompensa:"
              description="Puede hacer clic en cualquiera de los modelos o escribir/pegar cualquier emoji de su teclado."
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
