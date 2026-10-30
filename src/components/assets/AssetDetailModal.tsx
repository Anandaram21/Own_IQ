import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Asset, AssetDocument } from '../../types';
import { 
  X, 
  ShieldCheck, 
  Calendar, 
  DollarSign, 
  FileText, 
  QrCode, 
  Wrench, 
  Clock, 
  MapPin, 
  Sparkles, 
  Download, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  ExternalLink,
  Printer,
  Camera
} from 'lucide-react';

export const AssetDetailModal: React.FC = () => {
  const { 
    selectedAsset, 
    setSelectedAsset, 
    deleteAsset, 
    addDocumentToAsset, 
    addMaintenanceRecord, 
    logAssetUsage 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'qr' | 'maintenance' | 'usage'>('overview');

  // New Maintenance record form state
  const [showAddMaint, setShowAddMaint] = useState(false);
  const [maintTitle, setMaintTitle] = useState('');
  const [maintCost, setMaintCost] = useState(0);
  const [maintProvider, setMaintProvider] = useState('');
  const [maintType, setMaintType] = useState<any>('Routine Inspection');
  const [maintNotes, setMaintNotes] = useState('');

  // New Usage log form state
  const [showAddUsage, setShowAddUsage] = useState(false);
  const [usageDuration, setUsageDuration] = useState(60);
  const [usageType, setUsageType] = useState<any>('Daily Work');
  const [usageNotes, setUsageNotes] = useState('');

  if (!selectedAsset) return null;

  const handleCreateMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!maintTitle.trim()) return;

    addMaintenanceRecord(selectedAsset.id, {
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
    setShowAddMaint(false);
  };

  const handleCreateUsage = (e: React.FormEvent) => {
    e.preventDefault();
    logAssetUsage(selectedAsset.id, {
      date: new Date().toISOString().split('T')[0],
      durationMinutes: Number(usageDuration) || 60,
      usageType,
      notes: usageNotes.trim()
    });

    setUsageNotes('');
    setShowAddUsage(false);
  };

  const handleDownloadQr = () => {
    if (!selectedAsset.qrCodeUrl) return;
    const link = document.createElement('a');
    link.href = selectedAsset.qrCodeUrl;
    link.download = `OwnIQ_QR_${selectedAsset.serialNumber || selectedAsset.id}.png`;
    link.click();
  };

  const handlePrintQr = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && selectedAsset.qrCodeUrl) {
      printWindow.document.write(`
        <html>
          <head>
            <title>OwnIQ Asset Tag - ${selectedAsset.name}</title>
            <style>
              body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
              .tag { border: 2px solid #000; padding: 24px; border-radius: 16px; text-align: center; max-width: 320px; }
              img { width: 220px; height: 220px; }
              h2 { margin: 8px 0 4px; font-size: 18px; }
              p { margin: 4px 0; font-size: 12px; color: #555; }
              .sn { font-family: monospace; font-weight: bold; background: #eee; padding: 2px 6px; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="tag">
              <p style="font-weight: bold; letter-spacing: 1px; color: #026fc6;">OWNIQ ASSET PASSPORT</p>
              <img src="${selectedAsset.qrCodeUrl}" />
              <h2>${selectedAsset.name}</h2>
              <p>Serial: <span class="sn">${selectedAsset.serialNumber}</span></p>
              <p>Category: ${selectedAsset.category}</p>
            </div>
            <script>window.print(); window.close();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20 overflow-hidden shrink-0">
              {selectedAsset.imageUrl ? (
                <img src={selectedAsset.imageUrl} alt={selectedAsset.name} className="w-full h-full object-cover" />
              ) : (
                <ShieldCheck className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{selectedAsset.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {selectedAsset.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">SN: {selectedAsset.serialNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to remove ${selectedAsset.name} from your AI Asset Wallet?`)) {
                  deleteAsset(selectedAsset.id);
                }
              }}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
              title="Delete Asset"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedAsset(null)}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 gap-2 bg-slate-50/20 dark:bg-slate-900/20">
          {[
            { id: 'overview', label: 'Overview & Specs', icon: <ShieldCheck className="w-4 h-4" /> },
            { id: 'documents', label: `Documents (${selectedAsset.documents.length})`, icon: <FileText className="w-4 h-4" /> },
            { id: 'qr', label: 'QR Tag & Label', icon: <QrCode className="w-4 h-4" /> },
            { id: 'maintenance', label: `Maintenance (${selectedAsset.maintenanceRecords.length})`, icon: <Wrench className="w-4 h-4" /> },
            { id: 'usage', label: `Usage (${selectedAsset.usageLogs.length})`, icon: <Clock className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 flex-1 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Asset Picture Showcase */}
              {selectedAsset.imageUrl && (
                <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 max-h-72 flex items-center justify-center group shadow-sm">
                  <img 
                    src={selectedAsset.imageUrl} 
                    alt={selectedAsset.name} 
                    className="w-full max-h-72 object-contain" 
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-xl text-white text-xs font-semibold flex items-center gap-1.5 shadow-md border border-white/10">
                    <Camera className="w-3.5 h-3.5 text-brand-400" />
                    <span>Registered Physical Asset Photo</span>
                  </div>
                </div>
              )}

              {/* Top Banner Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-400 font-medium">Purchase Price</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    ${selectedAsset.purchasePrice.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">{selectedAsset.purchaseDate}</div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-400 font-medium">Estimated Value</div>
                  <div className="text-base font-bold text-brand-600 dark:text-brand-400 mt-0.5">
                    ${selectedAsset.currentEstimatedValue.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">AI Market Valuation</div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-400 font-medium">Warranty Expiry</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedAsset.warrantyExpiryDate || 'None'}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium">{selectedAsset.warrantyProvider || 'No provider'}</div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-400 font-medium">Condition</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {selectedAsset.condition}
                  </div>
                  <div className="text-[10px] text-slate-400">{selectedAsset.location}</div>
                </div>
              </div>

              {/* Hardware Specifications */}
              <div className="bg-slate-50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Asset Specifications</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Brand / Make:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 ml-2">{selectedAsset.brand}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Model / Spec:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 ml-2">{selectedAsset.model}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Serial Number:</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 ml-2">{selectedAsset.serialNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Current Location:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 ml-2 flex items-center gap-1 inline-flex">
                      <MapPin className="w-3 h-3 text-brand-500" /> {selectedAsset.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Accessories */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Associated Accessories (Tracked by AI Advisor)
                </div>
                {selectedAsset.accessories && selectedAsset.accessories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedAsset.accessories.map((acc, i) => (
                      <span key={i} className="px-3 py-1.5 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-900 rounded-xl text-xs font-medium">
                        ✓ {acc}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No accessories registered yet.</p>
                )}
              </div>

              {/* Insurance */}
              {selectedAsset.insuranceProvider && (
                <div className="bg-sky-50 dark:bg-sky-950/30 p-4 rounded-2xl border border-sky-100 dark:border-sky-900 text-xs space-y-1">
                  <div className="font-bold text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-sky-600" /> Active Insurance Policy
                  </div>
                  <p className="text-sky-800 dark:text-sky-300">
                    Policy #{selectedAsset.insurancePolicyNumber} with {selectedAsset.insuranceProvider}.
                    {selectedAsset.insuranceExpiryDate && ` Renews on ${selectedAsset.insuranceExpiryDate}.`}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Uploaded Ownership Documents</h3>
                  <p className="text-xs text-slate-400">Receipts, warranty cards, insurance schedules with OCR verified data</p>
                </div>
              </div>

              {selectedAsset.documents.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  No documents attached to this asset yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedAsset.documents.map(doc => (
                    <div key={doc.id} className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-brand-100 dark:bg-brand-950 text-brand-600 rounded-xl">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">{doc.title}</div>
                            <div className="text-[11px] text-slate-400">{doc.type} • Uploaded {doc.uploadDate}</div>
                          </div>
                        </div>

                        {doc.ocrConfidence && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-full">
                            OCR {doc.ocrConfidence}% Confidence
                          </span>
                        )}
                      </div>

                      {doc.ocrExtractedText && (
                        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 max-h-36 overflow-y-auto whitespace-pre-wrap">
                          {doc.ocrExtractedText}
                        </div>
                      )}

                      {/* Photo / Document Image Preview */}
                      {(doc.type === 'Photo' || doc.fileType?.startsWith('image/') || doc.fileUrl?.startsWith('data:image')) && (
                        <div className="rounded-xl overflow-hidden max-h-56 bg-slate-900/5 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center p-1">
                          <img 
                            src={doc.fileUrl} 
                            alt={doc.title} 
                            className="w-full max-h-52 object-contain rounded-lg" 
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* QR Code Tab */}
          {activeTab === 'qr' && (
            <div className="flex flex-col items-center justify-center p-4 space-y-4 text-center">
              <div className="p-6 bg-white rounded-3xl shadow-lg border-2 border-slate-200 text-slate-900 max-w-xs w-full flex flex-col items-center">
                <div className="text-xs font-extrabold uppercase tracking-widest text-brand-600 mb-1">
                  OwnIQ Asset Passport
                </div>
                <div className="text-sm font-bold text-slate-900 mb-3">{selectedAsset.name}</div>
                {selectedAsset.qrCodeUrl && (
                  <img src={selectedAsset.qrCodeUrl} alt="QR Code" className="w-48 h-48 rounded-xl border border-slate-100" />
                )}
                <div className="mt-3 text-[11px] font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  SN: {selectedAsset.serialNumber}
                </div>
                <p className="text-[10px] text-slate-400 mt-2">
                  Scan with any camera or OwnIQ QR reader to immediately pull this asset's warranty & identity.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" /> Download QR Image
                </button>
                <button
                  type="button"
                  onClick={handlePrintQr}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Printer className="w-4 h-4" /> Print Asset Label
                </button>
              </div>
            </div>
          )}

          {/* Maintenance Records */}
          {activeTab === 'maintenance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Service & Repair History</h3>
                  <p className="text-xs text-slate-400">Track maintenance tasks, inspections, and costs</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddMaint(!showAddMaint)}
                  className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Log Service
                </button>
              </div>

              {showAddMaint && (
                <form onSubmit={handleCreateMaintenance} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">New Maintenance Record</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Service Title (e.g. Battery Replacement, Filter Wash)"
                      value={maintTitle}
                      onChange={(e) => setMaintTitle(e.target.value)}
                      className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                    <input
                      type="number"
                      placeholder="Cost in USD (0 for complimentary)"
                      value={maintCost || ''}
                      onChange={(e) => setMaintCost(parseFloat(e.target.value) || 0)}
                      className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                    <input
                      type="text"
                      placeholder="Service Provider / Shop"
                      value={maintProvider}
                      onChange={(e) => setMaintProvider(e.target.value)}
                      className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                    <select
                      value={maintType}
                      onChange={(e) => setMaintType(e.target.value as any)}
                      className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    >
                      <option value="Routine Inspection">Routine Inspection</option>
                      <option value="Cleaning / Servicing">Cleaning / Servicing</option>
                      <option value="Repair">Repair</option>
                      <option value="Battery Replacement">Battery Replacement</option>
                      <option value="Software / Firmware">Software / Firmware</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Notes on diagnostics, parts changed, or technician recommendations"
                    value={maintNotes}
                    onChange={(e) => setMaintNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    rows={2}
                  />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setShowAddMaint(false)} className="px-3 py-1.5 text-xs text-slate-500">Cancel</button>
                    <button type="submit" className="px-4 py-1.5 bg-brand-600 text-white text-xs font-semibold rounded-xl">Save Record</button>
                  </div>
                </form>
              )}

              {selectedAsset.maintenanceRecords.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  No maintenance records logged yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {selectedAsset.maintenanceRecords.map(rec => (
                    <div key={rec.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">{rec.title}</span>
                          <span className="text-[10px] px-2 py-0.2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full font-medium">
                            {rec.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{rec.notes}</p>
                        <div className="text-[11px] text-slate-400">By {rec.provider} on {rec.date}</div>
                      </div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {rec.cost === 0 ? 'Complimentary' : `$${rec.cost}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Usage History */}
          {activeTab === 'usage' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Logged Usage Activity</h3>
                  <p className="text-xs text-slate-400">Powering AI Usage Intelligence & lifecycle recommendations</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddUsage(!showAddUsage)}
                  className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Log Session
                </button>
              </div>

              {showAddUsage && (
                <form onSubmit={handleCreateUsage} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Log Usage Session</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="number"
                      placeholder="Duration in minutes (e.g. 120)"
                      value={usageDuration}
                      onChange={(e) => setUsageDuration(parseInt(e.target.value) || 60)}
                      className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    />
                    <select
                      value={usageType}
                      onChange={(e) => setUsageType(e.target.value as any)}
                      className="px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                    >
                      <option value="Daily Work">Daily Work</option>
                      <option value="Commute">Commute</option>
                      <option value="Travel">Travel</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Exercise">Exercise</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Session notes (e.g. Flight to NYC, Client presentation)"
                    value={usageNotes}
                    onChange={(e) => setUsageNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setShowAddUsage(false)} className="px-3 py-1.5 text-xs text-slate-500">Cancel</button>
                    <button type="submit" className="px-4 py-1.5 bg-brand-600 text-white text-xs font-semibold rounded-xl">Save Session</button>
                  </div>
                </form>
              )}

              {selectedAsset.usageLogs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  No usage sessions recorded yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedAsset.usageLogs.map(log => (
                    <div key={log.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{log.usageType}</div>
                        <div className="text-[11px] text-slate-400">{log.notes || 'Recorded session'}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-brand-600 dark:text-brand-400">{log.durationMinutes} mins</div>
                        <div className="text-[10px] text-slate-400">{log.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={() => setSelectedAsset(null)}
            className="px-5 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 text-xs font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
