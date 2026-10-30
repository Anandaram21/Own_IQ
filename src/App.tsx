import React from 'react';
import { useApp } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { MainDashboard } from './components/dashboard/MainDashboard';
import { AssetWallet } from './components/assets/AssetWallet';
import { AssetAdvisor } from './components/advisor/AssetAdvisor';
import { AssetHealth } from './components/health/AssetHealth';
import { UsageIntelligence } from './components/usage/UsageIntelligence';
import { OwnIQCare } from './components/care/OwnIQCare';
import { SettingsView } from './components/settings/SettingsView';
import { AddAssetModal } from './components/assets/AddAssetModal';
import { AssetDetailModal } from './components/assets/AssetDetailModal';
import { QrScannerModal } from './components/assets/QrScannerModal';
import { AuthScreen } from './components/auth/AuthScreen';
import { ShieldCheck, Heart } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { currentModule, careViewMode } = useApp();
  const { isAuthenticated, isLoadingAuth } = useAuth();

  const isCareRecipientMode = currentModule === 'care' && careViewMode === 'recipient';

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs text-slate-400 font-medium tracking-wide">Validating secure session...</span>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show the authentication screen (Registration steps 1-5 or Returning Login)
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors ${isCareRecipientMode ? 'care-mode-active' : ''}`}>
      {/* Header Navigation */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentModule === 'dashboard' && <MainDashboard />}
        {currentModule === 'assets' && <AssetWallet />}
        {currentModule === 'advisor' && <AssetAdvisor />}
        {currentModule === 'health' && <AssetHealth />}
        {currentModule === 'usage' && <UsageIntelligence />}
        {currentModule === 'care' && <OwnIQCare />}
        {currentModule === 'settings' && <SettingsView />}
      </main>

      {/* Modals */}
      <AddAssetModal />
      <AssetDetailModal />
      <QrScannerModal />

      {/* Platform Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-600" /> OwnIQ Platform
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 italic">“Know Everything You Own.”</span>
            <span className="text-slate-300">|</span>
            <span className="text-rose-600 font-semibold flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" /> OwnIQ Care: “Remembering Life, Together.”
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Client v1.1.0</span>
            <span>•</span>
            <span>Local Encrypted Storage</span>
            <span>•</span>
            <span>SHA-256 Auth</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;
