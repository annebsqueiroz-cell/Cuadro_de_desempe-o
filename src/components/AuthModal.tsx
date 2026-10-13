import React, { useState } from 'react';
import { LogIn, UserPlus, KeyRound, User, School, Sparkles, CheckCircle2, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { UserAccount } from '../types';
import { DEFAULT_MASTER_USER } from '../services/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  onRegisterUser: (newUser: Omit<UserAccount, 'id' | 'createdAt'>) => Promise<UserAccount>;
  registeredUsers: UserAccount[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onRegisterUser,
  registeredUsers,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state - pre-filled with aqueiroz credentials as requested!
  const [loginUsername, setLoginUsername] = useState('aqueiroz');
  const [loginPassword, setLoginPassword] = useState('100%Jesus');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regSchool, setRegSchool] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const trimmedUser = loginUsername.trim().toLowerCase();
    const trimmedPass = loginPassword.trim();

    if (!trimmedUser || !trimmedPass) {
      setLoginError('Por favor ingrese su usuario y contraseña.');
      return;
    }

    // Check master default user
    if (
      (trimmedUser === DEFAULT_MASTER_USER.username.toLowerCase() ||
        trimmedUser === (DEFAULT_MASTER_USER.email?.toLowerCase() || '')) &&
      trimmedPass === DEFAULT_MASTER_USER.password
    ) {
      onLoginSuccess(DEFAULT_MASTER_USER);
      return;
    }

    // Check registered users from Firestore / state
    const matchedUser = registeredUsers.find(
      (u) =>
        (u.username.toLowerCase() === trimmedUser ||
          (u.email && u.email.toLowerCase() === trimmedUser)) &&
        u.password === trimmedPass
    );

    if (matchedUser) {
      onLoginSuccess(matchedUser);
      return;
    }

    setLoginError('Usuario o contraseña incorrectos. Por favor verifique sus datos.');
  };

  const handleQuickLoginMaster = () => {
    setLoginUsername(DEFAULT_MASTER_USER.username);
    setLoginPassword(DEFAULT_MASTER_USER.password);
    setLoginError('');
    onLoginSuccess(DEFAULT_MASTER_USER);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    const trimmedName = regName.trim();
    const trimmedUsername = regUsername.trim().toLowerCase();
    const trimmedSchool = regSchool.trim();
    const trimmedPass = regPassword.trim();

    if (!trimmedName || !trimmedUsername || !trimmedPass) {
      setRegError('Todos los campos marcados con * son obligatorios.');
      return;
    }

    if (trimmedPass.length < 4) {
      setRegError('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    if (trimmedPass !== regConfirmPassword.trim()) {
      setRegError('Las contraseñas no coinciden.');
      return;
    }

    // Verify username not already taken
    if (
      trimmedUsername === DEFAULT_MASTER_USER.username.toLowerCase() ||
      registeredUsers.some((u) => u.username.toLowerCase() === trimmedUsername)
    ) {
      setRegError(`El nombre de usuario "${trimmedUsername}" ya está registrado. Por favor elija otro.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const createdUser = await onRegisterUser({
        name: trimmedName,
        username: trimmedUsername,
        schoolName: trimmedSchool || 'Mi Escuela',
        password: trimmedPass,
      });
      onLoginSuccess(createdUser);
    } catch (err) {
      console.error('Error registrando usuario:', err);
      setRegError('Ocurrió un error al registrar la cuenta. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl border border-red-200 shadow-2xl max-w-md w-full overflow-hidden my-8">
        {/* Banner Header */}
        <div className="p-6 bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-2xl shadow-inner">
              ⭐
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>Rincón Hispano</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h2>
              <p className="text-xs text-red-100 font-medium">Cuadro de Desempeño Escolar</p>
            </div>
          </div>

          <p className="text-xs text-red-100/90 mt-3 leading-relaxed">
            Inicie sesión para acceder a sus clases, alumnos y herramientas de incentivo, o cree una nueva cuenta.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 p-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setLoginError('');
            }}
            className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-red-700 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Iniciar Sesión</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setRegError('');
            }}
            className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white text-red-700 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Crear Cuenta</span>
          </button>
        </div>

        {/* Tab 1: LOGIN */}
        {activeTab === 'login' && (
          <div className="p-6 space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {loginError}
              </div>
            )}

            {/* Quick 1-click access banner for Maestra Anne */}
            <div className="p-3.5 bg-amber-50/90 border border-amber-200/80 rounded-2xl flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-amber-900 flex items-center gap-1">
                  <span>Acceso directo Maestra Anne</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 font-mono">aqueiroz</span>
                </div>
                <div className="text-[11px] text-amber-700">Clases guardadas Nivel 1 y Nivel 2</div>
              </div>
              <button
                type="button"
                onClick={handleQuickLoginMaster}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Entrar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Usuario o Correo
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="aqueiroz"
                    className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden font-medium text-slate-900"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-sm pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden font-medium text-slate-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Entrar al Panel de Clases (↵ Enter)</span>
                </button>
              </div>
            </form>

            <div className="text-center pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                ¿No tiene cuenta aún?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-red-700 font-bold hover:underline cursor-pointer"
                >
                  Crear cuenta nueva con sus propios paneles
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: REGISTER */}
        {activeTab === 'register' && (
          <div className="p-6 space-y-4">
            {regError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {regError}
              </div>
            )}

            <div className="p-3 bg-red-50/70 border border-red-200/80 rounded-2xl flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs text-red-900">
                <p className="font-bold">Mismas herramientas para sus paneles:</p>
                <p className="text-[11px] text-red-700 mt-0.5">
                  Podrá crear sus clases, añadir alumnos, otorgar estrellitas, registrar actividades y emitir diplomas.
                </p>
              </div>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Nombre Completo / Profesor(a) *
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Ej: Prof. Mariana Morales"
                  className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Usuario *
                  </label>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="ej: mmorales"
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Escuela / Sede
                  </label>
                  <input
                    type="text"
                    value={regSchool}
                    onChange={(e) => setRegSchool(e.target.value)}
                    placeholder="Ej: Rincón Hispano"
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Contraseña *
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mínimo 4 caracteres"
                    className="w-full text-sm px-3 py-2 pr-10 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden text-slate-900"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Confirmar Contraseña *
                </label>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Repita su contraseña"
                  className="w-full text-sm px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-red-500 focus:outline-hidden text-slate-900"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta y Empezar mi Panel'}</span>
                </button>
              </div>
            </form>

            <div className="text-center pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                ¿Ya tiene cuenta?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-red-700 font-bold hover:underline cursor-pointer"
                >
                  Iniciar sesión
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
