import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  Lock,
  Mail,
  User,
  AlertCircle,
  CheckCircle,
  X,
  KeyRound,
  UserPlus,
  LogIn,
  Clock,
  Sparkles,
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialMode?: 'login' | 'signup' | 'reset';
}

type AuthMode = 'login' | 'signup' | 'reset';

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}) => {
  const {
    login,
    signUp,
    resetPassword,
    authorizedAdminEmail,
    isSupabaseConfigured,
  } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPendingNotice, setIsPendingNotice] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsPendingNotice(false);
    setLoading(true);

    try {
      if (mode === 'reset') {
        const res = await resetPassword(email);
        if (res.error) {
          setError(res.error);
        } else {
          setMessage(
            res.message || 'Password reset instructions have been sent to your email.'
          );
        }
      } else if (mode === 'signup') {
        if (password !== confirmPassword) {
          setError('Passwords do not match. Please re-enter.');
          setLoading(false);
          return;
        }

        const res = await signUp(email, password, fullName);
        if (res.error) {
          setError(res.error);
        } else {
          if (res.status === 'pending') {
            setIsPendingNotice(true);
            setMessage(
              res.message || 'Your registration is awaiting admin approval.'
            );
          } else {
            setMessage(
              res.message || 'Account created successfully! Check your email to confirm, then sign in.'
            );
          }
          setPassword('');
          setConfirmPassword('');
        }
      } else {
        const res = await login(email, password);
        if (res.error) {
          setError(res.error);
        } else if (res.status === 'pending') {
          setIsPendingNotice(true);
          setMessage('Your registration is awaiting admin approval.');
          // Allow modal to close and transition to member hub pending screen
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 1200);
        } else {
          onSuccess();
          onClose();
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreFillAdmin = () => {
    setEmail(authorizedAdminEmail);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400 mb-3 shadow-inner">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>

          <h2 className="text-xl font-bold tracking-tight">
            {mode === 'login' && 'Sign In to Account'}
            {mode === 'signup' && 'Register New Account'}
            {mode === 'reset' && 'Password Recovery'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Supabase Auth • Role-Based Access Control
          </p>

          {/* Mode Switch Tabs */}
          <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
                setMessage(null);
                setIsPendingNotice(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
                setMessage(null);
                setIsPendingNotice(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('reset');
                setError(null);
                setMessage(null);
                setIsPendingNotice(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mode === 'reset'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {!isSupabaseConfigured && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200">
              <span className="font-bold block">Supabase Publishable Key Required:</span>
              Your project reference is <code className="font-mono text-[11px]">gazndzdqljivpdsobrnq</code>.
              Ensure your publishable key is configured in the environment or Setup Guide.
            </div>
          )}

          {/* Pending Approval Notice Banner */}
          {isPendingNotice && (
            <div className="mb-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>Your registration is awaiting admin approval.</span>
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Your request has been logged in <code className="font-mono">portfolio_user_registrations</code> with status <span className="font-semibold">pending</span>. The administrator ({authorizedAdminEmail}) will review and approve your account.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {message && !isPendingNotice && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 flex items-start gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{message}</span>
            </div>
          )}

          {/* Admin shortcut for owner */}
          {mode === 'login' && (
            <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <div className="truncate">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">
                  Authorized Admin
                </span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold truncate block">
                  {authorizedAdminEmail}
                </span>
              </div>
              <button
                type="button"
                onClick={handlePreFillAdmin}
                className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-[#2563eb] dark:text-blue-300 font-bold hover:bg-blue-100 transition-colors shrink-0 ml-2"
              >
                Fill Email
              </button>
            </div>
          )}

          {mode === 'signup' && (
            <div className="mb-4 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-[11px] text-blue-800 dark:text-blue-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">New User Registration Policy:</span>
                Accounts start in <span className="font-semibold underline">pending</span> status and require admin review before protected member features are unlocked. Only {authorizedAdminEmail} holds administrator authority.
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Doe / QA Recruiter"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={mode === 'login' ? authorizedAdminEmail : 'your.email@example.com'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (min 6 characters)..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  />
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#2563eb] text-white text-sm font-bold hover:bg-[#1d4ed8] shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Processing...</span>
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              ) : mode === 'signup' ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Register for Access</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Send Recovery Email</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 text-[11px] text-center text-slate-500">
          Strict Security: Only <span className="font-semibold text-slate-700 dark:text-slate-300">{authorizedAdminEmail}</span> is authorized as Portfolio Administrator.
        </div>
      </div>
    </div>
  );
};
