// OwnIQ & OwnIQ Care - Global TypeScript Type Definitions

export type AppModule = 
  | 'dashboard' 
  | 'assets' 
  | 'advisor' 
  | 'health' 
  | 'usage' 
  | 'care' 
  | 'settings';

export type CareViewMode = 'recipient' | 'caregiver';

export type AssetCategory = 
  | 'Smartphones & Mobile'
  | 'Laptops & Computing'
  | 'Audio & Wearables'
  | 'Vehicles & Transport'
  | 'Household Appliances'
  | 'Cameras & Optics'
  | 'Travel & Luggage'
  | 'Valuables & Jewelry'
  | 'Home & Wellness'
  | 'Other';

export type AssetCondition = 'Mint / Like New' | 'Good' | 'Fair' | 'Needs Service' | 'Damaged';

export interface AssetDocument {
  id: string;
  assetId?: string;
  title: string;
  type: 'Invoice' | 'Receipt' | 'Warranty Certificate' | 'Insurance Policy' | 'User Manual' | 'Service Record' | 'Photo' | 'Other';
  fileUrl: string; // Base64 or Blob URL or placeholder
  fileType: string;
  fileSize?: string;
  uploadDate: string;
  ocrExtractedText?: string;
  ocrConfidence?: number;
}

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  title: string;
  date: string;
  cost: number;
  currency?: string;
  provider: string;
  notes: string;
  isCompleted: boolean;
  type: 'Routine Inspection' | 'Repair' | 'Battery Replacement' | 'Software / Firmware' | 'Cleaning / Servicing' | 'Warranty Claim';
}

export interface UsageLog {
  id: string;
  assetId: string;
  date: string;
  durationMinutes?: number;
  usageType: 'Daily Work' | 'Commute' | 'Travel' | 'Entertainment' | 'Exercise' | 'Standby';
  notes?: string;
}

export interface Asset {
  id: string;
  name: string;
  brand: string;
  model: string;
  serialNumber: string;
  category: AssetCategory;
  purchaseDate: string;
  purchasePrice: number;
  currency: string;
  currentEstimatedValue: number;
  condition: AssetCondition;
  location: string;
  accessories: string[];
  tags: string[];
  notes: string;
  imageUrl?: string;
  
  // Warranty
  warrantyProvider?: string;
  warrantyDurationMonths?: number;
  warrantyExpiryDate?: string;
  warrantyTerms?: string;
  
  // Insurance
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceExpiryDate?: string;
  insuranceCoverageAmount?: number;
  
  // Relations & Meta
  documents: AssetDocument[];
  maintenanceRecords: MaintenanceRecord[];
  usageLogs: UsageLog[];
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt: string;
  
  // Usage estimate
  estimatedUsageFrequency?: 'Daily' | 'Weekly' | 'Occasional' | 'Underused' | 'Rare' | 'Dormant';
  lastUsedDate?: string;
}

export interface OcrExtractedData {
  assetName?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  currency?: string;
  warrantyDurationMonths?: number;
  warrantyExpiryDate?: string;
  vendorName?: string;
  documentType?: 'Invoice' | 'Receipt' | 'Warranty Certificate' | 'Service Record';
  rawText: string;
  confidenceScore: number;
}

// Module Two: AI Asset Advisor
export interface CalendarEvent {
  id: string;
  title: string;
  type: 'meeting' | 'class' | 'trip' | 'appointment' | 'gym' | 'doctor' | 'shopping' | 'social';
  startTime: string; // ISO string
  endTime: string;   // ISO string
  location: string;
  description?: string;
  source: 'in-app' | 'google-calendar' | 'ics-import';
  suggestedAssetIds: string[]; // matching asset IDs from wallet
  additionalItems: string[];  // general items like 'Notebook', 'ID Badge', etc.
  checklist: {
    id: string;
    name: string;
    isPacked: boolean;
    assetId?: string;
    isEssential?: boolean;
    reason?: string;
  }[];
}

export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  conditionText: string;
  isRainExpected: boolean;
  precipitationProbability: number;
  humidity: number;
  uvIndex: number;
  windSpeed: number;
  lastUpdated: string;
  recommendations: {
    category: 'weather-gear' | 'warning' | 'preparation';
    item: string;
    reason: string;
    matchedAssetId?: string;
  }[];
}

export interface DepartureRoutine {
  id: string;
  name: string;
  icon: string;
  type: 'work' | 'college' | 'travel' | 'gym' | 'shopping' | 'custom';
  items: {
    id: string;
    name: string;
    assetId?: string;
    isPacked: boolean;
    isEssential: boolean;
  }[];
}

