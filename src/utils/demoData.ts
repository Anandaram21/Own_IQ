import { 
  Asset, 
  CalendarEvent, 
  DepartureRoutine, 
  MedicationReminder, 
  CaregiverInstruction, 
  CareDailyActivity, 
  CareRecipientProfile,
  AppNotification,
  UserProfile,
  TravelTrip
} from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  id: 'usr_001',
  name: 'Alex Chen',
  email: 'alex.chen@owniq.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  currency: 'INR',
  preferredUnits: 'metric',
  city: 'Vellore, Tamil Nadu',
  country: 'India',
  language: 'en-IN',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '12h',
  timeZone: 'Asia/Kolkata',
  notificationsEnabled: true,
  highContrastCareMode: false,
  speakPromptsAloud: true,
  googleCalendarLinked: true,
  demoModeActive: true
};

export const INITIAL_ASSETS: Asset[] = [
  {
    id: 'asset_mbp_16',
    name: 'MacBook Pro 16" M3 Max',
    brand: 'Apple',
    model: 'A2991 (Space Black, 36GB / 1TB)',
    serialNumber: 'C02XG123K9J2',
    category: 'Laptops & Computing',
    purchaseDate: '2024-03-15',
    purchasePrice: 249900.00,
    currency: 'INR',
    currentEstimatedValue: 215000.00,
    condition: 'Mint / Like New',
    location: 'Home Office - Desk Dock',
    accessories: [
      '140W USB-C Power Adapter',
      'MagSafe 3 Braided Cable',
      'Apple Magic Mouse 2 (Black)',
      'Incase Neoprene Woolenex Sleeve',
      'Anker 7-in-1 USB-C Hub'
    ],
    tags: ['work', 'daily-carry', 'high-value', 'apple-care'],
    notes: 'Primary workstation laptop. AppleCare+ registered until March 2027.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    warrantyProvider: 'AppleCare+ Extended Protection',
    warrantyDurationMonths: 36,
    warrantyExpiryDate: '2027-03-15',
    warrantyTerms: 'Full accidental damage protection (₹8,200 screen, ₹24,900 hardware replacement)',
    insuranceProvider: 'Lemonade Tech Endorsement',
    insurancePolicyNumber: 'LEM-TECH-884210',
    insuranceExpiryDate: '2027-04-01',
    insuranceCoverageAmount: 250000,
    estimatedUsageFrequency: 'Daily',
    lastUsedDate: '2026-10-26',
    createdAt: '2024-03-16T10:00:00Z',
    updatedAt: '2026-10-26T08:30:00Z',
    documents: [
      {
        id: 'doc_mbp_inv',
        title: 'Apple Store Official Tax Invoice',
        type: 'Invoice',
        fileUrl: 'https://images.unsplash.com/photo-1554415707-9e4966a604f7?auto=format&fit=crop&w=400&q=80',
        fileType: 'application/pdf',
        fileSize: '412 KB',
        uploadDate: '2024-03-16',
        ocrExtractedText: 'APPLE RETAIL STORE INV-2024-98421\nITEM: MacBook Pro 16-inch M3 Max\nSERIAL: C02XG123K9J2\nTOTAL: ₹2,49,900.00\nWARRANTY: AppleCare+ 3 Years',
        ocrConfidence: 96
      },
      {
        id: 'doc_mbp_warranty',
        title: 'AppleCare+ Proof of Coverage',
        type: 'Warranty Certificate',
        fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80',
        fileType: 'application/pdf',
        fileSize: '280 KB',
        uploadDate: '2024-03-17',
        ocrExtractedText: 'AppleCare+ Certificate of Insurance\nAgreement Number: 9938210948\nCoverage Ends: March 15, 2027',
        ocrConfidence: 94
      }
    ],
    maintenanceRecords: [
      {
        id: 'maint_mbp_1',
        assetId: 'asset_mbp_16',
        title: 'Internal Dust & Fan Purge + Thermal Diagnostic',
        date: '2025-09-12',
        cost: 0,
        provider: 'Apple Store Genius Bar (Union Square)',
        notes: 'Complimentary AppleCare annual diagnostic. Battery cycle count: 142. Health: 98%.',
        isCompleted: true,
        type: 'Routine Inspection'
      }
    ],
    usageLogs: [
      { id: 'use_mbp_1', assetId: 'asset_mbp_16', date: '2026-10-28', durationMinutes: 480, usageType: 'Daily Work', notes: 'Sprint architecture implementation & frontend dev' },
      { id: 'use_mbp_2', assetId: 'asset_mbp_16', date: '2026-10-27', durationMinutes: 450, usageType: 'Daily Work', notes: 'Client presentation & code review sync' },
      { id: 'use_mbp_3', assetId: 'asset_mbp_16', date: '2026-10-26', durationMinutes: 480, usageType: 'Daily Work', notes: 'Full-day sprint architecture development' },
      { id: 'use_mbp_4', assetId: 'asset_mbp_16', date: '2026-10-25', durationMinutes: 360, usageType: 'Daily Work', notes: 'Platform database migrations & schema design' },
      { id: 'use_mbp_5', assetId: 'asset_mbp_16', date: '2026-10-24', durationMinutes: 480, usageType: 'Daily Work', notes: 'Technical sync and UI performance tuning' },
      { id: 'use_mbp_6', assetId: 'asset_mbp_16', date: '2026-10-23', durationMinutes: 420, usageType: 'Daily Work', notes: 'Algorithm optimization & test coverage' },
      { id: 'use_mbp_7', assetId: 'asset_mbp_16', date: '2026-10-22', durationMinutes: 450, usageType: 'Daily Work', notes: 'Feature deployment and monitoring' },
      { id: 'use_mbp_8', assetId: 'asset_mbp_16', date: '2026-10-21', durationMinutes: 390, usageType: 'Daily Work', notes: 'Product roadmap planning & UX wireframes' },
      { id: 'use_mbp_9', assetId: 'asset_mbp_16', date: '2026-10-19', durationMinutes: 480, usageType: 'Daily Work', notes: 'Full-stack engineering sprint' },
      { id: 'use_mbp_10', assetId: 'asset_mbp_16', date: '2026-10-18', durationMinutes: 420, usageType: 'Daily Work', notes: 'Performance profiling & security audit' },
      { id: 'use_mbp_11', assetId: 'asset_mbp_16', date: '2026-10-15', durationMinutes: 480, usageType: 'Daily Work', notes: 'Deep focus coding session' },
      { id: 'use_mbp_12', assetId: 'asset_mbp_16', date: '2026-10-12', durationMinutes: 420, usageType: 'Daily Work', notes: 'Sprint backlog refinement' },
      { id: 'use_mbp_13', assetId: 'asset_mbp_16', date: '2026-10-08', durationMinutes: 480, usageType: 'Daily Work', notes: 'Architecture design documentation' },
      { id: 'use_mbp_14', assetId: 'asset_mbp_16', date: '2026-10-02', durationMinutes: 450, usageType: 'Daily Work', notes: 'Quarterly sprint kickoff' },
      { id: 'use_mbp_base', assetId: 'asset_mbp_16', date: '2026-09-15', durationMinutes: 21600, usageType: 'Daily Work', notes: 'Accumulated verified quarterly production hours' }
    ]
  },
  {
    id: 'asset_sony_xm5',
    name: 'Sony WH-1000XM5 ANC Headphones',
    brand: 'Sony',
    model: 'WH1000XM5/S (Silver)',
    serialNumber: 'S01-9876543-H',
    category: 'Audio & Wearables',
    purchaseDate: '2024-05-20',
    purchasePrice: 29990.00,
    currency: 'INR',
    currentEstimatedValue: 24500.00,
    condition: 'Good',
    location: 'Backpack - Top Pouch',
    accessories: [
      'Gold-Plated 3.5mm Headphone Cable',
      'USB-A to USB-C Charging Cable',
      'Collapsible Travel Hard Case',
      'Airplane In-Flight Audio Adapter'
    ],
    tags: ['audio', 'travel', 'commute', 'noise-cancelling'],
    notes: 'Used for daily meetings, train commutes, and flights.',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    warrantyProvider: 'Sony India 2-Year Manufacturer Guarantee',
    warrantyDurationMonths: 24,
    warrantyExpiryDate: '2026-05-20',
    warrantyTerms: 'Manufacturer defects covered. Excludes water damage.',
    insuranceProvider: 'Credit Card Purchase Protection',
    insurancePolicyNumber: 'CC-PROT-4912',
    insuranceExpiryDate: '2025-05-20',
    insuranceCoverageAmount: 30000,
    estimatedUsageFrequency: 'Daily',
    lastUsedDate: '2026-10-26',
    createdAt: '2024-05-21T14:20:00Z',
    updatedAt: '2026-10-25T18:00:00Z',
    documents: [
      {
        id: 'doc_sony_rcpt',
        title: 'Sony Center Official Purchase Receipt',
        type: 'Receipt',
        fileUrl: 'https://images.unsplash.com/photo-1554415707-9e4966a604f7?auto=format&fit=crop&w=400&q=80',
        fileType: 'image/jpeg',
        fileSize: '310 KB',
        uploadDate: '2024-05-21',
        ocrExtractedText: 'SONY CENTER ELECTRONICS\nSONY WH-1000XM5 SILVER\nSN: S01-9876543-H\nTOTAL: ₹29,990.00\nWARRANTY: 24 MONTHS',
        ocrConfidence: 91
      }
    ],
    maintenanceRecords: [
      {
        id: 'maint_sony_1',
        assetId: 'asset_sony_xm5',
        title: 'Ear Cushion Deep Cleaning & Firmware v2.1.0 Update',
        date: '2026-04-10',
        cost: 15.00,
        provider: 'Self-Serviced with Sony Care Kit',
        notes: 'Cleaned synthetic leather pads and installed multipoint stability update.',
        isCompleted: true,
        type: 'Cleaning / Servicing'
      }
    ],
    usageLogs: [
      { id: 'use_sony_1', assetId: 'asset_sony_xm5', date: '2026-10-28', durationMinutes: 180, usageType: 'Commute', notes: 'Morning train commute & focus audio' },
      { id: 'use_sony_2', assetId: 'asset_sony_xm5', date: '2026-10-27', durationMinutes: 240, usageType: 'Daily Work', notes: 'Client video calls and noise cancellation' },
      { id: 'use_sony_3', assetId: 'asset_sony_xm5', date: '2026-10-26', durationMinutes: 180, usageType: 'Commute', notes: 'Subway ride and office focus sessions' },
      { id: 'use_sony_4', assetId: 'asset_sony_xm5', date: '2026-10-25', durationMinutes: 210, usageType: 'Daily Work', notes: 'Deep focus playlist during coding' },
      { id: 'use_sony_5', assetId: 'asset_sony_xm5', date: '2026-10-24', durationMinutes: 150, usageType: 'Commute', notes: 'Evening commute return' },
      { id: 'use_sony_6', assetId: 'asset_sony_xm5', date: '2026-10-22', durationMinutes: 180, usageType: 'Daily Work', notes: 'Open-office sound isolation' },
      { id: 'use_sony_7', assetId: 'asset_sony_xm5', date: '2026-10-20', durationMinutes: 240, usageType: 'Entertainment', notes: 'Flight travel ANC isolation' },
      { id: 'use_sony_8', assetId: 'asset_sony_xm5', date: '2026-10-17', durationMinutes: 180, usageType: 'Commute', notes: 'BART transit commute' },
      { id: 'use_sony_9', assetId: 'asset_sony_xm5', date: '2026-10-14', durationMinutes: 210, usageType: 'Daily Work', notes: 'Design sprint conferencing' },
      { id: 'use_sony_10', assetId: 'asset_sony_xm5', date: '2026-10-10', durationMinutes: 180, usageType: 'Entertainment', notes: 'Audiobook and acoustic session' },
      { id: 'use_sony_base', assetId: 'asset_sony_xm5', date: '2026-09-15', durationMinutes: 10500, usageType: 'Daily Work', notes: 'Cumulative active verified listening hours' }
    ]
  },
  {
    id: 'asset_honda_civic',
    name: 'Honda Civic Touring Sedan 2022',
    brand: 'Honda',
    model: 'Civic 1.5L Turbo CVT (Sonic Gray Pearl)',
    serialNumber: 'VIN-1HGBG1F87NA019842',
    category: 'Vehicles & Transport',
    purchaseDate: '2022-09-10',
    purchasePrice: 2480000.00,
    currency: 'INR',
    currentEstimatedValue: 1860000.00,
    condition: 'Good',
    location: 'Garage - Bay 1',
    accessories: [
      'Smart Entry Key Fob #1 (Driver 1 Profile)',
      'Smart Entry Key Fob #2 (Driver 2 Profile)',
      'All-Weather Heavy Duty Rubber Floor Mats',
      'Roadside Emergency Hazard Kit & Air Compressor'
    ],
    tags: ['vehicle', 'commute', 'roadtrip', 'honda'],
    notes: 'Odometer: 34,200 km. Clean title.',
    imageUrl: 'https://images.unsplash.com/photo-1590362891988-f778047020a6?auto=format&fit=crop&w=800&q=80',
    warrantyProvider: 'Honda Powertrain Warranty (5-Year / 1,00,000 km)',
    warrantyDurationMonths: 60,
    warrantyExpiryDate: '2027-09-10',
    warrantyTerms: 'Engine, transmission, drivetrain components covered.',
    insuranceProvider: 'HDFC ERGO Auto Comprehensive & Collision',
    insurancePolicyNumber: 'HDFC-AUTO-948102-TN',
    insuranceExpiryDate: '2026-12-15',
    insuranceCoverageAmount: 2000000,
    estimatedUsageFrequency: 'Daily',
    lastUsedDate: '2026-10-25',
    createdAt: '2022-09-11T09:00:00Z',
    updatedAt: '2026-10-20T11:00:00Z',
    documents: [
      {
        id: 'doc_honda_reg',
        title: 'Tamil Nadu RTO Vehicle Registration Certificate',
        type: 'Other',
        fileUrl: 'https://images.unsplash.com/photo-1554415707-9e4966a604f7?auto=format&fit=crop&w=400&q=80',
        fileType: 'application/pdf',
        fileSize: '520 KB',
        uploadDate: '2022-09-12',
        ocrExtractedText: 'GOVERNMENT OF TAMIL NADU TRANSPORT DEPT\nVEHICLE REGISTRATION CARD\nVIN: 1HGBG1F87NA019842\nMAKE: HONDA 2022 CIVIC\nPLATE: TN-23-AX-8941',
        ocrConfidence: 98
      },
      {
        id: 'doc_honda_ins',
        title: 'HDFC ERGO Insurance Card & Policy Schedule',
        type: 'Insurance Policy',
        fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80',
        fileType: 'application/pdf',
        fileSize: '340 KB',
        uploadDate: '2026-06-15',
        ocrExtractedText: 'HDFC ERGO MOTOR INSURANCE CERTIFICATE\nPOLICY: 948102-TN\nEFFECTIVE: 15/06/2026 TO 15/12/2026\nCOVERED: 2022 HONDA CIVIC 4DR\nIDV: ₹20,00,000',
        ocrConfidence: 95
      }
    ],
    maintenanceRecords: [
      {
        id: 'maint_honda_1',
        assetId: 'asset_honda_civic',
        title: '30,000-km Factory Major Service (Oil, Filter, Cabin Filter, Brake Flush)',
        date: '2026-05-18',
        cost: 23500.00,
        provider: 'Capital Honda Authorized Dealership, Vellore',
        notes: '0W-20 Full Synthetic Oil, Multi-Point Inspection passed. Brake pads at 7mm front, 6mm rear.',
        isCompleted: true,
        type: 'Routine Inspection'
      },
      {
        id: 'maint_honda_2',
        assetId: 'asset_honda_civic',
        title: 'Tire Rotation & Pressure Sensor Calibration',
        date: '2026-11-20',
        cost: 3500.00,
        provider: 'Capital Honda Dealership',
        notes: 'Upcoming scheduled routine rotation at 37,500 km.',
        isCompleted: false,
        type: 'Routine Inspection'
      }
    ],
    usageLogs: [
      { id: 'use_honda_1', assetId: 'asset_honda_civic', date: '2026-10-28', durationMinutes: 60, usageType: 'Commute', notes: 'Downtown office round trip commute' },
      { id: 'use_honda_2', assetId: 'asset_honda_civic', date: '2026-10-27', durationMinutes: 45, usageType: 'Commute', notes: 'Evening grocery run & gym transit' },
      { id: 'use_honda_3', assetId: 'asset_honda_civic', date: '2026-10-26', durationMinutes: 60, usageType: 'Commute', notes: 'Highway 101 morning transit' },
      { id: 'use_honda_4', assetId: 'asset_honda_civic', date: '2026-10-25', durationMinutes: 90, usageType: 'Travel', notes: 'Weekend visit to Marin Headlands' },
      { id: 'use_honda_5', assetId: 'asset_honda_civic', date: '2026-10-24', durationMinutes: 45, usageType: 'Commute', notes: 'Office commute' },
      { id: 'use_honda_6', assetId: 'asset_honda_civic', date: '2026-10-22', durationMinutes: 60, usageType: 'Commute', notes: 'Rainy evening commute' },
      { id: 'use_honda_7', assetId: 'asset_honda_civic', date: '2026-10-20', durationMinutes: 75, usageType: 'Travel', notes: 'Visit to Maple Grove Senior Living' },
      { id: 'use_honda_8', assetId: 'asset_honda_civic', date: '2026-10-18', durationMinutes: 50, usageType: 'Commute', notes: 'Office commute' },
      { id: 'use_honda_9', assetId: 'asset_honda_civic', date: '2026-10-15', durationMinutes: 120, usageType: 'Travel', notes: 'Weekend coastal drive' },
      { id: 'use_honda_10', assetId: 'asset_honda_civic', date: '2026-10-10', durationMinutes: 45, usageType: 'Commute', notes: 'Weekday commute' },
      { id: 'use_honda_base', assetId: 'asset_honda_civic', date: '2026-09-15', durationMinutes: 8400, usageType: 'Commute', notes: 'Verified vehicle operational drive time' }
    ]
  },
  {
    id: 'asset_dyson_v15',
    name: 'Dyson V15 Detect Cordless Vacuum',
    brand: 'Dyson',
    model: 'SV22 Detect Absolute',
    serialNumber: 'DY-V15-894726-X',
    category: 'Household Appliances',
    purchaseDate: '2023-11-10',
    purchasePrice: 62990.00,
    currency: 'INR',
    currentEstimatedValue: 42000.00,
    condition: 'Good',
    location: 'Utility Closet - Wall Mount',
    accessories: [
      'Fluffy Optic Illuminated Cleaner Head',
      'Digital Motorbar Anti-Tangle Head',
      'Combination Crevice & Brush Tool',
      'Hair Screw Pet Tool',
      'Quick-Release Wand & Charger'
    ],
    tags: ['cleaning', 'home', 'appliances', 'dyson'],
    notes: 'Smart laser particle counter. 2-Year guarantee registered with Dyson.',
    imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=800&q=80',
    warrantyProvider: 'Dyson India 2-Year Manufacturer Limited Warranty',
    warrantyDurationMonths: 24,
    warrantyExpiryDate: '2025-11-10',
    warrantyTerms: 'Parts and labor coverage against manufacturing defects.',
    insuranceProvider: 'Home Contents Protection Plan',
    insurancePolicyNumber: 'HO-88912',
    insuranceExpiryDate: '2027-01-01',
    insuranceCoverageAmount: 60000,
    estimatedUsageFrequency: 'Weekly',
    lastUsedDate: '2026-10-24',
    createdAt: '2023-11-12T16:00:00Z',
    updatedAt: '2026-10-24T15:00:00Z',
    documents: [
      {
        id: 'doc_dyson_cert',
        title: 'Dyson Official Guarantee Registration Certificate',
        type: 'Warranty Certificate',
        fileUrl: 'https://images.unsplash.com/photo-1554415707-9e4966a604f7?auto=format&fit=crop&w=400&q=80',
        fileType: 'application/pdf',
        fileSize: '390 KB',
        uploadDate: '2023-11-12',
        ocrExtractedText: 'DYSON OFFICIAL GUARANTEE\nPRODUCT: Dyson V15 Detect\nSN: DY-V15-894726-X\nPRICE: ₹62,990.00\nEXPIRY: 2025-11-10',
        ocrConfidence: 94
      }
    ],
    maintenanceRecords: [
      {
        id: 'maint_dyson_1',
        assetId: 'asset_dyson_v15',
        title: 'Washable HEPA Filter Cold-Water Rinse & 24h Dry',
        date: '2026-09-15',
        cost: 0,
        provider: 'User Maintenance',
        notes: 'Monthly filter cleaning completed. Airflow suction restored to factory 230AW.',
        isCompleted: true,
        type: 'Cleaning / Servicing'
      }
    ],
    usageLogs: [
      { id: 'use_dyson_1', assetId: 'asset_dyson_v15', date: '2026-10-27', durationMinutes: 35, usageType: 'Daily Work', notes: 'Living room and kitchen floor vacuum' },
      { id: 'use_dyson_2', assetId: 'asset_dyson_v15', date: '2026-10-24', durationMinutes: 30, usageType: 'Daily Work', notes: 'Hallway & bedrooms deep clean' },
      { id: 'use_dyson_3', assetId: 'asset_dyson_v15', date: '2026-10-20', durationMinutes: 45, usageType: 'Daily Work', notes: 'Full apartment dust & HEPA cycle' },
      { id: 'use_dyson_4', assetId: 'asset_dyson_v15', date: '2026-10-14', durationMinutes: 30, usageType: 'Daily Work', notes: 'Upholstery pet tool cleaning' },
      { id: 'use_dyson_5', assetId: 'asset_dyson_v15', date: '2026-10-07', durationMinutes: 40, usageType: 'Daily Work', notes: 'Deep carpet vacuuming' },
      { id: 'use_dyson_6', assetId: 'asset_dyson_v15', date: '2026-09-29', durationMinutes: 35, usageType: 'Daily Work', notes: 'Living area weekly cleaning' },
      { id: 'use_dyson_base', assetId: 'asset_dyson_v15', date: '2026-09-15', durationMinutes: 2500, usageType: 'Daily Work', notes: 'Accumulated maintenance run time' }
    ]
  },
  {
    id: 'asset_samsonite_luggage',
    name: 'Samsonite Freeform 28" Hardside Spinner',
    brand: 'Samsonite',
    model: 'Freeform Expandable 28" (Navy Blue)',
    serialNumber: 'SAM-FF-098214',
    category: 'Travel & Luggage',
    purchaseDate: '2023-06-04',
    purchasePrice: 18400.00,
    currency: 'INR',
    currentEstimatedValue: 13500.00,
    condition: 'Good',
    location: 'Master Bedroom Closet - Upper Shelf',
    accessories: [
      'Integrated TSA 3-Dial Recessed Combination Lock',
      'Genuine Leather Identification Tag',
      'Water-Resistant Neoprene Luggage Shield',
      'Set of 4 Compression Packing Cubes'
    ],
    tags: ['travel', 'luggage', 'flight', 'samsonite'],
    notes: 'Durable polypropylene shell. 10-Year Global Warranty.',
    imageUrl: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=800&q=80',
    warrantyProvider: 'Samsonite 10-Year Global Warranty',
    warrantyDurationMonths: 120,
    warrantyExpiryDate: '2033-06-04',
    warrantyTerms: 'Covers defects in materials and workmanship worldwide.',
    estimatedUsageFrequency: 'Occasional',
    lastUsedDate: '2026-08-14',
    createdAt: '2023-06-05T12:00:00Z',
    updatedAt: '2026-08-15T09:00:00Z',
    documents: [],
    maintenanceRecords: [
      {
        id: 'maint_sam_1',
        assetId: 'asset_samsonite_luggage',
        title: '360° Spinner Wheel Bearing Lubrication',
        date: '2026-08-10',
        cost: 0,
        provider: 'Self-Serviced',
        notes: 'Applied silicone lubricant to all 4 dual spinner wheels for effortless gliding.',
        isCompleted: true,
        type: 'Cleaning / Servicing'
      }
    ],
    usageLogs: [
      { id: 'use_sam_1', assetId: 'asset_samsonite_luggage', date: '2026-09-15', durationMinutes: 480, usageType: 'Travel', notes: 'Annual East Coast Conference flight SFO to JFK' },
      { id: 'use_sam_2', assetId: 'asset_samsonite_luggage', date: '2026-08-14', durationMinutes: 360, usageType: 'Travel', notes: 'Summer family trip return flight' },
      { id: 'use_sam_3', assetId: 'asset_samsonite_luggage', date: '2026-06-20', durationMinutes: 480, usageType: 'Travel', notes: 'Tech Summit cross-country travel' },
      { id: 'use_sam_4', assetId: 'asset_samsonite_luggage', date: '2026-05-10', durationMinutes: 360, usageType: 'Travel', notes: 'Client on-site deployment travel' },
      { id: 'use_sam_base', assetId: 'asset_samsonite_luggage', date: '2026-04-01', durationMinutes: 1800, usageType: 'Travel', notes: 'Baseline checked baggage transit transit hours' }
    ]
  },
  {
    id: 'asset_iphone_15_pro',
    name: 'iPhone 15 Pro Titanium',
    brand: 'Apple',
    model: 'A2848 (Natural Titanium, 256GB)',
    serialNumber: 'K98QW279812M',
    category: 'Smartphones & Mobile',
    purchaseDate: '2023-10-01',
    purchasePrice: 134900.00,
    currency: 'INR',
    currentEstimatedValue: 112000.00,
    condition: 'Mint / Like New',
    location: 'Everyday Carry - Pocket',
    accessories: [
      'Apple FineWoven MagSafe Case',
      'MagSafe Wallet with Find My',
      'Belkin 3-in-1 Wireless Charging Stand',
      '2-Meter Braided USB-C Cable'
    ],
    tags: ['mobile', 'essential', 'daily-carry', 'camera'],
    notes: 'Primary personal and family communication device.',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    warrantyProvider: 'AppleCare+ with Theft and Loss',
    warrantyDurationMonths: 24,
    warrantyExpiryDate: '2025-10-01',
    warrantyTerms: 'Comprehensive hardware and accidental damage support.',
    insuranceProvider: 'AppleCare+ Extended Protection Plan',
    insurancePolicyNumber: 'APP-CARE-94812',
    insuranceExpiryDate: '2025-10-01',
    insuranceCoverageAmount: 140000,
    estimatedUsageFrequency: 'Daily',
    lastUsedDate: '2026-10-26',
    createdAt: '2023-10-02T11:00:00Z',
    updatedAt: '2026-10-26T21:00:00Z',
    documents: [],
    maintenanceRecords: [],
    usageLogs: [
      { id: 'use_iphone_1', assetId: 'asset_iphone_15_pro', date: '2026-10-28', durationMinutes: 340, usageType: 'Daily Work', notes: 'Daily communications, mobile banking, camera' },
      { id: 'use_iphone_2', assetId: 'asset_iphone_15_pro', date: '2026-10-27', durationMinutes: 360, usageType: 'Daily Work', notes: 'Slack, emails, GPS navigation, OwnIQ Care' },
      { id: 'use_iphone_3', assetId: 'asset_iphone_15_pro', date: '2026-10-26', durationMinutes: 320, usageType: 'Daily Work', notes: 'Calls, navigation, camera scanning' },
      { id: 'use_iphone_4', assetId: 'asset_iphone_15_pro', date: '2026-10-25', durationMinutes: 390, usageType: 'Daily Work', notes: 'Video calls, transit ticket scans' },
      { id: 'use_iphone_5', assetId: 'asset_iphone_15_pro', date: '2026-10-24', durationMinutes: 300, usageType: 'Daily Work', notes: 'Daily messaging & health logging' },
      { id: 'use_iphone_6', assetId: 'asset_iphone_15_pro', date: '2026-10-23', durationMinutes: 350, usageType: 'Daily Work', notes: 'Productivity and calendar management' },
      { id: 'use_iphone_7', assetId: 'asset_iphone_15_pro', date: '2026-10-21', durationMinutes: 330, usageType: 'Daily Work', notes: 'Everyday carry usage' },
      { id: 'use_iphone_8', assetId: 'asset_iphone_15_pro', date: '2026-10-19', durationMinutes: 370, usageType: 'Daily Work', notes: 'Navigation & family check-ins' },
      { id: 'use_iphone_9', assetId: 'asset_iphone_15_pro', date: '2026-10-15', durationMinutes: 340, usageType: 'Daily Work', notes: 'Care coordination & daily tasks' },
      { id: 'use_iphone_10', assetId: 'asset_iphone_15_pro', date: '2026-10-10', durationMinutes: 360, usageType: 'Daily Work', notes: 'Digital authentication & communication' },
      { id: 'use_iphone_base', assetId: 'asset_iphone_15_pro', date: '2026-09-15', durationMinutes: 28000, usageType: 'Daily Work', notes: 'Accumulated everyday carry operational hours' }
    ]
  }
];

