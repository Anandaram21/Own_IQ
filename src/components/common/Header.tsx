import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { 
  AppModule, 
  CareViewMode,
  Asset,
  DepartureRoutine,
  MedicationReminder
} from '../../types';
import { 
  ShieldCheck, 
  Heart, 
  Search, 
  Bell, 
  Plus, 
  QrCode, 
  Sun, 
  CloudRain, 
  Sparkles, 
  Compass, 
  Activity, 
  BarChart3, 
  Settings, 
  CheckCircle2, 
  ExternalLink,
  ChevronDown,
  UserCheck,
  LogOut,
  Phone,
  X,
  Pill,
  CheckSquare,
  ArrowRight,
  Clock,
  Tag
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentModule, 
    setCurrentModule, 
    careViewMode, 
    setCareViewMode,
    searchQuery, 
    setSearchQuery,
    assets,
    departureRoutines,
    medications,
    setSelectedAsset,
    setIsAddAssetModalOpen,
    setIsQrScannerModalOpen,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    weather,
    careRecipient,
    userProfile
  } = useApp();

  const { currentUser, logout } = useAuth();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const matchingAssets = normalizedQuery
    ? assets.filter(a =>
        a.name.toLowerCase().includes(normalizedQuery) ||
        a.brand.toLowerCase().includes(normalizedQuery) ||
        a.model.toLowerCase().includes(normalizedQuery) ||
        a.serialNumber.toLowerCase().includes(normalizedQuery) ||
        a.category.toLowerCase().includes(normalizedQuery) ||
        a.location?.toLowerCase().includes(normalizedQuery) ||
        a.tags?.some(t => t.toLowerCase().includes(normalizedQuery))
      ).slice(0, 4)
    : [];

  const matchingRoutines = normalizedQuery
    ? departureRoutines.filter(r =>
        r.name.toLowerCase().includes(normalizedQuery) ||
        r.items.some(i => i.name.toLowerCase().includes(normalizedQuery))
      ).slice(0, 3)
    : [];

  const matchingReminders = normalizedQuery
    ? medications.filter(m =>
        m.name.toLowerCase().includes(normalizedQuery) ||
        m.timingDescription.toLowerCase().includes(normalizedQuery) ||
        m.instructions.toLowerCase().includes(normalizedQuery)
      ).slice(0, 3)
    : [];

  const totalResults = matchingAssets.length + matchingRoutines.length + matchingReminders.length;

  const navItems: { id: AppModule; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'assets', label: 'AI Asset Wallet', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'advisor', label: 'AI Advisor', icon: <Compass className="w-4 h-4" /> },
    { id: 'health', label: 'Asset Health', icon: <Activity className="w-4 h-4" /> },
    { id: 'usage', label: 'Usage Intelligence', icon: <BarChart3 className="w-4 h-4" /> },
    { 
      id: 'care', 
      label: 'OwnIQ Care', 
      icon: <Heart className="w-4 h-4 text-rose-500" />,
      badge: 'Care'
    },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 dark:bg-slate-900/95 dark:border-slate-800 transition-colors">
      {/* Top Banner: Taglines & Quick Status */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="font-semibold tracking-wide flex items-center gap-1.5 text-brand-300">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-400" /> OwnIQ:
          </span>
          <span className="text-slate-300 italic hidden sm:inline">“Know Everything You Own.”</span>
          <span className="text-slate-500">|</span>
          <span className="font-semibold tracking-wide flex items-center gap-1.5 text-rose-300">
            <Heart className="w-3.5 h-3.5 text-rose-400" /> OwnIQ Care:
          </span>
          <span className="text-slate-300 italic hidden md:inline">“Remembering Life, Together.”</span>
        </div>

        <div className="flex items-center space-x-4 text-slate-300">
          {weather && (
            <div className="flex items-center gap-1.5 bg-white/10 px-2 py-0.5 rounded-full text-xs">
              {weather.isRainExpected ? (
                <CloudRain className="w-3.5 h-3.5 text-sky-300" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-300" />
              )}
              <span>{weather.city}: {weather.temperature}°C, {weather.conditionText}</span>
            </div>
          )}

          {currentModule === 'care' && (
            <div className="flex items-center gap-1 text-xs bg-rose-500/20 text-rose-200 px-2.5 py-0.5 rounded-full border border-rose-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
              <span>Active Recipient: {careRecipient.preferredName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentModule('dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">Own<span className="text-brand-600 dark:text-brand-400">IQ</span></span>
                  <span className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 rounded">Care</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Personal Asset & Care Intelligence</p>
              </div>
            </button>
          </div>

          {/* Quick Search (Desktop) */}
          <div ref={searchContainerRef} className="flex-1 max-w-md mx-2 relative hidden lg:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search assets, routines, reminders, serials..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                className="w-full pl-10 pr-9 py-2 text-sm bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchFocused(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Instant Search Results Dropdown */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50 max-h-[80vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <span>Found {totalResults} match{totalResults === 1 ? '' : 'es'} for "{searchQuery}"</span>
                  <button 
                    onClick={() => setIsSearchFocused(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    Esc
                  </button>
                </div>

                {totalResults === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 space-y-1">
                    <p className="font-semibold text-slate-600 dark:text-slate-300">No results found</p>
                    <p>Try searching by asset name, brand, routine item, or reminder.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {/* Matching Assets */}
                    {matchingAssets.length > 0 && (
                      <div className="p-2">
                        <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Registered Assets</span>
                          <button
                            onClick={() => {
                              setCurrentModule('assets');
                              setIsSearchFocused(false);
                            }}
                            className="text-[10px] hover:underline"
                          >
                            View all in Wallet →
                          </button>
                        </div>
                        {matchingAssets.map(asset => (
                          <div
                            key={asset.id}
                            onClick={() => {
                              setSelectedAsset(asset);
                              setIsSearchFocused(false);
                            }}
                            className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-3 group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 font-bold text-xs">
                                {asset.brand?.[0] || 'A'}
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-brand-600 transition-colors">
                                  {asset.name}
                                </div>
                                <div className="text-[11px] text-slate-400 truncate">
                                  {asset.brand} • {asset.model} • S/N: {asset.serialNumber}
                                </div>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                                {asset.currency === 'INR' ? '₹' : '$'}{asset.purchasePrice.toLocaleString()}
                              </div>
                              <span className="text-[10px] text-slate-400">{asset.category}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Matching Routines */}
                    {matchingRoutines.length > 0 && (
                      <div className="p-2">
                        <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><Compass className="w-3.5 h-3.5" /> Departure Routines</span>
                          <button
                            onClick={() => {
                              setCurrentModule('advisor');
                              setIsSearchFocused(false);
                            }}
                            className="text-[10px] hover:underline"
                          >
                            Open Advisor →
                          </button>
                        </div>
                        {matchingRoutines.map(rtn => (
                          <div
                            key={rtn.id}
                            onClick={() => {
                              setCurrentModule('advisor');
                              setIsSearchFocused(false);
                            }}
                            className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-3 group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                                <CheckSquare className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-sky-600 transition-colors">
                                  {rtn.name}
                                </div>
                                <div className="text-[11px] text-slate-400 truncate">
                                  {rtn.items.length} checklist items ({rtn.items.filter(i => i.isPacked).length} packed)
                                </div>
                              </div>
                            </div>
                            <span className="text-[10px] bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-full font-semibold">
                              Routine
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Matching Reminders */}
                    {matchingReminders.length > 0 && (
                      <div className="p-2">
                        <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5" /> Care Reminders</span>
                          <button
                            onClick={() => {
                              setCurrentModule('care');
                              setIsSearchFocused(false);
                            }}
                            className="text-[10px] hover:underline"
                          >
                            Open Care →
                          </button>
                        </div>
                        {matchingReminders.map(med => (
                          <div
                            key={med.id}
                            onClick={() => {
                              setCurrentModule('care');
                              setIsSearchFocused(false);
                            }}
                            className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-3 group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div 
                                className="w-8 h-8 rounded-lg text-white flex items-center justify-center shrink-0 shadow-sm"
                                style={{ backgroundColor: med.pillVisual.color }}
                              >
                                <Pill className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-rose-600 transition-colors">
                                  {med.name}
                                </div>
                                <div className="text-[11px] text-slate-400 truncate">
                                  {med.timingDescription}
                                </div>
                              </div>
                            </div>
                            <span className="text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full font-semibold">
                              Reminder
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl lg:hidden transition-colors border border-slate-200 dark:border-slate-700"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            {/* Scan QR Code */}
            <button
              onClick={() => setIsQrScannerModalOpen(true)}
              className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
              title="Scan Asset QR Tag"
            >
              <QrCode className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              <span className="hidden sm:inline">Scan QR</span>
            </button>

            {/* Add Asset Quick Button */}
            <button
              onClick={() => setIsAddAssetModalOpen(true)}
              className="p-2 sm:px-3 sm:py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 rounded-xl flex items-center gap-1.5 transition-all shadow-sm shadow-brand-500/30"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Asset</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl relative transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50">
                  <div className="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">Notifications</span>
                      <span className="text-xs bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 px-2 py-0.5 rounded-full font-semibold">
                        {unreadCount} new
                      </span>
                    </div>
                    {notifications.length > 0 && (
                      <button 
                        onClick={clearAllNotifications}
                        className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications right now.
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.targetModule) setCurrentModule(n.targetModule);
                            setIsNotifOpen(false);
                          }}
                          className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${!n.isRead ? 'bg-brand-50/40 dark:bg-brand-950/20' : ''}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                              {!n.isRead && <span className="w-2 h-2 rounded-full bg-brand-600"></span>}
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar / Caregiver Mode Pill */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <img 
                  src={userProfile.avatarUrl} 
                  alt={userProfile.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/40" 
                />
                <div className="hidden xl:block text-left text-xs leading-tight">
                  <div className="font-semibold text-slate-800 dark:text-slate-100">{currentUser?.name || userProfile.name}</div>
                  <div className="text-[10px] text-slate-400">{currentUser?.mobile || 'Personal & Caregiver'}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <img src={userProfile.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500/30" />
                    <div className="overflow-hidden">
                      <div className="font-bold text-sm text-slate-900 dark:text-white truncate">{currentUser?.name || userProfile.name}</div>
                      <div className="text-xs text-slate-400 truncate">{currentUser?.email || userProfile.email}</div>
                      {currentUser?.mobile && (
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {currentUser.mobile}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="py-2 space-y-1">
                    <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                      OwnIQ Care Perspective
                    </div>
                    <button
                      onClick={() => {
                        setCareViewMode('recipient');
                        setCurrentModule('care');
                        setIsProfileOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${careViewMode === 'recipient' ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50'}`}
                    >
                      <span>Care Recipient View (Eleanor)</span>
                      {careViewMode === 'recipient' && <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />}
                    </button>
                    <button
                      onClick={() => {
                        setCareViewMode('caregiver');
                        setCurrentModule('care');
                        setIsProfileOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${careViewMode === 'caregiver' ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50'}`}
                    >
                      <span>Caregiver Dashboard</span>
                      {careViewMode === 'caregiver' && <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                    <button
                      onClick={() => {
                        setCurrentModule('settings');
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                    >
                      <Settings className="w-3.5 h-3.5" /> Manage Settings & Integrations
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar Drawer */}
        {isSearchOpen && (
          <div className="pb-3 lg:hidden relative" ref={searchContainerRef}>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search assets, routines, reminders..."
                value={searchQuery}
                autoFocus
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                className="w-full pl-10 pr-9 py-2 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Search Results */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 max-h-72 overflow-y-auto">
                <div className="text-[11px] text-slate-500 px-2 py-1">
                  {totalResults} result{totalResults === 1 ? '' : 's'}
                </div>
                {matchingAssets.map(asset => (
                  <div
                    key={asset.id}
                    onClick={() => {
                      setSelectedAsset(asset);
                      setIsSearchOpen(false);
                      setIsSearchFocused(false);
                    }}
                    className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs flex justify-between"
                  >
                    <span className="font-bold text-slate-800 dark:text-slate-200">{asset.name}</span>
                    <span className="text-slate-400">{asset.category}</span>
                  </div>
                ))}
                {matchingRoutines.map(rtn => (
                  <div
                    key={rtn.id}
                    onClick={() => {
                      setCurrentModule('advisor');
                      setIsSearchOpen(false);
                      setIsSearchFocused(false);
                    }}
                    className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs flex justify-between"
                  >
                    <span className="font-bold text-sky-600">{rtn.name} (Routine)</span>
                    <span className="text-slate-400">{rtn.items.length} items</span>
                  </div>
                ))}
                {matchingReminders.map(med => (
                  <div
                    key={med.id}
                    onClick={() => {
                      setCurrentModule('care');
                      setIsSearchOpen(false);
                      setIsSearchFocused(false);
                    }}
                    className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs flex justify-between"
                  >
                    <span className="font-bold text-rose-600">{med.name} (Reminder)</span>
                    <span className="text-slate-400">{med.timingDescription}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Primary Navigation Bar */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none border-t border-slate-100 dark:border-slate-800/60">
          {navItems.map(item => {
            const isActive = currentModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentModule(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive 
                    ? item.id === 'care'
                      ? 'bg-rose-600 text-white shadow-sm shadow-rose-500/30'
                      : 'bg-brand-600 text-white shadow-sm shadow-brand-500/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && !isActive && (
                  <span className="text-[10px] bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 font-bold px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
