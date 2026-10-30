# OwnIQ & OwnIQ Care

**AI-Powered Personal Ownership Intelligence and Daily Care Platform**

> **OwnIQ Tagline:** *“Know Everything You Own.”*  
> **OwnIQ Care Tagline:** *“Remembering Life, Together.”*

---

## 1. Project Overview

OwnIQ is a modern, intelligent, secure, and accessible platform combining personal physical asset intelligence with **OwnIQ Care**—a specialized assistance and caregiver module for elderly individuals, people living with dementia or Alzheimer's disease, and their caregivers.

Built as a single cohesive application with unified navigation, deep module interoperability, accessible typography, and explainable AI recommendations.

---

## 2. Authentication & Registration Sequence

The application enforces a multi-step verification and registration sequence, ensuring security and privacy for sensitive ownership records and care routines:

```
Registration & Authentication Sequence
├── Step 1: Mobile Number Input
│   ├── Default Country Code: India (+91)
│   ├── International Country-Code Selector (with flags, formats, and search)
│   ├── Strict Mobile Validation (10 digits starting with 6, 7, 8, or 9 for India)
│   └── Email and password are NOT requested before phone verification
│
├── Step 2: OTP Verification
│   ├── Secure 6-digit random OTP (never a fixed code)
│   ├── 60-Second Resend Cooldown Timer
│   ├── 5-Minute OTP Expiry Countdown (real-time timer)
│   ├── Invalid-code messages & remaining attempts tracker (5 attempts max)
│   ├── Rate-limiting protection (max 4 OTP requests per 10-minute window)
│   ├── Option to correct the mobile number at any time
│   └── Explicitly Labeled Development Flow (transparent simulation banner; never claims real SMS was sent if unconfigured)
│
├── Step 3: Name & Email Address
│   ├── Requested only AFTER successful OTP verification
│   ├── Email format validation & duplicate account prevention
│   └── Pre-checks availability before proceeding
│
├── Step 4: Password Creation
│   ├── Create & Confirm Password with Show/Hide toggles
│   ├── Real-time visual requirement checklist:
│   │   ├── At least 8 characters
│   │   ├── At least one uppercase letter (A-Z)
│   │   ├── At least one lowercase letter (a-z)
│   │   ├── At least one number (0-9)
│   │   ├── At least one special character (!@#$...)
│   │   └── Passwords match
│   └── Passwords are salted and hashed using Web Crypto API SHA-256 (Never stored as plain text)
│
├── Step 5: Registration Completion
│   ├── Creation of user profile and initialization of preferences
│   ├── Auto-initializes currency (INR for +91, USD for international)
│   └── Direct entry into the OwnIQ & OwnIQ Care dashboard with celebratory confetti
│
└── Step 6: Returning-User Login Screen
    ├── Separate dedicated sign-in screen
    ├── Supports Login via Verified Mobile Number OR Email Address + Password
    ├── Account Lockout Protection (after 5 failed attempts, locks account for 15 minutes with live countdown)
    ├── Forgot Password & Secure Recovery Sequence (Mobile/Email verification -> OTP -> New Password)
    ├── Session Expiry Handling & "Keep me signed in" preference
    ├── Instant Logout via profile menu
    └── Existing users log in directly without repeating registration or OTP on ordinary logins
```

---

## 3. Core Modules Architecture

```
OwnIQ & OwnIQ Care Platform
├── Module 1: AI Asset Wallet
│   ├── Manual & Optical OCR Asset Registration
│   ├── Document Vault (Invoices, Receipts, Warranties, Insurance Policies, Manuals)
│   ├── Real Tesseract.js Optical Character Recognition with Editable User Confirmation
│   ├── High-Resolution QR Passport Generator & Label Printing
│   └── Camera & Simulated QR Scanner for Instant Asset Lookup
│
├── Module 2: AI Asset Advisor
│   ├── Calendar Integration (In-App Calendar + Authorized Google Calendar Sync)
│   ├── Live Weather-Based Recommendations (Real Open-Meteo Meteorological Feed)
│   ├── “Before You Leave Home” Contextual Departure Checklist
│   └── Multi-Category Travel Packing Assistant
│
├── Module 3: AI Asset Health
│   ├── Warranty Countdown & Expiration Tracking
│   ├── Insurance Renewal Monitoring
│   ├── Service & Repair History with Cost Auditing
│   └── Health Score Breakdown (Clear separation of scheduled maintenance vs predictive signals)
│
├── Module 4: AI Usage Intelligence
│   ├── Logged Usage Hours & Category Breakdown (Recharts)
│   ├── Asset Utilization Distribution & Underutilized Asset Alerts
│   └── Explainable AI Lifecycle Actions (Keep, Preventative Service, Repair, Resale, Donation)
│
├── Module 5: OwnIQ Care
│   ├── Dual Perspectives:
│   │   ├── Care Recipient View (High contrast, dementia-friendly, large text, audio prompts)
│   │   └── Caregiver Dashboard (Adherence audit logs, medication & instruction manager)
│   ├── Strict Non-Prescriptive Medication Reminders (Adherence support only)
│   ├── Loving Caregiver & Family Instructions
│   ├── Daily Routine Timeline with Celebration Feedback
│   └── Today's Orientation Board (Date, Season, Location, Peaceful Reassurance)
│
└── Main Dashboard & Navigation
    ├── 7-Widget Summary Hub
    ├── Global Notification Center
    ├── Universal Asset & Routine Search
    └── JSON Export / Import & Demo Data Reset
```

---

## 4. Technology Stack

- **Frontend Framework:** React 18 with TypeScript
- **Security & Cryptography:** Web Crypto API (`crypto.subtle` SHA-256 with unique 16-byte cryptographic salts, `crypto.getRandomValues` OTP generation)
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS with custom typography and accessible Care palette
- **Icons:** Lucide React
- **Data Visualizations:** Recharts
- **OCR Engine:** Tesseract.js Optical Character Recognition
- **QR Code Engine:** QRCode.js high-density vector matrix generator
- **Audio Prompts:** Web Speech Synthesis API
- **Live Weather:** Open-Meteo Weather API
- **State & Storage:** Persistent LocalStorage with full JSON export/import and demo reset

---

## 5. Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation & Run

```bash
# Navigate to project directory
cd c:\QwnIQ

# Install dependencies (already installed)
npm install

# Run Vite development server
npm run dev

# Build production bundle
npm run build

# Preview production build
npm run preview
```

The application is accessible at: `http://localhost:5173`.

---

## 6. Pre-Configured Accounts for Demonstration

| Account | Mobile | Email | Password |
| :--- | :--- | :--- | :--- |
| **Alex Chen** (Pre-seeded Demo) | `+91 98765 43210` | `alex.chen@owniq.com` | `Password@123` |
| **New Registration** | Any valid 10-digit number | Unique email address | User-created (8+ chars, upper, lower, number, special) |

*You can test the entire 5-step registration sequence from scratch by clicking **"Create an account"** on the sign-in screen.*
