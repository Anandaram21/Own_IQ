import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CalendarEvent, TravelTrip, Asset } from '../../types';
import confetti from 'canvas-confetti';
import { 
  Compass, 
  Calendar as CalendarIcon, 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets, 
  CheckCircle2, 
  Circle, 
  Plus, 
  ShieldCheck, 
  Briefcase, 
  GraduationCap, 
  Dumbbell, 
  Plane, 
  ShoppingBag, 
  Sparkles, 
  AlertCircle, 
  Clock, 
  MapPin, 
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Info,
  Search,
  X,
  Pencil,
  Trash2,
  Check,
  Tag,
  Camera,
  Layers,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export const AssetAdvisor: React.FC = () => {
  const { 
    calendarEvents, 
    toggleChecklistItem, 
    addCustomItemToEvent,
    addCalendarEvent,
    editCalendarChecklistItem,
    removeCalendarChecklistItem,
    departureRoutines, 
    toggleRoutineItem, 
    addCustomRoutineItem,
    editRoutineItem,
    removeRoutineItem,
    addAssetToRoutine,
    travelTrip, 
    toggleTravelItem, 
    addTravelItem,
    editTravelItem,
    removeTravelItem,
    weather, 
    refreshWeather, 
    isWeatherLoading,
    assets,
    userProfile,
    updateUserProfile
  } = useApp();

  const [activeTab, setActiveTab] = useState<'departure' | 'calendar' | 'weather' | 'travel'>('departure');
  const [selectedRoutineId, setSelectedRoutineId] = useState<string>(departureRoutines[0]?.id || 'rtn_work');
  const [routineSearch, setRoutineSearch] = useState('');
  const [newCustomItemName, setNewCustomItemName] = useState('');
  const [isEssentialNew, setIsEssentialNew] = useState(false);
  const [newCityInput, setNewCityInput] = useState(
    userProfile.city && userProfile.city !== 'San Francisco' ? userProfile.city : 'Vellore, Tamil Nadu'
  );

  // New Event Form State
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState<CalendarEvent['type']>('meeting');
  const [eventTime, setEventTime] = useState('2026-10-28T10:00');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDesc, setEventDesc] = useState('');

  // New Travel Item Form State
  const [newTravelItemName, setNewTravelItemName] = useState('');
  const [travelCategory, setTravelCategory] = useState<any>('Electronics & Work');

  // Routine Item Edit State
  const [editingRoutineItemId, setEditingRoutineItemId] = useState<string | null>(null);
  const [editRoutineItemName, setEditRoutineItemName] = useState('');
  const [editRoutineItemEssential, setEditRoutineItemEssential] = useState(false);
  const [editRoutineItemAssetId, setEditRoutineItemAssetId] = useState('');

  // Calendar Item Edit State
  const [editingCalItemId, setEditingCalItemId] = useState<{ eventId: string; itemId: string } | null>(null);
  const [editCalName, setEditCalName] = useState('');
  const [editCalReason, setEditCalReason] = useState('');
  const [editCalEssential, setEditCalEssential] = useState(false);

  // Travel Item Edit State
  const [editingTravelItemId, setEditingTravelItemId] = useState<string | null>(null);
  const [editTravelItemName, setEditTravelItemName] = useState('');
  const [editTravelItemCategory, setEditTravelItemCategory] = useState<TravelTrip['items'][0]['category']>('Electronics & Work');

  // Quick Wallet Asset Picker State
  const [quickAssetSelectId, setQuickAssetSelectId] = useState('');

  // Recommendation System Filter & Toast State
  const [recFilter, setRecFilter] = useState<'all' | 'high' | 'accessories' | 'weather'>('all');
  const [advisorToast, setAdvisorToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setAdvisorToast(msg);
    setTimeout(() => {
      setAdvisorToast(prev => prev === msg ? null : prev);
    }, 3500);
  };

  const activeRoutine = departureRoutines.find(r => r.id === selectedRoutineId) || departureRoutines[0];

  // Routine packed progress
  const packedRoutineCount = activeRoutine ? activeRoutine.items.filter(i => i.isPacked).length : 0;
  const totalRoutineCount = activeRoutine ? activeRoutine.items.length : 0;
  const routineProgressPct = totalRoutineCount > 0 ? Math.round((packedRoutineCount / totalRoutineCount) * 100) : 0;

  const triggerCelebration = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  const handleToggleRoutine = (itemId: string) => {
    if (!activeRoutine) return;
    const item = activeRoutine.items.find(i => i.id === itemId);
    if (item && !item.isPacked && packedRoutineCount + 1 === totalRoutineCount) {
      triggerCelebration();
    }
    toggleRoutineItem(activeRoutine.id, itemId);
  };

  // --- Routine Item Edit & Remove Handlers ---
  const startEditingRoutineItem = (item: { id: string; name: string; isEssential: boolean; assetId?: string }) => {
    setEditingRoutineItemId(item.id);
    setEditRoutineItemName(item.name);
    setEditRoutineItemEssential(item.isEssential);
    setEditRoutineItemAssetId(item.assetId || '');
  };

  const cancelEditingRoutineItem = () => {
    setEditingRoutineItemId(null);
    setEditRoutineItemName('');
    setEditRoutineItemEssential(false);
    setEditRoutineItemAssetId('');
  };

  const saveEditingRoutineItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRoutine || !editingRoutineItemId || !editRoutineItemName.trim()) return;
    editRoutineItem(activeRoutine.id, editingRoutineItemId, {
      name: editRoutineItemName.trim(),
      isEssential: editRoutineItemEssential,
      assetId: editRoutineItemAssetId || undefined
    });
    showToast(`Updated "${editRoutineItemName.trim()}" in ${activeRoutine.name}`);
    cancelEditingRoutineItem();
  };

  const handleRemoveRoutineItem = (itemId: string, itemName: string) => {
    if (!activeRoutine) return;
    removeRoutineItem(activeRoutine.id, itemId);
    showToast(`Removed "${itemName}" from ${activeRoutine.name}`);
    if (editingRoutineItemId === itemId) {
      cancelEditingRoutineItem();
    }
  };

  const handleAddRoutineItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomItemName.trim() || !activeRoutine) return;
    addCustomRoutineItem(activeRoutine.id, newCustomItemName.trim(), isEssentialNew);
    setNewCustomItemName('');
    setIsEssentialNew(false);
    showToast(`Added "${newCustomItemName.trim()}" to ${activeRoutine.name}`);
  };

  const handleQuickAddWalletAsset = () => {
    if (!activeRoutine || !quickAssetSelectId) return;
    const selected = assets.find(a => a.id === quickAssetSelectId);
    if (!selected) return;
    addAssetToRoutine(activeRoutine.id, selected, true);
    showToast(`Added "${selected.name}" from your Asset Wallet!`);
    setQuickAssetSelectId('');
  };

  // --- Recommendation System Logic ---
  interface AssetRecommendation {
    id: string;
    assetId?: string;
    name: string;
    brand?: string;
    category: string;
    imageUrl?: string;
    location?: string;
    matchScore: number;
    reason: string;
    badge: string;
    type: 'core' | 'accessory' | 'weather';
    isEssential: boolean;
    assetObj?: Asset;
  }

  const getWalletRecommendations = (): AssetRecommendation[] => {
    if (!activeRoutine) return [];

    const recs: AssetRecommendation[] = [];
    const routineType = activeRoutine.type;
    const existingItemNames = new Set(activeRoutine.items.map(i => i.name.toLowerCase()));
    const existingAssetIds = new Set(activeRoutine.items.map(i => i.assetId).filter(Boolean));

    // 1. Process Core Assets in Wallet
    assets.forEach(asset => {
      // If already in routine, skip
      if (existingAssetIds.has(asset.id) || existingItemNames.has(asset.name.toLowerCase())) {
        return;
      }

      let matchScore = 0;
      let reason = '';
      let badge = '';
      let isEssential = false;
      let recType: 'core' | 'accessory' | 'weather' = 'core';

      // Weather check
      const isRainGear = /umbrella|rain|waterproof|trench|jacket/i.test(`${asset.name} ${asset.category} ${asset.tags?.join(' ')}`);
      if (weather?.isRainExpected && isRainGear) {
        matchScore = 98;
        badge = '🌧️ Weather Alert';
        reason = `Rain forecasted in ${weather.city} (${weather.precipitationProbability}% precip). Recommended wet-weather gear.`;
        isEssential = true;
        recType = 'weather';
      } else {
        switch (routineType) {
          case 'work':
            if (asset.category === 'Laptops & Computing') {
              matchScore = 96;
              badge = '💼 Work Productivity';
              reason = `Primary laptop/computing device located at ${asset.location}.`;
              isEssential = true;
            } else if (asset.category === 'Smartphones & Mobile') {
              matchScore = 95;
              badge = '📱 Everyday Essential';
              reason = `Primary communication & 2FA security pass.`;
              isEssential = true;
            } else if (asset.category === 'Audio & Wearables') {
              matchScore = 88;
              badge = '🎧 Office Focus';
              reason = `Noise cancellation for open office or transit.`;
            } else if (asset.category === 'Vehicles & Transport') {
              matchScore = 90;
              badge = '🚗 Commute Transit';
              reason = `Registered vehicle / transportation keys at ${asset.location}.`;
              isEssential = true;
            } else if (asset.tags?.some(t => ['work', 'commute', 'essential'].includes(t.toLowerCase()))) {
              matchScore = 75;
              badge = '📌 Tagged for Work';
              reason = `Item has tags matching work & daily commute.`;
            }
            break;

          case 'college':
            if (asset.category === 'Laptops & Computing') {
              matchScore = 96;
              badge = '🎓 Lecture & Notes';
              reason = `Required for lecture notes, research and coursework.`;
              isEssential = true;
            } else if (asset.category === 'Audio & Wearables') {
              matchScore = 88;
              badge = '📚 Library Study';
              reason = `Study focus and quiet audio listening.`;
            } else if (asset.category === 'Travel & Luggage') {
              matchScore = 82;
              badge = '🎒 Campus Carry';
              reason = `Luggage / backpack to carry laptop & folders.`;
            } else if (asset.category === 'Smartphones & Mobile') {
              matchScore = 92;
              badge = '📱 Campus ID & Pass';
              reason = `Digital student identification and mobile pass.`;
              isEssential = true;
            }
            break;

          case 'gym':
            if (asset.category === 'Audio & Wearables') {
              matchScore = 98;
              badge = '💪 Workout Audio';
              reason = `High-energy workout playlist and noise suppression.`;
              isEssential = true;
            } else if (asset.category === 'Home & Wellness') {
              matchScore = 90;
              badge = '🏃 Health & Recovery';
              reason = `Tracking vitals and post-workout wellness.`;
            }
            break;

          case 'travel':
            if (asset.category === 'Travel & Luggage') {
              matchScore = 99;
              badge = '✈️ Registered Luggage';
              reason = `Hardside suitcase with registered warranty & TSA lock.`;
              isEssential = true;
            } else if (asset.category === 'Audio & Wearables') {
              matchScore = 92;
              badge = '🛫 In-Flight ANC';
              reason = `Airplane cabin noise reduction & travel comfort.`;
            } else if (asset.category === 'Cameras & Optics') {
              matchScore = 88;
              badge = '📸 Travel Photography';
              reason = `Capture travel experiences and memories.`;
            } else if (asset.category === 'Laptops & Computing') {
              matchScore = 80;
              badge = '💻 Remote Work';
              reason = `Stay connected during travel.`;
            }
            break;

          default:
            if (asset.tags?.includes('essential') || asset.tags?.includes('daily-carry')) {
              matchScore = 78;
              badge = '⭐ Daily Carry';
              reason = `Tagged as valuable daily carry in your Asset Wallet.`;
            } else {
              matchScore = 55;
              badge = '📦 Wallet Asset';
              reason = `Registered in ${asset.category} • Located at ${asset.location}.`;
            }
        }
      }

      if (matchScore >= 50) {
        recs.push({
          id: `rec_asset_${asset.id}`,
          assetId: asset.id,
          name: asset.name,
          brand: asset.brand,
          category: asset.category,
          imageUrl: asset.imageUrl,
          location: asset.location,
          matchScore,
          reason,
          badge,
          type: recType,
          isEssential,
          assetObj: asset
        });
      }

      // 2. Process Asset Accessories as companion recommendations
      if (asset.accessories && asset.accessories.length > 0) {
        asset.accessories.forEach((acc, idx) => {
          if (!existingItemNames.has(acc.toLowerCase())) {
            const parentIsInRoutine = existingAssetIds.has(asset.id);
            const accessoryScore = parentIsInRoutine ? 94 : Math.max(matchScore - 10, 60);

            recs.push({
              id: `rec_acc_${asset.id}_${idx}`,
              assetId: asset.id,
              name: acc,
              brand: asset.brand,
              category: `${asset.name} Accessory`,
              imageUrl: asset.imageUrl,
              location: asset.location,
              matchScore: accessoryScore,
              reason: parentIsInRoutine 
                ? `Registered companion accessory for your ${asset.name}. Keep together!`
                : `Accessory bundled with ${asset.name} (${asset.brand}).`,
              badge: parentIsInRoutine ? '🔌 Companion Accessory' : '📦 Asset Accessory',
              type: 'accessory',
              isEssential: parentIsInRoutine
            });
          }
        });
      }
    });

    return recs.sort((a, b) => b.matchScore - a.matchScore);
  };

  const handleAddRecommendation = (rec: AssetRecommendation) => {
    if (!activeRoutine) return;
    if (rec.assetObj) {
      addAssetToRoutine(activeRoutine.id, rec.assetObj, rec.isEssential);
    } else {
      addCustomRoutineItem(activeRoutine.id, rec.name, rec.isEssential, rec.assetId);
    }
    showToast(`Added recommended "${rec.name}" to ${activeRoutine.name}!`);
  };

  // --- Calendar Checklist Edit & Remove Handlers ---
  const startEditingCalItem = (eventId: string, item: { id: string; name: string; isEssential?: boolean; reason?: string }) => {
    setEditingCalItemId({ eventId, itemId: item.id });
    setEditCalName(item.name);
    setEditCalReason(item.reason || '');
    setEditCalEssential(item.isEssential ?? false);
  };

  const saveEditingCalItem = (eventId: string, itemId: string) => {
    if (!editCalName.trim()) return;
    editCalendarChecklistItem(eventId, itemId, {
      name: editCalName.trim(),
      reason: editCalReason.trim(),
      isEssential: editCalEssential
    });
    setEditingCalItemId(null);
    showToast(`Updated "${editCalName.trim()}" in event checklist`);
  };

  const handleRemoveCalItem = (eventId: string, itemId: string, name: string) => {
    removeCalendarChecklistItem(eventId, itemId);
    showToast(`Removed "${name}" from event gear list`);
  };

  // --- Travel Checklist Edit & Remove Handlers ---
  const startEditingTravelItem = (item: { id: string; name: string; category: any }) => {
    setEditingTravelItemId(item.id);
    setEditTravelItemName(item.name);
    setEditTravelItemCategory(item.category);
  };

  const saveEditingTravelItem = (itemId: string) => {
    if (!editTravelItemName.trim()) return;
    editTravelItem(itemId, {
      name: editTravelItemName.trim(),
      category: editTravelItemCategory
    });
    setEditingTravelItemId(null);
    showToast(`Updated "${editTravelItemName.trim()}" in travel list`);
  };

  const handleRemoveTravelItem = (itemId: string, name: string) => {
    removeTravelItem(itemId);
    showToast(`Removed "${name}" from travel packing list`);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    // AI Contextual Recommendation based on registered assets and event type
    const suggestedAssetIds: string[] = [];
    const checklist: CalendarEvent['checklist'] = [];

    // Find registered laptop
    const laptop = assets.find(a => a.category === 'Laptops & Computing');
    const phone = assets.find(a => a.category === 'Smartphones & Mobile');
    const audio = assets.find(a => a.category === 'Audio & Wearables');
    const vehicle = assets.find(a => a.category === 'Vehicles & Transport');

    if (eventType === 'meeting' || eventType === 'class') {
      if (laptop) {
        suggestedAssetIds.push(laptop.id);
        checklist.push({
          id: `chk_${Date.now()}_1`,
          name: laptop.name,
          assetId: laptop.id,
          isPacked: false,
          isEssential: true,
          reason: 'Required for notes and presentation deck'
        });
        if (laptop.accessories?.[0]) {
          checklist.push({
            id: `chk_${Date.now()}_2`,
            name: laptop.accessories[0],
            assetId: laptop.id,
            isPacked: false,
            isEssential: true,
            reason: `Registered accessory for ${laptop.brand}`
          });
        }
      }
      checklist.push({
        id: `chk_${Date.now()}_3`,
        name: 'Building Entry Badge / Photo ID',
        isPacked: false,
        isEssential: true,
        reason: 'Security check-in'
      });
    } else if (eventType === 'gym') {
      if (audio) {
        suggestedAssetIds.push(audio.id);
        checklist.push({
          id: `chk_${Date.now()}_g1`,
          name: audio.name,
          assetId: audio.id,
          isPacked: false,
          isEssential: true,
          reason: 'Workout audio and noise-cancellation'
        });
      }
      checklist.push({
        id: `chk_${Date.now()}_g2`,
        name: 'Insulated Water Bottle & Towel',
        isPacked: false,
        isEssential: true,
        reason: 'Hydration and hygiene'
      });
    }

    if (weather?.isRainExpected) {
      checklist.push({
        id: `chk_${Date.now()}_w`,
        name: 'Compact Umbrella',
        isPacked: false,
        isEssential: false,
        reason: `Weather: ${weather.conditionText} expected`
      });
    }

    addCalendarEvent({
      title: eventTitle.trim(),
      type: eventType,
      startTime: new Date(eventTime).toISOString(),
      endTime: new Date(new Date(eventTime).getTime() + 60 * 60 * 1000).toISOString(),
      location: eventLocation.trim() || 'Scheduled Location',
      description: eventDesc.trim(),
      source: 'in-app',
      suggestedAssetIds,
      additionalItems: [],
      checklist
    });

    setEventTitle('');
    setEventLocation('');
    setEventDesc('');
    setShowAddEvent(false);
  };

  const handleCitySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCityInput.trim()) {
      refreshWeather(newCityInput.trim());
      updateUserProfile({ city: newCityInput.trim() });
    }
  };

  return (
    <div className="space-y-6">
      {/* Advisor Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-slate-900 to-brand-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-brand-300">
              <Compass className="w-3.5 h-3.5 text-brand-400" />
              <span>AI Asset Advisor • Daily Preparation Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Prepare Intelligently. Never Leave Items Behind.
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Cross-references your registered assets & accessories with live weather conditions, schedule events, and travel itineraries to suggest exactly what you need.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-xs space-y-1">
              <div className="text-slate-400 font-medium">Synced Calendars</div>
              <div className="flex items-center gap-2 font-bold text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Google Calendar (Authorized)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mt-8 pt-4 border-t border-white/10 overflow-x-auto scrollbar-none">
          {[
            { id: 'departure', label: 'Before You Leave Home', icon: <Briefcase className="w-4 h-4" /> },
            { id: 'calendar', label: 'Schedule & Event Gear', icon: <CalendarIcon className="w-4 h-4" /> },
            { id: 'weather', label: 'Weather-Based Gear', icon: <Sun className="w-4 h-4" /> },
            { id: 'travel', label: 'Travel Packing Assistant', icon: <Plane className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Advisor Feedback Toast */}
      {advisorToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 backdrop-blur-md text-white text-xs px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-4 h-4 text-brand-400 shrink-0" />
          <span className="font-semibold">{advisorToast}</span>
          <button 
            onClick={() => setAdvisorToast(null)} 
            className="ml-2 text-slate-400 hover:text-white p-0.5 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TAB 1: BEFORE YOU LEAVE HOME CHECKLIST */}
      {activeTab === 'departure' && (
        <div className="space-y-6">
          {/* Routine Switcher & Search Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search routines or checklist items (e.g. laptop, keys, charger, water bottle)..."
                value={routineSearch}
                onChange={(e) => setRoutineSearch(e.target.value)}
                className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-slate-400"
              />
              {routineSearch && (
                <button
                  onClick={() => setRoutineSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                {departureRoutines
                  .filter(rtn => {
                    if (!routineSearch.trim()) return true;
                    const q = routineSearch.toLowerCase();
                    return rtn.name.toLowerCase().includes(q) || rtn.items.some(i => i.name.toLowerCase().includes(q));
                  })
                  .map(rtn => {
                    const isSelected = rtn.id === selectedRoutineId;
                    return (
                      <button
                        key={rtn.id}
                        onClick={() => setSelectedRoutineId(rtn.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                          isSelected
                            ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        <span>{rtn.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                          {rtn.items.filter(i => i.isPacked).length}/{rtn.items.length}
                        </span>
                      </button>
                    );
                  })}
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 shrink-0">
                <Sparkles className="w-4 h-4 text-brand-500" />
                <span>AI Recommendation Engine Active</span>
              </div>
            </div>
          </div>

          {/* Departure Readiness Progress Card */}
          {activeRoutine && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Departure Checklist: {activeRoutine.name}
                    </h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                      {routineProgressPct}% Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    AI cross-referenced your routine, {assets.length} Asset Wallet items, and live weather ({weather?.temperature}°C, {weather?.conditionText}).
                  </p>
                </div>

                <div className="w-full sm:w-48 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <span>Pack Status</span>
                    <span>{packedRoutineCount} of {totalRoutineCount} Packed</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        routineProgressPct === 100 ? 'bg-emerald-500' : 'bg-brand-600'
                      }`}
                      style={{ width: `${routineProgressPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* ────────────────────────────────────────────────────────── */}
              {/* SMART AI ASSET WALLET RECOMMENDATIONS (RECOMMENDER SYSTEM) */}
              {/* ────────────────────────────────────────────────────────── */}
              {(() => {
                const recommendations = getWalletRecommendations();
                const filteredRecs = recommendations.filter(rec => {
                  if (recFilter === 'all') return true;
                  if (recFilter === 'high') return rec.matchScore >= 90;
                  if (recFilter === 'accessories') return rec.type === 'accessory';
                  if (recFilter === 'weather') return rec.type === 'weather';
                  return true;
                });

                if (recommendations.length === 0) return null;

                return (
                  <div className="p-5 bg-gradient-to-br from-brand-50/70 via-slate-50 to-indigo-50/40 dark:from-slate-800/60 dark:via-slate-800/40 dark:to-brand-950/20 border border-brand-200/80 dark:border-brand-900/60 rounded-3xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
                            <Sparkles className="w-4 h-4" />
                          </span>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            Smart Wallet Recommendations ({recommendations.length} Suggestions)
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 pl-9">
                          AI evaluated your registered wallet assets against "{activeRoutine.name}" & current weather
                        </p>
                      </div>

                      {/* Filter Chips */}
                      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pl-9 sm:pl-0">
                        {[
                          { id: 'all', label: `All (${recommendations.length})` },
                          { id: 'high', label: `High Match (${recommendations.filter(r => r.matchScore >= 90).length})` },
                          { id: 'accessories', label: `Accessories (${recommendations.filter(r => r.type === 'accessory').length})` },
                          { id: 'weather', label: `Weather (${recommendations.filter(r => r.type === 'weather').length})` },
                        ].map(f => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setRecFilter(f.id as any)}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                              recFilter === f.id
                                ? 'bg-brand-600 text-white shadow-xs'
                                : 'bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-white'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Recommendation Cards Carousel / Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {filteredRecs.slice(0, 6).map(rec => (
                        <div
                          key={rec.id}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 p-3.5 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                                  {rec.imageUrl ? (
                                    <img src={rec.imageUrl} alt={rec.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <ShieldCheck className="w-5 h-5 text-brand-600" />
                                  )}
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-600 transition-colors">
                                    {rec.name}
                                  </div>
                                  <div className="text-[10px] text-slate-400 line-clamp-1">
                                    {rec.category}
                                  </div>
                                </div>
                              </div>

                              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 shrink-0">
                                {rec.matchScore}%
                              </span>
                            </div>

                            <div className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100 dark:border-slate-800/60 leading-relaxed">
                              {rec.reason}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                            <span className="truncate max-w-[130px]">📍 {rec.location || 'Asset Wallet'}</span>
                            <button
                              type="button"
                              onClick={() => handleAddRecommendation(rec)}
                              className="px-3 py-1 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-semibold rounded-lg flex items-center gap-1 shadow-xs transition-all"
                            >
                              <Plus className="w-3 h-3" /> Add
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* ────────────────────────────────────────────────────────── */}
              {/* CHECKLIST ITEMS WITH LIVE EDIT & REMOVE ACTIONS           */}
              {/* ────────────────────────────────────────────────────────── */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between pb-1">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Routine Checklist Items</span>
                    <span className="text-[10px] font-normal text-slate-400">(Click item to pack • Edit or remove anytime)</span>
                  </div>
                </div>

                {(() => {
                  const itemsToDisplay = activeRoutine.items.filter(item => {
                    if (!routineSearch.trim()) return true;
                    const q = routineSearch.toLowerCase();
                    const matchedAsset = item.assetId ? assets.find(a => a.id === item.assetId) : null;
                    return (
                      item.name.toLowerCase().includes(q) ||
                      matchedAsset?.name.toLowerCase().includes(q) ||
                      matchedAsset?.brand.toLowerCase().includes(q)
                    );
                  });

                  if (itemsToDisplay.length === 0) {
                    return (
                      <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                        <p className="font-semibold text-slate-600 dark:text-slate-300">No items matched "{routineSearch}"</p>
                        <button onClick={() => setRoutineSearch('')} className="text-brand-600 hover:underline font-semibold">
                          Clear search filter
                        </button>
                      </div>
                    );
                  }

                  return itemsToDisplay.map(item => {
                    const matchedAsset = item.assetId ? assets.find(a => a.id === item.assetId) : null;
                    const isEditing = editingRoutineItemId === item.id;

                    // Inline Editing Mode
                    if (isEditing) {
                      return (
                        <form 
                          key={item.id}
                          onSubmit={saveEditingRoutineItem}
                          className="p-4 rounded-2xl border-2 border-brand-500 bg-brand-50/40 dark:bg-brand-950/30 space-y-3 animate-in fade-in duration-150"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-brand-700 dark:text-brand-300 flex items-center gap-1.5">
                              <Pencil className="w-3.5 h-3.5" /> Edit Checklist Item
                            </span>
                            <button
                              type="button"
                              onClick={cancelEditingRoutineItem}
                              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                Item Name *
                              </label>
                              <input
                                type="text"
                                required
                                value={editRoutineItemName}
                                onChange={(e) => setEditRoutineItemName(e.target.value)}
                                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                Link to Registered Wallet Asset
                              </label>
                              <select
                                value={editRoutineItemAssetId}
                                onChange={(e) => {
                                  setEditRoutineItemAssetId(e.target.value);
                                  const linked = assets.find(a => a.id === e.target.value);
                                  if (linked && !editRoutineItemName.trim()) {
                                    setEditRoutineItemName(linked.name);
                                  }
                                }}
                                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                              >
                                <option value="">— No asset link (General item) —</option>
                                {assets.map(asset => (
                                  <option key={asset.id} value={asset.id}>
                                    {asset.name} ({asset.brand} • {asset.location})
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-brand-200/50 dark:border-brand-900/40">
                            <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editRoutineItemEssential}
                                onChange={(e) => setEditRoutineItemEssential(e.target.checked)}
                                className="rounded text-brand-600"
                              />
                              <span>Mark as Essential (Cannot depart without it)</span>
                            </label>

                            <div className="flex items-center gap-2 justify-end">
                              <button
                                type="button"
                                onClick={cancelEditingRoutineItem}
                                className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 rounded-xl font-medium"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                              >
                                <Check className="w-3.5 h-3.5" /> Save Changes
                              </button>
                            </div>
                          </div>
                        </form>
                      );
                    }

                    // Standard Checklist Item View
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleToggleRoutine(item.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                          item.isPacked
                            ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-slate-500'
                            : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-brand-500 text-slate-900 dark:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                              item.isPacked 
                                ? 'bg-emerald-600 text-white' 
                                : 'border-2 border-slate-300 dark:border-slate-600'
                            }`}
                          >
                            {item.isPacked && <CheckCircle2 className="w-4 h-4" />}
                          </button>

                          <div>
                            <div className={`text-sm font-semibold flex items-center gap-2 ${item.isPacked ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>
                              <span>{item.name}</span>
                              {item.isEssential && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 rounded">
                                  Essential
                                </span>
                              )}
                            </div>
                            
                            {matchedAsset ? (
                              <div className="text-[11px] text-brand-600 dark:text-brand-400 font-medium flex items-center gap-1.5 mt-0.5">
                                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                <span>Matched in Asset Wallet: {matchedAsset.location}</span>
                              </div>
                            ) : (
                              <div className="text-[11px] text-slate-400 mt-0.5">General routine necessity</div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-xs font-semibold mr-1 hidden sm:block">
                            {item.isPacked ? (
                              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                Packed
                              </span>
                            ) : (
                              <span className="text-slate-400">Needs Packing</span>
                            )}
                          </div>

                          {/* Edit & Remove Action Buttons */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditingRoutineItem(item);
                              }}
                              className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                              title="Edit item name or link asset"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveRoutineItem(item.id, item.name);
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                              title="Remove from routine"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>

              {/* ────────────────────────────────────────────────────────── */}
              {/* ADD CUSTOM ITEM & BROWSE ASSET WALLET QUICK PICKER         */}
              {/* ────────────────────────────────────────────────────────── */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                {/* Manual custom item form */}
                <form onSubmit={handleAddRoutineItem} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Add custom item to this routine (e.g. Lab Safety Goggles, Water Bottle)"
                    value={newCustomItemName}
                    onChange={(e) => setNewCustomItemName(e.target.value)}
                    className="flex-1 px-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 px-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isEssentialNew}
                      onChange={(e) => setIsEssentialNew(e.target.checked)}
                      className="rounded text-brand-600"
                    />
                    <span>Mark as Essential</span>
                  </label>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 dark:bg-brand-600 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Item
                  </button>
                </form>

                {/* Quick Pick from Asset Wallet dropdown */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5 p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
                    <ShieldCheck className="w-4 h-4 text-brand-500" />
                    <span>Pick from Asset Wallet:</span>
                  </div>
                  <select
                    value={quickAssetSelectId}
                    onChange={(e) => setQuickAssetSelectId(e.target.value)}
                    className="flex-1 w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">— Select an asset from your wallet to add to routine —</option>
                    {assets.map(asset => (
                      <option key={asset.id} value={asset.id}>
                        {asset.name} ({asset.brand} • {asset.category} • {asset.location})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleQuickAddWalletAsset}
                    disabled={!quickAssetSelectId}
                    className="w-full sm:w-auto px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl disabled:opacity-50 flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Selected Asset
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CALENDAR INTEGRATION & EVENT GEAR */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Upcoming Calendar Activities</h2>
              <p className="text-xs text-slate-400">Automatic belongings recommendations generated for scheduled appointments & classes</p>
            </div>
            <button
              onClick={() => setShowAddEvent(!showAddEvent)}
              className="px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Calendar Event
            </button>
          </div>

          {/* Add Event Form Modal / Expandable */}
          {showAddEvent && (
            <form onSubmit={handleCreateEvent} className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
              <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-brand-500" />
                <span>Schedule New Event & Generate AI Gear Checklist</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Event Title (e.g. Bio-Mechanics Lecture, Client Pitch)"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as any)}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <option value="meeting">Business Meeting</option>
                  <option value="class">University / College Class</option>
                  <option value="gym">Gym / Sports Activity</option>
                  <option value="trip">Travel / Journey</option>
                  <option value="doctor">Medical / Care Appointment</option>
                </select>
                <input
                  type="datetime-local"
                  required
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
                <input
                  type="text"
                  placeholder="Location / Room / Venue"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
              <textarea
                placeholder="Optional description / agenda"
                value={eventDesc}
                onChange={(e) => setEventDesc(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                rows={2}
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowAddEvent(false)} className="px-4 py-2 text-xs text-slate-500">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-brand-600 text-white text-xs font-semibold rounded-xl">Save & Recommend Gear</button>
              </div>
            </form>
          )}

          {/* Events List */}
          <div className="space-y-4">
            {calendarEvents.map(event => (
              <div 
                key={event.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-slate-900 dark:text-white">{event.title}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                        {event.type}
                      </span>
                      {event.source === 'google-calendar' && (
                        <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          Google Calendar Synced
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(event.startTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} at {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checklist */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>AI Recommended Gear Checklist</span>
                    <span>
                      {event.checklist.filter(i => i.isPacked).length} of {event.checklist.length} Packed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {event.checklist.map(item => {
                      const isEditing = editingCalItemId?.eventId === event.id && editingCalItemId?.itemId === item.id;
                      if (isEditing) {
                        return (
                          <div 
                            key={item.id} 
                            className="p-3.5 rounded-2xl border-2 border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 space-y-2 col-span-1 sm:col-span-2 animate-in fade-in duration-150"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-brand-700 dark:text-brand-300 flex items-center gap-1.5">
                                <Pencil className="w-3.5 h-3.5" /> Edit Event Gear
                              </span>
                              <button 
                                onClick={() => setEditingCalItemId(null)} 
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Item Name</label>
                                <input
                                  type="text"
                                  value={editCalName}
                                  onChange={(e) => setEditCalName(e.target.value)}
                                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                                  placeholder="Item name"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Reason / Rationale</label>
                                <input
                                  type="text"
                                  value={editCalReason}
                                  onChange={(e) => setEditCalReason(e.target.value)}
                                  className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                                  placeholder="Reason / context"
                                />
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-1">
                              <label className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={editCalEssential}
                                  onChange={(e) => setEditCalEssential(e.target.checked)}
                                  className="rounded text-brand-600"
                                />
                                <span>Essential Gear for this Event</span>
                              </label>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingCalItemId(null)}
                                  className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => saveEditingCalItem(event.id, item.id)}
                                  className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs"
                                >
                                  <Check className="w-3 h-3" /> Save
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleChecklistItem(event.id, item.id)}
                          className={`p-3 rounded-2xl border text-xs cursor-pointer flex items-start justify-between gap-3 transition-colors group ${
                            item.isPacked 
                              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-slate-500' 
                              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-brand-500 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 ${
                              item.isPacked ? 'bg-emerald-600 text-white' : 'border border-slate-300 dark:border-slate-600'
                            }`}>
                              {item.isPacked && <CheckCircle2 className="w-3.5 h-3.5" />}
                            </div>
                            <div className="space-y-0.5">
                              <div className={`font-semibold flex items-center gap-1.5 ${item.isPacked ? 'line-through text-slate-400' : ''}`}>
                                <span>{item.name}</span>
                                {item.isEssential && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 rounded">
                                    Essential
                                  </span>
                                )}
                              </div>
                              {item.reason && (
                                <div className="text-[10px] text-slate-400">{item.reason}</div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditingCalItem(event.id, item);
                              }}
                              className="p-1 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-md transition-colors"
                              title="Edit item"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveCalItem(event.id, item.id, item.name);
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WEATHER-BASED RECOMMENDATIONS */}
      {activeTab === 'weather' && (
        <div className="space-y-6">
          {/* Weather Location Selector */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Live Meteorological Data</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                  Real API Feed (Open-Meteo)
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Genuine weather conditions driving real belongings advice. Never fabricated.
              </p>
            </div>

            <form onSubmit={handleCitySearch} className="flex gap-2 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search city (e.g. Vellore, Chennai, Bengaluru, New York)"
                value={newCityInput}
                onChange={(e) => setNewCityInput(e.target.value)}
                className="px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none"
              />
              <button
                type="submit"
                disabled={isWeatherLoading}
                className="px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
              >
                {isWeatherLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Update'}
              </button>
            </form>
          </div>

          {/* Weather Metrics Card */}
          {weather && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Primary Weather Widget */}
              <div className="bg-gradient-to-br from-brand-600 to-sky-700 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6">
                <div>
                  <div className="text-xs uppercase tracking-wider text-brand-200 font-bold">{weather.city}, {weather.country}</div>
                  <div className="text-4xl font-extrabold mt-2 flex items-baseline gap-2">
                    <span>{weather.temperature}°C</span>
                    <span className="text-sm font-normal text-brand-200">Feels like {weather.apparentTemperature}°C</span>
                  </div>
                  <div className="text-sm font-medium mt-1 text-sky-100">{weather.conditionText}</div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/20 text-xs">
                  <div>
                    <div className="text-brand-200 text-[10px]">Precipitation</div>
                    <div className="font-bold">{weather.precipitationProbability}%</div>
                  </div>
                  <div>
                    <div className="text-brand-200 text-[10px]">UV Index</div>
                    <div className="font-bold">{weather.uvIndex}</div>
                  </div>
                  <div>
                    <div className="text-brand-200 text-[10px]">Wind Speed</div>
                    <div className="font-bold">{weather.windSpeed} km/h</div>
                  </div>
                </div>
              </div>

              {/* Weather Recommended Belongings */}
              <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Weather Gear Advice</h3>
                    <p className="text-xs text-slate-400">Items you should pack based on current meteorological signals</p>
                  </div>
                  <span className="text-xs text-slate-400">Updated {weather.lastUpdated}</span>
                </div>

                <div className="space-y-3">
                  {weather.recommendations.map((rec, i) => (
                    <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-start gap-3">
                      <div className="p-2 bg-brand-100 dark:bg-brand-950 text-brand-600 rounded-xl shrink-0 mt-0.5">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{rec.item}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full">
                            {rec.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{rec.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: TRAVEL PACKING ASSISTANT */}
      {activeTab === 'travel' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Travel Itinerary</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full">
                    {travelTrip.purpose}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  Trip to {travelTrip.destination}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dates: {travelTrip.startDate} to {travelTrip.endDate} • {travelTrip.expectedWeather}
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">Packed Progress</div>
                <div className="text-lg font-bold text-brand-600">
                  {travelTrip.items.filter(i => i.isPacked).length} of {travelTrip.items.length} Ready
                </div>
              </div>
            </div>

            {/* Travel Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {travelTrip.items.map(item => {
                const matchedAsset = item.assetId ? assets.find(a => a.id === item.assetId) : null;
                const isEditing = editingTravelItemId === item.id;

                if (isEditing) {
                  return (
                    <div 
                      key={item.id}
                      className="p-3.5 rounded-2xl border-2 border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 space-y-2 col-span-1 sm:col-span-2 animate-in fade-in duration-150"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-700 dark:text-brand-300 flex items-center gap-1.5">
                          <Pencil className="w-3.5 h-3.5" /> Edit Travel Packing Item
                        </span>
                        <button 
                          onClick={() => setEditingTravelItemId(null)} 
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Item Name</label>
                          <input
                            type="text"
                            value={editTravelItemName}
                            onChange={(e) => setEditTravelItemName(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                            placeholder="Packing item name"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Packing Category</label>
                          <select
                            value={editTravelItemCategory}
                            onChange={(e) => setEditTravelItemCategory(e.target.value as any)}
                            className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                          >
                            <option value="Electronics & Work">Electronics & Work</option>
                            <option value="Clothing & Weather">Clothing & Weather</option>
                            <option value="Documents & Essentials">Documents & Essentials</option>
                            <option value="Health & Care">Health & Care</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingTravelItemId(null)}
                          className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => saveEditingTravelItem(item.id)}
                          className="px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs"
                        >
                          <Check className="w-3 h-3" /> Save Changes
                        </button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleTravelItem(item.id)}
                    className={`p-3.5 rounded-2xl border text-xs cursor-pointer flex items-start justify-between gap-3 transition-colors group ${
                      item.isPacked
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-slate-400'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:border-brand-500 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 ${
                        item.isPacked ? 'bg-emerald-600 text-white' : 'border border-slate-300 dark:border-slate-600'
                      }`}>
                        {item.isPacked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>

                      <div className="space-y-0.5">
                        <div className={`font-semibold ${item.isPacked ? 'line-through' : ''}`}>
                          {item.name}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Category: {item.category} {matchedAsset ? `• In Asset Wallet` : ''}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditingTravelItem(item);
                        }}
                        className="p-1 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-md transition-colors"
                        title="Edit travel item"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveTravelItem(item.id, item.name);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-md transition-colors"
                        title="Remove travel item"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Travel Item */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (newTravelItemName.trim()) {
                  addTravelItem(newTravelItemName.trim(), travelCategory);
                  setNewTravelItemName('');
                  showToast(`Added "${newTravelItemName.trim()}" to travel packing list`);
                }
              }}
              className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-2"
            >
              <input
                type="text"
                placeholder="Add packing item (e.g. Travel Pill Organizer, Passport Holder)"
                value={newTravelItemName}
                onChange={(e) => setNewTravelItemName(e.target.value)}
                className="flex-1 px-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
              <select
                value={travelCategory}
                onChange={(e) => setTravelCategory(e.target.value as any)}
                className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                <option value="Electronics & Work">Electronics & Work</option>
                <option value="Clothing & Weather">Clothing & Weather</option>
                <option value="Documents & Essentials">Documents & Essentials</option>
                <option value="Health & Care">Health & Care</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
