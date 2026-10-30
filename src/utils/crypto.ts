import { PasswordValidationResult } from '../types/auth';

/**
 * Generate a cryptographically secure random 16-byte hex salt
 */
export function generateSalt(): string {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Hash a password using Web Crypto API SHA-256 with a unique cryptographic salt.
 * Plain text passwords are NEVER stored.
 */
export async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt + 'owniq_platform_auth_pepper_2026');
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify a plain text password against a stored salt & hash
 */
export async function verifyPassword(password: string, salt: string, storedHash: string): Promise<boolean> {
  const computedHash = await hashPassword(password, salt);
  return computedHash === storedHash;
}

/**
 * Generate a random 6-digit OTP using crypto.getRandomValues
 * Not a fixed code; changes on every dispatch.
 */
export function generateSecureOtp(): string {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  // Guarantee a 6-digit code between 100000 and 999999
  const code = (100000 + (array[0] % 900000)).toString();
  return code;
}

/**
 * Comprehensive password requirement validation
 */
export function evaluatePasswordRules(password: string, confirmPassword: string = ''): PasswordValidationResult {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?~`\\/]/.test(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  const isValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar && passwordsMatch;

  return {
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    passwordsMatch,
    isValid
  };
}
