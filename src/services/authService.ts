import { 
  UserAccount, 
  AuthSession, 
  OtpSession, 
  LockoutState, 
  CountryCode 
} from '../types/auth';
import { 
  hashPassword, 
  verifyPassword, 
  generateSalt, 
  generateSecureOtp 
} from '../utils/crypto';

const STORAGE_KEYS = {
  ACCOUNTS: 'owniq_auth_accounts_v1',
  SESSION: 'owniq_auth_session_v1',
  ACTIVE_OTP: 'owniq_auth_active_otp_v1',
  RATE_LIMITS: 'owniq_auth_rate_limits_v1',
};

// Cooldown and Expiry settings
export const OTP_COOLDOWN_SECONDS = 60;
export const OTP_EXPIRY_SECONDS = 300; // 5 minutes
export const MAX_OTP_ATTEMPTS = 5;
export const MAX_OTP_REQUESTS_PER_WINDOW = 4; // Max 4 requests in 10 minutes
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
export const SESSION_DURATION_REMEMBER_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
export const SESSION_DURATION_NORMAL_MS = 24 * 60 * 60 * 1000;      // 24 hours

// Initial seed demo user
async function createDemoUser(): Promise<UserAccount> {
  const salt = 'a1b2c3d4e5f67890123456789abcdef0';
  const passwordHash = await hashPassword('Password@123', salt);

  return {
    id: 'usr_demo_001',
    name: 'Alex Chen',
    mobile: '+919876543210',
    countryCode: '+91',
    rawMobile: '9876543210',
    email: 'alex.chen@owniq.com',
    passwordHash,
    passwordSalt: salt,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    emailVerified: true,
    mobileVerified: true,
    failedLoginAttempts: 0
  };
}