export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'evt_client_strategy',
    title: 'Client Strategy & Architecture Review',
    type: 'meeting',
    startTime: '2026-10-27T10:00:00Z',
    endTime: '2026-10-27T11:30:00Z',
    location: 'Downtown Tech Hub, Conference Room 4B',
    description: 'Executive presentation on Q4 platform scaling and roadmap.',
    source: 'google-calendar',
    suggestedAssetIds: ['asset_mbp_16', 'asset_iphone_15_pro'],
    additionalItems: ['Building Access Badge', 'Anker HDMI Adapter', 'Moleskine Notebook & Pen'],
    checklist: [
      { id: 'chk_1', name: 'MacBook Pro 16" M3 Max', isPacked: true, assetId: 'asset_mbp_16', isEssential: true, reason: 'Required for presenting deck' },
      { id: 'chk_2', name: '140W USB-C Power Adapter & Cable', isPacked: true, assetId: 'asset_mbp_16', isEssential: true, reason: 'High brightness presentation drain' },
      { id: 'chk_3', name: 'Apple Magic Mouse 2', isPacked: false, assetId: 'asset_mbp_16', isEssential: false, reason: 'Ergonomic slide navigation' },
      { id: 'chk_4', name: 'Building Access Badge', isPacked: true, isEssential: true, reason: 'Security checkpoint entry' },
      { id: 'chk_5', name: 'Compact Umbrella', isPacked: false, isEssential: false, reason: 'Weather Advisor: Vellore monsoon rain forecast' }
    ]
  },
  {
    id: 'evt_gym_session',
    title: 'Functional Cardio & Strength Training',
    type: 'gym',
    startTime: '2026-10-27T17:30:00Z',
    endTime: '2026-10-27T18:45:00Z',
    location: 'Equinox Sports Club, Market St',
    description: 'Interval training and mobility routine.',
    source: 'in-app',
    suggestedAssetIds: ['asset_sony_xm5', 'asset_iphone_15_pro'],
    additionalItems: ['Gym Locker Key / Padlock', 'Microfiber Towel', 'Electrolyte Hydration Flask'],
    checklist: [
      { id: 'chk_g1', name: 'Sony WH-1000XM5 ANC Headphones', isPacked: false, assetId: 'asset_sony_xm5', isEssential: true, reason: 'Workout focus audio' },
      { id: 'chk_g2', name: 'Electrolyte Hydration Flask', isPacked: false, isEssential: true, reason: 'Essential hydration' },
      { id: 'chk_g3', name: 'Gym Locker Key / Padlock', isPacked: true, isEssential: true, reason: 'Secure personal locker' },
      { id: 'chk_g4', name: 'Microfiber Towel', isPacked: true, isEssential: false, reason: 'Gym hygiene requirement' }
    ]
  },
  {
    id: 'evt_grandma_visit',
    title: 'Grandma Eleanor Routine Check-in & Tea',
    type: 'doctor',
    startTime: '2026-10-28T14:30:00Z',
    endTime: '2026-10-28T16:00:00Z',
    location: 'Eleanor\'s Residence (Maple Grove Senior Living)',
    description: 'Verify weekly medication reminders, caregiver log, and spend peaceful tea time.',
    source: 'in-app',
    suggestedAssetIds: ['asset_honda_civic', 'asset_iphone_15_pro'],
    additionalItems: ['Blueberry Muffins from Clara', 'Updated Caregiver Log Sheet'],
    checklist: [
      { id: 'chk_cv1', name: 'Honda Civic Fob & Driving Essentials', isPacked: true, assetId: 'asset_honda_civic', isEssential: true, reason: 'Transportation to Maple Grove' },
      { id: 'chk_cv2', name: 'Caregiver Log & Tablet', isPacked: false, isEssential: true, reason: 'Review Eleanor\'s OwnIQ Care schedule' },
      { id: 'chk_cv3', name: 'Blueberry Muffins', isPacked: false, isEssential: false, reason: 'Family treat for tea time' }
    ]
  }
];

