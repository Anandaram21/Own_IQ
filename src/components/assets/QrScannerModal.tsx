import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { parseAssetQrCode } from '../../services/qrService';
import { 
  X, 
  QrCode, 
  Camera, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const QrScannerModal: React.FC = () => {
  const { 
    isQrScannerModalOpen, 
    setIsQrScannerModalOpen, 
    assets, 
    setSelectedAsset 
  } = useApp();

  const [simulatedInput, setSimulatedInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [matchedAssetName, setMatchedAssetName] = useState('');

  if (!isQrScannerModalOpen) return null;

  const handleScanCode = (codeString: string) => {
    setErrorMessage('');
    const parsed = parseAssetQrCode(codeString);

    if (parsed && parsed.assetId) {
      const found = assets.find(a => a.id === parsed.assetId);
      if (found) {
        setMatchedAssetName(found.name);
        setTimeout(() => {
          setSelectedAsset(found);
          setIsQrScannerModalOpen(false);
        }, 600);
        return;
      }
    }

    // Direct search by serial number or name
    const foundDirect = assets.find(a => 
      a.id.toLowerCase() === codeString.toLowerCase() ||
      a.serialNumber.toLowerCase() === codeString.toLowerCase() ||
      a.name.toLowerCase().includes(codeString.toLowerCase())
    );

    if (foundDirect) {
      setMatchedAssetName(foundDirect.name);
      setTimeout(() => {
        setSelectedAsset(foundDirect);
        setIsQrScannerModalOpen(false);
      }, 600);
    } else {
      setErrorMessage(`No asset matched the scanned code "${codeString}".`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Scan Asset QR Passport</h2>
              <p className="text-xs text-slate-400">Instantly look up physical ownership & documents</p>
            </div>
          </div>
          <button
            onClick={() => setIsQrScannerModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scanner Viewport */}
        <div className="p-6 space-y-6">
          <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden flex flex-col items-center justify-center border-2 border-slate-800">
            {/* Viewfinder target */}
            <div className="w-48 h-48 border-2 border-brand-500/80 rounded-2xl relative flex items-center justify-center">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-brand-400"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-brand-400"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-brand-400"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-brand-400"></div>
              
              <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-brand-400 to-transparent animate-pulse"></div>
            </div>

            <div className="absolute bottom-3 text-xs text-slate-400 flex items-center gap-1.5 bg-slate-900/80 px-3 py-1 rounded-full">
              <Camera className="w-3.5 h-3.5 text-brand-400" />
              <span>Align QR sticker within frame</span>
            </div>

            {matchedAssetName && (
              <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-bounce" />
                <div className="font-bold text-sm">Asset Verified!</div>
                <div className="text-xs text-emerald-200">{matchedAssetName}</div>
                <div className="text-[10px] text-emerald-300">Opening Digital Wallet...</div>
              </div>
            )}
          </div>

          {/* Quick Click to Test Any Registered Asset */}
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Or Select Any Registered Asset to Simulate Scan:
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {assets.map(asset => (
                <button
                  key={asset.id}
                  onClick={() => handleScanCode(asset.id)}
                  className="w-full text-left p-2.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-brand-50 dark:hover:bg-brand-950/40 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs group transition-colors"
                >
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-brand-600">
                      {asset.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">SN: {asset.serialNumber}</div>
                  </div>
                  <span className="text-[11px] font-semibold text-brand-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Simulate Scan <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Code / Serial Input */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Enter Tag Payload or Serial Number:
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. C02XG123K9J2 or asset_mbp_16"
                value={simulatedInput}
                onChange={(e) => setSimulatedInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleScanCode(simulatedInput); }}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="button"
                onClick={() => handleScanCode(simulatedInput)}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1"
              >
                <Search className="w-3.5 h-3.5" /> Verify
              </button>
            </div>

            {errorMessage && (
              <div className="mt-2 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