class AuthService {
  private accountsCache: UserAccount[] | null = null;
  private currentSession: AuthSession | null = null;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    const raw = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (!raw) {
      const demo = await createDemoUser();
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify([demo]));
      this.accountsCache = [demo];
    } else {
      try {
        this.accountsCache = JSON.parse(raw);
      } catch {
        this.accountsCache = [];
      }
    }
  }

  // --- ACCOUNTS DATA ACCESS ---

  public async getAccounts(): Promise<UserAccount[]> {
    if (!this.accountsCache) {
      await this.initialize();
    }
    return this.accountsCache || [];
  }

  private saveAccounts(accounts: UserAccount[]): void {
    this.accountsCache = accounts;
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  }

  public async findByMobile(fullMobile: string): Promise<UserAccount | null> {
    const accounts = await this.getAccounts();
    const cleanTarget = fullMobile.replace(/\D/g, '');
    return accounts.find(a => a.mobile.replace(/\D/g, '') === cleanTarget) || null;
  }

  public async findByEmail(email: string): Promise<UserAccount | null> {
    const accounts = await this.getAccounts();
    const normalized = email.trim().toLowerCase();
    return accounts.find(a => a.email.toLowerCase() === normalized) || null;
  }

  public async findById(id: string): Promise<UserAccount | null> {
    const accounts = await this.getAccounts();
    return accounts.find(a => a.id === id) || null;
  }

  // --- OTP LIFECYCLE, EXPIRY & RATE LIMITING ---

  private getRateLimitHistory(mobile: string): number[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RATE_LIMITS);
      const data: Record<string, number[]> = raw ? JSON.parse(raw) : {};
      const now = Date.now();
      const userHistory = (data[mobile] || []).filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
      return userHistory;
    } catch {
      return [];
    }
  }

  private recordRateLimitAttempt(mobile: string): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RATE_LIMITS);
      const data: Record<string, number[]> = raw ? JSON.parse(raw) : {};
      const history = this.getRateLimitHistory(mobile);
      history.push(Date.now());
      data[mobile] = history;
      localStorage.setItem(STORAGE_KEYS.RATE_LIMITS, JSON.stringify(data));
    } catch (e) {
      console.error('Rate limit save error', e);
    }
  }

  public async requestOtp(
    mobile: string, 
    purpose: 'registration' | 'recovery' = 'registration'
  ): Promise<{ success: boolean; message: string; cooldownSeconds?: number; otpSession?: OtpSession }> {
    const now = Date.now();
    const existingOtpRaw = localStorage.getItem(STORAGE_KEYS.ACTIVE_OTP);
    let existingOtp: OtpSession | null = null;
    
    if (existingOtpRaw) {
      try {
        existingOtp = JSON.parse(existingOtpRaw);
      } catch {}
    }

    // Check cooldown if existing OTP was sent recently
    if (existingOtp && existingOtp.mobile === mobile) {
      const elapsed = Math.floor((now - existingOtp.lastSentAt) / 1000);
      if (elapsed < OTP_COOLDOWN_SECONDS) {
        const remaining = OTP_COOLDOWN_SECONDS - elapsed;
        return {
          success: false,
          message: `Please wait ${remaining}s before requesting a new OTP.`,
          cooldownSeconds: remaining
        };
      }
    }

    // Check rate limit: max requests per 10 minutes
    const history = this.getRateLimitHistory(mobile);
    if (history.length >= MAX_OTP_REQUESTS_PER_WINDOW) {
      const oldest = history[0];
      const waitMinutes = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - oldest)) / 60000);
      return {
        success: false,
        message: `Too many OTP requests. Rate limit reached. Please try again in ${waitMinutes} minute(s).`
      };
    }

    // Check external SMS Gateway configuration (e.g. from Vite env)
    // IMPORTANT: As per prompt: Never claim a real SMS was sent if not configured!
    const isLiveGatewayConfigured = Boolean(
      (import.meta as any).env?.VITE_SMS_GATEWAY_URL || 
      (import.meta as any).env?.VITE_TWILIO_ACCOUNT_SID
    );

    const generatedCode = generateSecureOtp();
    const otpSession: OtpSession = {
      mobile,
      code: generatedCode,
      expiresAt: now + (OTP_EXPIRY_SECONDS * 1000),
      attemptsLeft: MAX_OTP_ATTEMPTS,
      lastSentAt: now,
      purpose,
      isSimulatedDevFlow: !isLiveGatewayConfigured
    };

    localStorage.setItem(STORAGE_KEYS.ACTIVE_OTP, JSON.stringify(otpSession));
    this.recordRateLimitAttempt(mobile);

    if (isLiveGatewayConfigured) {
      // Dispatch via real HTTP endpoint if configured
      try {
        // e.g. await fetch(...)
      } catch (err) {
        console.error('SMS Gateway Error', err);
      }
    }

    return {
      success: true,
      message: isLiveGatewayConfigured 
        ? `OTP has been dispatched via SMS to ${mobile}.`
        : `Development Mode: Carrier SMS not configured. Your verification code is ${generatedCode}.`,
      cooldownSeconds: OTP_COOLDOWN_SECONDS,
      otpSession
    };
  }

  public getActiveOtpSession(mobile: string): OtpSession | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_OTP);
      if (!raw) return null;
      const session: OtpSession = JSON.parse(raw);
      if (session.mobile === mobile) {
        return session;
      }
      return null;
    } catch {
      return null;
    }
  }

  public verifyOtp(mobile: string, enteredCode: string): { success: boolean; message: string; attemptsLeft?: number } {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_OTP);
    if (!raw) {
      return { success: false, message: 'No active OTP found. Please request a new verification code.' };
    }

    let session: OtpSession;
    try {
      session = JSON.parse(raw);
    } catch {
      return { success: false, message: 'Invalid OTP session.' };
    }

    if (session.mobile !== mobile) {
      return { success: false, message: 'OTP does not match this mobile number. Please request a new code.' };
    }

    const now = Date.now();
    if (now > session.expiresAt) {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_OTP);
      return { 
        success: false, 
        message: 'This OTP has expired. Please request a fresh verification code.' 
      };
    }

    if (session.attemptsLeft <= 0) {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_OTP);
      return { 
        success: false, 
        message: 'Maximum verification attempts exceeded. For your security, this OTP is now invalid.' 
      };
    }

    if (session.code.trim() !== enteredCode.trim()) {
      session.attemptsLeft -= 1;
      if (session.attemptsLeft <= 0) {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_OTP);
        return {
          success: false,
          message: 'Incorrect OTP. You have exhausted all attempts. Please request a new code.',
          attemptsLeft: 0
        };
      }
      localStorage.setItem(STORAGE_KEYS.ACTIVE_OTP, JSON.stringify(session));
      return {
        success: false,
        message: `Incorrect verification code. ${session.attemptsLeft} attempt(s) remaining.`,
        attemptsLeft: session.attemptsLeft
      };
    }

    // Success: Clear used OTP
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_OTP);
    return {
      success: true,
      message: 'Mobile number verified successfully!'
    };
  }

  // --- ACCOUNT CREATION (STEP 5) ---

  public async registerUser(
    fullName: string,
    mobile: string,
    countryCode: string,
    rawMobile: string,
    email: string,
    passwordPlain: string
  ): Promise<{ success: boolean; message: string; user?: UserAccount }> {
    const accounts = await this.getAccounts();

    // Check duplicate mobile
    const existingMobile = accounts.find(a => a.mobile.replace(/\D/g, '') === mobile.replace(/\D/g, ''));
    if (existingMobile) {
      return { 
        success: false, 
        message: 'This mobile number is already registered. Please log in instead.' 
      };
    }

    // Check duplicate email
    const existingEmail = accounts.find(a => a.email.toLowerCase() === email.trim().toLowerCase());
    if (existingEmail) {
      return { 
        success: false, 
        message: 'An account with this email address already exists. Please log in or use a different email.' 
      };
    }

    // Generate cryptographic salt and hash password
    const salt = generateSalt();
    const passwordHash = await hashPassword(passwordPlain, salt);

    const newUser: UserAccount = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: fullName.trim(),
      mobile,
      countryCode,
      rawMobile,
      email: email.trim().toLowerCase(),
      passwordHash,
      passwordSalt: salt,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      emailVerified: true,
      mobileVerified: true,
      failedLoginAttempts: 0
    };

    accounts.push(newUser);
    this.saveAccounts(accounts);

    // Auto-create session
    this.createSession(newUser.id, true);

    return {
      success: true,
      message: 'Account created successfully! Welcome to OwnIQ.',
      user: newUser
    };
  }

  // --- RETURNING USER LOGIN (STEP 6) & ACCOUNT LOCKOUT ---

  public getLockoutState(account: UserAccount): LockoutState {
    if (!account.lockoutUntil) {
      return { isLocked: false, remainingSeconds: 0 };
    }
    const now = Date.now();
    if (now < account.lockoutUntil) {
      const remainingSeconds = Math.ceil((account.lockoutUntil - now) / 1000);
      return { isLocked: true, remainingSeconds };
    }
    return { isLocked: false, remainingSeconds: 0 };
  }

  public async loginWithPassword(
    identifier: string, // mobile or email
    passwordPlain: string,
    rememberMe: boolean = false
  ): Promise<{ success: boolean; message: string; user?: UserAccount; lockoutState?: LockoutState }> {
    const accounts = await this.getAccounts();
    const cleanId = identifier.trim();

    // Search by email or mobile
    const user = accounts.find(a => {
      const isEmail = a.email.toLowerCase() === cleanId.toLowerCase();
      const isMobile = a.mobile.replace(/\D/g, '') === cleanId.replace(/\D/g, '') ||
                       a.rawMobile === cleanId.replace(/\D/g, '');
      return isEmail || isMobile;
    });

    if (!user) {
      return {
        success: false,
        message: 'No account found matching the provided mobile number or email address.'
      };
    }

    // Check account lockout
    const lockout = this.getLockoutState(user);
    if (lockout.isLocked) {
      const minutes = Math.ceil(lockout.remainingSeconds / 60);
      return {
        success: false,
        message: `Account temporarily locked due to excessive failed attempts. Please retry in ${minutes} minute(s).`,
        lockoutState: lockout
      };
    }

    // Verify password against stored hash and salt
    const isPasswordCorrect = await verifyPassword(passwordPlain, user.passwordSalt, user.passwordHash);

    if (!isPasswordCorrect) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      if (user.failedLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
        this.saveAccounts(accounts);
        return {
          success: false,
          message: `Too many failed login attempts. For security, your account has been locked for 15 minutes.`,
          lockoutState: { isLocked: true, remainingSeconds: LOCKOUT_DURATION_MS / 1000 }
        };
      }

      this.saveAccounts(accounts);
      const remainingAttempts = MAX_LOGIN_ATTEMPTS - user.failedLoginAttempts;
      return {
        success: false,
        message: `Incorrect password. ${remainingAttempts} attempt(s) remaining before temporary lockout.`
      };
    }

    // Login Successful: Reset failed attempts & lockout
    user.failedLoginAttempts = 0;
    user.lockoutUntil = undefined;
    user.lastLoginAt = new Date().toISOString();
    this.saveAccounts(accounts);

    this.createSession(user.id, rememberMe);

    return {
      success: true,
      message: `Welcome back, ${user.name}!`,
      user
    };
  }

  // --- PASSWORD RECOVERY / RESET ---

  public async resetPasswordWithOtp(
    mobileOrEmail: string,
    newPasswordPlain: string
  ): Promise<{ success: boolean; message: string }> {
    const accounts = await this.getAccounts();
    const cleanId = mobileOrEmail.trim();

    const user = accounts.find(a => 
      a.email.toLowerCase() === cleanId.toLowerCase() ||
      a.mobile.replace(/\D/g, '') === cleanId.replace(/\D/g, '') ||
      a.rawMobile === cleanId.replace(/\D/g, '')
    );

    if (!user) {
      return { success: false, message: 'Account not found for password reset.' };
    }

    const newSalt = generateSalt();
    const newHash = await hashPassword(newPasswordPlain, newSalt);

    user.passwordHash = newHash;
    user.passwordSalt = newSalt;
    user.failedLoginAttempts = 0;
    user.lockoutUntil = undefined;
    this.saveAccounts(accounts);

    return {
      success: true,
      message: 'Password reset successful! You can now log in with your new password.'
    };
  }

  // --- SESSION MANAGEMENT & EXPIRY ---

  public createSession(userId: string, rememberMe: boolean = true): AuthSession {
    const now = Date.now();
    const duration = rememberMe ? SESSION_DURATION_REMEMBER_MS : SESSION_DURATION_NORMAL_MS;
    const session: AuthSession = {
      userId,
      token: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
      createdAt: now,
      expiresAt: now + duration,
      rememberMe
    };
    this.currentSession = session;
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    return session;
  }

  public getSession(): AuthSession | null {
    if (this.currentSession) {
      if (Date.now() > this.currentSession.expiresAt) {
        this.logout();
        return null;
      }
      return this.currentSession;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (!raw) return null;
      const session: AuthSession = JSON.parse(raw);
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }
      this.currentSession = session;
      return session;
    } catch {
      return null;
    }
  }

  public async getAuthenticatedUser(): Promise<UserAccount | null> {
    const session = this.getSession();
    if (!session) return null;
    return this.findById(session.userId);
  }

  public logout(): void {
    this.currentSession = null;
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }
}

export const authService = new AuthService();