export const INITIAL_DEPARTURE_ROUTINES: DepartureRoutine[] = [
  {
    id: 'rtn_work',
    name: 'Work & Office Commute',
    icon: 'Briefcase',
    type: 'work',
    items: [
      { id: 'ri_1', name: 'MacBook Pro 16"', assetId: 'asset_mbp_16', isPacked: true, isEssential: true },
      { id: 'ri_2', name: '140W USB-C Charger & Cable', assetId: 'asset_mbp_16', isPacked: true, isEssential: true },
      { id: 'ri_3', name: 'iPhone 15 Pro & MagSafe Wallet', assetId: 'asset_iphone_15_pro', isPacked: true, isEssential: true },
      { id: 'ri_4', name: 'Sony WH-1000XM5 Headphones', assetId: 'asset_sony_xm5', isPacked: false, isEssential: false },
      { id: 'ri_5', name: 'Honda Civic Smart Key Fob', assetId: 'asset_honda_civic', isPacked: true, isEssential: true },
      { id: 'ri_6', name: 'Office ID & Badge Card', isPacked: true, isEssential: true },
      { id: 'ri_7', name: 'Insulated Water Bottle', isPacked: false, isEssential: false }
    ]
  },
  {
    id: 'rtn_college',
    name: 'College / University Classes',
    icon: 'GraduationCap',
    type: 'college',
    items: [
      { id: 'ri_c1', name: 'Laptop / Tablet & Charger', assetId: 'asset_mbp_16', isPacked: true, isEssential: true },
      { id: 'ri_c2', name: 'Student Identification Card', isPacked: true, isEssential: true },
      { id: 'ri_c3', name: 'Course Notebook & Pen Set', isPacked: true, isEssential: true },
      { id: 'ri_c4', name: 'Headphones for Library', assetId: 'asset_sony_xm5', isPacked: true, isEssential: false },
      { id: 'ri_c5', name: 'Water Bottle & Snack', isPacked: false, isEssential: false }
    ]
  },
  {
    id: 'rtn_gym',
    name: 'Gym & Sports Session',
    icon: 'Dumbbell',
    type: 'gym',
    items: [
      { id: 'ri_g1', name: 'Sony WH-1000XM5 ANC Headphones', assetId: 'asset_sony_xm5', isPacked: true, isEssential: true },
      { id: 'ri_g2', name: 'Gym Member Keycard / Digital Pass', isPacked: true, isEssential: true },
      { id: 'ri_g3', name: 'Locker Padlock', isPacked: true, isEssential: true },
      { id: 'ri_g4', name: 'Water Bottle', isPacked: false, isEssential: true },
      { id: 'ri_g5', name: 'Clean Workout Towel', isPacked: true, isEssential: false }
    ]
  },
  {
    id: 'rtn_travel',
    name: 'Airport & Long Distance Journey',
    icon: 'Plane',
    type: 'travel',
    items: [
      { id: 'ri_t1', name: 'Passport & Government Photo ID', isPacked: true, isEssential: true },
      { id: 'ri_t2', name: 'Samsonite Freeform Hardside Suitcase', assetId: 'asset_samsonite_luggage', isPacked: true, isEssential: true },
      { id: 'ri_t3', name: 'MacBook Pro & 140W Charger', assetId: 'asset_mbp_16', isPacked: true, isEssential: true },
      { id: 'ri_t4', name: 'Sony WH-1000XM5 (In-flight ANC)', assetId: 'asset_sony_xm5', isPacked: true, isEssential: true },
      { id: 'ri_t5', name: 'Universal International Travel Adapter', isPacked: false, isEssential: true },
      { id: 'ri_t6', name: 'Personal Medication Pouch', isPacked: true, isEssential: true }
    ]
  }
];

