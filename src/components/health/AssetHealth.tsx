import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Asset, MaintenanceRecord } from '../../types';
import { 
  Activity, 
  ShieldCheck, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  DollarSign, 
  Info, 
  Sparkles, 
  Plus, 
  ChevronRight,
  ShieldAlert,
  FileCheck
} from 'lucide-react';

export const AssetHealth: React.FC = () => {
  const { assets, setSelectedAsset, addMaintenanceRecord } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'expiring' | 'maintenance-due' | 'insured'>('all');
  const [selectedAssetForMaint, setSelectedAssetForMaint] = useState<string>('');

  // Quick maintenance modal state
  const [showLogModal, setShowLogModal] = useState(false);
  const [maintTitle, setMaintTitle] = useState('');
  const [maintCost, setMaintCost] = useState(0);
  const [maintProvider, setMaintProvider] = useState('');
  const [maintType, setMaintType] = useState<any>('Routine Inspection');
  const [maintNotes, setMaintNotes] = useState('');

  const now = new Date();

  // Compute Health Metrics for each asset
  const healthData = useMemo(() => {
    return assets.map(asset => {
      let score = 100;
      let warrantyStatus: 'active' | 'expiring-soon' | 'expired' | 'no-warranty' = 'no-warranty';
      let insuranceStatus: 'active' | 'expiring-soon' | 'expired' | 'no-insurance' = 'no-insurance';
      let maintenanceStatus: 'up-to-date' | 'due-soon' | 'overdue' = 'up-to-date';
      let daysUntilWarranty: number | undefined = undefined;
      let daysUntilInsurance: number | undefined = undefined;

      // Warranty calculation
      if (asset.warrantyExpiryDate) {
        const exp = new Date(asset.warrantyExpiryDate);
        daysUntilWarranty = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilWarranty < 0) {
          warrantyStatus = 'expired';
          score -= 20;
        } else if (daysUntilWarranty <= 60) {
          warrantyStatus = 'expiring-soon';
          score -= 10;
        } else {
          warrantyStatus = 'active';
        }
      } else {
        score -= 15;
      }

      // Insurance calculation
      if (asset.insuranceExpiryDate) {
        const exp = new Date(asset.insuranceExpiryDate);
        daysUntilInsurance = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilInsurance < 0) {
          insuranceStatus = 'expired';
          score -= 15;
        } else if (daysUntilInsurance <= 60) {
          insuranceStatus = 'expiring-soon';
        } else {
          insuranceStatus = 'active';
        }
      }

      // Condition penalty
      if (asset.condition === 'Fair') score -= 15;
      if (asset.condition === 'Needs Service') score -= 30;
      if (asset.condition === 'Damaged') score -= 50;

      // Maintenance overdue check
      const pendingMaint = asset.maintenanceRecords.find(r => !r.isCompleted);
      if (pendingMaint) {
        maintenanceStatus = 'due-soon';
        score -= 10;
      }

      // Clamp score
      const finalScore = Math.max(10, Math.min(score, 100));

      return {
        asset,
        healthScore: finalScore,
        warrantyStatus,
        insuranceStatus,
        maintenanceStatus,
        daysUntilWarranty,
        daysUntilInsurance
      };
    });
  }, [assets]);

  // Overall counts
  const expiringWarrantiesCount = healthData.filter(h => h.warrantyStatus === 'expiring-soon').length;
  const expiredWarrantiesCount = healthData.filter(h => h.warrantyStatus === 'expired').length;
  const totalInsuredCount = healthData.filter(h => h.insuranceStatus === 'active').length;
  const pendingMaintenanceCount = healthData.filter(h => h.asset.maintenanceRecords.some(r => !r.isCompleted)).length;

  const filteredHealth = useMemo(() => {
    return healthData.filter(h => {
      if (filterType === 'expiring') return h.warrantyStatus === 'expiring-soon' || h.warrantyStatus === 'expired';
      if (filterType === 'maintenance-due') return h.maintenanceStatus === 'due-soon' || h.asset.maintenanceRecords.length > 0;
      if (filterType === 'insured') return h.insuranceStatus === 'active';
      return true;
    });
  }, [healthData, filterType]);

  const handleSaveMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetForMaint || !maintTitle.trim()) return;

    addMaintenanceRecord(selectedAssetForMaint, {
      title: maintTitle.trim(),
      date: new Date().toISOString().split('T')[0],
      cost: Number(maintCost) || 0,
      provider: maintProvider.trim() || 'Self-Service',
      notes: maintNotes.trim(),
      isCompleted: true,
      type: maintType
    });

    setMaintTitle('');
    setMaintCost(0);
    setMaintNotes('');
    setShowLogModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-indigo-300">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Asset Health • Protection & Lifecycle Deadlines</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Maintain Possessions. Prevent Costly Failures.
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Real-time monitoring of warranty expiry dates, insurance renewals, and manufacturer-recommended maintenance schedules.
            </p>
          </div>

          <button
            onClick={() => {
              if (assets[0]) setSelectedAssetForMaint(assets[0].id);
              setShowLogModal(true);
            }}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Log Service / Repair</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10">
          <div>
            <div className="text-xs text-slate-400">Expiring Warranties (&lt;60d)</div>
            <div className="text-2xl font-extrabold text-amber-400 mt-0.5">{expiringWarrantiesCount} items</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Expired Coverage</div>
            <div className="text-2xl font-extrabold text-rose-400 mt-0.5">{expiredWarrantiesCount} items</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Active Insurances</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-0.5">{totalInsuredCount} protected</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Pending Inspections</div>
            <div className="text-2xl font-extrabold text-indigo-300 mt-0.5">{pendingMaintenanceCount} scheduled</div>
          </div>
        </div>
      </div>

      {/* Critical Verification Notice on Predictive vs Scheduled */}
      <div className="p-4 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Ownership Integrity & Method Transparency:
          </span>
          <p className="text-slate-600 dark:text-slate-400">
            OwnIQ clearly distinguishes scheduled manufacturer maintenance timelines from predictive diagnostics. We never claim an asset failure has been predicted unless supported by authorized IoT telemetry and validated data.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: `All Assets (${healthData.length})` },
          { id: 'expiring', label: `Warranties Expiring / Expired (${expiringWarrantiesCount + expiredWarrantiesCount})` },
          { id: 'maintenance-due', label: 'Maintenance Log & Schedules' },
          { id: 'insured', label: `Insurance Monitored (${totalInsuredCount})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterType === tab.id
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Health Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHealth.map(({ asset, healthScore, warrantyStatus, insuranceStatus, daysUntilWarranty, daysUntilInsurance }) => (
          <div
            key={asset.id}
            onClick={() => setSelectedAsset(asset)}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer group space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                  {asset.imageUrl ? (
                    <img src={asset.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ShieldCheck className="w-6 h-6 text-slate-400 m-auto mt-3" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                    {asset.name}
                  </h3>
                  <div className="text-xs text-slate-400">{asset.brand} • {asset.category}</div>
                </div>
              </div>

              {/* Health Score Pill */}
              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-semibold">Health Score</div>
                <div className={`text-xl font-extrabold ${
                  healthScore >= 80 ? 'text-emerald-600' : healthScore >= 60 ? 'text-amber-500' : 'text-rose-500'
                }`}>
                  {healthScore}/100
                </div>
              </div>
            </div>

            {/* Status Breakdown Chips */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Warranty */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] text-slate-400">Warranty Coverage</div>
                {warrantyStatus === 'active' && (
                  <div className="font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active ({daysUntilWarranty}d left)</span>
                  </div>
                )}
                {warrantyStatus === 'expiring-soon' && (
                  <div className="font-semibold text-amber-600 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Expiring in {daysUntilWarranty}d</span>
                  </div>
                )}
                {warrantyStatus === 'expired' && (
                  <div className="font-semibold text-rose-500 flex items-center gap-1 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Expired {asset.warrantyExpiryDate}</span>
                  </div>
                )}
                {warrantyStatus === 'no-warranty' && (
                  <div className="text-slate-400 mt-0.5">No warranty logged</div>
                )}
              </div>

              {/* Insurance */}
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="text-[10px] text-slate-400">Insurance Policy</div>
                {asset.insuranceProvider ? (
                  <div className="font-semibold text-indigo-600 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="truncate">{asset.insuranceProvider}</span>
                  </div>
                ) : (
                  <div className="text-slate-400 mt-0.5">No policy attached</div>
                )}
              </div>
            </div>

            {/* Upcoming / Last Maintenance Summary */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5 text-slate-400" />
                <span>{asset.maintenanceRecords.length} service records recorded</span>
              </span>
              <span className="font-semibold text-indigo-600 flex items-center gap-0.5">
                View Passport <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Log Service Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-indigo-600" />
              <span>Log Maintenance / Service Record</span>
            </h3>

            <form onSubmit={handleSaveMaintenance} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Registered Asset
                </label>
                <select
                  value={selectedAssetForMaint}
                  onChange={(e) => setSelectedAssetForMaint(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.brand})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brake Pad Replacement, Oil Change, Firmware Upgrade"
                  value={maintTitle}
                  onChange={(e) => setMaintTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cost in INR (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={maintCost || ''}
                    onChange={(e) => setMaintCost(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Service Type
                  </label>
                  <select
                    value={maintType}
                    onChange={(e) => setMaintType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="Routine Inspection">Routine Inspection</option>
                    <option value="Cleaning / Servicing">Cleaning / Servicing</option>
                    <option value="Repair">Repair</option>
                    <option value="Battery Replacement">Battery Replacement</option>
                    <option value="Software / Firmware">Software / Firmware</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Service Provider / Workshop
                </label>
                <input
                  type="text"
                  placeholder="e.g. Authorized Dealer, Genius Bar, Self"
                  value={maintProvider}
                  onChange={(e) => setMaintProvider(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Technician Notes / Findings
                </label>
                <textarea
                  placeholder="Parts changed, diagnostic results, next scheduled visit"
                  value={maintNotes}
                  onChange={(e) => setMaintNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 text-xs text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
