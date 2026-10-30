import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AppModule, 
  CareViewMode, 
  Asset, 
  CalendarEvent, 
  DepartureRoutine, 
  TravelTrip, 
  WeatherData, 
  MedicationReminder, 
  CaregiverInstruction, 
  CareDailyActivity, 
  CareRecipientProfile, 
  AppNotification, 
  UserProfile,
  AssetDocument,
  MaintenanceRecord,
  UsageLog
} from '../types';
import { 
  INITIAL_ASSETS, 
  INITIAL_CALENDAR_EVENTS, 
  INITIAL_DEPARTURE_ROUTINES, 
  INITIAL_TRAVEL_TRIP, 
  INITIAL_CARE_RECIPIENT, 
  INITIAL_MEDICATION_REMINDERS, 
  INITIAL_CAREGIVER_INSTRUCTIONS, 
  INITIAL_CARE_ACTIVITIES, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_USER_PROFILE 
} from '../utils/demoData';
import { fetchLiveWeather } from '../services/weatherService';
import { generateAssetQrCode } from '../services/qrService';

interface AppContextType {
  // Navigation & Role
  currentModule: AppModule;
  setCurrentModule: (mod: AppModule) => void;
  careViewMode: CareViewMode;
  setCareViewMode: (mode: CareViewMode) => void;
  
  // Search & Modals
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedAsset: Asset | null;
  setSelectedAsset: (asset: Asset | null) => void;
  isAddAssetModalOpen: boolean;
  setIsAddAssetModalOpen: (open: boolean) => void;
  isQrScannerModalOpen: boolean;
  setIsQrScannerModalOpen: (open: boolean) => void;
  
