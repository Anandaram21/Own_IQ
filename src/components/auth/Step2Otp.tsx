import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  Clock, 
  RotateCcw, 
  Edit3, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Terminal, 
  Sparkles,
  Copy
} from 'lucide-react';

export const Step2Otp: React.FC = () => {
  const { 
    regCountry, 
    regMobile, 
    setRegistrationStep, 
    activeOtpSession, 
    requestOtp, 
    verifyOtp 
  } = useAuth();

  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMessage, setErrorMessage] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(60);
  const [secondsUntilExpiry, setSecondsUntilExpiry] = useState<number>(300);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const fullMobile = `${regCountry.dialCode}${regMobile.replace(/\D/g, '')}`;

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const interval = setInterval(() => {
      setCooldownRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownRemaining]);

  // Expiry countdown timer
  useEffect(() => {
    if (!activeOtpSession) return;
    const updateExpiry = () => {
      const remaining = Math.max(0, Math.ceil((activeOtpSession.expiresAt - Date.now()) / 1000));
      setSecondsUntilExpiry(remaining);
      if (remaining === 0) {
        setErrorMessage('This verification code has expired. Please click "Resend Code" to receive a new OTP.');
      }
    };
    updateExpiry();
    const interval = setInterval(updateExpiry, 1000);
    return () => clearInterval(interval);
  }, [activeOtpSession]);

  const handleDigitChange = (index: number, value: string) => {
    // Only accept numeric digit
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const updated = [...otpDigits];
      updated[index] = '';
      setOtpDigits(updated);
      return;
    }

    // Handle paste of full 6-digit code
    if (cleaned.length > 1) {
      const digits = cleaned.slice(0, 6).split('');
      const updated = [...otpDigits];
      digits.forEach((d, i) => {
        if (i < 6) updated[i] = d;
      });
      setOtpDigits(updated);
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      if (errorMessage) setErrorMessage('');
      return;
    }

    const updated = [...otpDigits];
    updated[index] = cleaned[0];
    setOtpDigits(updated);
    if (errorMessage) setErrorMessage('');

    // Auto-advance to next input
    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');
    if (fullOtp.length < 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    if (secondsUntilExpiry <= 0) {
      setErrorMessage('This OTP has expired. Please click "Resend Code".');
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');

    const res = verifyOtp(fullMobile, fullOtp);
    if (res.success) {
      // Advance to Step 3: Email Address
      setRegistrationStep('email');
    } else {
      setErrorMessage(res.message);
    }
    setIsVerifying(false);
  };

  const handleResend = async () => {
    if (cooldownRemaining > 0) return;
    setErrorMessage('');
    setOtpDigits(['', '', '', '', '', '']);

    const res = await requestOtp(fullMobile, 'registration');
    if (res.success) {
      setCooldownRemaining(res.cooldownSeconds || 60);
      setSuccessNotice('A new verification code has been dispatched.');
      setTimeout(() => setSuccessNotice(''), 4000);
      inputRefs.current[0]?.focus();
    } else {
      setErrorMessage(res.message);
    }
  };

  const formatExpiryTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-brand-400">
          <span>Step 2 of 4: One-Time Password</span>
          <span>50%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-brand-600 h-full w-2/4 rounded-full transition-all duration-300"></div>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Verify your mobile number
        </h2>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <span>Code sent to <span className="font-bold text-slate-900 dark:text-white font-mono">{fullMobile}</span></span>
          <button
            type="button"
            onClick={() => setRegistrationStep('mobile')}
            className="text-brand-600 hover:text-brand-700 font-semibold inline-flex items-center gap-0.5 hover:underline"
            title="Edit mobile number"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>
      </div>

      {/* EXPLICIT DEVELOPMENT FLOW BANNER */}
      {/* Requirement: If SMS verification is not configured, provide an explicitly labeled development flow. Never claim that a real SMS was sent if it was not. */}
      {activeOtpSession?.isSimulatedDevFlow && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border-2 border-dashed border-amber-300 dark:border-amber-800 rounded-2xl space-y-2 text-xs">
          <div className="flex items-center justify-between text-amber-900 dark:text-amber-200 font-bold">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-amber-600" />
              <span>Development Mode: Live SMS Gateway Not Configured</span>
            </span>
            <span className="text-[10px] uppercase px-2 py-0.5 bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 rounded-full font-mono">
              Dev Simulation
            </span>
          </div>
          <p className="text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
            Carrier SMS dispatch is disabled in local environment. As per platform policy, we do not claim an SMS was delivered. Your generated 6-digit verification code is:
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="font-mono font-extrabold text-lg sm:text-xl tracking-widest text-amber-950 dark:text-amber-100 bg-amber-100 dark:bg-amber-900/60 px-3 py-1 rounded-xl border border-amber-300 dark:border-amber-700">
              {activeOtpSession.code}
            </span>
            <button
              type="button"
              onClick={() => {
                const digits = activeOtpSession.code.split('');
                setOtpDigits(digits);
                if (errorMessage) setErrorMessage('');
              }}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold flex items-center gap-1 text-[11px] shadow-sm transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" /> Auto-Fill Code
            </button>
          </div>
        </div>
      )}

      {/* 6-Digit OTP Input Form */}
      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Enter 6-Digit OTP *
          </label>
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={6} // allows paste
                autoFocus={index === 0}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-11 sm:w-13 h-14 text-center font-mono text-xl sm:text-2xl font-bold rounded-2xl border transition-all ${
                  digit 
                    ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/40 text-slate-900 dark:text-white shadow-sm'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white'
                } focus:outline-none focus:ring-2 focus:ring-brand-500`}
              />
            ))}
          </div>
        </div>

        {/* Expiry and Cooldown Indicators */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Expires in: <span className={`font-mono font-bold ${secondsUntilExpiry <= 30 ? 'text-rose-600' : 'text-slate-700 dark:text-slate-200'}`}>
                {formatExpiryTime(secondsUntilExpiry)}
              </span>
            </span>
          </div>

          <div>
            {cooldownRemaining > 0 ? (
              <span className="text-slate-400">
                Resend code in <span className="font-mono font-bold">{cooldownRemaining}s</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:underline"
              >
                <RotateCcw className="w-3 h-3" /> Resend OTP
              </button>
            )}
          </div>
        </div>

        {/* Error Notice */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Notice */}
        {successNotice && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Verify Action Button */}
        <button
          type="submit"
          disabled={isVerifying || otpDigits.join('').length < 6}
          className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 active:scale-98 transition-all"
        >
          {isVerifying ? (
            <span>Verifying Code...</span>
          ) : (
            <>
              <span>Verify & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Return to Step 1 */}
      <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
        <span>Wrong number or lost access? </span>
        <button
          type="button"
          onClick={() => setRegistrationStep('mobile')}
          className="font-bold text-brand-600 hover:text-brand-700 hover:underline"
        >
          Change mobile number
        </button>
      </div>
    </div>
  );
};
