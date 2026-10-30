import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { COUNTRY_CODES, validateMobileNumber } from '../../utils/countryCodes';
import { CountryCode } from '../../types/auth';
import { 
  Phone, 
  ChevronDown, 
  Search, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck, 
  Check 
} from 'lucide-react';

export const Step1Mobile: React.FC = () => {
  const { 
    regCountry, 
    setRegCountry, 
    regMobile, 
    setRegMobile, 
    setRegistrationStep, 
    setAuthMode, 
    requestOtp 
  } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCountries = COUNTRY_CODES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.dialCode.includes(searchQuery) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits and spaces
    const val = e.target.value.replace(/[^\d\s]/g, '');
    setRegMobile(val);
    if (errorMessage) setErrorMessage('');
  };

  const handleCountrySelect = (country: CountryCode) => {
    setRegCountry(country);
    setIsDropdownOpen(false);
    setSearchQuery('');
    if (errorMessage) setErrorMessage('');
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Step 1 Validation
    const validation = validateMobileNumber(regMobile, regCountry);
    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Please enter a valid mobile number');
      return;
    }

    setIsSubmitting(true);
    const fullMobile = `${regCountry.dialCode}${regMobile.replace(/\D/g, '')}`;

    try {
      const result = await requestOtp(fullMobile, 'registration');
      if (result.success) {
        setRegistrationStep('otp');
      } else {
        setErrorMessage(result.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to request OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-brand-400">
          <span>Step 1 of 4: Mobile Verification</span>
          <span>25%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-brand-600 h-full w-1/4 rounded-full transition-all duration-300"></div>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
          Enter your mobile number
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          We will send a 6-digit verification code to confirm your device and safeguard your physical asset records.
        </p>
      </div>

      <form onSubmit={handleContinue} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Mobile Number *
          </label>

          <div className="flex rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500 transition-all overflow-hidden shadow-sm">
            {/* Country Code Dropdown Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="h-full px-3.5 py-3 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 border-r border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors"
                title="Change country code"
              >
                <span className="text-base">{regCountry.flag}</span>
                <span>{regCountry.dialCode}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Country Selector Modal / Dropdown */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 p-2 overflow-hidden">
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search country or code..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>

                  <div className="max-h-52 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredCountries.map(c => {
                      const isSelected = c.code === regCountry.code;
                      return (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => handleCountrySelect(c)}
                          className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between text-xs transition-colors ${
                            isSelected 
                              ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-semibold' 
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{c.flag}</span>
                            <span className="truncate">{c.name}</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-mono text-slate-400">
                            <span>{c.dialCode}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-brand-600" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Input */}
            <input
              type="tel"
              autoFocus
              required
              placeholder={regCountry.format}
              value={regMobile}
              onChange={handleMobileChange}
              className="flex-1 px-4 py-3 text-sm bg-transparent border-none focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 font-medium tracking-wide"
            />
          </div>
        </div>

        {/* Validation Error Banner */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Security Disclaimers */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 space-y-1">
          <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Privacy & Device Verification</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            As per security requirements, email and password are never requested before your phone number is verified. Standard SMS rates may apply.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !regMobile.trim()}
          className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 active:scale-98 transition-all"
        >
          {isSubmitting ? (
            <span>Dispatching OTP...</span>
          ) : (
            <>
              <span>Send Verification Code</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Switch to Returning-User Login */}
      <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
        <span>Already have an OwnIQ account? </span>
        <button
          type="button"
          onClick={() => setAuthMode('login')}
          className="font-bold text-brand-600 hover:text-brand-700 hover:underline"
        >
          Sign in here
        </button>
      </div>
    </div>
  );
};
