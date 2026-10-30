import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { evaluatePasswordRules } from '../../utils/crypto';
import { 
  KeyRound, 
  Phone, 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Lock, 
  Eye, 
  EyeOff, 
  Clock, 
  Terminal, 
  Sparkles 
} from 'lucide-react';

export const ForgotPasswordForm: React.FC = () => {
  const { setAuthMode, resetPassword } = useAuth();

  const [recoveryStep, setRecoveryStep] = useState<'identify' | 'otp' | 'new-password' | 'done'>('identify');
  const [identifier, setIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);

  const passwordRules = evaluatePasswordRules(newPassword, confirmPassword);

  const handleIdentifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!identifier.trim()) {
      setErrorMessage('Please enter your registered mobile number or email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanId = identifier.trim();
      const user = cleanId.includes('@') 
        ? await authService.findByEmail(cleanId)
        : await authService.findByMobile(cleanId);

      if (!user) {
        setErrorMessage('No account was found with those details. Please check and try again.');
        setIsSubmitting(false);
        return;
      }

      // Dispatch real/dev OTP to user's mobile
      const res = await authService.requestOtp(user.mobile, 'recovery');
      if (res.success && res.otpSession) {
        if (res.otpSession.isSimulatedDevFlow) {
          setDevOtpCode(res.otpSession.code);
        }
        setRecoveryStep('otp');
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Recovery request failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (otpCode.trim().length !== 6) {
      setErrorMessage('Please enter the 6-digit OTP code.');
      return;
    }

    setIsSubmitting(true);
    // Find user mobile to verify
    const cleanId = identifier.trim();
    authService.getAccounts().then(accounts => {
      const user = accounts.find(a => 
        a.email.toLowerCase() === cleanId.toLowerCase() ||
        a.mobile.replace(/\D/g, '') === cleanId.replace(/\D/g, '') ||
        a.rawMobile === cleanId.replace(/\D/g, '')
      );

      if (!user) {
        setErrorMessage('Account not found.');
        setIsSubmitting(false);
        return;
      }

      const res = authService.verifyOtp(user.mobile, otpCode.trim());
      if (res.success) {
        setRecoveryStep('new-password');
      } else {
        setErrorMessage(res.message);
      }
      setIsSubmitting(false);
    });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!passwordRules.isValid) {
      setErrorMessage('Please ensure all password requirements are satisfied.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await resetPassword(identifier.trim(), newPassword);
      if (res.success) {
        setRecoveryStep('done');
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Password reset failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        type="button"
        onClick={() => setAuthMode('login')}
        className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
      </button>

      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Reset your password
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Verify ownership through your registered contact method to establish a new password.
        </p>
      </div>

      {/* Step A: Identify */}
      {recoveryStep === 'identify' && (
        <form onSubmit={handleIdentifySubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Registered Mobile or Email *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. +91 98765 43210 or user@example.com"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-start gap-2 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !identifier.trim()}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 active:scale-98 transition-all"
          >
            {isSubmitting ? <span>Locating Account...</span> : <><span>Send Recovery Code</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      )}

      {/* Step B: OTP */}
      {recoveryStep === 'otp' && (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          {devOtpCode && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-xl space-y-1 text-xs">
              <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-amber-600" />
                <span>Dev Simulation Code: <span className="font-mono">{devOtpCode}</span></span>
              </div>
              <button
                type="button"
                onClick={() => setOtpCode(devOtpCode)}
                className="text-[11px] font-semibold text-amber-700 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Auto-Fill Code
              </button>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Enter 6-Digit Verification Code *
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              autoFocus
              placeholder="123456"
              value={otpCode}
              onChange={(e) => {
                setOtpCode(e.target.value.replace(/\D/g, ''));
                if (errorMessage) setErrorMessage('');
              }}
              className="w-full px-4 py-3 text-center font-mono tracking-widest text-lg font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-start gap-2 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || otpCode.length < 6}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 active:scale-98 transition-all"
          >
            {isSubmitting ? <span>Verifying...</span> : <><span>Confirm Code</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      )}

      {/* Step C: New Password */}
      {recoveryStep === 'new-password' && (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              New Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1.5 text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Confirm New Password *
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-start gap-2 text-xs text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !passwordRules.isValid}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 active:scale-98 transition-all"
          >
            {isSubmitting ? <span>Updating Password...</span> : <><span>Set New Password</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      )}

      {/* Step D: Done */}
      {recoveryStep === 'done' && (
        <div className="space-y-4 text-center py-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Password Updated!</h3>
          <p className="text-xs text-slate-500">
            Your password has been successfully reset. You can now log in securely.
          </p>
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-2xl"
          >
            Return to Sign In
          </button>
        </div>
      )}
    </div>
  );
};
