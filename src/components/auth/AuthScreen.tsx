import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Step1Mobile } from './Step1Mobile';
import { Step2Otp } from './Step2Otp';
import { Step3Email } from './Step3Email';
import { Step4Password } from './Step4Password';
import { Step5Complete } from './Step5Complete';
import { LoginForm } from './LoginForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { 
  ShieldCheck, 
  Heart, 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { authMode, registrationStep } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Left Side Brand Showcase (Hidden on smaller screens, prominent on desktop) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-56 h-56 bg-brand-500/15 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-extrabold text-xl tracking-tight text-white">Own<span className="text-brand-400">IQ</span></span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-rose-500/20 text-rose-300 rounded border border-rose-500/30">Care</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Personal Ownership & Daily Care</p>
              </div>
            </div>

            {/* Taglines Banner */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm space-y-2">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-brand-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> OwnIQ:
                </div>
                <div className="text-xs font-semibold italic text-slate-200">“Know Everything You Own.”</div>
              </div>
              <div className="pt-2 border-t border-white/10">
                <div className="text-[10px] font-bold uppercase tracking-widest text-rose-300 flex items-center gap-1">
                  <Heart className="w-3 h-3" /> OwnIQ Care:
                </div>
                <div className="text-xs font-semibold italic text-slate-200">“Remembering Life, Together.”</div>
              </div>
            </div>

            {/* Platform Highlights */}
            <div className="space-y-3 text-xs text-slate-300 pt-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>AI Asset Wallet with Optical OCR document extraction & QR passport labeling.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>AI Advisor: Weather & Calendar-driven "Before You Leave Home" preparation.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>OwnIQ Care: Reassuring daily routines, memory support, and medication adherence.</span>
              </div>
            </div>
          </div>

          {/* Security assurance */}
          <div className="relative z-10 pt-6 border-t border-white/10 flex items-center gap-2 text-[11px] text-slate-400">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Encrypted local storage • AAA Accessibility</span>
          </div>
        </div>

        {/* Right Side: Auth Sequence View */}
        <div className="lg:col-span-7 p-6 sm:p-8 sm:py-10 flex flex-col justify-center">
          {authMode === 'register' && (
            <>
              {registrationStep === 'mobile' && <Step1Mobile />}
              {registrationStep === 'otp' && <Step2Otp />}
              {registrationStep === 'email' && <Step3Email />}
              {registrationStep === 'password' && <Step4Password />}
              {registrationStep === 'complete' && <Step5Complete />}
            </>
          )}

          {authMode === 'login' && <LoginForm />}

          {authMode === 'forgot-password' && <ForgotPasswordForm />}
        </div>
      </div>
    </div>
  );
};
