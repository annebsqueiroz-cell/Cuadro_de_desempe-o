import React, { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { X, Trophy, Award, Printer, Sparkles, Copy, Check, Star, Share2 } from 'lucide-react';
import { StudentStats, Turma } from '../types';
import { formatMonthLabel } from '../utils/date';
import { playTrophySound } from '../utils/audio';
import { CompassLogo } from './CompassLogo';

interface MonthlyHighlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentStats: StudentStats[];
  selectedMonth: string;
  turma: Turma;
  soundEnabled: boolean;
}

export const MonthlyHighlightModal: React.FC<MonthlyHighlightModalProps> = ({
  isOpen,
  onClose,
  studentStats,
  selectedMonth,
  turma,
  soundEnabled,
}) => {
  const [selectedStudentForCertificate, setSelectedStudentForCertificate] = useState<StudentStats | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const hasTriggeredRef = useRef(false);

  // Sort students by total stickers descending
  const sortedStudents = [...studentStats].sort((a, b) => b.totalCount - a.totalCount);
  const top1 = sortedStudents[0] || null;
  const top2 = sortedStudents[1] || null;
  const top3 = sortedStudents[2] || null;

  const currentCertificateStudent = selectedStudentForCertificate || top1;

  useEffect(() => {
    if (isOpen) {
      if (soundEnabled) {
        playTrophySound();
      }
      // Confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#dc2626', '#ef4444', '#b91c1c', '#ffffff', '#f59e0b'],
        });
      } catch (e) {
        console.debug('Confetti execution error', e);
      }
      if (top1) {
        setSelectedStudentForCertificate(top1);
      }
    } else {
      hasTriggeredRef.current = false;
    }
  }, [isOpen, soundEnabled]);

  if (!isOpen) return null;

  const fireMoreConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.5 },
      });
      if (soundEnabled) playTrophySound();
    } catch {}
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const handleCopyParentNote = () => {
    if (!currentCertificateStudent) return;
    const text = `🎉 ¡Felicitaciones! Estimada familia, tenemos el inmenso orgullo de informar que el(la) alumno(a) ${currentCertificateStudent.student.name} fue el gran DESTACADO DEL MES de ${formatMonthLabel(selectedMonth)} en la clase ${turma.name}, obteniendo ${currentCertificateStudent.totalCount} estrellitas de mérito por la entrega ejemplar de sus actividades. 🌟 ¡Felicitaciones por el esfuerzo y dedicación! — ${turma.teacherName}, ${turma.schoolName}.`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 3000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      {/* Modal Container */}
      <div className="bg-white rounded-3xl border border-red-300 shadow-2xl max-w-3xl w-full my-6 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header with celebration theme */}
        <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white p-5 sm:p-6 relative no-print shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-inner border border-white/30 shrink-0">
              🏆
            </div>
            <div>
              <div className="inline-flex items-center gap-1 bg-white/20 text-red-100 text-xs font-bold px-2.5 py-0.5 rounded-full mb-1 border border-white/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Resultado Oficial del Mes</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Destacado del Mes: {formatMonthLabel(selectedMonth)}
              </h2>
              <p className="text-xs sm:text-sm text-red-100 mt-0.5">
                {turma.name} • {turma.schoolName}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Top 3 Podium Cards */}
          <div className="no-print">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
              <span>Podio de Estrellitas del Mes</span>
              <button
                type="button"
                onClick={fireMoreConfetti}
                className="text-red-700 hover:text-red-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-red-600" /> ¡Lanzar Confeti!
              </button>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 2nd Place */}
              {top2 && (
                <div
                  onClick={() => setSelectedStudentForCertificate(top2)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    currentCertificateStudent?.student.id === top2.student.id
                      ? 'bg-slate-100/90 border-slate-400 ring-2 ring-slate-400 shadow-sm'
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🥈</span>
                    <span className="text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      2.º Lugar
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-2 line-clamp-1">
                    {top2.student.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    {top2.totalCount} stickers obtenidos
                  </p>
                </div>
              )}

              {/* 1st Place (Champion) */}
              {top1 && (
                <div
                  onClick={() => setSelectedStudentForCertificate(top1)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    currentCertificateStudent?.student.id === top1.student.id
                      ? 'bg-red-50/60 border-red-500 ring-2 ring-red-400 shadow-md scale-[1.02]'
                      : 'bg-white border-red-200 hover:border-red-400'
                  }`}
                >
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
                    Campeón del Mes
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-3xl">🥇</span>
                    <span className="text-xs font-black text-red-900 bg-red-100 px-2 py-0.5 rounded-full border border-red-200">
                      1.º Lugar
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base mt-2 line-clamp-1">
                    {top1.student.name}
                  </h4>
                  <p className="text-xs font-bold text-red-700 mt-0.5 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                    {top1.totalCount} actividades entregadas
                  </p>
                </div>
              )}

              {/* 3rd Place */}
              {top3 && (
                <div
                  onClick={() => setSelectedStudentForCertificate(top3)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    currentCertificateStudent?.student.id === top3.student.id
                      ? 'bg-amber-100/50 border-amber-400 ring-2 ring-amber-400 shadow-sm'
                      : 'bg-slate-50/70 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">🥉</span>
                    <span className="text-xs font-bold text-amber-800 bg-white px-2 py-0.5 rounded-full border border-amber-200">
                      3.º Lugar
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-2 line-clamp-1">
                    {top3.student.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    {top3.totalCount} stickers obtenidos
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Certificate Selection & Action Buttons */}
          <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Emitir Certificado para:</span>
              <select
                id="select-certificate-student"
                value={currentCertificateStudent?.student.id}
                onChange={(e) => {
                  const st = studentStats.find((s) => s.student.id === e.target.value);
                  if (st) setSelectedStudentForCertificate(st);
                }}
                className="text-xs font-semibold rounded-lg border border-slate-300 px-2.5 py-1.5 bg-slate-50 focus:outline-hidden focus:ring-2 focus:ring-red-500"
              >
                {sortedStudents.map((s, idx) => (
                  <option key={s.student.id} value={s.student.id}>
                    {idx + 1}.º - {s.student.name} ({s.totalCount} ⭐)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyParentNote}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                title="Copiar mensaje para grupo de familias/padres"
              >
                {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMessage ? '¡Copiado!' : 'Mensaje para Familias'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrintCertificate}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Certificado</span>
              </button>
            </div>
          </div>

          {/* OFFICIAL CERTIFICATE (Printable & Viewable) */}
          {currentCertificateStudent && (
            <div
              id="printable-certificate"
              className="relative p-6 sm:p-8 bg-white border-4 border-double border-red-600 rounded-2xl shadow-inner text-center text-slate-900"
            >
              {/* Corner decorative stars */}
              <span className="absolute top-3 left-3 text-red-600 text-lg">✦</span>
              <span className="absolute top-3 right-3 text-red-600 text-lg">✦</span>
              <span className="absolute bottom-3 left-3 text-red-600 text-lg">✦</span>
              <span className="absolute bottom-3 right-3 text-red-600 text-lg">✦</span>

              <div className="max-w-xl mx-auto space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <CompassLogo size="lg" className="rounded-full shadow-lg" />
                </div>

                <p className="text-xs uppercase font-extrabold tracking-widest text-red-700">
                  {turma.schoolName}
                </p>

                <h3 className="text-xl sm:text-2xl font-serif-display font-bold text-slate-900 tracking-wide uppercase">
                  Certificado de Alumno Destacado
                </h3>

                <p className="text-xs text-slate-600 italic">
                  Reconocimiento al mérito y dedicación a los estudios
                </p>

                <div className="py-2">
                  <p className="text-xs text-slate-500 font-medium">Otorgado con orgullo a:</p>
                  <p className="text-xl sm:text-2xl font-serif-display font-bold text-red-700 underline decoration-red-300 underline-offset-4 mt-1">
                    {currentCertificateStudent.student.name}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-lg mx-auto">
                  Por su excelente desempeño, puntualidad y dedicación, habiendo entregado con esmero{' '}
                  <strong className="text-slate-900">{currentCertificateStudent.totalCount} actividades</strong> en el cuadro de desempeño durante el mes de{' '}
                  <strong className="text-slate-900">{formatMonthLabel(selectedMonth)}</strong> en la clase {turma.name}.
                </p>

                {/* Stickers showcase inside certificate */}
                <div className="flex items-center justify-center gap-1.5 flex-wrap py-2">
                  {currentCertificateStudent.stickers.slice(0, 10).map((stk, i) => (
                    <span key={i} className="text-lg" title={stk.activityTitle}>
                      {stk.emoji}
                    </span>
                  ))}
                  {currentCertificateStudent.stickers.length > 10 && (
                    <span className="text-xs font-bold text-red-700">
                      +¡{currentCertificateStudent.stickers.length - 10} más!
                    </span>
                  )}
                </div>

                {/* Signatures */}
                <div className="pt-6 mt-4 border-t border-red-200 flex items-end justify-around text-xs text-slate-600 gap-6">
                  <div className="text-center w-40">
                    <div className="border-b border-slate-400 pb-1 mb-1 font-medium italic text-slate-800">
                      {turma.teacherName}
                    </div>
                    <span className="text-[11px] text-slate-500">Profesora Responsable</span>
                  </div>

                  <div className="text-center w-40">
                    <div className="border-b border-slate-400 pb-1 mb-1 font-medium italic text-slate-800">
                      {new Date().toLocaleDateString('es-ES')}
                    </div>
                    <span className="text-[11px] text-slate-500">Fecha de Emisión</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 no-print shrink-0">
          <span>{turma.monthlyRewardDescription}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-bold rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
