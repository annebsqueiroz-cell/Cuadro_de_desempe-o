export interface StickerRecord {
  id: string;
  studentId: string;
  emoji: string;
  label: string;
  activityTitle: string;
  timestamp: string; // ISO string
  monthKey: string; // e.g. '2026-09'
}

export interface Student {
  id: string;
  name: string;
  avatarColor: string;
  turmaId: string;
  active: boolean;
}

export interface Turma {
  id: string;
  name: string;
  teacherName: string;
  schoolName: string;
  monthlyGoal: number; // e.g. 10 stickers
  monthlyRewardDescription: string; // e.g. "Dia de cinema com pipoca e certificado de honra"
  starEmoji?: string; // e.g. "⭐", "🌟", "✨", "🚀", or any custom emoji
  ownerId?: string; // user ID who created/owns this panel (e.g. 'user-aqueiroz')
}

export interface UserAccount {
  id: string;
  username: string;
  name: string;
  password: string;
  schoolName?: string;
  email?: string;
  createdAt: string;
}

export interface StickerOption {
  emoji: string;
  label: string;
  category: 'estrelas' | 'atividades' | 'conquistas' | 'elogios' | 'estrellas' | 'actividades' | 'logros';
}

export interface StudentStats {
  student: Student;
  stickers: StickerRecord[];
  totalCount: number;
  uniqueActivities: number;
  rank: number;
}
