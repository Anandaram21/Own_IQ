import { CountryCode } from '../types/auth';

export const DEFAULT_COUNTRY_CODE: CountryCode = {
  name: 'India',
  code: 'IN',
  dialCode: '+91',
  flag: '🇮🇳',
  format: '98765 43210',
  minLength: 10,
  maxLength: 10
};

export const COUNTRY_CODES: CountryCode[] = [
  DEFAULT_COUNTRY_CODE,
  {
    name: 'United States',
    code: 'US',
    dialCode: '+1',
    flag: '🇺🇸',
    format: '(555) 000-0000',
    minLength: 10,
    maxLength: 10
  },
  {
    name: 'United Kingdom',
    code: 'GB',
    dialCode: '+44',
    flag: '🇬🇧',
    format: '7911 123456',
    minLength: 10,
    maxLength: 10
  },
  {
    name: 'United Arab Emirates',
    code: 'AE',
    dialCode: '+971',
    flag: '🇦🇪',
    format: '50 123 4567',
    minLength: 9,
    maxLength: 9
  },
  {
    name: 'Canada',
    code: 'CA',
    dialCode: '+1',
    flag: '🇨🇦',
    format: '(555) 000-0000',
    minLength: 10,
    maxLength: 10
  },
  {
    name: 'Australia',
    code: 'AU',
    dialCode: '+61',
    flag: '🇦🇺',
    format: '412 345 678',
    minLength: 9,
    maxLength: 9
  },
  {
    name: 'Singapore',
    code: 'SG',
    dialCode: '+65',
    flag: '🇸🇬',
    format: '8123 4567',
    minLength: 8,
    maxLength: 8
  },
  {
    name: 'Germany',
    code: 'DE',
    dialCode: '+49',
    flag: '🇩🇪',
    format: '151 12345678',
    minLength: 10,
    maxLength: 11
  },
  {
    name: 'France',
    code: 'FR',
    dialCode: '+33',
    flag: '🇫🇷',
    format: '6 12 34 56 78',
    minLength: 9,
    maxLength: 9
  },
  {
    name: 'Saudi Arabia',
    code: 'SA',
    dialCode: '+966',
    flag: '🇸🇦',
    format: '50 123 4567',
    minLength: 9,
    maxLength: 9
  },
  {
    name: 'Japan',
    code: 'JP',
    dialCode: '+81',
    flag: '🇯🇵',
    format: '90 1234 5678',
    minLength: 10,
    maxLength: 10
  }
];

export function validateMobileNumber(rawNumber: string, country: CountryCode): { isValid: boolean; error?: string } {
  const digitsOnly = rawNumber.replace(/\D/g, '');

  if (!digitsOnly) {
    return { isValid: false, error: 'Mobile number is required' };
  }

  // Specific rules for India (+91)
  if (country.dialCode === '+91') {
    if (digitsOnly.length !== 10) {
      return { isValid: false, error: 'Indian mobile numbers must be exactly 10 digits' };
    }
    if (!/^[6-9]\d{9}$/.test(digitsOnly)) {
      return { isValid: false, error: 'Indian mobile numbers must start with 6, 7, 8, or 9' };
    }
    return { isValid: true };
  }

  // General international length check
  if (digitsOnly.length < country.minLength) {
    return { 
      isValid: false, 
      error: `Mobile number for ${country.name} must be at least ${country.minLength} digits` 
    };
  }

  if (digitsOnly.length > country.maxLength) {
    return { 
      isValid: false, 
      error: `Mobile number for ${country.name} cannot exceed ${country.maxLength} digits` 
    };
  }

  return { isValid: true };
}
