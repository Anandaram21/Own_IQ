import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Asset, AssetCategory } from '../../types';
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  QrCode, 
  FileText, 
  Clock, 
  Tag, 
  Calendar, 
  Sparkles, 
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  X
} from 'lucide-react';

export const AssetWallet: React.FC = () => {
  const { 
    assets, 
    setSelectedAsset, 
    setIsAddAssetModalOpen, 
    setIsQrScannerModalOpen,
    searchQuery, 
    setSearchQuery 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'recent' | 'value-desc' | 'value-asc' | 'warranty' | 'name'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories: (string | AssetCategory)[] = [
    'All',
    'Smartphones & Mobile',
    'Laptops & Computing',
    'Audio & Wearables',
    'Vehicles & Transport',
    'Household Appliances',
    'Travel & Luggage',
    'Cameras & Optics',
    'Valuables & Jewelry'
  ];

  // Calculated stats
  const totalValue = useMemo(() => {
    return assets.reduce((sum, a) => sum + (a.currentEstimatedValue || a.purchasePrice || 0), 0);
  }, [assets]);

  const totalDocuments = useMemo(() => {
    return assets.reduce((sum, a) => sum + (a.documents?.length || 0), 0);
  }, [assets]);

  const activeWarrantiesCount = useMemo(() => {
    const now = new Date();
    return assets.filter(a => a.warrantyExpiryDate && new Date(a.warrantyExpiryDate) > now).length;
  }, [assets]);

  // Filtered and Sorted Assets
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      // Category filter
      if (selectedCategory !== 'All' && asset.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = asset.name.toLowerCase().includes(q);
        const matchesBrand = asset.brand.toLowerCase().includes(q);
        const matchesModel = asset.model.toLowerCase().includes(q);
        const matchesSerial = asset.serialNumber.toLowerCase().includes(q);
        const matchesCategory = asset.category.toLowerCase().includes(q);
        const matchesLocation = asset.location?.toLowerCase().includes(q);
        const matchesNotes = asset.notes?.toLowerCase().includes(q);
        const matchesWarranty = asset.warrantyProvider?.toLowerCase().includes(q);
        const matchesTags = asset.tags?.some(t => t.toLowerCase().includes(q));
        const matchesAcc = asset.accessories?.some(acc => acc.toLowerCase().includes(q));
        if (!matchesName && !matchesBrand && !matchesModel && !matchesSerial && !matchesCategory && !matchesLocation && !matchesNotes && !matchesWarranty && !matchesTags && !matchesAcc) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'value-desc') {
        return (b.currentEstimatedValue || 0) - (a.currentEstimatedValue || 0);
      }
      if (sortBy === 'value-asc') {
        return (a.currentEstimatedValue || 0) - (b.currentEstimatedValue || 0);
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'warranty') {
        if (!a.warrantyExpiryDate) return 1;
        if (!b.warrantyExpiryDate) return -1;
        return new Date(a.warrantyExpiryDate).getTime() - new Date(b.warrantyExpiryDate).getTime();
      }
      return 0;
    });
  }, [assets, selectedCategory, searchQuery, sortBy]);

  const getWarrantyBadge = (asset: Asset) => {
    if (!asset.warrantyExpiryDate) {
      return (
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
          No Warranty
        </span>
      );
    }
    const expiry = new Date(asset.warrantyExpiryDate);
    const now = new Date();
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> Expired
        </span>
      );
    }
    if (diffDays <= 45) {
      return (
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900 flex items-center gap-1">
          <Clock className="w-3 h-3" /> Expires in {diffDays}d
        </span>
      );
    }
    return (
      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900 flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" /> Active ({diffDays}d left)
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Metrics */}
      <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-brand-300">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
              <span>AI Asset Wallet • Digital Ownership Registry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Know Everything You Own.
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Organize serial numbers, invoices, warranty guarantees, and accessories. Synchronized across your ecosystem with QR passport tagging.
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

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/10">
          <div>
            <div className="text-xs text-slate-400">Total Registered Assets</div>
            <div className="text-2xl font-extrabold text-white mt-0.5">{assets.length} items</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Total Portfolio Value</div>
            <div className="text-2xl font-extrabold text-brand-400 mt-0.5">${totalValue.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Secured Documents</div>
            <div className="text-2xl font-extrabold text-white mt-0.5">{totalDocuments} files</div>
          </div>
          <div>
            <div className="text-xs text-slate-400">Active Warranties</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-0.5">{activeWarrantiesCount} covered</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assets by name, brand, model, serial number, tag, location, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-slate-900 transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800/60">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort & View Mode */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            {searchQuery && (
              <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 mr-1 hidden sm:inline">
                {filteredAssets.length} match{filteredAssets.length === 1 ? '' : 'es'}
              </span>
            )}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none"
            >
              <option value="recent">Sort: Recently Added</option>
              <option value="value-desc">Value: High to Low</option>
              <option value="value-asc">Value: Low to High</option>
              <option value="warranty">Warranty Expiry Date</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>

            <div className="flex border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 ${viewMode === 'grid' ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 ${viewMode === 'list' ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Cards Display */}
      {filteredAssets.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No assets matched your filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing categories, or add a new asset to your digital wallet.
          </p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="px-4 py-2 text-xs font-semibold text-brand-600 hover:underline"
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map(asset => (
            <div
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-brand-500 dark:hover:border-brand-500 p-5 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Image / Header */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4">
                  {asset.imageUrl ? (
                    <img 
                      src={asset.imageUrl} 
                      alt={asset.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-700">
                      <ShieldCheck className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white rounded-lg">
                      {asset.category}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    {getWarrantyBadge(asset)}
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                      {asset.brand}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      SN: {asset.serialNumber}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-brand-600 transition-colors">
                    {asset.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{asset.model}</p>
                </div>

                {/* Accessories preview */}
                {asset.accessories && asset.accessories.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="text-[10px] text-slate-400 font-medium mb-1">
                      Accessories ({asset.accessories.length}):
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {asset.accessories.slice(0, 2).map((acc, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                          {acc}
                        </span>
                      ))}
                      {asset.accessories.length > 2 && (
                        <span className="text-[10px] px-1.5 py-0.5 text-slate-400 font-medium">
                          +{asset.accessories.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Meta */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">Current Value</div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    ${(asset.currentEstimatedValue || asset.purchasePrice || 0).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    {asset.documents?.length || 0}
                  </span>
                  <div className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredAssets.map(asset => (
            <div
              key={asset.id}
              onClick={() => setSelectedAsset(asset)}
              className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer flex items-center justify-between gap-4 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                  {asset.imageUrl ? (
                    <img src={asset.imageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ShieldCheck className="w-7 h-7 text-slate-400 m-auto mt-3.5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-600">{asset.brand}</span>
                    <span className="text-xs font-mono text-slate-400">SN: {asset.serialNumber}</span>
                    {getWarrantyBadge(asset)}
                  </div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white">{asset.name}</div>
                  <div className="text-xs text-slate-500">{asset.category} • {asset.location}</div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    ${(asset.currentEstimatedValue || asset.purchasePrice).toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">{asset.documents?.length || 0} documents</div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
