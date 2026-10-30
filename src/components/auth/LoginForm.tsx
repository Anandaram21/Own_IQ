import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LockoutState } from '../../types/auth';
import { 
  Lock, 
  Mail, 
  Phone, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  KeyRound, 
  CheckCircle2 
} from 'lucide-react';

export const LoginForm: React.FC = () => {
  const { 
    login, 
    setAuthMode, 
    resetRegistrationFlow, 
    demoLogin 
  } = useAuth();

  const [loginMethod, setLoginMethod] = useState<'mobile' | 'email'>('mobile');
  const [mobileInput, setMobileInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lockoutState, setLockoutState] = useState<LockoutState | null>(null);

  // Live countdown timer for account lockout
  useEffect(() => {
    if (!lockoutState || !lockoutState.isLocked) return;
    const interval = setInterval(() => {
      setLockoutState(prev => {
        if (!prev) return null;
        if (prev.remainingSeconds <= 1) {
          return { isLocked: false, remainingSeconds: 0 };
        }
        return { isLocked: true, remainingSeconds: prev.remainingSeconds - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const identifier = loginMethod === 'mobile' ? mobileInput.trim() : emailInput.trim();
    if (!identifier) {
      setErrorMessage(`Please enter your registered ${loginMethod}.`);
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await login(identifier, password, rememberMe);
      if (!res.success) {
        setErrorMessage(res.message);
        if (res.lockoutState) {
          setLockoutState(res.lockoutState);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatLockoutMinutes = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Sign in to your account
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Enter your registered mobile number or email address with your password.
        </p>
      </div>

      {/* Account Lockout Banner */}
      {lockoutState?.isLocked && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900 rounded-2xl flex items-start gap-3 text-xs text-rose-800 dark:text-rose-200">
          <Clock className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1">
            <span className="font-bold">Security Lockout Active</span>
            <p className="text-[11px] leading-relaxed">
              Too many failed login attempts. To protect your possessions vault, sign-in is paused for{' '}
              <span className="font-mono font-bold">{formatLockoutMinutes(lockoutState.remainingSeconds)}</span>.
            </p>
          </div>
        </div>
      )}

      {/* Login Method Toggle: Mobile vs Email */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
        <button
          type="button"
          onClick={() => { setLoginMethod('mobile'); setErrorMessage(''); }}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            loginMethod === 'mobile'
              ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Mobile Number</span>
        </button>
        <button
          type="button"
          onClick={() => { setLoginMethod('email'); setErrorMessage(''); }}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            loginMethod === 'email'
              ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Email Address</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Identifier Field */}
        {loginMethod === 'mobile' ? (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Verified Mobile Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                autoFocus
                placeholder="e.g. +919876543210 or 9876543210"
                value={mobileInput}
                onChange={(e) => {
                  setMobileInput(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                className="w-full pl-10 pr-4 py-3 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Registered Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                autoFocus
                placeholder="e.g. alex.chen@owniq.com"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                className="w-full pl-10 pr-4 py-3 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password *
            </label>
            <button
              type="button"
              onClick={() => setAuthMode('forgot-password')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              className="w-full pl-10 pr-10 py-3 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-3 top-1/2 -translate-y-1/2"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            <span>Keep me signed in for 7 days</span>
          </label>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || (lockoutState?.isLocked ?? false)}
          className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 active:scale-98 transition-all"
        >
          {isSubmitting ? (
            <span>Signing In...</span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Quick 1-Click Demo Login for Testing */}
      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
        <div>
          <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" /> Demo Account Ready
          </div>
          <div className="text-[11px] text-slate-400 font-mono">Alex Chen (+91 98765 43210)</div>
        </div>
        <button
          type="button"
          onClick={demoLogin}
          className="px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 rounded-xl font-semibold text-xs border border-brand-200 dark:border-brand-800 transition-colors"
        >
          1-Click Demo
        </button>
      </div>

      {/* Switch to Registration Sequence (Step 1) */}
      <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
        <span>New to OwnIQ? </span>
        <button
          type="button"
          onClick={() => {
            resetRegistrationFlow();
            setAuthMode('register');
          }}
          className="font-bold text-brand-600 hover:text-brand-700 hover:underline"
        >
          Create an account
        </button>
      </div>
    </div>
  );
};
