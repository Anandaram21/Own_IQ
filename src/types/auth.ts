// OwnIQ Authentication & Security Type Definitions

export type AuthMode = 'login' | 'register' | 'forgot-password';

export type RegistrationStep = 
  | 'mobile'      // Step 1: Mobile number & country code
  | 'otp'         // Step 2: OTP verification
  | 'email'       // Step 3: Name & email address
  | 'password'    // Step 4: Password creation
  | 'complete';   // Step 5: Success & profile initialization

export interface CountryCode {
  name: string;
  code: string;       // e.g. "IN", "US"
  dialCode: string;   // e.g. "+91", "+1"
  flag: string;       // emoji flag e.g. "🇮🇳"
  format: string;     // format placeholder e.g. "98765 43210"
  minLength: number;
  maxLength: number;
}

export interface UserAccount {
  id: string;
  name: string;
  mobile: string;          // Formatted dialCode + number, e.g. "+919876543210"
  countryCode: string;     // e.g. "+91"
  rawMobile: string;       // e.g. "9876543210"
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
  lastLoginAt: string;
  emailVerified: boolean;
  mobileVerified: boolean;
  failedLoginAttempts: number;
  lockoutUntil?: number;    // timestamp in ms
}

export interface AuthSession {
  userId: string;
  token: string;
  createdAt: number;
  expiresAt: number;        // timestamp in ms
  rememberMe: boolean;
}

export interface OtpSession {
  mobile: string;
  code: string;
  expiresAt: number;        // timestamp in ms
  attemptsLeft: number;
  lastSentAt: number;       // timestamp in ms
  purpose: 'registration' | 'recovery';
  isSimulatedDevFlow: boolean;
}

export interface PasswordValidationResult {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  passwordsMatch: boolean;
  isValid: boolean;
}

export interface RegistrationFormData {
  countryCode: CountryCode;
  mobileNumber: string;
  otp: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LockoutState {
  isLocked: boolean;
  remainingSeconds: number;
}