export const INITIAL_TRAVEL_TRIP: TravelTrip = {
  id: 'trip_sf_to_nyc',
  destination: 'New York City, NY',
  startDate: '2026-11-14',
  endDate: '2026-11-18',
  purpose: 'conference',
  expectedWeather: 'Crisp autumn weather, 11°C (52°F), potential evening drizzle.',
  notes: 'Keynote presentation on Saturday morning. Hotel check-in near Midtown.',
  items: [
    { id: 'ti_1', category: 'Electronics & Work', name: 'MacBook Pro 16" & 140W Charger', assetId: 'asset_mbp_16', isPacked: true },
    { id: 'ti_2', category: 'Electronics & Work', name: 'Sony WH-1000XM5 ANC Headphones & Airplane Plug', assetId: 'asset_sony_xm5', isPacked: true },
    { id: 'ti_3', category: 'Electronics & Work', name: '20,000mAh Anker Flight-Safe Power Bank', isPacked: false },
    { id: 'ti_4', category: 'Clothing & Weather', name: 'Medium Trench Coat / Layered Jacket', isPacked: false },
    { id: 'ti_5', category: 'Clothing & Weather', name: 'Compact Windproof Umbrella', isPacked: true },
    { id: 'ti_6', category: 'Documents & Essentials', name: 'Samsonite Hardside Spinner with TSA Lock', assetId: 'asset_samsonite_luggage', isPacked: true },
    { id: 'ti_7', category: 'Documents & Essentials', name: 'Boarding Pass & Government ID', isPacked: true },
    { id: 'ti_8', category: 'Health & Care', name: 'Travel First Aid & Hydration Tablets', isPacked: false }
  ]
};