export interface TravelTrip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  purpose: 'business' | 'vacation' | 'hiking' | 'conference' | 'family-visit';
  expectedWeather: string;
  notes?: string;
  items: {
    id: string;
    category: 'Electronics & Work' | 'Clothing & Weather' | 'Documents & Essentials' | 'Health & Care';
    name: string;
    assetId?: string;
    isPacked: boolean;
  }[];
}

// Module Three: AI Asset Health
export interface AssetHealthMetric {
  assetId: string;
  healthScore: number; // 0 - 100
  warrantyStatus: 'active' | 'expiring-soon' | 'expired' | 'no-warranty';
  insuranceStatus: 'active' | 'expiring-soon' | 'expired' | 'no-insurance';
  daysUntilWarrantyExpiry?: number;
  daysUntilInsuranceExpiry?: number;
  maintenanceStatus: 'up-to-date' | 'due-soon' | 'overdue' | 'not-scheduled';
  nextMaintenanceDate?: string;
  recommendedService?: string;
  isPredictiveSignal?: boolean;
  signalConfidenceNote?: string;
}

// Module Four: AI Usage Intelligence
export interface UsageAnalytics {
  assetId: string;
  assetName: string;
  category: AssetCategory;
  totalLoggedHours: number;
  usageFrequency: 'Daily' | 'Weekly' | 'Occasional' | 'Underused' | 'Rare' | 'Dormant';
  utilizationRate: number; // percentage 0-100
  costPerUse: number;
  recommendation: 'Keep & Maintain' | 'Preventative Service' | 'Repair Needed' | 'Consider Resale' | 'Consider Donation' | 'Upgrade Recommended';
  reasoning: string;
  estimatedResaleValue: number;
  depreciationPercentage: number;
}

// Module Five: OwnIQ Care
export interface MedicationReminder {
  id: string;
  name: string;
  timingDescription: string; // e.g. "Morning with Breakfast (8:00 AM)"
  scheduledTime: string;      // HH:mm format, e.g. "08:00"
  instructions: string;       // e.g. "Take 1 tablet with a full glass of water. Do not chew."
  pillVisual: {
    shape: 'round' | 'oval' | 'capsule' | 'dropper' | 'liquid';
    color: string;
    label: string;
  };
  caregiverNotes: string;
  statusToday: 'pending' | 'taken' | 'snoozed' | 'missed';
  takenAt?: string;
  snoozedUntil?: string;
  notifyCaregiverIfMissed: boolean;
  history: {
    date: string;
    status: 'taken' | 'snoozed' | 'missed';
    timestamp: string;
    loggedBy: 'recipient' | 'caregiver';
  }[];
}

export interface CaregiverInstruction {
  id: string;
  title: string;
  category: 'Daily Activity' | 'Appointment' | 'Personal Care' | 'Meal Reminder' | 'Family Message' | 'Gentle Note';
  message: string;
  scheduledTime?: string;
  caregiverName: string;
  caregiverRole: string; // e.g., "Sarah (Daughter)", "Robert (Visiting Nurse)"
  isAcknowledged: boolean;
  acknowledgedAt?: string;
  priority: 'normal' | 'important' | 'loving-note';
  dateCreated: string;
}

export interface CareDailyActivity {
  id: string;
  time: string;
  title: string;
  description: string;
  category: 'wake' | 'meal' | 'medication' | 'exercise' | 'social' | 'rest' | 'night';
  isCompleted: boolean;
  completedAt?: string;
  relatedMedicationId?: string;
  audioPromptText?: string;
}

export interface CareRecipientProfile {
  id: string;
  name: string;
  preferredName: string;
  birthYear: number;
  photoUrl?: string;
  residence: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  caregiverContact: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
  todayOrientation: {
    greeting: string;
    weatherSummary: string;
    peacefulMessage: string;
  };
}

// Notification System
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'asset-warranty' | 'asset-maintenance' | 'advisor-departure' | 'weather' | 'care-medication' | 'care-instruction' | 'system';
  isRead: boolean;
  actionUrl?: string;
  targetModule?: AppModule;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

// User & Preferences
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  currency: string; // Default: 'INR'
  preferredUnits: 'metric' | 'imperial';
  city: string;
  country: string; // Default: 'India'
  language: string; // Default: 'en-IN'
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD' | 'DD MMM YYYY'; // Default: 'DD/MM/YYYY'
  timeFormat: '12h' | '24h'; // Default: '12h'
  timeZone: string; // Default: 'Asia/Kolkata'
  notificationsEnabled: boolean;
  highContrastCareMode: boolean;
  speakPromptsAloud: boolean;
  googleCalendarLinked: boolean;
  demoModeActive: boolean;
}
