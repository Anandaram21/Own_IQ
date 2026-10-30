import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { 
  Mail, 
  User, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

export const Step3Email: React.FC = () => {
  const { 
    regName, 
    setRegName, 
    regEmail, 
    setRegEmail, 
    setRegistrationStep, 
    setAuthMode 
  } = useAuth();

  const [errorMessage, setErrorMessage] = useState('');
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false);

  const isValidEmailFormat = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!regEmail.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!isValidEmailFormat(regEmail)) {
      setErrorMessage('Please enter a valid email address (e.g., user@example.com).');
      return;
    }

    setIsCheckingDuplicate(true);

    try {
      // Check for duplicate account
      const existing = await authService.findByEmail(regEmail.trim());
      if (existing) {
        setErrorMessage(
          'An account with this email address already exists. Please sign in or use a different email.'
        );
        setIsCheckingDuplicate(false);
        return;
      }

      // Email is unique and valid -> proceed to Step 4
      setRegistrationStep('password');
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsCheckingDuplicate(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-brand-400">
          <span>Step 3 of 4: Account Details & Email</span>
          <span>75%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-brand-600 h-full w-3/4 rounded-full transition-all duration-300"></div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" /> Mobile Verified
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Enter your name and email
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Your email is used for warranty certificate alerts, insurance renewal notices, and caregiver reports.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Full Name *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Alex Chen"
              value={regName}
              onChange={(e) => {
                setRegName(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              className="w-full pl-10 pr-4 py-3 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="e.g. alex.chen@example.com"
              value={regEmail}
              onChange={(e) => {
                setRegEmail(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              className="w-full pl-10 pr-4 py-3 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-start justify-between gap-2.5 text-xs text-rose-700 dark:text-rose-300">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
            {errorMessage.includes('already exists') && (
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="font-bold underline text-brand-600 hover:text-brand-700 whitespace-nowrap"
              >
                Sign In
              </button>
            )}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isCheckingDuplicate || !regName.trim() || !regEmail.trim()}
          className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 active:scale-98 transition-all"
        >
          {isCheckingDuplicate ? (
            <span>Checking availability...</span>
          ) : (
            <>
              <span>Continue to Create Password</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