// OwnIQ Care: Dedicated Elderly & Dementia Memory Support
export const INITIAL_CARE_RECIPIENT: CareRecipientProfile = {
  id: 'care_eleanor',
  name: 'Eleanor Vance',
  preferredName: 'Eleanor',
  birthYear: 1944,
  photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  residence: 'Sunny Meadow Cottage, Apt 14 (Near Garden Walk)',
  emergencyContact: {
    name: 'David Vance (Son)',
    relationship: 'Primary Caregiver & Power of Attorney',
    phone: '+1 (555) 392-8109'
  },
  caregiverContact: {
    name: 'Sarah Vance-Miller (Daughter)',
    relationship: 'Secondary Caregiver & Nurse Liaison',
    phone: '+1 (555) 741-2098',
    email: 'sarah.vance@familycare.org'
  },
  todayOrientation: {
    greeting: 'Good morning, Eleanor!',
    weatherSummary: 'The sun is shining gently over Vellore today. It is 29°C outside with a warm pleasant breeze, perfect for looking at the garden flowers.',
    peacefulMessage: 'David and Sarah are both looking out for you today. You are safe, loved, and in your home.'
  }
};

export const INITIAL_MEDICATION_REMINDERS: MedicationReminder[] = [
  {
    id: 'med_lisinopril',
    name: 'Lisinopril (Blood Pressure Support)',
    timingDescription: 'Morning with Breakfast (8:30 AM)',
    scheduledTime: '08:30',
    instructions: 'Take 1 round pink tablet with a full glass of fresh water after breakfast. Do not crush.',
    pillVisual: {
      shape: 'round',
      color: '#f43f5e', // Pink
      label: 'L-10'
    },
    caregiverNotes: 'Verified by Dr. Patel. Helps maintain Eleanor\'s steady morning blood pressure. Remind gently.',
    statusToday: 'taken',
    takenAt: '2026-10-26T08:35:00Z',
    notifyCaregiverIfMissed: true,
    history: [
      { date: '2026-10-26', status: 'taken', timestamp: '08:35 AM', loggedBy: 'recipient' },
      { date: '2026-10-25', status: 'taken', timestamp: '08:31 AM', loggedBy: 'recipient' },
      { date: '2026-10-24', status: 'taken', timestamp: '08:40 AM', loggedBy: 'caregiver' }
    ]
  },
  {
    id: 'med_vit_d3',
    name: 'Calcium & Vitamin D3 Softgel',
    timingDescription: 'Lunchtime (1:00 PM)',
    scheduledTime: '13:00',
    instructions: 'Take 1 golden oval softgel with your lunch meal.',
    pillVisual: {
      shape: 'oval',
      color: '#eab308', // Gold
      label: 'D3'
    },
    caregiverNotes: 'Supports bone strength. Best absorbed when taken with food.',
    statusToday: 'taken',
    takenAt: '2026-10-26T13:10:00Z',
    notifyCaregiverIfMissed: false,
    history: [
      { date: '2026-10-26', status: 'taken', timestamp: '01:10 PM', loggedBy: 'recipient' },
      { date: '2026-10-25', status: 'taken', timestamp: '01:05 PM', loggedBy: 'recipient' },
      { date: '2026-10-24', status: 'taken', timestamp: '01:15 PM', loggedBy: 'recipient' }
    ]
  },
  {
    id: 'med_eye_drops',
    name: 'Hydrating Eye Comfort Drops',
    timingDescription: 'Evening Bedtime (8:30 PM)',
    scheduledTime: '20:30',
    instructions: 'Place 1 gentle drop into each eye before bedtime.',
    pillVisual: {
      shape: 'dropper',
      color: '#0ea5e9', // Sky blue
      label: 'DROP'
    },
    caregiverNotes: 'Keeps eyes comfortable and reduces dry nighttime irritation.',
    statusToday: 'pending',
    notifyCaregiverIfMissed: true,
    history: [
      { date: '2026-10-25', status: 'taken', timestamp: '08:35 PM', loggedBy: 'recipient' },
      { date: '2026-10-24', status: 'taken', timestamp: '08:28 PM', loggedBy: 'recipient' }
    ]
  }
];

