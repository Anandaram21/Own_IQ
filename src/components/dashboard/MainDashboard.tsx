import React from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../services/currencyService';
import { 
  ShieldCheck, 
  Compass, 
  Activity, 
  BarChart3, 
  Heart, 
  Bell, 
  Calendar, 
  Sun, 
  CloudRain, 
  CheckCircle2, 
  Plus, 
  QrCode, 
  Sparkles, 
  ChevronRight, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Pill,
  MessageSquare
} from 'lucide-react';

export const MainDashboard: React.FC = () => {
  const { 
    setCurrentModule, 
    assets, 
    calendarEvents, 
    departureRoutines, 
    toggleRoutineItem, 
    weather, 
    medications, 
    caregiverInstructions, 
    careActivities, 
    careRecipient, 
    notifications, 
    markNotificationRead,
    setSelectedAsset,
    setIsAddAssetModalOpen,
    setIsQrScannerModalOpen,
    userProfile 
  } = useApp();

  const totalPortfolioValue = assets.reduce((sum, a) => sum + (a.currentEstimatedValue || a.purchasePrice || 0), 0);
  const activeRoutine = departureRoutines[0];
  const upcomingEvent = calendarEvents[0];
  const nextMed = medications.find(m => m.statusToday !== 'taken') || medications[0];
  const unacknowledgedNote = caregiverInstructions.find(i => !i.isAcknowledged) || caregiverInstructions[0];

  const now = new Date();
  const expiringWarranties = assets.filter(a => {
    if (!a.warrantyExpiryDate) return false;
    const diff = (new Date(a.warrantyExpiryDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 60;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HERO BANNER: PLATFORM INTELLIGENCE */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-brand-300">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Unified Intelligence Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Know Everything You Own. <span className="text-rose-400">Care for Everyone You Love.</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Physical asset intelligence combined with reassuring care routines. What to carry, what to maintain, and what matters today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsQrScannerModalOpen(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl border border-white/20 flex items-center gap-2 backdrop-blur-sm transition-all"
            >
              <QrCode className="w-4 h-4 text-brand-300" />
              <span>Scan QR Tag</span>
            </button>
            <button
              onClick={() => setIsAddAssetModalOpen(true)}
              className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-brand-500/30 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Physical Asset</span>
            </button>
          </div>
        </div>

        {/* Quick stats snapshot */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div>
            <div className="text-xs text-slate-400">Total Registered Possessions</div>
            <div className="text-2xl font-extrabold text-white mt-0.5">{assets.length} items</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Total Portfolio Valuation</div>
            <div className="text-2xl font-extrabold text-brand-400 mt-0.5">
              {formatCurrency(totalPortfolioValue, 'INR', userProfile.currency || 'INR')}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Today's Weather Readiness</div>
            <div className="text-2xl font-extrabold text-sky-300 mt-0.5">{weather?.temperature}°C • {weather?.conditionText}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Caregiver Adherence</div>
            <div className="text-2xl font-extrabold text-rose-300 mt-0.5">
              {medications.filter(m => m.statusToday === 'taken').length}/{medications.length} Meds
            </div>
          </div>
        </div>
      </div>

      {/* 2 & 3. TWO-COLUMN INTERACTIVE ROW: BEFORE YOU LEAVE & TODAY'S SCHEDULE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* BEFORE YOU LEAVE HOME (Personalized Departure Checklist) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-600 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">“Before You Leave Home” Checklist</h2>
                <p className="text-xs text-slate-400">Routine: {activeRoutine?.name} • Real Weather: {weather?.temperature}°C</p>
              </div>
            </div>

            <button
              onClick={() => setCurrentModule('advisor')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              All Routines <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Checklist Items */}
          <div className="space-y-2">
            {activeRoutine?.items.slice(0, 5).map(item => (
              <div
                key={item.id}
                onClick={() => toggleRoutineItem(activeRoutine.id, item.id)}
                className={`p-3 rounded-2xl border text-xs cursor-pointer flex items-center justify-between gap-3 transition-colors ${
                  item.isPacked 
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-slate-400' 
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-brand-500 text-slate-900 dark:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center ${
                    item.isPacked ? 'bg-emerald-600 text-white' : 'border border-slate-300 dark:border-slate-600'
                  }`}>
                    {item.isPacked && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                  <span className={`font-semibold ${item.isPacked ? 'line-through' : ''}`}>{item.name}</span>
                </div>
                {item.isEssential && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded">Essential</span>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <span>
              {activeRoutine?.items.filter(i => i.isPacked).length} of {activeRoutine?.items.length} packed
            </span>
            <span className="text-brand-600 font-semibold cursor-pointer" onClick={() => setCurrentModule('advisor')}>
              Open Full Advisor
            </span>
          </div>
        </div>

        {/* TODAY'S SCHEDULE & EVENT PREPARATION */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Upcoming Event Gear</h2>
                  <p className="text-xs text-slate-400">From Google Calendar</p>
                </div>
              </div>

              <button
                onClick={() => setCurrentModule('advisor')}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                Calendar View
              </button>
            </div>

            {upcomingEvent ? (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-600 uppercase">{upcomingEvent.type}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(upcomingEvent.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{upcomingEvent.title}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{upcomingEvent.location}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Recommended Assets From Wallet:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {upcomingEvent.checklist.slice(0, 3).map(c => (
                      <span key={c.id} className="text-[11px] px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 font-medium">
                        ✓ {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400">No events scheduled today.</div>
            )}
          </div>

          <button
            onClick={() => setCurrentModule('advisor')}
            className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl text-center transition-colors"
          >
            Review Gear Preparation
          </button>
        </div>
      </div>

      {/* 4, 5 & 6. THREE-COLUMN ROW: ASSET HEALTH, USAGE INTELLIGENCE & OWNIQ CARE */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ASSET HEALTH CARD */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">AI Asset Health</h3>
              </div>
              <button onClick={() => setCurrentModule('health')} className="text-xs font-semibold text-indigo-600">
                View All
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Warranties Expiring Soon</div>
                  <div className="text-[11px] text-slate-400">{expiringWarranties.length} items within 60 days</div>
                </div>
                <span className="font-bold text-amber-600 px-2 py-0.5 bg-amber-50 rounded-full">
                  {expiringWarranties.length} Due
                </span>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Scheduled Inspections</div>
                  <div className="text-[11px] text-slate-400">Honda Civic Tire Rotation</div>
                </div>
                <span className="font-bold text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-full">
                  Upcoming
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentModule('health')}
            className="w-full py-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 hover:bg-indigo-100 transition-colors"
          >
            <span>Open Asset Health</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* USAGE INTELLIGENCE CARD */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Usage Intelligence</h3>
              </div>
              <button onClick={() => setCurrentModule('usage')} className="text-xs font-semibold text-brand-600">
                Insights
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Highest Utilization</span>
                <span className="font-bold text-slate-900 dark:text-white">MacBook Pro 16" (Daily)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Underutilized Alert</span>
                <span className="font-bold text-amber-600">Samsonite Luggage</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                AI Recommendation: Samsonite Luggage maintains ₹13,500 residual value. Retained for Nov travel.
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentModule('usage')}
            className="w-full py-2 bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 hover:bg-brand-100 transition-colors"
          >
            <span>View Lifecycle Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* OWNIQ CARE SUMMARY CARD */}
        <div className="bg-gradient-to-br from-rose-50 to-white dark:from-slate-900 dark:to-slate-900 rounded-3xl border-2 border-rose-200 dark:border-rose-900/60 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-sm">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">OwnIQ Care</h3>
                  <p className="text-[10px] text-rose-600 font-semibold">Active: {careRecipient.preferredName}</p>
                </div>
              </div>
              <button onClick={() => setCurrentModule('care')} className="text-xs font-bold text-rose-600">
                Open Care
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {nextMed && (
                <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-rose-100 dark:border-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-rose-600 uppercase">Next Medication</span>
                    <span className="text-[10px] text-slate-400">{nextMed.timingDescription}</span>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white">{nextMed.name}</div>
                </div>
              )}

              {unacknowledgedNote && (
                <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-rose-100 dark:border-slate-700 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Caregiver Note</span>
                  <p className="text-slate-700 dark:text-slate-300 font-medium truncate">
                    “{unacknowledgedNote.title}”
                  </p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setCurrentModule('care')}
            className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 shadow-sm transition-colors"
          >
            <span>Launch OwnIQ Care Support</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* 7. ASSET WALLET RECENT POSSESSIONS ROW */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Recently Registered Assets</h2>
            <p className="text-xs text-slate-400">Access invoices, serial codes, and printable QR tags</p>
          </div>
          <button
            onClick={() => setCurrentModule('assets')}
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>View All ({assets.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {assets.slice(0, 4).map(asset => (
            <div
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-brand-500 transition-all cursor-pointer group space-y-3"
            >
              <div className="aspect-video rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700">
                {asset.imageUrl ? (
                  <img src={asset.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-slate-400 m-auto mt-6" />
                )}
              </div>
              <div>
                <div className="text-[10px] font-bold text-brand-600 uppercase">{asset.brand}</div>
                <div className="font-bold text-xs text-slate-900 dark:text-white truncate">{asset.name}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {formatCurrency(asset.currentEstimatedValue || asset.purchasePrice, asset.currency || 'INR', userProfile.currency || 'INR')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
