import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Heart, 
  UserCheck, 
  FileText 
} from 'lucide-react';

export const Step5Complete: React.FC = () => {
  const { currentUser } = useAuth();
  const { updateUserProfile } = useApp();

  useEffect(() => {
    // Fire celebratory confetti on registration completion
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Step 5 Requirement: Create the user profile and initialize preferences only after successful account creation
    if (currentUser) {
      updateUserProfile({
        name: currentUser.name,
        email: currentUser.email,
        currency: currentUser.countryCode === '+91' ? 'INR' : 'USD',
        notificationsEnabled: true,
        highContrastCareMode: false,
        speakPromptsAloud: true
      });
    }
  }, [currentUser]);

  return (
    <div className="space-y-6 text-center py-2 animate-in fade-in zoom-in-95 duration-300">
      <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Registration Complete
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Welcome to OwnIQ, {currentUser?.name}!
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Your personal ownership vault and daily care intelligence platform are ready.
        </p>
      </div>

      {/* Account Verification Summary */}
      <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-left space-y-3">
        <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Profile & Security Summary
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Verified Mobile:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {currentUser?.mobile}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Verified Email:</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {currentUser?.email}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Password Security:</span>
            <span className="font-medium text-emerald-600">Salted & Hashed (SHA-256)</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Preferences Initialized:</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {currentUser?.countryCode === '+91' ? 'INR (₹)' : 'USD ($)'} • Metric Units
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          // Closes auth view / proceeds to dashboard
          window.location.reload();
        }}
        className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 active:scale-98 transition-all"
      >
        <span>Enter OwnIQ Dashboard</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};
