import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import type { AuthFormState, AuthMode } from '@/features/auth/types';

const initialState: AuthFormState = {
  email: '',
  password: '',
  passwordConfirmation: '',
  rememberMe: true
};

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formState, setFormState] = useState<AuthFormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { login, requestPasswordReset, resetPassword, status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token') ?? '';

  const title = useMemo(() => {
    if (mode === 'forgot') return 'Recover account access';
    if (mode === 'reset') return 'Set a new password';
    return 'Welcome back';
  }, [mode]);

  const subtitle = useMemo(() => {
    if (mode === 'forgot') return 'We will email a secure reset link to your inbox.';
    if (mode === 'reset') return 'Choose a strong password for your IndustrialGPT workspace.';
    return 'Sign in to continue monitoring operations and evidence.';
  }, [mode]);

  useEffect(() => {
    if (location.pathname === '/forgot-password') {
      setMode('forgot');
      setError(null);
      setSuccessMessage(null);
    } else if (location.pathname === '/reset-password') {
      setMode('reset');
      setError(null);
      setSuccessMessage(null);
    } else {
      setMode('login');
    }
  }, [location.pathname]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === 'forgot') {
        await requestPasswordReset({ email: formState.email });
        setSuccessMessage('If an account exists, a reset link has been sent.');
        setFormState((prev) => ({ ...prev, email: '' }));
      } else if (mode === 'reset') {
        await resetPassword({ token, password: formState.password, passwordConfirmation: formState.passwordConfirmation });
        setSuccessMessage('Password updated. You can sign in with your new password.');
        setMode('login');
        setFormState(initialState);
      } else {
        await login({
          email: formState.email,
          password: formState.password,
          rememberMe: formState.rememberMe
        });
        navigate('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication request failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-glow">
          <ShieldCheck className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate-100">{title}</h2>
          <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {(mode === 'login' || mode === 'forgot') && (
          <label className="block space-y-2 text-sm text-slate-300">
            <span className="font-medium">Email</span>
            <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 focus-within:border-cyan-400">
              <Mail className="h-4 w-4 text-slate-500" />
              <Input
                type="email"
                value={formState.email}
                onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="name@company.com"
                className="border-0 bg-transparent px-0 py-0"
                autoComplete="email"
                required
              />
            </div>
          </label>
        )}

        {mode === 'login' && (
          <label className="block space-y-2 text-sm text-slate-300">
            <span className="font-medium">Password</span>
            <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 focus-within:border-cyan-400">
              <Lock className="h-4 w-4 text-slate-500" />
              <Input
                type="password"
                value={formState.password}
                onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="Enter your password"
                className="border-0 bg-transparent px-0 py-0"
                autoComplete="current-password"
                required
              />
            </div>
          </label>
        )}

        {mode === 'reset' && (
          <>
            <label className="block space-y-2 text-sm text-slate-300">
              <span className="font-medium">New password</span>
              <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 focus-within:border-cyan-400">
                <Lock className="h-4 w-4 text-slate-500" />
                <Input
                  type="password"
                  value={formState.password}
                  onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
                  placeholder="Create a new password"
                  className="border-0 bg-transparent px-0 py-0"
                  autoComplete="new-password"
                  required
                />
              </div>
            </label>
            <label className="block space-y-2 text-sm text-slate-300">
              <span className="font-medium">Confirm password</span>
              <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 focus-within:border-cyan-400">
                <Lock className="h-4 w-4 text-slate-500" />
                <Input
                  type="password"
                  value={formState.passwordConfirmation}
                  onChange={(event) => setFormState((prev) => ({ ...prev, passwordConfirmation: event.target.value }))}
                  placeholder="Confirm password"
                  className="border-0 bg-transparent px-0 py-0"
                  autoComplete="new-password"
                  required
                />
              </div>
            </label>
          </>
        )}

        {mode === 'login' && (
          <div className="flex items-center justify-between text-sm text-slate-400">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formState.rememberMe}
                onChange={(event) => setFormState((prev) => ({ ...prev, rememberMe: event.target.checked }))}
                className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
              />
              Remember me
            </label>
            <button type="button" className="text-cyan-400 transition hover:text-cyan-300" onClick={() => setMode('forgot')}>
              Forgot password?
            </button>
          </div>
        )}

        {error && <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</p>}
        {successMessage && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300">{successMessage}</p>}

        <Button type="submit" className="w-full gap-2" disabled={isSubmitting || status === 'loading'}>
          {isSubmitting ? 'Processing…' : mode === 'forgot' ? 'Send recovery link' : mode === 'reset' ? 'Save new password' : 'Sign in'}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.form>

      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 text-sm text-slate-400">
        <div className="flex items-start gap-2">
          <Sparkles className="mt-0.5 h-4 w-4 text-cyan-400" />
          <p>
            Secure access with enterprise-grade session handling, refresh token rotation, and role-aware navigation.
          </p>
        </div>
      </div>

      {(mode === 'forgot' || mode === 'reset') && (
        <button type="button" className="text-sm text-cyan-400 transition hover:text-cyan-300" onClick={() => setMode('login')}>
          Back to sign in
        </button>
      )}
    </div>
  );
}
