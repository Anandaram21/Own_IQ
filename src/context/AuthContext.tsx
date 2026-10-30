import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserAccount, 
  AuthMode, 
  RegistrationStep, 
  OtpSession, 
  LockoutState, 
  CountryCode 
} from '../types/auth';
import { DEFAULT_COUNTRY_CODE } from '../utils/countryCodes';
import { authService } from '../services/authService';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: UserAccount | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  registrationStep: RegistrationStep;
  setRegistrationStep: (step: RegistrationStep) => void;
  
  // Registration scratch state across steps 1-5
  regCountry: CountryCode;
  setRegCountry: (country: CountryCode) => void;
  regMobile: string;
  setRegMobile: (mobile: string) => void;
  regOtp: string;
  setRegOtp: (otp: string) => void;
  regName: string;
  setRegName: (name: string) => void;
  regEmail: string;
  setRegEmail: (email: string) => void;
  
  // Active OTP session for countdown & dev display
  activeOtpSession: OtpSession | null;
  setActiveOtpSession: (session: OtpSession | null) => void;
  
  // Actions
  requestOtp: (mobile: string, purpose?: 'registration' | 'recovery') => Promise<{ success: boolean; message: string; cooldownSeconds?: number; otpSession?: OtpSession }>;
  verifyOtp: (mobile: string, code: string) => { success: boolean; message: string; attemptsLeft?: number };
  completeRegistration: (passwordPlain: string) => Promise<{ success: boolean; message: string; user?: UserAccount }>;
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message: string; lockoutState?: LockoutState }>;
  logout: () => void;
  resetPassword: (mobileOrEmail: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  
  // Reset registration workflow
  resetRegistrationFlow: () => void;
  demoLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);

  // Auth UI state
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>('mobile');

  // Registration form inputs
  const [regCountry, setRegCountry] = useState<CountryCode>(DEFAULT_COUNTRY_CODE);
  const [regMobile, setRegMobile] = useState<string>('');
  const [regOtp, setRegOtp] = useState<string>('');
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');

  const [activeOtpSession, setActiveOtpSession] = useState<OtpSession | null>(null);

  // Check active session on initial mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await authService.getAuthenticatedUser();
        if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Session check error', err);
        setCurrentUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoadingAuth(false);
      }
    };
    checkSession();
  }, []);

  const resetRegistrationFlow = () => {
    setRegistrationStep('mobile');
    setRegMobile('');
    setRegOtp('');
    setRegName('');
    setRegEmail('');
    setRegCountry(DEFAULT_COUNTRY_CODE);
    setActiveOtpSession(null);
  };

  const requestOtp = async (mobile: string, purpose: 'registration' | 'recovery' = 'registration') => {
    const result = await authService.requestOtp(mobile, purpose);
    if (result.otpSession) {
      setActiveOtpSession(result.otpSession);
    }
    return result;
  };

  const verifyOtp = (mobile: string, code: string) => {
    const result = authService.verifyOtp(mobile, code);
    if (result.success) {
      setActiveOtpSession(null);
    }
    return result;
  };

  const completeRegistration = async (passwordPlain: string) => {
    const fullMobile = `${regCountry.dialCode}${regMobile.replace(/\D/g, '')}`;
    const result = await authService.registerUser(
      regName,
      fullMobile,
      regCountry.dialCode,
      regMobile.replace(/\D/g, ''),
      regEmail,
      passwordPlain
    );

    if (result.success && result.user) {
      setCurrentUser(result.user);
      setIsAuthenticated(true);
      setRegistrationStep('complete');
    }
    return result;
  };

  const login = async (identifier: string, password: string, rememberMe: boolean = true) => {
    const result = await authService.loginWithPassword(identifier, password, rememberMe);
    if (result.success && result.user) {
      setCurrentUser(result.user);
      setIsAuthenticated(true);
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setAuthMode('login');
    resetRegistrationFlow();
  };

  const resetPassword = async (mobileOrEmail: string, newPassword: string) => {
    return authService.resetPasswordWithOtp(mobileOrEmail, newPassword);
  };

  const demoLogin = async () => {
    await login('+919876543210', 'Password@123', true);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated,
      isLoadingAuth,
      authMode,
      setAuthMode,
      registrationStep,
      setRegistrationStep,
      regCountry,
      setRegCountry,
      regMobile,
      setRegMobile,
      regOtp,
      setRegOtp,
      regName,
      setRegName,
      regEmail,
      setRegEmail,
      activeOtpSession,
      setActiveOtpSession,
      requestOtp,
      verifyOtp,
      completeRegistration,
      login,
      logout,
      resetPassword,
      resetRegistrationFlow,
      demoLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
