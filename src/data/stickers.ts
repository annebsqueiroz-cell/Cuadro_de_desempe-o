import { StickerOption } from '../types';

export const AVAILABLE_STICKERS: StickerOption[] = [
  // Estrelas / Estrellas & Destaques
  { emoji: '⭐', label: 'Estrella Dorada', category: 'estrellas' },
  { emoji: '🌟', label: 'Super Brillo', category: 'estrellas' },
  { emoji: '✨', label: 'Dedicación & Luz', category: 'estrellas' },
  { emoji: '🏆', label: 'Trofeo Campeón', category: 'estrellas' },
  { emoji: '🎖️', label: 'Medalla de Honor', category: 'estrellas' },
  
  // Atividades & Lições
  { emoji: '📚', label: 'Tarea Entregada', category: 'actividades' },
  { emoji: '📝', label: 'Redacción & Escritura', category: 'actividades' },
  { emoji: '📐', label: 'Matemáticas Sobresaliente', category: 'actividades' },
  { emoji: '📖', label: 'Lectura Completada', category: 'actividades' },
  { emoji: '🎨', label: 'Arte & Creatividad', category: 'actividades' },
  { emoji: '🔬', label: 'Ciencias & Investigación', category: 'actividades' },

  // Conquistas / Logros & Desempenho
  { emoji: '🎯', label: '¡En el Blanco!', category: 'logros' },
  { emoji: '💯', label: '100% Acierto', category: 'logros' },
  { emoji: '🚀', label: 'Gran Progreso', category: 'logros' },
  { emoji: '💡', label: 'Idea Brillante', category: 'logros' },
  { emoji: '⚡', label: 'Rápido y Puntual', category: 'logros' },

  // Elogios & Atitudes
  { emoji: '👏', label: '¡Felicitaciones!', category: 'elogios' },
  { emoji: '💖', label: 'Dedicación Total', category: 'elogios' },
  { emoji: '🤝', label: 'Trabajo en Equipo', category: 'elogios' },
  { emoji: '🌱', label: 'Crecimiento Continuo', category: 'elogios' },
  { emoji: '🌈', label: 'Alegría en el Aula', category: 'elogios' },
];

export const QUICK_ACTIVITY_SUGGESTIONS = [
  'Tarea de Casa Entregada',
  'Cuaderno Impecable',
  'Ejercicio de Matemáticas',
  'Redacción & Texto',
  'Lectura en Voz Alta',
  'Trabajo en Grupo',
  'Participación en Clase',
  'Puntualidad en la Entrega',
  'Excelente Comportamiento',
  'Ayudó a un Compañero',
];
