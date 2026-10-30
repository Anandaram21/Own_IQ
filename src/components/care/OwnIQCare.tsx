import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MedicationReminder, 
  CaregiverInstruction, 
  CareDailyActivity 
} from '../../types';
import { speakAloud, stopSpeaking } from '../../services/speechService';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  Clock, 
  Calendar, 
  Sun, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  PhoneCall, 
  User, 
  ShieldCheck, 
  Smile, 
  Sparkles, 
  Pill, 
  MessageSquare, 
  Layers, 
  Sliders, 
  Trash2, 
  ArrowRight,
  Info,
  Search,
  X
} from 'lucide-react';

export const OwnIQCare: React.FC = () => {
  const { 
    careViewMode, 
    setCareViewMode, 
    careRecipient, 
    updateCareRecipient,
    medications, 
    updateMedicationStatus, 
    addMedicationReminder, 
    deleteMedicationReminder,
    caregiverInstructions, 
    addCaregiverInstruction, 
    acknowledgeInstruction, 
    deleteCaregiverInstruction,
    careActivities, 
    toggleCareActivity, 
    addCareActivity,
    userProfile 
  } = useApp();

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeCareTab, setActiveCareTab] = useState<'timeline' | 'meds' | 'instructions'>('timeline');
  const [careSearch, setCareSearch] = useState('');

  // Search filtering
  const q = careSearch.trim().toLowerCase();
  const filteredMedications = medications.filter(med => {
    if (!q) return true;
    return (
      med.name.toLowerCase().includes(q) ||
      med.timingDescription.toLowerCase().includes(q) ||
      med.instructions.toLowerCase().includes(q) ||
      med.caregiverNotes?.toLowerCase().includes(q) ||
      med.pillVisual?.label?.toLowerCase().includes(q)
    );
  });

  const filteredCareActivities = careActivities.filter(act => {
    if (!q) return true;
    return (
      act.title.toLowerCase().includes(q) ||
      act.description.toLowerCase().includes(q) ||
      act.time.toLowerCase().includes(q) ||
      act.category.toLowerCase().includes(q)
    );
  });

  const filteredInstructions = caregiverInstructions.filter(inst => {
    if (!q) return true;
    return (
      inst.title.toLowerCase().includes(q) ||
      inst.message.toLowerCase().includes(q) ||
      inst.caregiverName.toLowerCase().includes(q) ||
      inst.category.toLowerCase().includes(q)
    );
  });

  // Caregiver form state: Add Medication
  const [showAddMed, setShowAddMed] = useState(false);
  const [medName, setMedName] = useState('');
  const [medTiming, setMedTiming] = useState('08:00 AM');
  const [medTimeRaw, setMedTimeRaw] = useState('08:00');
  const [medInstructions, setMedInstructions] = useState('');
  const [medColor, setMedColor] = useState('#f43f5e');
  const [medShape, setMedShape] = useState<'round' | 'oval' | 'capsule' | 'dropper'>('round');
  const [medNotes, setMedNotes] = useState('');

  // Caregiver form state: Add Instruction
  const [showAddInstr, setShowAddInstr] = useState(false);
  const [instrTitle, setInstrTitle] = useState('');
  const [instrCategory, setInstrCategory] = useState<CaregiverInstruction['category']>('Daily Activity');
  const [instrMessage, setInstrMessage] = useState('');
  const [instrPriority, setInstrPriority] = useState<CaregiverInstruction['priority']>('normal');

  // Caregiver form state: Add Activity
  const [showAddAct, setShowAddAct] = useState(false);
  const [actTitle, setActTitle] = useState('');
  const [actTime, setActTime] = useState('11:00 AM');
  const [actDesc, setActDesc] = useState('');
  const [actCat, setActCat] = useState<CareDailyActivity['category']>('exercise');

  const triggerCelebration = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.7 }
    });
  };

  const handleSpeak = (text: string) => {
    setIsSpeaking(true);
    speakAloud(text, () => setIsSpeaking(false));
  };

  const handleStopSpeaking = () => {
    stopSpeaking();
    setIsSpeaking(false);
  };

  const handleSaveMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName.trim()) return;

    addMedicationReminder({
      name: medName.trim(),
      timingDescription: `${medTiming} (${medTimeRaw})`,
      scheduledTime: medTimeRaw,
      instructions: medInstructions.trim() || 'Take with water according to care instructions.',
      pillVisual: {
        shape: medShape,
        color: medColor,
        label: medName.substring(0, 3).toUpperCase()
      },
      caregiverNotes: medNotes.trim() || 'Follow prescribed medical directions.',
      notifyCaregiverIfMissed: true
    });

    setMedName('');
    setMedInstructions('');
    setMedNotes('');
    setShowAddMed(false);
  };

  const handleSaveInstruction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instrTitle.trim() || !instrMessage.trim()) return;

    addCaregiverInstruction({
      title: instrTitle.trim(),
      category: instrCategory,
      message: instrMessage.trim(),
      caregiverName: 'David Vance',
      caregiverRole: 'Son & Caregiver',
      priority: instrPriority
    });

    setInstrTitle('');
    setInstrMessage('');
    setShowAddInstr(false);
  };

  const handleSaveActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTitle.trim()) return;

    addCareActivity({
      title: actTitle.trim(),
      time: actTime.trim(),
      description: actDesc.trim(),
      category: actCat,
      isCompleted: false,
      audioPromptText: `Eleanor, time for: ${actTitle}.`
    });

    setActTitle('');
    setActDesc('');
    setShowAddAct(false);
  };

  const adherenceScore = Math.round(
    (medications.filter(m => m.statusToday === 'taken').length / Math.max(1, medications.length)) * 100
  );

  return (
    <div className="space-y-6">
      {/* Module Brand Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-rose-300">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>OwnIQ Care • Memory & Daily Support</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              “Remembering Life, Together.”
            </h1>
            <p className="text-sm text-rose-100/80 max-w-2xl">
              Thoughtfully engineered for elderly individuals, dementia memory care, and authorized family caregivers. Reassuring routines, adherence reminders, and peaceful daily guidance.
            </p>
          </div>

          {/* Perspective Switcher */}
          <div className="p-1.5 bg-black/40 backdrop-blur-md rounded-2xl border border-white/15 flex items-center gap-1 self-start md:self-auto">
            <button
              onClick={() => setCareViewMode('recipient')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                careViewMode === 'recipient'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Care Recipient View</span>
            </button>
            <button
              onClick={() => setCareViewMode('caregiver')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                careViewMode === 'caregiver'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Caregiver Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* STRICT REGULATORY & SAFETY NOTICE */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-amber-900 dark:text-amber-200">
            Adherence Reminder & Safety Notice:
          </span>
          <p className="text-amber-800 dark:text-amber-300">
            OwnIQ Care provides reminder timing and routine adherence support only. It strictly does NOT calculate, prescribe, or recommend medication dosages. All routines reflect plans entered and verified by authorized caregivers and physicians.
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* PERSPECTIVE 1: CARE RECIPIENT VIEW (DEMENTIA FRIENDLY)       */}
      {/* ============================================================ */}
      {careViewMode === 'recipient' && (
        <div className="space-y-6">
          {/* Orientation Board: Large text, high contrast, date, weather, peace */}
          <div className="bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl border-2 border-rose-200 dark:border-rose-900/60 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs uppercase font-extrabold tracking-widest text-rose-600 dark:text-rose-400">
                  Today's Orientation
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                  {careRecipient.todayOrientation.greeting}
                </h2>
                <p className="text-base sm:text-lg font-medium text-slate-700 dark:text-slate-200 pt-1">
                  Today is <span className="font-bold text-rose-600 dark:text-rose-400">Monday, October 26</span>. You are safe at home in your sunny sunroom.
                </p>
              </div>

              {/* Speak Aloud Assistance Button */}
              <button
                onClick={() => {
                  if (isSpeaking) {
                    handleStopSpeaking();
                  } else {
                    handleSpeak(`${careRecipient.todayOrientation.greeting}. Today is Monday, October 26. ${careRecipient.todayOrientation.weatherSummary} ${careRecipient.todayOrientation.peacefulMessage}`);
                  }
                }}
                className={`px-5 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all self-start sm:self-auto ${
                  isSpeaking 
                    ? 'bg-rose-700 text-white animate-pulse' 
                    : 'bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-300 border-2 border-rose-300 dark:border-rose-700 hover:bg-rose-50'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                <span>{isSpeaking ? 'Pause Voice' : 'Read Aloud To Me'}</span>
              </button>
            </div>

            {/* Peaceful message card */}
            <div className="p-4 bg-white/80 dark:bg-slate-800/80 rounded-2xl border border-rose-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm sm:text-base flex items-center gap-3">
              <Smile className="w-6 h-6 text-rose-500 shrink-0" />
              <span>{careRecipient.todayOrientation.peacefulMessage}</span>
            </div>
          </div>

          {/* Care Reminders Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reminders by medication name, timing, instructions, or doctor note..."
              value={careSearch}
              onChange={(e) => setCareSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm placeholder:text-slate-400"
            />
            {careSearch && (
              <button
                onClick={() => setCareSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Care Sub-Nav */}
          <div className="flex gap-2">
            {[
              { id: 'timeline', label: "Today's Schedule & Routine", count: careActivities.length },
              { id: 'meds', label: 'My Medication Reminders', count: medications.length },
              { id: 'instructions', label: 'Notes From Family & Doctors', count: caregiverInstructions.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCareTab(tab.id as any)}
                className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-base font-bold transition-all text-center ${
                  activeCareTab === tab.id
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-500/20'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* SUB-VIEW 1: DAILY ROUTINE TIMELINE */}
          {activeCareTab === 'timeline' && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Step-by-step Daily Activities
              </div>

              <div className="space-y-3">
                {filteredCareActivities.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <p className="font-semibold text-slate-600 dark:text-slate-300">No scheduled activities matched "{careSearch}"</p>
                    <button onClick={() => setCareSearch('')} className="text-rose-600 hover:underline font-semibold">Clear search</button>
                  </div>
                ) : (
                  filteredCareActivities.map(activity => (
                  <div
                    key={activity.id}
                    className={`p-5 sm:p-6 rounded-3xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      activity.isCompleted
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-400'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-center shrink-0 min-w-16">
                        <span className="text-xs sm:text-sm font-extrabold text-slate-600 dark:text-slate-300 block">
                          {activity.time}
                        </span>
                        {activity.isCompleted ? (
                          <span className="text-[11px] font-bold text-emerald-600 block mt-1">Completed</span>
                        ) : (
                          <span className="text-[11px] font-semibold text-rose-500 block mt-1">Scheduled</span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h3 className={`text-base sm:text-xl font-bold ${activity.isCompleted ? 'text-slate-500 line-through' : 'text-slate-900 dark:text-white'}`}>
                          {activity.title}
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                          {activity.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {activity.audioPromptText && (
                        <button
                          onClick={() => handleSpeak(activity.audioPromptText!)}
                          className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 rounded-2xl"
                          title="Listen to instruction"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (!activity.isCompleted) triggerCelebration();
                          toggleCareActivity(activity.id);
                        }}
                        className={`px-6 py-3.5 rounded-2xl text-sm sm:text-base font-extrabold flex items-center gap-2 transition-all active:scale-95 ${
                          activity.isCompleted
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                            : 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30'
                        }`}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>{activity.isCompleted ? 'Finished ✓' : 'I Did This!'}</span>
                      </button>
                    </div>
                  </div>
                )))}
              </div>
            </div>
          )}

          {/* SUB-VIEW 2: MEDICATION REMINDERS (LARGE VISUAL PILLS) */}
          {activeCareTab === 'meds' && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Scheduled Medication Reminders (Verified by Physician)
              </div>

              <div className="space-y-4">
                {filteredMedications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <p className="font-semibold text-slate-600 dark:text-slate-300">No medication reminders matched "{careSearch}"</p>
                    <button onClick={() => setCareSearch('')} className="text-rose-600 hover:underline font-semibold">Clear search</button>
                  </div>
                ) : (
                  filteredMedications.map(med => (
                  <div
                    key={med.id}
                    className={`p-6 rounded-3xl border-2 transition-all ${
                      med.statusToday === 'taken'
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                        : med.statusToday === 'snoozed'
                        ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800'
                        : 'bg-white dark:bg-slate-900 border-rose-200 dark:border-rose-900'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-start gap-4">
                        {/* Pill Visual Display */}
                        <div 
                          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-extrabold shadow-md shrink-0"
                          style={{ backgroundColor: med.pillVisual.color }}
                        >
                          <Pill className="w-8 h-8" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {med.timingDescription}
                            </span>
                            {med.statusToday === 'taken' && (
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                Taken at {med.history[0]?.timestamp || 'Scheduled Time'}
                              </span>
                            )}
                          </div>

                          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                            {med.name}
                          </h3>
                          <p className="text-sm sm:text-base font-medium text-slate-700 dark:text-slate-300">
                            {med.instructions}
                          </p>
                          <div className="text-xs text-slate-500 italic">
                            Caregiver Note: “{med.caregiverNotes}”
                          </div>
                        </div>
                      </div>

                      {/* Large Action Buttons */}
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => handleSpeak(`${med.name}. ${med.instructions}`)}
                          className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl"
                          title="Read instructions aloud"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>

                        {med.statusToday !== 'taken' && (
                          <button
                            onClick={() => updateMedicationStatus(med.id, 'snoozed')}
                            className="px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-2xl"
                          >
                            Remind in 15m
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (med.statusToday !== 'taken') triggerCelebration();
                            updateMedicationStatus(med.id, med.statusToday === 'taken' ? 'pending' : 'taken');
                          }}
                          className={`px-6 py-3.5 rounded-2xl text-sm sm:text-base font-extrabold flex items-center gap-2 transition-all active:scale-95 ${
                            med.statusToday === 'taken'
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                              : 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30'
                          }`}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                          <span>{med.statusToday === 'taken' ? 'Taken ✓' : 'I Took This'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )))}
              </div>
            </div>
          )}

          {/* SUB-VIEW 3: CAREGIVER INSTRUCTIONS & FAMILY MESSAGES */}
          {activeCareTab === 'instructions' && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                Messages & Notes From Your Family
              </div>

              <div className="space-y-4">
                {filteredInstructions.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <p className="font-semibold text-slate-600 dark:text-slate-300">No doctor or family notes matched "{careSearch}"</p>
                    <button onClick={() => setCareSearch('')} className="text-rose-600 hover:underline font-semibold">Clear search</button>
                  </div>
                ) : (
                  filteredInstructions.map(instr => (
                  <div
                    key={instr.id}
                    className="p-6 bg-white dark:bg-slate-900 rounded-3xl border-2 border-rose-100 dark:border-slate-800 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                            {instr.category}
                          </span>
                          <span className="text-xs text-slate-400">• From {instr.caregiverName} ({instr.caregiverRole})</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
                          {instr.title}
                        </h3>
                      </div>

                      <button
                        onClick={() => handleSpeak(`${instr.title}. ${instr.message}`)}
                        className="p-2.5 bg-rose-50 dark:bg-rose-950 text-rose-600 rounded-xl shrink-0"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed bg-rose-50/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-rose-100 dark:border-slate-700">
                      {instr.message}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-slate-400">
                        {instr.isAcknowledged ? `Acknowledged by you` : 'Please read when ready'}
                      </span>
                      <button
                        onClick={() => acknowledgeInstruction(instr.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                          instr.isAcknowledged
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-600 text-white hover:bg-rose-700'
                        }`}
                      >
                        {instr.isAcknowledged ? 'Thank You, Read ✓' : 'Confirm I Read This'}
                      </button>
                    </div>
                  </div>
                )))}
              </div>
            </div>
          )}

          {/* Quick Caregiver Emergency Reassurance Bar */}
          <div className="bg-gradient-to-r from-slate-900 to-rose-950 text-white p-6 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                <PhoneCall className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Need assistance or want to talk?</h3>
                <p className="text-xs text-rose-200">
                  {careRecipient.emergencyContact.name} ({careRecipient.emergencyContact.relationship}) is available.
                </p>
              </div>
            </div>

            <a
              href={`tel:${careRecipient.emergencyContact.phone}`}
              className="px-6 py-3 bg-white text-rose-700 hover:bg-rose-50 font-extrabold text-sm sm:text-base rounded-2xl shadow-md transition-colors"
            >
              Call {careRecipient.emergencyContact.name.split(' ')[0]} Now
            </a>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* PERSPECTIVE 2: CAREGIVER DASHBOARD                           */}
      {/* ============================================================ */}
      {careViewMode === 'caregiver' && (
        <div className="space-y-6">
          {/* Caregiver Overview Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs text-slate-400 font-semibold">Today's Adherence Rate</div>
              <div className="text-3xl font-extrabold text-emerald-600 mt-1">{adherenceScore}%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Medications taken on schedule</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs text-slate-400 font-semibold">Active Medications</div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{medications.length}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Configured reminders</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs text-slate-400 font-semibold">Caregiver Instructions</div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{caregiverInstructions.length}</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Notes displayed to Eleanor</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-xs text-slate-400 font-semibold">Routine Activities</div>
              <div className="text-3xl font-extrabold text-rose-600 mt-1">
                {careActivities.filter(a => a.isCompleted).length} / {careActivities.length}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Activities acknowledged</div>
            </div>
          </div>

          {/* Quick Action Buttons for Caregiver */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddMed(true)}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Medication Schedule
            </button>
            <button
              onClick={() => setShowAddInstr(true)}
              className="px-4 py-2.5 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Care Instruction Note
            </button>
            <button
              onClick={() => setShowAddAct(true)}
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Daily Activity
            </button>
          </div>

          {/* Caregiver Modals */}
          {/* 1. Add Med Modal */}
          {showAddMed && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Pill className="w-5 h-5 text-rose-600" />
                  <span>Configure Medication Reminder</span>
                </h3>
                <form onSubmit={handleSaveMedication} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Medication Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lisinopril, Vitamin D3, Eye Drops"
                      value={medName}
                      onChange={(e) => setMedName(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Scheduled Time</label>
                      <input
                        type="time"
                        value={medTimeRaw}
                        onChange={(e) => setMedTimeRaw(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Timing Description</label>
                      <input
                        type="text"
                        placeholder="e.g. Morning with Breakfast"
                        value={medTiming}
                        onChange={(e) => setMedTiming(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Instructions for Recipient</label>
                    <input
                      type="text"
                      placeholder="e.g. Take 1 tablet with a tall glass of water after meal"
                      value={medInstructions}
                      onChange={(e) => setMedInstructions(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Pill Shape</label>
                      <select
                        value={medShape}
                        onChange={(e) => setMedShape(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
                      >
                        <option value="round">Round Tablet</option>
                        <option value="oval">Oval Softgel</option>
                        <option value="capsule">Two-Tone Capsule</option>
                        <option value="dropper">Liquid / Eye Dropper</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Pill Color Badge</label>
                      <input
                        type="color"
                        value={medColor}
                        onChange={(e) => setMedColor(e.target.value)}
                        className="w-full h-9 p-1 bg-slate-50 dark:bg-slate-800 border rounded-xl cursor-pointer"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Caregiver Private Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Dr. Patel instruction, verify hydration"
                      value={medNotes}
                      onChange={(e) => setMedNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setShowAddMed(false)} className="px-4 py-2 text-xs text-slate-500">Cancel</button>
                    <button type="submit" className="px-5 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl">Save Reminder</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 2. Add Instruction Modal */}
          {showAddInstr && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-lg w-full space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-rose-600" />
                  <span>Create Caregiver Instruction</span>
                </h3>
                <form onSubmit={handleSaveInstruction} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Note Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Grandchildren visiting at 3 PM, Wear warm cardigan"
                      value={instrTitle}
                      onChange={(e) => setInstrTitle(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                      <select
                        value={instrCategory}
                        onChange={(e) => setInstrCategory(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
                      >
                        <option value="Daily Activity">Daily Activity</option>
                        <option value="Appointment">Appointment</option>
                        <option value="Personal Care">Personal Care</option>
                        <option value="Meal Reminder">Meal Reminder</option>
                        <option value="Family Message">Family Message</option>
                        <option value="Gentle Note">Gentle Note</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                      <select
                        value={instrPriority}
                        onChange={(e) => setInstrPriority(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
                      >
                        <option value="normal">Normal</option>
                        <option value="important">Important</option>
                        <option value="loving-note">Loving Family Note</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Message Body *</label>
                    <textarea
                      required
                      placeholder="Warm, reassuring explanation displayed to recipient"
                      value={instrMessage}
                      onChange={(e) => setInstrMessage(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border rounded-xl"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setShowAddInstr(false)} className="px-4 py-2 text-xs text-slate-500">Cancel</button>
                    <button type="submit" className="px-5 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl">Save Note</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Adherence Audit Logs & History */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Medication Adherence History Log
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredMedications.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  No medication records matched "{careSearch}".
                </div>
              ) : (
                filteredMedications.map(med => (
                <div key={med.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: med.pillVisual.color }}></div>
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{med.name}</span>
                      <span className="text-slate-400 ml-2">({med.timingDescription})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${
                      med.statusToday === 'taken' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {med.statusToday === 'taken' ? 'Confirmed Taken' : 'Pending'}
                    </span>
                    <button
                      onClick={() => deleteMedicationReminder(med.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