  // Data entities
  assets: Asset[];
  addAsset: (asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt' | 'documents' | 'maintenanceRecords' | 'usageLogs'>, initialDoc?: Omit<AssetDocument, 'id' | 'uploadDate'>) => Promise<Asset>;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  addDocumentToAsset: (assetId: string, doc: Omit<AssetDocument, 'id' | 'uploadDate'>) => void;
  addMaintenanceRecord: (assetId: string, record: Omit<MaintenanceRecord, 'id' | 'assetId'>) => void;
  logAssetUsage: (assetId: string, usage: Omit<UsageLog, 'id' | 'assetId'>) => void;
  
  // Advisor
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  toggleChecklistItem: (eventId: string, itemId: string) => void;
  addCustomItemToEvent: (eventId: string, name: string) => void;
  editCalendarChecklistItem: (eventId: string, itemId: string, updates: { name: string; isEssential?: boolean; reason?: string; assetId?: string }) => void;
  removeCalendarChecklistItem: (eventId: string, itemId: string) => void;
  departureRoutines: DepartureRoutine[];
  toggleRoutineItem: (routineId: string, itemId: string) => void;
  addCustomRoutineItem: (routineId: string, name: string, isEssential: boolean, assetId?: string) => void;
  editRoutineItem: (routineId: string, itemId: string, updates: { name: string; isEssential: boolean; assetId?: string }) => void;
  removeRoutineItem: (routineId: string, itemId: string) => void;
  addAssetToRoutine: (routineId: string, asset: Asset, isEssential?: boolean) => void;
  travelTrip: TravelTrip;
  toggleTravelItem: (itemId: string) => void;
  addTravelItem: (name: string, category: TravelTrip['items'][0]['category'], assetId?: string) => void;
  editTravelItem: (itemId: string, updates: { name: string; category?: TravelTrip['items'][0]['category']; assetId?: string }) => void;
  removeTravelItem: (itemId: string) => void;
  
  // Weather
  weather: WeatherData | null;
  isWeatherLoading: boolean;
  refreshWeather: (city?: string) => Promise<void>;
  
  // Care Module
  careRecipient: CareRecipientProfile;
  updateCareRecipient: (updates: Partial<CareRecipientProfile>) => void;
  medications: MedicationReminder[];
  updateMedicationStatus: (id: string, status: MedicationReminder['statusToday']) => void;
  addMedicationReminder: (reminder: Omit<MedicationReminder, 'id' | 'history' | 'statusToday'>) => void;
  updateMedicationReminder: (id: string, updates: Partial<MedicationReminder>) => void;
  deleteMedicationReminder: (id: string) => void;
  caregiverInstructions: CaregiverInstruction[];
  addCaregiverInstruction: (instruction: Omit<CaregiverInstruction, 'id' | 'dateCreated' | 'isAcknowledged'>) => void;
  acknowledgeInstruction: (id: string) => void;
  deleteCaregiverInstruction: (id: string) => void;
  careActivities: CareDailyActivity[];
  toggleCareActivity: (id: string) => void;
  addCareActivity: (act: Omit<CareDailyActivity, 'id'>) => void;
  
  // Notifications & User
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  resetAllToDemoData: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonStr: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ASSETS: 'owniq_assets_v1',
  CALENDAR: 'owniq_calendar_v1',
  ROUTINES: 'owniq_routines_v1',
  TRIP: 'owniq_trip_v1',
  MEDICATIONS: 'owniq_medications_v1',
  INSTRUCTIONS: 'owniq_instructions_v1',
  ACTIVITIES: 'owniq_activities_v1',
  RECIPIENT: 'owniq_recipient_v1',
  NOTIFICATIONS: 'owniq_notifications_v1',
  PROFILE: 'owniq_profile_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentModule, setCurrentModule] = useState<AppModule>('dashboard');
  const [careViewMode, setCareViewMode] = useState<CareViewMode>('recipient');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
  const [isQrScannerModalOpen, setIsQrScannerModalOpen] = useState(false);

  // Core state from storage with fallbacks
  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ASSETS);
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CALENDAR);
    return saved ? JSON.parse(saved) : INITIAL_CALENDAR_EVENTS;
  });

  const [departureRoutines, setDepartureRoutines] = useState<DepartureRoutine[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROUTINES);
    return saved ? JSON.parse(saved) : INITIAL_DEPARTURE_ROUTINES;
  });

  const [travelTrip, setTravelTrip] = useState<TravelTrip>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRIP);
    return saved ? JSON.parse(saved) : INITIAL_TRAVEL_TRIP;
  });

  const [medications, setMedications] = useState<MedicationReminder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_MEDICATION_REMINDERS;
  });

  const [caregiverInstructions, setCaregiverInstructions] = useState<CaregiverInstruction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INSTRUCTIONS);
    return saved ? JSON.parse(saved) : INITIAL_CAREGIVER_INSTRUCTIONS;
  });

  const [careActivities, setCareActivities] = useState<CareDailyActivity[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return saved ? JSON.parse(saved) : INITIAL_CARE_ACTIVITIES;
  });

  const [careRecipient, setCareRecipient] = useState<CareRecipientProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECIPIENT);
    return saved ? JSON.parse(saved) : INITIAL_CARE_RECIPIENT;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.city || parsed.city === 'San Francisco' || parsed.city === 'Bengaluru') {
          return { ...parsed, city: 'Vellore, Tamil Nadu', country: 'India' };
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USER_PROFILE;
  });

  // Weather state
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROUTINES, JSON.stringify(departureRoutines));
  }, [departureRoutines]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRIP, JSON.stringify(travelTrip));
  }, [travelTrip]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INSTRUCTIONS, JSON.stringify(caregiverInstructions));
  }, [caregiverInstructions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(careActivities));
  }, [careActivities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECIPIENT, JSON.stringify(careRecipient));
  }, [careRecipient]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
  }, [userProfile]);

  // Load weather on mount
  useEffect(() => {
    const targetCity = userProfile?.city && userProfile.city !== 'San Francisco'
      ? userProfile.city
      : 'Vellore, Tamil Nadu';
    refreshWeather(targetCity);
  }, []);

  const refreshWeather = async (city: string = 'Vellore, Tamil Nadu') => {
    setIsWeatherLoading(true);
    try {
      const data = await fetchLiveWeather(city);
      setWeather(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  // Asset Actions
  const addAsset = async (
    rawAsset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt' | 'documents' | 'maintenanceRecords' | 'usageLogs'>,
    initialDoc?: Omit<AssetDocument, 'id' | 'uploadDate'>
  ): Promise<Asset> => {
    const id = `asset_${Date.now()}`;
    const qrCode = await generateAssetQrCode(id, rawAsset.name, rawAsset.serialNumber || 'SN-UNKNOWN');

    const newAsset: Asset = {
      ...rawAsset,
      id,
      qrCodeUrl: qrCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documents: initialDoc ? [{ ...initialDoc, id: `doc_${Date.now()}`, uploadDate: new Date().toISOString().split('T')[0] }] : [],
      maintenanceRecords: [],
      usageLogs: [
        {
          id: `log_${Date.now()}`,
          assetId: id,
          date: new Date().toISOString().split('T')[0],
          durationMinutes: 60,
          usageType: 'Daily Work',
          notes: 'Asset registered in OwnIQ digital wallet.'
        }
      ]
    };

    setAssets(prev => [newAsset, ...prev]);

    // Send confirmation notification
    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      title: `Asset Registered: ${newAsset.name}`,
      message: `${newAsset.brand} ${newAsset.model} added to AI Asset Wallet with QR code generated.`,
      timestamp: 'Just now',
      type: 'system',
      isRead: false,
      targetModule: 'assets',
      priority: 'low'
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newAsset;
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets(prev => prev.map(a => a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a));
    if (selectedAsset?.id === id) {
      setSelectedAsset(prev => prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null);
    }
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
    if (selectedAsset?.id === id) {
      setSelectedAsset(null);
    }
  };

  const addDocumentToAsset = (assetId: string, doc: Omit<AssetDocument, 'id' | 'uploadDate'>) => {
    const newDoc: AssetDocument = {
      ...doc,
      id: `doc_${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0]
    };

    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        return {
          ...a,
          documents: [...a.documents, newDoc],
          updatedAt: new Date().toISOString()
        };
      }
      return a;
    }));
  };

  const addMaintenanceRecord = (assetId: string, record: Omit<MaintenanceRecord, 'id' | 'assetId'>) => {
    const newRecord: MaintenanceRecord = {
      ...record,
      id: `maint_${Date.now()}`,
      assetId
    };

    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        return {
          ...a,
          maintenanceRecords: [newRecord, ...a.maintenanceRecords],
          updatedAt: new Date().toISOString()
        };
      }
      return a;
    }));
  };

  const logAssetUsage = (assetId: string, usage: Omit<UsageLog, 'id' | 'assetId'>) => {
    const newLog: UsageLog = {
      ...usage,
      id: `use_${Date.now()}`,
      assetId
    };

    setAssets(prev => prev.map(a => {
      if (a.id === assetId) {
        return {
          ...a,
          lastUsedDate: usage.date,
          usageLogs: [newLog, ...a.usageLogs],
          updatedAt: new Date().toISOString()
        };
      }
      return a;
    }));
  };

  // Advisor Events & Checklist
  const addCalendarEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: `evt_${Date.now()}`
    };
    setCalendarEvents(prev => [...prev, newEvent]);
  };

  const toggleChecklistItem = (eventId: string, itemId: string) => {
    setCalendarEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          checklist: evt.checklist.map(item => 
            item.id === itemId ? { ...item, isPacked: !item.isPacked } : item
          )
        };
      }
      return evt;
    }));
  };

  const addCustomItemToEvent = (eventId: string, name: string) => {
    setCalendarEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          checklist: [
            ...evt.checklist,
            {
              id: `item_${Date.now()}`,
              name,
              isPacked: false,
              isEssential: false,
              reason: 'Custom item added by user'
            }
          ]
        };
      }
      return evt;
    }));
  };

  const editCalendarChecklistItem = (
    eventId: string,
    itemId: string,
    updates: { name: string; isEssential?: boolean; reason?: string; assetId?: string }
  ) => {
    setCalendarEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          checklist: evt.checklist.map(item =>
            item.id === itemId
              ? {
                  ...item,
                  name: updates.name.trim(),
                  isEssential: updates.isEssential !== undefined ? updates.isEssential : item.isEssential,
                  reason: updates.reason !== undefined ? updates.reason : item.reason,
                  assetId: updates.assetId !== undefined ? (updates.assetId || undefined) : item.assetId
                }
              : item
          )
        };
      }
      return evt;
    }));
  };

  const removeCalendarChecklistItem = (eventId: string, itemId: string) => {
    setCalendarEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          checklist: evt.checklist.filter(item => item.id !== itemId)
        };
      }
      return evt;
    }));
  };

  // Departure Routines
  const toggleRoutineItem = (routineId: string, itemId: string) => {
    setDepartureRoutines(prev => prev.map(rtn => {
      if (rtn.id === routineId) {
        return {
          ...rtn,
          items: rtn.items.map(i => i.id === itemId ? { ...i, isPacked: !i.isPacked } : i)
        };
      }
      return rtn;
    }));
  };

  const addCustomRoutineItem = (routineId: string, name: string, isEssential: boolean, assetId?: string) => {
    setDepartureRoutines(prev => prev.map(rtn => {
      if (rtn.id === routineId) {
        return {
          ...rtn,
          items: [
            ...rtn.items,
            {
              id: `ri_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              name,
              isPacked: false,
              isEssential,
              assetId: assetId || undefined
            }
          ]
        };
      }
      return rtn;
    }));
  };

  const editRoutineItem = (
    routineId: string,
    itemId: string,
    updates: { name: string; isEssential: boolean; assetId?: string }
  ) => {
    setDepartureRoutines(prev => prev.map(rtn => {
      if (rtn.id === routineId) {
        return {
          ...rtn,
          items: rtn.items.map(item =>
            item.id === itemId
              ? {
                  ...item,
                  name: updates.name.trim(),
                  isEssential: updates.isEssential,
                  assetId: updates.assetId || undefined
                }
              : item
          )
        };
      }
      return rtn;
    }));
  };

  const removeRoutineItem = (routineId: string, itemId: string) => {
    setDepartureRoutines(prev => prev.map(rtn => {
      if (rtn.id === routineId) {
        return {
          ...rtn,
          items: rtn.items.filter(item => item.id !== itemId)
        };
      }
      return rtn;
    }));
  };

  const addAssetToRoutine = (routineId: string, asset: Asset, isEssential: boolean = true) => {
    setDepartureRoutines(prev => prev.map(rtn => {
      if (rtn.id === routineId) {
        if (rtn.items.some(i => i.assetId === asset.id || i.name.toLowerCase() === asset.name.toLowerCase())) {
          return rtn;
        }
        return {
          ...rtn,
          items: [
            ...rtn.items,
            {
              id: `ri_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              name: asset.name,
              assetId: asset.id,
              isPacked: false,
              isEssential
            }
          ]
        };
      }
      return rtn;
    }));
  };

  // Travel Trip
  const toggleTravelItem = (itemId: string) => {
    setTravelTrip(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === itemId ? { ...item, isPacked: !item.isPacked } : item)
    }));
  };

  const addTravelItem = (name: string, category: TravelTrip['items'][0]['category'], assetId?: string) => {
    setTravelTrip(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: `ti_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          name,
          category,
          isPacked: false,
          assetId: assetId || undefined
        }
      ]
    }));
  };

  const editTravelItem = (
    itemId: string,
    updates: { name: string; category?: TravelTrip['items'][0]['category']; assetId?: string }
  ) => {
    setTravelTrip(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId
          ? {
              ...item,
              name: updates.name.trim(),
              category: updates.category || item.category,
              assetId: updates.assetId || item.assetId
            }
          : item
      )
    }));
  };

  const removeTravelItem = (itemId: string) => {
    setTravelTrip(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  // Care Recipient & Medications
  const updateCareRecipient = (updates: Partial<CareRecipientProfile>) => {
    setCareRecipient(prev => ({ ...prev, ...updates }));
  };

  const updateMedicationStatus = (id: string, status: MedicationReminder['statusToday']) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMedications(prev => prev.map(m => {
      if (m.id === id) {
        const historyEntry = {
          date: now.toISOString().split('T')[0],
          status: (status === 'taken' || status === 'snoozed' || status === 'missed') ? status : 'missed' as const,
          timestamp: timeStr,
          loggedBy: careViewMode === 'caregiver' ? 'caregiver' as const : 'recipient' as const
        };
        return {
          ...m,
          statusToday: status,
          takenAt: status === 'taken' ? now.toISOString() : m.takenAt,
          history: [historyEntry, ...m.history]
        };
      }
      return m;
    }));

    // If caregiver view or if notification configured
    if (status === 'taken') {
      const med = medications.find(m => m.id === id);
      const newNotif: AppNotification = {
        id: `notif_${Date.now()}`,
        title: `Care Adherence: ${med?.name || 'Medication'} Taken`,
        message: `${careRecipient.preferredName} confirmed medication at ${timeStr}.`,
        timestamp: 'Just now',
        type: 'care-medication',
        isRead: false,
        targetModule: 'care',
        priority: 'low'
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const addMedicationReminder = (reminder: Omit<MedicationReminder, 'id' | 'history' | 'statusToday'>) => {
    const newMed: MedicationReminder = {
      ...reminder,
      id: `med_${Date.now()}`,
      statusToday: 'pending',
      history: []
    };
    setMedications(prev => [...prev, newMed]);
  };

  const updateMedicationReminder = (id: string, updates: Partial<MedicationReminder>) => {
    setMedications(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteMedicationReminder = (id: string) => {
    setMedications(prev => prev.filter(m => m.id !== id));
  };

  const addCaregiverInstruction = (instruction: Omit<CaregiverInstruction, 'id' | 'dateCreated' | 'isAcknowledged'>) => {
    const newInstr: CaregiverInstruction = {
      ...instruction,
      id: `instr_${Date.now()}`,
      dateCreated: new Date().toISOString(),
      isAcknowledged: false
    };
    setCaregiverInstructions(prev => [newInstr, ...prev]);
  };

  const acknowledgeInstruction = (id: string) => {
    setCaregiverInstructions(prev => prev.map(inst => 
      inst.id === id ? { ...inst, isAcknowledged: true, acknowledgedAt: new Date().toISOString() } : inst
    ));
  };

  const deleteCaregiverInstruction = (id: string) => {
    setCaregiverInstructions(prev => prev.filter(inst => inst.id !== id));
  };

  const toggleCareActivity = (id: string) => {
    setCareActivities(prev => prev.map(act => {
      if (act.id === id) {
        const nextCompleted = !act.isCompleted;
        return {
          ...act,
          isCompleted: nextCompleted,
          completedAt: nextCompleted ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined
        };
      }
      return act;
    }));
  };

  const addCareActivity = (act: Omit<CareDailyActivity, 'id'>) => {
    const newAct: CareDailyActivity = {
      ...act,
      id: `act_${Date.now()}`
    };
    setCareActivities(prev => [...prev, newAct]);
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const resetAllToDemoData = () => {
    setAssets(INITIAL_ASSETS);
    setCalendarEvents(INITIAL_CALENDAR_EVENTS);
    setDepartureRoutines(INITIAL_DEPARTURE_ROUTINES);
    setTravelTrip(INITIAL_TRAVEL_TRIP);
    setMedications(INITIAL_MEDICATION_REMINDERS);
    setCaregiverInstructions(INITIAL_CAREGIVER_INSTRUCTIONS);
    setCareActivities(INITIAL_CARE_ACTIVITIES);
    setCareRecipient(INITIAL_CARE_RECIPIENT);
    setNotifications(INITIAL_NOTIFICATIONS);
    setUserProfile(INITIAL_USER_PROFILE);
    localStorage.clear();
  };

  const exportDataJson = () => {
    const data = {
      assets,
      calendarEvents,
      departureRoutines,
      travelTrip,
      medications,
      caregiverInstructions,
      careActivities,
      careRecipient,
      notifications,
      userProfile,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.assets) setAssets(data.assets);
      if (data.calendarEvents) setCalendarEvents(data.calendarEvents);
      if (data.departureRoutines) setDepartureRoutines(data.departureRoutines);
      if (data.travelTrip) setTravelTrip(data.travelTrip);
      if (data.medications) setMedications(data.medications);
      if (data.caregiverInstructions) setCaregiverInstructions(data.caregiverInstructions);
      if (data.careActivities) setCareActivities(data.careActivities);
      if (data.careRecipient) setCareRecipient(data.careRecipient);
      if (data.userProfile) setUserProfile(data.userProfile);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  return (
    <AppContext.Provider value={{
      currentModule,
      setCurrentModule,
      careViewMode,
      setCareViewMode,
      searchQuery,
      setSearchQuery,
      selectedAsset,
      setSelectedAsset,
      isAddAssetModalOpen,
      setIsAddAssetModalOpen,
      isQrScannerModalOpen,
      setIsQrScannerModalOpen,
      assets,
      addAsset,
      updateAsset,
      deleteAsset,
      addDocumentToAsset,
      addMaintenanceRecord,
      logAssetUsage,
      calendarEvents,
      addCalendarEvent,
      toggleChecklistItem,
      addCustomItemToEvent,
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
      isWeatherLoading,
      refreshWeather,
      careRecipient,
      updateCareRecipient,
      medications,
      updateMedicationStatus,
      addMedicationReminder,
      updateMedicationReminder,
      deleteMedicationReminder,
      caregiverInstructions,
      addCaregiverInstruction,
      acknowledgeInstruction,
      deleteCaregiverInstruction,
      careActivities,
      toggleCareActivity,
      addCareActivity,
      notifications,
      markNotificationRead,
      clearAllNotifications,
      userProfile,
      updateUserProfile,
      resetAllToDemoData,
      exportDataJson,
      importDataJson
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