export const INITIAL_CAREGIVER_INSTRUCTIONS: CaregiverInstruction[] = [
  {
    id: 'instr_1',
    title: 'Grandchildren Clara & Leo Visiting Today!',
    category: 'Family Message',
    message: 'David is bringing Clara and Leo by at 3:30 PM. Clara made homemade blueberry muffins to enjoy with your favorite chamomile tea.',
    scheduledTime: '15:30',
    caregiverName: 'Sarah Vance-Miller',
    caregiverRole: 'Daughter',
    isAcknowledged: true,
    acknowledgedAt: '2026-10-26T11:00:00Z',
    priority: 'loving-note',
    dateCreated: '2026-10-26T07:30:00Z'
  },
  {
    id: 'instr_2',
    title: 'Wear Your Warm Lavender Cardigan for the Porch',
    category: 'Gentle Note',
    message: 'The afternoon breeze is a little chilly today. Please put on your cozy lavender cardigan hanging right on the wooden coat tree by the door before sitting on the garden porch.',
    scheduledTime: '14:00',
    caregiverName: 'David Vance',
    caregiverRole: 'Son & Primary Caregiver',
    isAcknowledged: false,
    priority: 'normal',
    dateCreated: '2026-10-26T08:00:00Z'
  },
  {
    id: 'instr_3',
    title: 'Dr. Patel Routine Wellness Chat on Thursday',
    category: 'Appointment',
    message: 'Friendly reminder that Dr. Patel has our routine 6-month wellness check-in on Thursday at 2:00 PM. David will pick you up at 1:15 PM. Everything is going wonderfully!',
    scheduledTime: '14:00',
    caregiverName: 'David Vance',
    caregiverRole: 'Son & Primary Caregiver',
    isAcknowledged: true,
    acknowledgedAt: '2026-10-25T16:00:00Z',
    priority: 'important',
    dateCreated: '2026-10-25T10:00:00Z'
  }
];

