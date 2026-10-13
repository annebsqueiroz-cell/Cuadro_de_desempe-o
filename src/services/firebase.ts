import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  getDocFromServer,
  writeBatch,
  Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Turma, Student, StickerRecord, UserAccount } from '../types';

export const DEFAULT_MASTER_USER: UserAccount = {
  id: 'user-aqueiroz',
  username: 'aqueiroz',
  name: 'Maestra Anne',
  password: '100%Jesus',
  schoolName: 'Rincón Hispano',
  email: 'annebsqueiroz@gmail.com',
  createdAt: '2026-09-01T00:00:00Z',
};

// Initialize Firebase App & Services
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);

// Test connection on app startup (as required by Firestore guidelines)
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'turmas', 'connection-probe'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Verifique sua conexão com o Firebase Firestore.');
    }
  }
}
testConnection();

// Standard Firestore Error Handling conforming to FirestoreErrorInfo specification
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ---------------------------------------------------------------------------
// Realtime Subscriptions (onSnapshot)
// ---------------------------------------------------------------------------

export function subscribeTurmas(
  onUpdate: (turmas: Turma[]) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const path = 'turmas';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: Turma[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Turma;
        list.push({ ...data, id: docSnap.id });
      });
      onUpdate(list);
    },
    (error) => {
      console.error('Error listening to turmas:', error);
      onError?.(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export function subscribeStudents(
  onUpdate: (students: Student[]) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const path = 'students';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: Student[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Student;
        list.push({ ...data, id: docSnap.id });
      });
      onUpdate(list);
    },
    (error) => {
      console.error('Error listening to students:', error);
      onError?.(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export function subscribeStickers(
  onUpdate: (stickers: StickerRecord[]) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const path = 'stickers';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: StickerRecord[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as StickerRecord;
        list.push({ ...data, id: docSnap.id });
      });
      onUpdate(list);
    },
    (error) => {
      console.error('Error listening to stickers:', error);
      onError?.(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export function subscribeUsers(
  onUpdate: (users: UserAccount[]) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const path = 'users';
  return onSnapshot(
    collection(db, path),
    (snapshot) => {
      const list: UserAccount[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as UserAccount;
        list.push({ ...data, id: docSnap.id });
      });
      onUpdate(list);
    },
    (error) => {
      console.error('Error listening to users:', error);
      onError?.(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// ---------------------------------------------------------------------------
// CRUD Operations
// ---------------------------------------------------------------------------

// Users
export async function saveUserToFirestore(user: UserAccount): Promise<void> {
  const path = `users/${user.id}`;
  try {
    await setDoc(doc(db, 'users', user.id), user, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Turmas
export async function saveTurmaToFirestore(turma: Turma): Promise<void> {
  const path = `turmas/${turma.id}`;
  try {
    await setDoc(doc(db, 'turmas', turma.id), turma, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteTurmaFromFirestore(turmaId: string, studentIds: string[]): Promise<void> {
  const path = `turmas/${turmaId}`;
  try {
    const batch = writeBatch(db);
    // Delete turma document
    batch.delete(doc(db, 'turmas', turmaId));

    // Delete associated student documents
    for (const studentId of studentIds) {
      batch.delete(doc(db, 'students', studentId));
    }

    // Also remove stickers of those students
    const stickersSnap = await getDocs(collection(db, 'stickers'));
    stickersSnap.forEach((stkDoc) => {
      const stk = stkDoc.data() as StickerRecord;
      if (studentIds.includes(stk.studentId)) {
        batch.delete(doc(db, 'stickers', stkDoc.id));
      }
    });

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Students
export async function saveStudentToFirestore(student: Student): Promise<void> {
  const path = `students/${student.id}`;
  try {
    await setDoc(doc(db, 'students', student.id), student, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteStudentFromFirestore(studentId: string): Promise<void> {
  const path = `students/${studentId}`;
  try {
    const batch = writeBatch(db);
    batch.delete(doc(db, 'students', studentId));

    // Also delete any stickers awarded to this student
    const stickersSnap = await getDocs(collection(db, 'stickers'));
    stickersSnap.forEach((stkDoc) => {
      const stk = stkDoc.data() as StickerRecord;
      if (stk.studentId === studentId) {
        batch.delete(doc(db, 'stickers', stkDoc.id));
      }
    });

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Stickers
export async function saveStickerToFirestore(sticker: StickerRecord): Promise<void> {
  const path = `stickers/${sticker.id}`;
  try {
    await setDoc(doc(db, 'stickers', sticker.id), sticker, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteStickerFromFirestore(stickerId: string): Promise<void> {
  const path = `stickers/${stickerId}`;
  try {
    await deleteDoc(doc(db, 'stickers', stickerId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ---------------------------------------------------------------------------
// Initial Database Seeding / Migration from existing data
// ---------------------------------------------------------------------------
export async function initializeFirestoreIfEmpty(
  fallbackTurmas: Turma[],
  fallbackStudents: Student[],
  fallbackStickers: StickerRecord[]
): Promise<boolean> {
  try {
    // Ensure default master user exists in users collection
    const usersSnap = await getDocs(collection(db, 'users'));
    if (usersSnap.size === 0) {
      await setDoc(doc(db, 'users', DEFAULT_MASTER_USER.id), DEFAULT_MASTER_USER);
    }

    const turmasSnap = await getDocs(collection(db, 'turmas'));
    if (turmasSnap.size > 0) {
      // Database already has data! Never overwrite or delete existing records.
      return false;
    }

    console.log('Firestore is empty. Initializing with existing or default base data...');
    const batch = writeBatch(db);

    batch.set(doc(db, 'users', DEFAULT_MASTER_USER.id), DEFAULT_MASTER_USER);

    fallbackTurmas.forEach((turma) => {
      batch.set(doc(db, 'turmas', turma.id), turma);
    });

    fallbackStudents.forEach((student) => {
      batch.set(doc(db, 'students', student.id), student);
    });

    fallbackStickers.forEach((sticker) => {
      batch.set(doc(db, 'stickers', sticker.id), sticker);
    });

    await batch.commit();
    console.log('Firestore initialization complete!');
    return true;
  } catch (error) {
    console.error('Failed to initialize Firestore:', error);
    return false;
  }
}
