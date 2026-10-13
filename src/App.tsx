import React, { useState, useEffect, useMemo } from 'react';
import { Plus, UserPlus, GraduationCap, School, Layers, Sparkles, Pencil } from 'lucide-react';
import { Header } from './components/Header';
import { MonthlyGoalBanner } from './components/MonthlyGoalBanner';
import { BoardTable } from './components/BoardTable';
import { AddStickerModal } from './components/AddStickerModal';
import { MonthlyHighlightModal } from './components/MonthlyHighlightModal';
import { StudentDetailModal } from './components/StudentDetailModal';
import { AddStudentModal } from './components/AddStudentModal';
import { EditStudentModal } from './components/EditStudentModal';
import { AddTurmaModal } from './components/AddTurmaModal';
import { TurmaSettingsModal } from './components/TurmaSettingsModal';
import { AuthModal } from './components/AuthModal';
import { MonthNavigationBanner } from './components/MonthNavigationBanner';
import { RestoreMonthModal } from './components/RestoreMonthModal';
import { Turma, Student, StickerRecord, StudentStats, UserAccount } from './types';
import { INITIAL_TURMAS, INITIAL_STUDENTS, getInitialStickers } from './data/initialData';
import { getCurrentMonthKey, formatMonthLabel } from './utils/date';
import { playStarSound } from './utils/audio';
import {
  saveTurmaToFirestore,
  deleteTurmaFromFirestore,
  saveStudentToFirestore,
  deleteStudentFromFirestore,
  saveStickerToFirestore,
  deleteStickerFromFirestore,
  subscribeTurmas,
  subscribeStudents,
  subscribeStickers,
  subscribeUsers,
  saveUserToFirestore,
  DEFAULT_MASTER_USER,
  initializeFirestoreIfEmpty,
} from './services/firebase';

const STORAGE_KEYS = {
  TURMAS: 'quadro_turmas_rh_v3',
  STUDENTS: 'quadro_students_rh_v3',
  STICKERS: 'quadro_stickers_rh_v3',
  SOUND: 'quadro_sound_rh_v3',
  SELECTED_TURMA_FILTER: 'quadro_filter_turma_rh_v3',
  SELECTED_MONTH: 'quadro_selected_month_rh_v3',
  USER: 'quadro_active_user_rh_v3',
  USERS: 'quadro_registered_users_rh_v3',
};