export const INITIAL_CARE_ACTIVITIES: CareDailyActivity[] = [
  {
    id: 'act_wake',
    time: '08:00 AM',
    title: 'Gentle Morning Awakening & Tea',
    description: 'Open the sheer curtains, sip warm lemon water, and enjoy breakfast in the sunroom.',
    category: 'wake',
    isCompleted: true,
    completedAt: '08:15 AM',
    audioPromptText: 'Good morning Eleanor! Take your time and enjoy your warm tea and breakfast.'
  },
  {
    id: 'act_med_morning',
    time: '08:30 AM',
    title: 'Morning Medication Reminder',
    description: 'Take 1 pink Lisinopril tablet with a tall glass of water.',
    category: 'medication',
    isCompleted: true,
    completedAt: '08:35 AM',
    relatedMedicationId: 'med_lisinopril',
    audioPromptText: 'Eleanor, it is time for your morning medication with water.'
  },
  {
    id: 'act_garden_walk',
    time: '10:30 AM',
    title: 'Peaceful Garden Stroll & Bird Watching',
    description: 'Enjoy 20 minutes walking along the paved rose garden path. Check on the bluebird feeder.',
    category: 'exercise',
    isCompleted: true,
    completedAt: '10:55 AM',
    audioPromptText: 'It is a lovely morning for your garden stroll to see the bluebirds.'
  },
  {
    id: 'act_lunch',
    time: '01:00 PM',
    title: 'Wholesome Lunch & Vitamin D3',
    description: 'Warm chicken vegetable soup, crusty whole grain bread, and your golden Vitamin D3 capsule.',
    category: 'meal',
    isCompleted: true,
    completedAt: '01:10 PM',
    relatedMedicationId: 'med_vit_d3',
    audioPromptText: 'Eleanor, your lunch is ready. Remember your golden Vitamin D3 softgel.'
  },
  {
    id: 'act_family_tea',
    time: '03:30 PM',
    title: 'Family Visit: Clara & Leo with Blueberry Muffins',
    description: 'David and the kids will be here for tea and stories on the garden patio!',
    category: 'social',
    isCompleted: false,
    audioPromptText: 'Clara and Leo will be arriving soon for tea and blueberry muffins!'
  },
  {
    id: 'act_dinner',
    time: '06:30 PM',
    title: 'Light Dinner & Hydration',
    description: 'Baked salmon, steamed green beans, and refreshing herbal mint tea.',
    category: 'meal',
    isCompleted: false,
    audioPromptText: 'Time for a light, delicious dinner and relaxing herbal tea.'
  },
  {
    id: 'act_night_med',
    time: '08:30 PM',
    title: 'Evening Eye Drops & Restful Bedtime',
    description: 'Apply hydrating drops into each eye, listen to quiet classical music, and restful sleep.',
    category: 'night',
    isCompleted: false,
    relatedMedicationId: 'med_eye_drops',
    audioPromptText: 'Time to put in your soothing eye drops and settle in for a restful, peaceful night.'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    title: 'Upcoming Client Strategy Meeting in 45m',
    message: 'Before You Leave checklist: MacBook Pro and 140W charger ready. 30% chance of rain in the afternoon.',
    timestamp: '15 mins ago',
    type: 'advisor-departure',
    isRead: false,
    targetModule: 'advisor',
    priority: 'high'
  },
  {
    id: 'notif_2',
    title: 'GEICO Auto Insurance Renewal in 49 Days',
    message: 'Your 2022 Honda Civic policy GEICO-AUTO-948102 renews on Dec 15, 2026. Review coverage options.',
    timestamp: '2 hours ago',
    type: 'asset-maintenance',
    isRead: false,
    targetModule: 'health',
    priority: 'medium'
  },
  {
    id: 'notif_3',
    title: 'OwnIQ Care: Eleanor Completed Morning Medication',
    message: 'Eleanor logged her morning Lisinopril reminder at 8:35 AM. All routine activities up-to-date.',
    timestamp: '5 hours ago',
    type: 'care-medication',
    isRead: true,
    targetModule: 'care',
    priority: 'low'
  },
  {
    id: 'notif_4',
    title: 'Weather Advisory: Breezy Afternoon Ahead',
    message: 'Temperature 19°C with winds reaching 11 km/h. Consider a light jacket when stepping out.',
    timestamp: '1 hour ago',
    type: 'weather',
    isRead: false,
    targetModule: 'advisor',
    priority: 'low'
  }
];
