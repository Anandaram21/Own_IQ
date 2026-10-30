import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { evaluatePasswordRules } from '../../utils/crypto';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight 
} from 'lucide-react';

export const Step4Password: React.FC = () => {
  const { completeRegistration } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const rules = evaluatePasswordRules(password, confirmPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!rules.hasMinLength) {
      setErrorMessage('Password must be at least 8 characters long.');
      return;
    }
    if (!rules.hasUppercase || !rules.hasLowercase) {
      setErrorMessage('Password must contain both uppercase and lowercase letters.');
      return;
    }
    if (!rules.hasNumber) {
      setErrorMessage('Password must contain at least one numerical digit (0-9).');
      return;
    }
    if (!rules.hasSpecialChar) {
      setErrorMessage('Password must contain at least one special character (!@#$%^&*...).');
      return;
    }
    if (!rules.passwordsMatch) {
      setErrorMessage('Passwords do not match. Please re-enter confirmation password.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Passes plain password to completeRegistration, which hashes it with salt before persisting
      const res = await completeRegistration(password);
      if (!res.success) {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-brand-400">
          <span>Step 4 of 4: Password Security</span>
          <span>100%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-brand-600 h-full w-full rounded-full transition-all duration-300"></div>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Create a secure password
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Protect your asset documents, warranty certificates, and private caregiver records.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Create Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Password *
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoFocus
              placeholder="Create strong password"
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

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Confirm Password *
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              className="w-full pl-10 pr-10 py-3 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-3 top-1/2 -translate-y-1/2"
              title={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Password Requirement Guidance Card */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>Password Security Requirements</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className={`flex items-center gap-1.5 ${rules.hasMinLength ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
              {rules.hasMinLength ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Circle className="w-3.5 h-3.5" />}
              <span>At least 8 characters</span>
            </div>

            <div className={`flex items-center gap-1.5 ${rules.hasUppercase ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
              {rules.hasUppercase ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Circle className="w-3.5 h-3.5" />}
              <span>One uppercase letter (A-Z)</span>
            </div>

            <div className={`flex items-center gap-1.5 ${rules.hasLowercase ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
              {rules.hasLowercase ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Circle className="w-3.5 h-3.5" />}
              <span>One lowercase letter (a-z)</span>
            </div>

            <div className={`flex items-center gap-1.5 ${rules.hasNumber ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
              {rules.hasNumber ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Circle className="w-3.5 h-3.5" />}
              <span>One numerical digit (0-9)</span>
            </div>

            <div className={`flex items-center gap-1.5 ${rules.hasSpecialChar ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
              {rules.hasSpecialChar ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Circle className="w-3.5 h-3.5" />}
              <span>One special character (!@#$)</span>
            </div>

            <div className={`flex items-center gap-1.5 ${rules.passwordsMatch ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
              {rules.passwordsMatch ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Circle className="w-3.5 h-3.5" />}
              <span>Passwords match</span>
            </div>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Cryptographic notice */}
        <p className="text-[11px] text-slate-400 italic">
          Passwords are salted and cryptographically hashed with SHA-256 via Web Crypto API. Never stored in plain text.
        </p>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !rules.isValid}
          className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 active:scale-98 transition-all"
        >
          {isSubmitting ? (
            <span>Creating Secure Profile...</span>
          ) : (
            <>
              <span>Complete Account Registration</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
