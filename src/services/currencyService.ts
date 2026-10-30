// Currency & Regional Formatting Service for OwnIQ & OwnIQ Care

export type SupportedCurrency = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'CAD' | 'AUD' | 'SGD' | 'JPY';
export type DateFormatOption = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD' | 'DD MMM YYYY';
export type TimeFormatOption = '12h' | '24h';
export type SupportedLanguage = 'en-IN' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'en-US' | 'en-GB';

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  locale: string;
  rateToInr: number; // 1 unit of this currency = X INR
}

export const SUPPORTED_CURRENCIES: Record<SupportedCurrency, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    locale: 'en-IN',
    rateToInr: 1.0,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
    rateToInr: 83.25,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    locale: 'en-IE',
    rateToInr: 89.50,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    locale: 'en-GB',
    rateToInr: 105.40,
  },
  AED: {
    code: 'AED',
    symbol: 'د.إ',
    name: 'UAE Dirham',
    locale: 'en-AE',
    rateToInr: 22.65,
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    name: 'Canadian Dollar',
    locale: 'en-CA',
    rateToInr: 60.80,
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    locale: 'en-AU',
    rateToInr: 54.10,
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Singapore Dollar',
    locale: 'en-SG',
    rateToInr: 62.30,
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    locale: 'ja-JP',
    rateToInr: 0.54,
  },
};

export const SUPPORTED_LANGUAGES = [
  { code: 'en-IN', name: 'English (India)', nativeName: 'English (India)', isIndiaFirst: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी', isIndiaFirst: true },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', isIndiaFirst: true },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', isIndiaFirst: true },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', isIndiaFirst: true },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', isIndiaFirst: true },
  { code: 'en-US', name: 'English (US)', nativeName: 'English (US)', isIndiaFirst: false },
  { code: 'en-GB', name: 'English (UK)', nativeName: 'English (UK)', isIndiaFirst: false },
];

export const SUPPORTED_TIMEZONES = [
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST, UTC+05:30)', isDefault: true },
  { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (GST, UTC+04:00)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT, UTC+08:00)' },
  { value: 'Europe/London', label: 'Europe/London (GMT/BST, UTC+00:00)' },
  { value: 'Europe/Paris', label: 'Europe/Paris (CET, UTC+01:00)' },
  { value: 'America/New_York', label: 'America/New_York (EST/EDT, UTC-05:00)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST/PDT, UTC-08:00)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (AEST, UTC+10:00)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST, UTC+09:00)' },
];

export const SUPPORTED_COUNTRIES = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
];

/**
 * Convert value between currencies using verified rates table
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string = 'INR',
  toCurrency: string = 'INR'
): { convertedAmount: number; rate: number; isConverted: boolean } {
  const fromCode = (fromCurrency.toUpperCase() as SupportedCurrency);
  const toCode = (toCurrency.toUpperCase() as SupportedCurrency);

  const fromConfig = SUPPORTED_CURRENCIES[fromCode] || SUPPORTED_CURRENCIES.INR;
  const toConfig = SUPPORTED_CURRENCIES[toCode] || SUPPORTED_CURRENCIES.INR;

  if (fromCode === toCode) {
    return { convertedAmount: amount, rate: 1, isConverted: false };
  }

  // Convert from origin to INR, then to target
  const amountInInr = amount * fromConfig.rateToInr;
  const targetAmount = amountInInr / toConfig.rateToInr;
  const effectiveRate = fromConfig.rateToInr / toConfig.rateToInr;

  return {
    convertedAmount: Math.round(targetAmount * 100) / 100,
    rate: Math.round(effectiveRate * 10000) / 10000,
    isConverted: true
  };
}

/**
 * Format raw number with Indian numbering system or target locale
 * Indian grouping: ₹999, ₹12,499, ₹1,25,000
 */