export default function App() {
  // Load data from localStorage or initial state as immediate fast cache
  const [turmas, setTurmas] = useState<Turma[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TURMAS);
      return saved ? JSON.parse(saved) : INITIAL_TURMAS;
    } catch {
      return INITIAL_TURMAS;
    }
  });

  // 'all' means all turmas are shown grouped as separate tables, or a specific turma id
  const [selectedTurmaFilter, setSelectedTurmaFilter] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_TURMA_FILTER);
      if (saved && (saved === 'all' || turmas.some((t) => t.id === saved))) return saved;
    } catch {}
    return 'all';
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [stickers, setStickers] = useState<StickerRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STICKERS);
      return saved ? JSON.parse(saved) : getInitialStickers();
    } catch {
      return getInitialStickers();
    }
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOUND);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Default to September 2026 ('2026-09') where user's 166 activities and stars are stored, or saved preference
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_MONTH);
      if (saved) return saved;
    } catch {}
    return '2026-09';
  });
  const [firestoreStatus, setFirestoreStatus] = useState<'connected' | 'syncing' | 'offline'>('syncing');

  // User Authentication State (Default: aqueiroz / Maestra Anne)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_MASTER_USER;
  });

  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [DEFAULT_MASTER_USER];
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);

  // Modal visibility states
  const [isHighlightModalOpen, setIsHighlightModalOpen] = useState(false);
  const [activeTurmaForHighlight, setActiveTurmaForHighlight] = useState<Turma>(() => turmas[0] || INITIAL_TURMAS[0]);
  const [isAddStickerModalOpen, setIsAddStickerModalOpen] = useState(false);
  const [targetStudentForSticker, setTargetStudentForSticker] = useState<Student | null>(null);
  
  // Student modal states (Add & Edit)
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [defaultTurmaForNewStudent, setDefaultTurmaForNewStudent] = useState<string>(() => turmas[0]?.id || '');
  
  // Turma modal states (Add & Edit/Settings)
  const [isAddTurmaModalOpen, setIsAddTurmaModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [activeTurmaForSettings, setActiveTurmaForSettings] = useState<Turma>(() => turmas[0] || INITIAL_TURMAS[0]);
  
  // Student Detail modal state
  const [detailedStudentStats, setDetailedStudentStats] = useState<StudentStats | null>(null);

  // Firestore initialization and realtime subscription on mount
  useEffect(() => {
    let unsubscribeTurmas: (() => void) | null = null;
    let unsubscribeStudents: (() => void) | null = null;
    let unsubscribeStickers: (() => void) | null = null;
    let unsubscribeUsers: (() => void) | null = null;
    let isMounted = true;

    async function setupFirestore() {
      setFirestoreStatus('syncing');
      try {
        // Initialize Firestore with existing data if Firestore is currently empty
        await initializeFirestoreIfEmpty(turmas, students, stickers);

        // Subscribe to Users collection
        unsubscribeUsers = subscribeUsers(
          (remoteUsers) => {
            if (!isMounted) return;
            if (remoteUsers.length > 0) {
              const hasMaster = remoteUsers.some(
                (u) => u.username.toLowerCase() === DEFAULT_MASTER_USER.username.toLowerCase()
              );
              setRegisteredUsers(hasMaster ? remoteUsers : [DEFAULT_MASTER_USER, ...remoteUsers]);
            }
          },
          (err) => console.warn('Usuarios offline:', err)
        );

        // Subscribe to Turmas collection
        unsubscribeTurmas = subscribeTurmas(
          (remoteTurmas) => {
            if (!isMounted) return;
            if (remoteTurmas.length > 0) {
              setTurmas(remoteTurmas);
            }
            setFirestoreStatus('connected');
          },
          () => {
            if (isMounted) setFirestoreStatus('offline');
          }
        );

        // Subscribe to Students collection
        unsubscribeStudents = subscribeStudents(
          (remoteStudents) => {
            if (!isMounted) return;
            setStudents(remoteStudents);
            setFirestoreStatus('connected');
          },
          () => {
            if (isMounted) setFirestoreStatus('offline');
          }
        );

        // Subscribe to Stickers collection
        unsubscribeStickers = subscribeStickers(
          (remoteStickers) => {
            if (!isMounted) return;
            setStickers(remoteStickers);
            setFirestoreStatus('connected');
          },
          () => {
            if (isMounted) setFirestoreStatus('offline');
          }
        );
      } catch (err) {
        console.error('Erro na sincronização inicial com o Firestore:', err);
        if (isMounted) setFirestoreStatus('offline');
      }
    }

    setupFirestore();

    return () => {
      isMounted = false;
      unsubscribeTurmas?.();
      unsubscribeStudents?.();
      unsubscribeStickers?.();
      unsubscribeUsers?.();
    };
  }, []);

  // Sync state changes with localStorage as offline cache
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch {}
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(registeredUsers));
    } catch {}
  }, [registeredUsers]);

  // Sync state changes with localStorage as offline cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TURMAS, JSON.stringify(turmas));
    } catch {}
  }, [turmas]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_TURMA_FILTER, selectedTurmaFilter);
    } catch {}
  }, [selectedTurmaFilter]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch {}
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STICKERS, JSON.stringify(stickers));
    } catch {}
  }, [stickers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND, JSON.stringify(soundEnabled));
    } catch {}
  }, [soundEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_MONTH, selectedMonth);
    } catch {}
  }, [selectedMonth]);

  // Visible turmas for the logged-in user:
  // If user is 'aqueiroz', they own the original classes and anything assigned to aqueiroz or unassigned.
  // If any other user creates an account, they get their own panels!
  const userTurmas = useMemo(() => {
    if (!currentUser) return turmas;
    const isAqueiroz =
      currentUser.username.toLowerCase() === 'aqueiroz' ||
      currentUser.id === DEFAULT_MASTER_USER.id;

    if (isAqueiroz) {
      return turmas.filter(
        (t) => !t.ownerId || t.ownerId === DEFAULT_MASTER_USER.id || t.ownerId === currentUser.id
      );
    }

    return turmas.filter((t) => t.ownerId === currentUser.id);
  }, [turmas, currentUser]);

  // Active single turma for banners/headers if not 'all'
  const currentTurma = useMemo(() => {
    if (selectedTurmaFilter !== 'all') {
      return userTurmas.find((t) => t.id === selectedTurmaFilter) || userTurmas[0];
    }
    return userTurmas[0] || INITIAL_TURMAS[0];
  }, [userTurmas, selectedTurmaFilter]);

  // Helper: compute stats for any list of students in the current month
  const computeStudentStats = (studentList: Student[]): StudentStats[] => {
    const monthStickers = stickers.filter((stk) => stk.monthKey === selectedMonth);

    const mapped = studentList.map((student) => {
      const studentStickers = monthStickers.filter((stk) => stk.studentId === student.id);
      const uniqueActivities = new Set(studentStickers.map((s) => s.activityTitle.toLowerCase())).size;

      return {
        student,
        stickers: studentStickers,
        totalCount: studentStickers.length,
        uniqueActivities,
        rank: 1,
      };
    });

    // Sort to determine ranks
    const sorted = [...mapped].sort((a, b) => b.totalCount - a.totalCount);
    sorted.forEach((item, index) => {
      item.rank = index + 1;
    });

    return sorted;
  };

  // Overall student stats (across all active students)
  const overallStudentStats = useMemo(() => {
    const visibleTurmaIds = new Set(userTurmas.map((t) => t.id));
    return computeStudentStats(students.filter((s) => s.active && visibleTurmaIds.has(s.turmaId)));
  }, [students, stickers, selectedMonth, userTurmas]);

  const topOverallStudent = overallStudentStats.length > 0 && overallStudentStats[0].totalCount > 0
    ? overallStudentStats[0]
    : null;

  // Turmas to render on the page
  const turmasToDisplay = useMemo(() => {
    if (selectedTurmaFilter === 'all') {
      return userTurmas;
    }
    const found = userTurmas.filter((t) => t.id === selectedTurmaFilter);
    return found.length > 0 ? found : userTurmas;
  }, [userTurmas, selectedTurmaFilter]);

  // Handler: Quick Star Award (+⭐ or custom turma emoji) -> Saved immediately to Firestore
  const handleQuickAddStar = async (student: Student) => {
    const studentTurma = turmas.find((t) => t.id === student.turmaId);
    const starEmoji = studentTurma?.starEmoji || '⭐';

    const newSticker: StickerRecord = {
      id: `stk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      studentId: student.id,
      emoji: starEmoji,
      label: starEmoji === '⭐' ? 'Estrella Dorada' : `Estrella / ${starEmoji}`,
      activityTitle: 'Actividad Entregada',
      timestamp: new Date().toISOString(),
      monthKey: selectedMonth,
    };

    setStickers((prev) => [...prev, newSticker]);
    if (soundEnabled) {
      playStarSound();
    }

    setFirestoreStatus('syncing');
    try {
      await saveStickerToFirestore(newSticker);
      setFirestoreStatus('connected');
    } catch (err) {
      console.error('Erro ao salvar estrelinha no Firestore:', err);
      setFirestoreStatus('offline');
    }
  };

  // Handler: Update Turma Goal (number of activities) -> Saved immediately to Firestore
  const handleUpdateTurmaGoal = async (turmaId: string, newGoal: number) => {
    const targetTurma = turmas.find((t) => t.id === turmaId);
    if (!targetTurma) return;
    const updatedTurma: Turma = {
      ...targetTurma,
      monthlyGoal: Math.max(1, newGoal),
    };

    setTurmas((prev) => prev.map((t) => (t.id === turmaId ? updatedTurma : t)));
    setFirestoreStatus('syncing');
    try {
      await saveTurmaToFirestore(updatedTurma);
      setFirestoreStatus('connected');
    } catch (err) {
      console.error('Erro ao salvar meta no Firestore:', err);
      setFirestoreStatus('offline');
    }
  };

  // Handler: Update Turma Star Emoji -> Saved immediately to Firestore
  const handleUpdateTurmaStarEmoji = async (turmaId: string, newEmoji: string) => {
    const targetTurma = turmas.find((t) => t.id === turmaId);
    if (!targetTurma) return;
    const cleanEmoji = newEmoji.trim() || '⭐';
    const updatedTurma: Turma = {
      ...targetTurma,
      starEmoji: cleanEmoji,
    };

    setTurmas((prev) => prev.map((t) => (t.id === turmaId ? updatedTurma : t)));
    setFirestoreStatus('syncing');
    try {
      await saveTurmaToFirestore(updatedTurma);
      setFirestoreStatus('connected');
    } catch (err) {
      console.error('Erro ao salvar emoji da turma no Firestore:', err);
      setFirestoreStatus('offline');
    }
  };

  // Handler: Update Individual Sticker Emoji -> Saved immediately to Firestore
  const handleUpdateStickerEmoji = async (stickerId: string, newEmoji: string) => {
    const cleanEmoji = newEmoji.trim() || '⭐';
    setStickers((prev) =>
      prev.map((s) => (s.id === stickerId ? { ...s, emoji: cleanEmoji } : s))
    );

    if (detailedStudentStats) {
      setDetailedStudentStats((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          stickers: prev.stickers.map((s) =>
            s.id === stickerId ? { ...s, emoji: cleanEmoji } : s
          ),
        };
      });
    }

    const targetSticker = stickers.find((s) => s.id === stickerId);
    if (targetSticker) {
      const updatedSticker: StickerRecord = { ...targetSticker, emoji: cleanEmoji };
      setFirestoreStatus('syncing');
      try {
        await saveStickerToFirestore(updatedSticker);
        setFirestoreStatus('connected');
      } catch (err) {
        console.error('Erro ao atualizar emoji do sticker no Firestore:', err);
        setFirestoreStatus('offline');
      }
    }
  };

  // Handler: Add Sticker with custom Emoji & Activity -> Saved immediately to Firestore
  const handleAddSticker = async (studentId: string, emoji: string, label: string, activityTitle: string) => {
    const newSticker: StickerRecord = {
      id: `stk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      studentId,
      emoji,
      label,
      activityTitle,
      timestamp: new Date().toISOString(),
      monthKey: selectedMonth,
    };

    setStickers((prev) => [...prev, newSticker]);
    if (soundEnabled) {
      playStarSound();
    }

    setFirestoreStatus('syncing');
    try {
      await saveStickerToFirestore(newSticker);
      setFirestoreStatus('connected');
    } catch (err) {
      console.error('Erro ao salvar sticker no Firestore:', err);
      setFirestoreStatus('offline');
    }
  };

  // Handler: Delete sticker -> Deleted immediately from Firestore
  const handleDeleteSticker = async (stickerId: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== stickerId));

    if (detailedStudentStats) {
      setDetailedStudentStats((prev) => {
        if (!prev) return null;
        const updatedStickers = prev.stickers.filter((s) => s.id !== stickerId);
        return {
          ...prev,
          stickers: updatedStickers,
          totalCount: updatedStickers.length,
        };
      });
    }

    setFirestoreStatus('syncing');
    try {
      await deleteStickerFromFirestore(stickerId);
      setFirestoreStatus('connected');
    } catch (err) {
      console.error('Erro ao deletar sticker no Firestore:', err);
      setFirestoreStatus('offline');
    }
  };

  // Handler: Add new student with turma assignment -> Saved immediately to Firestore
  const handleAddStudent = async (name: string, turmaId: string) => {
    const avatarColors = [
      'bg-rose-100 text-rose-700 border-rose-200',
      'bg-sky-100 text-sky-700 border-sky-200',
      'bg-emerald-100 text-emerald-700 border-emerald-200',
      'bg-amber-100 text-amber-700 border-amber-200',
      'bg-purple-100 text-purple-700 border-purple-200',
      'bg-teal-100 text-teal-700 border-teal-200',
      'bg-indigo-100 text-indigo-700 border-indigo-200',
      'bg-orange-100 text-orange-700 border-orange-200',
    ];
    const randomColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

    const newStudent: Student = {
      id: `std-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name,
      avatarColor: randomColor,
      turmaId: turmaId || turmas[0]?.id || 'turma-1',
      active: true,
    };

    setStudents((prev) => [...prev, newStudent]);

    setFirestoreStatus('syncing');
    try {
      await saveStudentToFirestore(newStudent);
      setFirestoreStatus('connected');
    } catch (err) {
      console.error('Erro ao salvar aluno no Firestore:', err);
      setFirestoreStatus('offline');
    }
  };

  // Handler: Open Edit Student Modal
  const handleOpenEditStudent = (student: Student) => {
    setStudentToEdit(student);
    setIsEditStudentModalOpen(true);
  };

  // Handler: Save Edited Student -> Saved immediately to Firestore
  const handleSaveStudent = async (updatedStudent: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));

    if (detailedStudentStats && detailedStudentStats.student.id === updatedStudent.id) {
      setDetailedStudentStats((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          student: updatedStudent,
        };
      });
    }

    setFirestoreStatus('syncing');
    try {
      await saveStudentToFirestore(updatedStudent);
      setFirestoreStatus('connected');
    } catch (err) {
      console.error('Erro ao atualizar aluno no Firestore:', err);
      setFirestoreStatus('offline');
    }
  };

  // Handler: Transfer student between turmas -> Saved immediately to Firestore
  const handleTransferTurma = async (studentId: string, newTurmaId: string) => {
    const targetStudent = students.find((s) => s.id === studentId);
    if (!targetStudent) return;

    const updatedStudent: Student = { ...targetStudent, turmaId: newTurmaId };
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? updatedStudent : s))
    );

    if (detailedStudentStats && detailedStudentStats.student.id === studentId) {
      setDetailedStudentStats((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          student: updatedStudent,
        };
      });
    }

    setFirestoreStatus('syncing');
    try {
      await saveStudentToFirestore(updatedStudent);
      setFirestoreStatus('connected');
    } catch (err) {
      console.error('Erro ao transferir aluno no Firestore:', err);
      setFirestoreStatus('offline');
    }
  };

  // Handler: Delete student -> Deleted immediately from Firestore (along with stickers)
  const handleDeleteStudent = async (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
    setStickers((prev) => prev.filter((stk) => stk.studentId !== studentId));
    if (detailedStudentStats && detailedStudentStats.student.id === studentId) {
      setDetailedStudentStats(null);
    }

    setFirestoreStatus('syncing');
    try {
      await deleteStudentFromFirestore(studentId);
      setFirestoreStatus('connected');
    } catch (err) {
      console.error('Erro ao excluir aluno no Firestore:', err);
      setFirestoreStatus('offline');
    }
  };

  // Handler: Add new Turma -> Saved immediately to Firestore
  const handleAddTurma = async (newTurmaData: Omit<Turma, 'id'>) => {
    const newTurma: Turma = {
      ...newTurmaData,
      id: `turma-${Date.now()}`,
      ownerId: currentUser?.id || DEFAULT_MASTER_USER.id,
    };
    setTurmas((prev) => [...prev, newTurma]);
    setSelectedTurmaFilter(newTurma.id);

    setFirestoreStatus('syncing');
    try {
      await saveTurmaToFirestore(newTurma);
      setFirestoreStatus('connected');
    } catch (err) {
      console.error('Erro ao salvar nova turma no Firestore:', err);
      setFirestoreStatus('offline');
    }
  };

  // Handler: Save Edited Turma Settings -> Saved immediately to Firestore
  const handleSaveTurma = async (updatedTurma: Turma) => {
    setTurmas((prev) => prev.map((t) => (t.id === updatedTurma.id ? updatedTurma : t)));

    setFirestoreStatus('syncing');
    try {
      await saveTurmaToFirestore(updatedTurma);
      setFirestoreStatus('connected');
    } catch (err) {
      console.error('Erro ao salvar configurações da turma no Firestore:', err);
      setFirestoreStatus('offline');
    }
  };

  // Handler: Quick Save Turma Name -> Saved immediately to Firestore
  const handleUpdateTurmaName = async (turmaId: string, newName: string) => {
    const targetTurma = turmas.find((t) => t.id === turmaId);
    if (!targetTurma) return;

    const updatedTurma: Turma = {
      ...targetTurma,
      name: newName,
    };

    setTurmas((prev) => prev.map((t) => (t.id === turmaId ? updatedTurma : t)));

    setFirestoreStatus('syncing');
    try {
      await saveTurmaToFirestore(updatedTurma);
      setFirestoreStatus('connected');
    } catch (err) {
      console.error('Erro ao salvar novo nome da turma no Firestore:', err);
      setFirestoreStatus('offline');
    }
  };

  // Handler: Login Success
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    setSelectedTurmaFilter('all');
  };

  // Handler: Logout / Switch Account
  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthModalOpen(true);
  };

  // Handler: Register New User Account
  const handleRegisterUser = async (newUserData: Omit<UserAccount, 'id' | 'createdAt'>): Promise<UserAccount> => {
    const newUserId = `user-${Date.now()}`;
    const newUser: UserAccount = {
      ...newUserData,
      id: newUserId,
      createdAt: new Date().toISOString(),
    };

    setRegisteredUsers((prev) => [...prev, newUser]);

    setFirestoreStatus('syncing');
    try {
      await saveUserToFirestore(newUser);
      setFirestoreStatus('connected');
    } catch (err) {
      console.error('Erro ao salvar usuario no Firestore:', err);
    }

    // Auto-create starter classroom for the new registered teacher
    const starterTurma: Turma = {
      id: `turma-${Date.now()}`,
      name: `${newUser.name.split(' ')[0]} - Clase 1`,
      teacherName: newUser.name,
      schoolName: newUser.schoolName || 'Mi Escuela',
      monthlyGoal: 8,
      monthlyRewardDescription: 'Certificado de Honor y Reconocimiento',
      starEmoji: '⭐',
      ownerId: newUser.id,
    };

    setTurmas((prev) => [...prev, starterTurma]);
    try {
      await saveTurmaToFirestore(starterTurma);
    } catch (err) {
      console.error('Erro ao criar turma para novo usuário:', err);
    }

    return newUser;
  };

  // Handler: Delete Turma -> Deleted immediately from Firestore
  const handleDeleteTurma = async (turmaId: string) => {
    if (turmas.length <= 1) {
      alert('Debe tener al menos 1 clase registrada en el sistema.');
      return;
    }

    const studentsInThisTurma = students.filter((s) => s.turmaId === turmaId);
    const deletedStudentIds = studentsInThisTurma.map((s) => s.id);
    const deletedStudentSet = new Set(deletedStudentIds);

    setTurmas((prev) => prev.filter((t) => t.id !== turmaId));
    setStudents((prev) => prev.filter((s) => s.turmaId !== turmaId));
    setStickers((prev) => prev.filter((stk) => !deletedStudentSet.has(stk.studentId)));

    if (selectedTurmaFilter === turmaId) {
      setSelectedTurmaFilter('all');
    }

    setFirestoreStatus('syncing');
    try {
      await deleteTurmaFromFirestore(turmaId, deletedStudentIds);
      setFirestoreStatus('connected');
    } catch (err) {
      console.error('Erro ao excluir turma no Firestore:', err);
      setFirestoreStatus('offline');
    }
  };

  // Handler: Reset default demo data
  const handleResetData = async () => {
    setTurmas(INITIAL_TURMAS);
    setStudents(INITIAL_STUDENTS);
    const initStickers = getInitialStickers();
    setStickers(initStickers);
    setSelectedTurmaFilter('all');
    setSelectedMonth(getCurrentMonthKey());

    setFirestoreStatus('syncing');
    try {
      for (const t of INITIAL_TURMAS) {
        await saveTurmaToFirestore(t);
      }
      for (const s of INITIAL_STUDENTS) {
        await saveStudentToFirestore(s);
      }
      for (const stk of initStickers) {
        await saveStickerToFirestore(stk);
      }
      setFirestoreStatus('connected');
    } catch (err) {
      console.error('Erro ao resetar dados no Firestore:', err);
      setFirestoreStatus('offline');
    }
  };

  // Month sticker counts for quick navigation & restore
  const septemberStickersCount = useMemo(() => {
    return stickers.filter((stk) => stk.monthKey === '2026-09').length;
  }, [stickers]);

  const octoberStickersCount = useMemo(() => {
    return stickers.filter((stk) => stk.monthKey === '2026-10').length;
  }, [stickers]);

  // Handler: Restore / Replicate activities from one month to another (e.g. Septiembre -> Octubre)
  const handleRestoreMonth = async (sourceMonth: string, targetMonth: string, targetTurmaId: string) => {
    const sourceStickers = stickers.filter((s) => s.monthKey === sourceMonth);
    const toCopy =
      targetTurmaId === 'all'
        ? sourceStickers
        : sourceStickers.filter((s) => {
            const student = students.find((std) => std.id === s.studentId);
            return student && student.turmaId === targetTurmaId;
          });

    const newStickers: StickerRecord[] = toCopy.map((s) => ({
      ...s,
      id: `stk-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      monthKey: targetMonth,
      timestamp: new Date().toISOString(),
    }));

    setStickers((prev) => [...prev, ...newStickers]);
    setSelectedMonth(targetMonth);

    setFirestoreStatus('syncing');
    try {
      for (const stk of newStickers) {
        await saveStickerToFirestore(stk);
      }
      setFirestoreStatus('connected');
    } catch (err) {
      console.error('Erro ao salvar atividades restauradas no Firestore:', err);
      setFirestoreStatus('offline');
    }
  };

  // Open Add Student Modal targeting a specific turma
  const handleOpenAddStudentForTurma = (turmaId?: string) => {
    setDefaultTurmaForNewStudent(turmaId || (selectedTurmaFilter !== 'all' ? selectedTurmaFilter : turmas[0]?.id || ''));
    setIsAddStudentModalOpen(true);
  };

  // Open Highlight Modal for a specific turma
  const handleOpenHighlightForTurma = (turma: Turma) => {
    setActiveTurmaForHighlight(turma);
    setIsHighlightModalOpen(true);
  };

  // Open Settings/Edit Modal for a specific turma
  const handleOpenSettingsForTurma = (turma: Turma) => {
    setActiveTurmaForSettings(turma);
    setIsSettingsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* App Header */}
      <Header
        currentTurma={currentTurma}
        turmas={userTurmas}
        selectedTurmaId={selectedTurmaFilter}
        onSelectTurma={setSelectedTurmaFilter}
        selectedMonth={selectedMonth}
        onSelectMonth={setSelectedMonth}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenHighlight={() => handleOpenHighlightForTurma(currentTurma)}
        onOpenAddStudent={() => handleOpenAddStudentForTurma()}
        onOpenAddTurma={() => setIsAddTurmaModalOpen(true)}
        onOpenSettings={() => handleOpenSettingsForTurma(currentTurma)}
        topStudentName={topOverallStudent?.student.name}
        topStudentStars={topOverallStudent?.totalCount}
        firestoreStatus={firestoreStatus}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Quick Month Switch & Restore Banner */}
        <MonthNavigationBanner
          selectedMonth={selectedMonth}
          onSelectMonth={setSelectedMonth}
          septemberStickersCount={septemberStickersCount}
          octoberStickersCount={octoberStickersCount}
          onOpenRestoreModal={() => setIsRestoreModalOpen(true)}
        />

        {/* Monthly Goal & Classroom Highlight Banner */}
        <MonthlyGoalBanner
          turma={currentTurma}
          selectedMonth={selectedMonth}
          studentStats={selectedTurmaFilter === 'all' ? overallStudentStats : computeStudentStats(students.filter(s => s.turmaId === currentTurma.id && s.active))}
          onOpenHighlight={() => handleOpenHighlightForTurma(currentTurma)}
          onOpenSettings={() => handleOpenSettingsForTurma(currentTurma)}
          onUpdateGoal={handleUpdateTurmaGoal}
          onUpdateStarEmoji={handleUpdateTurmaStarEmoji}
          isAllTurmas={selectedTurmaFilter === 'all'}
          totalTurmasCount={userTurmas.length}
        />

        {/* Turma Grouping Navigation Bar */}
        <div className="mb-6 bg-white p-3 rounded-2xl border border-red-200 shadow-xs no-print">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Left: Turma Tabs */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
                <School className="w-3.5 h-3.5 text-red-600" />
                Clases:
              </span>

              {/* All Turmas Tab */}
              <button
                id="tab-all-turmas"
                type="button"
                onClick={() => setSelectedTurmaFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedTurmaFilter === 'all'
                     ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>📑 Todas las Clases</span>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-full font-black ${
                    selectedTurmaFilter === 'all' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {userTurmas.length}
                </span>
              </button>

              {/* Individual Turma Tabs */}
              {userTurmas.map((t) => {
                const count = students.filter((s) => s.turmaId === t.id && s.active).length;
                const isSelected = selectedTurmaFilter === t.id;
                return (
                  <div key={t.id} className="inline-flex items-center rounded-xl overflow-hidden shadow-2xs border border-transparent">
                    <button
                      id={`tab-turma-${t.id}`}
                      type="button"
                      onClick={() => setSelectedTurmaFilter(t.id)}
                      className={`px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <span>{t.name}</span>
                      <span
                        className={`text-[11px] px-1.5 py-0.5 rounded-full font-black ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                    {/* Quick Edit Turma button in tab */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenSettingsForTurma(t);
                      }}
                      title={`Editar clase ${t.name}`}
                      className={`px-1.5 py-2 text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-red-700 hover:bg-red-800 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 hover:text-red-700 text-slate-400'
                      }`}
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Right: Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                id="btn-bar-add-turma"
                type="button"
                onClick={() => setIsAddTurmaModalOpen(true)}
                className="px-3 py-1.5 rounded-xl border border-red-200 hover:bg-red-50 text-red-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nueva Clase</span>
              </button>

              <button
                id="btn-bar-add-student"
                type="button"
                onClick={() => handleOpenAddStudentForTurma()}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Añadir Alumno</span>
              </button>
            </div>
          </div>
        </div>

        {/* The Virtual Classroom Boards (Grouped per Turma) or Empty State */}
        {turmasToDisplay.length === 0 ? (
          <div className="bg-white rounded-3xl border border-red-200 p-8 sm:p-12 text-center shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-3xl mx-auto mb-4 border border-red-200 shadow-2xs">
              🏫
            </div>
            <h3 className="text-xl font-bold text-slate-800">
              ¡Bienvenido a su Panel, {currentUser?.name || 'Profesor(a)'}!
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto mt-2">
              Aún no tiene clases configuradas. Puede crear su primera clase ahora mismo para comenzar a registrar a sus alumnos y metas.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setIsAddTurmaModalOpen(true)}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Crear mi Primera Clase</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {turmasToDisplay.map((turma) => {
              const turmaStudents = students.filter((s) => s.turmaId === turma.id && s.active);
              const turmaStats = computeStudentStats(turmaStudents);

              return (
                <section key={turma.id} id={`section-turma-${turma.id}`} aria-label={`Tabla de la clase ${turma.name}`}>
                  <BoardTable
                    turma={turma}
                    studentStats={turmaStats}
                    monthlyGoal={turma.monthlyGoal}
                    selectedMonthLabel={formatMonthLabel(selectedMonth)}
                    onQuickAddStar={handleQuickAddStar}
                    onOpenAddStickerModal={(student) => {
                      setTargetStudentForSticker(student);
                      setIsAddStickerModalOpen(true);
                    }}
                    onOpenStudentDetail={(stats) => setDetailedStudentStats(stats)}
                    onDeleteSticker={handleDeleteSticker}
                    onOpenAddStudent={(turmaId) => handleOpenAddStudentForTurma(turmaId || turma.id)}
                    onOpenEditStudent={handleOpenEditStudent}
                    onOpenHighlight={() => handleOpenHighlightForTurma(turma)}
                    onOpenSettings={() => handleOpenSettingsForTurma(turma)}
                    onUpdateTurmaGoal={handleUpdateTurmaGoal}
                    onUpdateTurmaStarEmoji={handleUpdateTurmaStarEmoji}
                    onUpdateTurmaName={handleUpdateTurmaName}
                    isAllTurmasView={selectedTurmaFilter === 'all'}
                  />
                </section>
              );
            })}
          </div>
        )}
      </main>

      {/* Modals */}
      {/* 1. Add Sticker & Activity Modal */}
      <AddStickerModal
        isOpen={isAddStickerModalOpen}
        onClose={() => {
          setIsAddStickerModalOpen(false);
          setTargetStudentForSticker(null);
        }}
        students={students.filter((s) => s.active)}
        turmas={userTurmas}
        initialStudentId={targetStudentForSticker?.id}
        onAddSticker={handleAddSticker}
      />

      {/* 2. Monthly Highlight & Award Ceremony Modal */}
      <MonthlyHighlightModal
        isOpen={isHighlightModalOpen}
        onClose={() => setIsHighlightModalOpen(false)}
        studentStats={computeStudentStats(students.filter((s) => s.turmaId === activeTurmaForHighlight.id && s.active))}
        selectedMonth={selectedMonth}
        turma={activeTurmaForHighlight}
        soundEnabled={soundEnabled}
      />

      {/* 3. Student Individual History & Detail Modal */}
      <StudentDetailModal
        isOpen={detailedStudentStats !== null}
        onClose={() => setDetailedStudentStats(null)}
        stats={detailedStudentStats}
        monthlyGoal={
          (detailedStudentStats &&
            turmas.find((t) => t.id === detailedStudentStats.student.turmaId)?.monthlyGoal) ||
          currentTurma.monthlyGoal
        }
        turmas={userTurmas}
        onOpenAddSticker={(student) => {
          setTargetStudentForSticker(student);
          setIsAddStickerModalOpen(true);
        }}
        onDeleteSticker={handleDeleteSticker}
        onTransferTurma={handleTransferTurma}
        onDeleteStudent={handleDeleteStudent}
        onOpenEditStudent={handleOpenEditStudent}
        onUpdateStickerEmoji={handleUpdateStickerEmoji}
      />

      {/* 4. Add Student Modal */}
      <AddStudentModal
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
        turmas={userTurmas}
        defaultTurmaId={defaultTurmaForNewStudent}
        onAddStudent={handleAddStudent}
        onOpenCreateTurma={() => setIsAddTurmaModalOpen(true)}
      />

      {/* 5. Edit Student Modal */}
      <EditStudentModal
        isOpen={isEditStudentModalOpen}
        onClose={() => {
          setIsEditStudentModalOpen(false);
          setStudentToEdit(null);
        }}
        student={studentToEdit}
        turmas={userTurmas}
        onSaveStudent={handleSaveStudent}
        onDeleteStudent={handleDeleteStudent}
      />

      {/* 6. Add Turma Modal */}
      <AddTurmaModal
        isOpen={isAddTurmaModalOpen}
        onClose={() => setIsAddTurmaModalOpen(false)}
        onAddTurma={handleAddTurma}
        defaultSchoolName={currentUser?.schoolName || 'Rincón Hispano'}
        defaultTeacherName={currentUser?.name || 'Maestra Anne'}
      />

      {/* 7. Edit Turma / Turma Settings Modal */}
      <TurmaSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        turma={activeTurmaForSettings}
        onSaveTurma={handleSaveTurma}
        onResetData={handleResetData}
        onDeleteTurma={handleDeleteTurma}
        totalTurmasCount={userTurmas.length}
        studentsInTurmaCount={students.filter((s) => s.turmaId === activeTurmaForSettings.id).length}
      />

      {/* 8. Auth Modal (Login & Crear Cuenta) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onRegisterUser={handleRegisterUser}
        registeredUsers={registeredUsers}
      />

      {/* 9. Restore / Replicate Month Modal */}
      <RestoreMonthModal
        isOpen={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        turmas={userTurmas}
        students={students}
        stickers={stickers}
        onConfirmRestore={handleRestoreMonth}
        currentSelectedTurmaId={selectedTurmaFilter}
      />
    </div>
  );
}
