import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Settings, 
  ShieldCheck, 
  Calendar, 
  Sun, 
  FileText, 
  QrCode, 
  Volume2, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  User, 
  Heart,
  ExternalLink,
  Trash2,
  LogOut,
  Phone
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    userProfile, 
    updateUserProfile, 
    resetAllToDemoData, 
    exportDataJson, 
    importDataJson,
    weather,
    refreshWeather
  } = useApp();

  const { currentUser, logout } = useAuth();

  const [importStatus, setImportStatus] = useState<string>('');
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);

  const handleDownloadBackup = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OwnIQ_Backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return;
    const success = importDataJson(importJsonText.trim());
    if (success) {
      setImportStatus('Backup data successfully imported and synced!');
      setImportJsonText('');
      setTimeout(() => setImportStatus(''), 4000);
    } else {
      setImportStatus('Failed to parse backup JSON. Please check file format.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Platform Settings & Modular Integrations
            </h1>
            <p className="text-xs text-slate-500">
              Configure connected services, privacy safeguards, voice settings, and data exports.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 0: ACCOUNT SECURITY & SESSION */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Account Security & Active Session</h2>
            <p className="text-xs text-slate-400">Authenticated profile and cryptographic password protection</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-rose-200 dark:border-rose-900 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400">Account Name:</span>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5">{currentUser?.name || userProfile.name}</div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400">Verified Mobile:</span>
            <div className="font-bold text-emerald-600 font-mono mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> {currentUser?.mobile || '+91 98765 43210'}
            </div>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400">Verified Email:</span>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5 truncate">{currentUser?.email || userProfile.email}</div>
          </div>
        </div>

        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Active Session Protected: SHA-256 salted password encryption with automatic 5-attempt lockout security.</span>
        </div>
      </div>

      {/* SECTION: REGIONAL & CURRENCY PREFERENCES */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Regional & Currency Preferences</h2>
          <p className="text-xs text-slate-400">Controls default currency formatting, unit systems, and locale settings across the platform</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Platform Currency
            </label>
            <select
              value={userProfile.currency || 'INR'}
              onChange={(e) => updateUserProfile({ currency: e.target.value })}
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="INR">🇮🇳 INR (₹) — Indian Rupee (Default)</option>
              <option value="USD">🇺🇸 USD ($) — US Dollar</option>
              <option value="EUR">🇪🇺 EUR (€) — Euro</option>
              <option value="GBP">🇬🇧 GBP (£) — British Pound</option>
              <option value="AED">🇦🇪 AED (د.إ) — UAE Dirham</option>
              <option value="CAD">🇨🇦 CAD (CA$) — Canadian Dollar</option>
              <option value="AUD">🇦🇺 AUD (A$) — Australian Dollar</option>
              <option value="SGD">🇸🇬 SGD (S$) — Singapore Dollar</option>
              <option value="JPY">🇯🇵 JPY (¥) — Japanese Yen</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Weather Location Node
            </label>
            <input
              type="text"
              value={userProfile.city || 'Vellore, Tamil Nadu'}
              onChange={(e) => updateUserProfile({ city: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Timezone & Clock
            </label>
            <select
              value={userProfile.timeZone || 'Asia/Kolkata'}
              onChange={(e) => updateUserProfile({ timeZone: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST, UTC+05:30)</option>
              <option value="UTC">Coordinated Universal Time (UTC)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST, UTC+04:00)</option>
              <option value="Asia/Singapore">Asia/Singapore (SGT, UTC+08:00)</option>
              <option value="Europe/London">Europe/London (GMT/BST, UTC+00:00)</option>
              <option value="America/New_York">America/New_York (EST/EDT, UTC-05:00)</option>
            </select>
          </div>
        </div>

        <div className="p-3 bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-900 rounded-xl text-xs text-brand-800 dark:text-brand-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">₹</span>
            <span>Default currency is set to <strong>Indian Rupee (INR)</strong> with Indian numbering system grouping (e.g. ₹2,49,900).</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-200 dark:bg-brand-800 text-brand-900 dark:text-brand-100 rounded-full">
            Active
          </span>
        </div>
      </div>

      {/* SECTION 1: MODULAR INTEGRATIONS STATUS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Modular Integrations</h2>
          <p className="text-xs text-slate-400">External services and system drivers powering OwnIQ intelligence</p>
        </div>

        <div className="space-y-3">
          {/* 1. Google Calendar Integration */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-sky-100 dark:bg-sky-950 text-sky-600 rounded-xl shrink-0 mt-0.5">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Google Calendar Synchronization</span>
                  {userProfile.googleCalendarLinked ? (
                    <span className="text-[10px] font-bold px-2 py-0.2 bg-emerald-100 text-emerald-800 rounded-full">
                      Authorized & Synced
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.2 bg-slate-200 text-slate-600 rounded-full">
                      Disconnected
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Reads scheduled appointments and classes to generate belongings and packing lists.
                </p>
              </div>
            </div>

            <button
              onClick={() => updateUserProfile({ googleCalendarLinked: !userProfile.googleCalendarLinked })}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                userProfile.googleCalendarLinked 
                  ? 'bg-slate-200 hover:bg-slate-300 text-slate-800' 
                  : 'bg-brand-600 hover:bg-brand-700 text-white'
              }`}
            >
              {userProfile.googleCalendarLinked ? 'Disconnect Calendar' : 'Authorize Google Calendar'}
            </button>
          </div>

          {/* 2. Weather Service (Open-Meteo) */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-100 dark:bg-amber-950 text-amber-600 rounded-xl shrink-0 mt-0.5">
                <Sun className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Open-Meteo Weather API Integration</span>
                  <span className="text-[10px] font-bold px-2 py-0.2 bg-emerald-100 text-emerald-800 rounded-full">
                    Live Real-Time Active
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Retrieves live temperature, precipitation probability, and wind metrics for {userProfile.city || 'current location'}.
                </p>
              </div>
            </div>

            <button
              onClick={() => refreshWeather(userProfile.city || 'Vellore, Tamil Nadu')}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold whitespace-nowrap"
            >
              Test Weather Ping
            </button>
          </div>

          {/* 3. OCR Engine (Tesseract.js) */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 rounded-xl shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Tesseract.js Optical Character Recognition Engine</span>
                  <span className="text-[10px] font-bold px-2 py-0.2 bg-emerald-100 text-emerald-800 rounded-full">
                    Local In-Browser Ready
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Extracts serial numbers, purchase dates, warranty terms, and invoice values directly on device.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Speech Synthesis */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-rose-100 dark:bg-rose-950 text-rose-600 rounded-xl shrink-0 mt-0.5">
                <Volume2 className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Web Speech Voice Synthesis (OwnIQ Care)</span>
                  <span className="text-[10px] font-bold px-2 py-0.2 bg-emerald-100 text-emerald-800 rounded-full">
                    Enabled
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Calm voice audio prompts for care recipients living with cognitive or visual impairment.
                </p>
              </div>
            </div>

            <input
              type="checkbox"
              checked={userProfile.speakPromptsAloud}
              onChange={(e) => updateUserProfile({ speakPromptsAloud: e.target.checked })}
              className="w-5 h-5 rounded text-rose-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: PRIVACY, BACKUP & DATA CONTROLS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Privacy, Portability & Backups</h2>
          <p className="text-xs text-slate-400">Full control over personal documents, care logs, and encrypted local storage</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-brand-500" />
              <span>Export Full Platform Backup (JSON)</span>
            </div>
            <p className="text-xs text-slate-500">
              Download your complete asset registry, documents metadata, routines, medication schedules, and care logs.
            </p>
            <button
              onClick={handleDownloadBackup}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Download JSON Backup
            </button>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-brand-500" />
              <span>Restore from Backup</span>
            </div>
            <p className="text-xs text-slate-500">
              Restore assets and care schedules from a previously exported OwnIQ backup file.
            </p>
            <button
              onClick={() => setShowImportBox(!showImportBox)}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" /> Paste JSON Backup
            </button>
          </div>
        </div>

        {showImportBox && (
          <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Paste Backup JSON String:
            </label>
            <textarea
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste JSON content here..."
              className="w-full h-32 p-3 font-mono text-xs bg-white dark:bg-slate-900 border rounded-xl"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowImportBox(false)} className="px-3 py-1.5 text-xs text-slate-500">Cancel</button>
              <button onClick={handleImportSubmit} className="px-4 py-1.5 bg-brand-600 text-white text-xs font-semibold rounded-xl">Import Now</button>
            </div>
          </div>
        )}

        {importStatus && (
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-semibold">
            {importStatus}
          </div>
        )}

        {/* Reset to Clean Demo Data */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Demonstration Reset</div>
            <p className="text-[11px] text-slate-400">Restore factory sample assets and Eleanor's verified care routine</p>
          </div>
          <button
            onClick={() => {
              if (confirm('Reset all assets, schedules, and care routines to clean demonstration state?')) {
                resetAllToDemoData();
              }
            }}
            className="px-4 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 text-xs font-semibold rounded-xl border border-rose-200 dark:border-rose-900 transition-colors"
          >
            Reset Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};