export function formatRawNumber(amount: number, locale: string = 'en-IN'): string {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Primary formatCurrency function
 * Consistently applies currency preference and Indian number grouping.
 * Never silently mutates original value.
 */
export function formatCurrency(
  amount: number,
  fromCurrency: string = 'INR',
  displayCurrency: string = 'INR',
  options?: {
    showOriginalIfConverted?: boolean;
    maximumFractionDigits?: number;
  }
): string {
  const toCode = (displayCurrency.toUpperCase() as SupportedCurrency);
  const toConfig = SUPPORTED_CURRENCIES[toCode] || SUPPORTED_CURRENCIES.INR;
  
  const fromCode = (fromCurrency.toUpperCase() as SupportedCurrency);
  const fromConfig = SUPPORTED_CURRENCIES[fromCode] || SUPPORTED_CURRENCIES.INR;

  const { convertedAmount, isConverted, rate } = convertCurrency(amount, fromCode, toCode);

  // Format using native Intl with specific currency and locale
  // For INR with en-IN locale, this outputs: ₹999, ₹12,499, ₹1,25,000
  const formatter = new Intl.NumberFormat(toConfig.locale, {
    style: 'currency',
    currency: toConfig.code,
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
    minimumFractionDigits: 0
  });

  const formattedTarget = formatter.format(convertedAmount);

  if (isConverted && options?.showOriginalIfConverted) {
    const origFormatter = new Intl.NumberFormat(fromConfig.locale, {
      style: 'currency',
      currency: fromConfig.code,
      maximumFractionDigits: 0
    });
    return `${formattedTarget} (orig. ${origFormatter.format(amount)})`;
  }

  return formattedTarget;
}

export interface DetailedPrice {
  displayAmount: number;
  displayFormatted: string;
  originalAmount: number;
  originalFormatted: string;
  originalCurrency: string;
  displayCurrency: string;
  isConverted: boolean;
  exchangeRateNotice?: string;
}

/**
 * Returns detailed conversion breakdown for explicit UI labeling
 */
export function getDetailedPrice(
  amount: number,
  fromCurrency: string = 'INR',
  displayCurrency: string = 'INR'
): DetailedPrice {
  const toCode = (displayCurrency.toUpperCase() as SupportedCurrency);
  const toConfig = SUPPORTED_CURRENCIES[toCode] || SUPPORTED_CURRENCIES.INR;
  const fromCode = (fromCurrency.toUpperCase() as SupportedCurrency);
  const fromConfig = SUPPORTED_CURRENCIES[fromCode] || SUPPORTED_CURRENCIES.INR;

  const { convertedAmount, isConverted, rate } = convertCurrency(amount, fromCode, toCode);

  const displayFormatter = new Intl.NumberFormat(toConfig.locale, {
    style: 'currency',
    currency: toConfig.code,
    maximumFractionDigits: 0
  });

  const origFormatter = new Intl.NumberFormat(fromConfig.locale, {
    style: 'currency',
    currency: fromConfig.code,
    maximumFractionDigits: 0
  });

  const displayFormatted = displayFormatter.format(convertedAmount);
  const originalFormatted = origFormatter.format(amount);

  let exchangeRateNotice: string | undefined = undefined;
  if (isConverted) {
    exchangeRateNotice = `Converted from ${originalFormatted} @ 1 ${fromConfig.code} = ${toConfig.symbol}${rate.toFixed(2)}`;
  }

  return {
    displayAmount: convertedAmount,
    displayFormatted,
    originalAmount: amount,
    originalFormatted,
    originalCurrency: fromCode,
    displayCurrency: toCode,
    isConverted,
    exchangeRateNotice
  };
}

/**
 * Format date string according to regional preference
 */
export function formatRegionalDate(dateStr: string | Date, formatOption: DateFormatOption = 'DD/MM/YYYY'): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);

    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const monthShort = d.toLocaleString('en-US', { month: 'short' });

    if (formatOption === 'DD/MM/YYYY') return `${day}/${month}/${year}`;
    if (formatOption === 'MM/DD/YYYY') return `${month}/${day}/${year}`;
    if (formatOption === 'YYYY-MM-DD') return `${year}-${month}-${day}`;
    if (formatOption === 'DD MMM YYYY') return `${day} ${monthShort} ${year}`;
    return `${day}/${month}/${year}`;
  } catch {
    return String(dateStr);
  }
}

/**
 * Format time string according to regional preference (12h vs 24h)
 */
export function formatRegionalTime(timeStr: string | Date, formatOption: TimeFormatOption = '12h'): string {
  try {
    let d: Date;
    if (typeof timeStr === 'string' && /^\d{1,2}:\d{2}$/.test(timeStr.trim())) {
      const [h, m] = timeStr.trim().split(':').map(Number);
      d = new Date();
      d.setHours(h, m, 0, 0);
    } else {
      d = new Date(timeStr);
    }
    if (isNaN(d.getTime())) return String(timeStr);

    if (formatOption === '24h') {
      return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();
  } catch {
    return String(timeStr);
  }
}
