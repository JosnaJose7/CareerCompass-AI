import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  UserCheck,
  KeyRound,
  ArrowLeft,
  AlertCircle,
  MailCheck
} from 'lucide-react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification
} from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (isNewUser: boolean) => void;
}

type AuthMode = 'login' | 'signup' | 'forgot_password';

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      setInfoMessage(null);
      const res = await signInWithPopup(auth, googleProvider);
      // Check if new user or profile exists
      const isNew = Boolean(res.user?.metadata?.creationTime === res.user?.metadata?.lastSignInTime);
      if (onLoginSuccess) onLoginSuccess(isNew);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setInfoMessage(null);

      if (mode === 'forgot_password') {
        await sendPasswordResetEmail(auth, email);
        setInfoMessage('Password reset link sent to your email. Please check your inbox!');
        setLoading(false);
        return;
      }

      if (!password) {
        setError('Please enter your password');
        setLoading(false);
        return;
      }

      if (mode === 'signup') {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        // Trigger Email Verification
        try {
          if (userCred.user) {
            await sendEmailVerification(userCred.user);
            setInfoMessage('Verification email sent! Please check your inbox to verify your account.');
          }
        } catch (vErr) {
          console.warn('Email verification notification error:', vErr);
        }
        if (onLoginSuccess) onLoginSuccess(true);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        if (onLoginSuccess) onLoginSuccess(false);
      }

      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Try logging in.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long.');
      } else {
        setError(err.message || 'Authentication error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      setInfoMessage(null);
      await signInAnonymously(auth);
      if (onLoginSuccess) onLoginSuccess(false);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to start demo session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-xl bg-[#131724] border border-white/[0.08] text-slate-100 shadow-xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mb-3 shadow-xs">
            {mode === 'forgot_password' ? <KeyRound className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {mode === 'signup' && 'Create CareerCompass Account'}
            {mode === 'login' && 'Welcome Back'}
            {mode === 'forgot_password' && 'Reset Your Password'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'forgot_password'
              ? 'Enter your university email to receive a password reset link.'
              : 'Save your target career paths, skill roadmaps, and resume reviews.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {infoMessage && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span>{infoMessage}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">University Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@stanford.edu"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0E111B] border border-white/[0.12] text-slate-100 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {mode !== 'forgot_password' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot_password');
                      setError(null);
                      setInfoMessage(null);
                    }}
                    className="text-[11px] text-indigo-400 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0E111B] border border-white/[0.12] text-slate-100 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg font-semibold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              'Processing...'
            ) : mode === 'forgot_password' ? (
              'Send Reset Link'
            ) : mode === 'signup' ? (
              'Create Account & Verify'
            ) : (
              'Sign In'
            )}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {mode === 'forgot_password' ? (
          <button
            onClick={() => {
              setMode('login');
              setError(null);
              setInfoMessage(null);
            }}
            className="mt-4 w-full text-center text-xs text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </button>
        ) : (
          <>
            <div className="my-4 flex items-center justify-between text-xs text-slate-500">
              <div className="h-px bg-white/[0.08] w-full" />
              <span className="px-3 text-[10px] font-mono whitespace-nowrap text-slate-500">OR</span>
              <div className="h-px bg-white/[0.08] w-full" />
            </div>

            {/* Google & Demo Actions */}
            <div className="space-y-2">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg font-medium text-xs bg-[#0E111B] hover:bg-white/[0.04] border border-white/[0.10] text-slate-200 transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Continue with Google
              </button>

              <button
                onClick={handleDemoSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-lg font-medium text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                Quick Guest Demo Mode
              </button>
            </div>

            {/* Persistent Login note & Toggle Sign Up / Sign In */}
            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Persistent Session
              </span>
              <div>
                {mode === 'signup' ? 'Already registered?' : "Need an account?"}{' '}
                <button
                  onClick={() => {
                    setMode(mode === 'signup' ? 'login' : 'signup');
                    setError(null);
                    setInfoMessage(null);
                  }}
                  className="text-indigo-400 font-semibold hover:underline cursor-pointer"
                >
                  {mode === 'signup' ? 'Sign In' : 'Sign Up'}
                </button>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

