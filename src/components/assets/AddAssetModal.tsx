import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AssetCategory, AssetCondition, OcrExtractedData, AssetDocument } from '../../types';
import {
  SAMPLE_DOCUMENTS,
  processDocumentWithOcr,
} from "../../services/ocrService.ts";
import { 
  X, 
  UploadCloud, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Tag, 
  ShieldCheck, 
  Plus, 
  Trash2,
  Calendar,
  DollarSign,
  Camera,
  Image as ImageIcon
} from 'lucide-react';

export const AddAssetModal: React.FC = () => {
  const { isAddAssetModalOpen, setIsAddAssetModalOpen, addAsset, userProfile } = useApp();

  const [mode, setMode] = useState<'upload' | 'manual'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string>('');
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number | null>(null);

  // Asset Photo / Picture State
  const [assetImageUrl, setAssetImageUrl] = useState<string>('');
  const [isDraggingImage, setIsDraggingImage] = useState(false);

  // OCR Processing State
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatusText, setOcrStatusText] = useState('');
  const [extractedOcrData, setExtractedOcrData] = useState<OcrExtractedData | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [category, setCategory] = useState<AssetCategory>('Laptops & Computing');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [currency, setCurrency] = useState(userProfile.currency || 'INR');
  const [condition, setCondition] = useState<AssetCondition>('Mint / Like New');
  const [location, setLocation] = useState('Home Office');
  const [warrantyProvider, setWarrantyProvider] = useState('');
  const [warrantyDurationMonths, setWarrantyDurationMonths] = useState<number>(12);
  const [warrantyExpiryDate, setWarrantyExpiryDate] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [insurancePolicyNumber, setInsurancePolicyNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [accessories, setAccessories] = useState<string[]>([]);
  const [newAccessory, setNewAccessory] = useState('');
  const [tags, setTags] = useState<string[]>(['valuable']);
  const [newTag, setNewTag] = useState('');

  if (!isAddAssetModalOpen) return null;

  const categories: AssetCategory[] = [
    'Smartphones & Mobile',
    'Laptops & Computing',
    'Audio & Wearables',
    'Vehicles & Transport',
    'Household Appliances',
    'Cameras & Optics',
    'Travel & Luggage',
    'Valuables & Jewelry',
    'Home & Wellness',
    'Other'
  ];

  const compressImageToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawData = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const MAX_DIM = 1200;
          let width = img.width;
          let height = img.height;
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(rawData);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          try {
            const compressed = canvas.toDataURL('image/jpeg', 0.85);
            resolve(compressed);
          } catch {
            resolve(rawData);
          }
        };
        img.onerror = () => resolve(rawData);
        img.src = rawData;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  const handleAssetPhotoSelect = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (e.g. JPG, PNG, WebP).');
      return;
    }
    try {
      const compressed = await compressImageToDataUrl(file);
      if (compressed) {
        setAssetImageUrl(compressed);
      }
    } catch (err) {
      console.error('Error processing asset photo:', err);
    }
  };

  const handleRemoveAssetPhoto = () => {
    setAssetImageUrl('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSelectedSampleIndex(null);
      const url = URL.createObjectURL(file);
      setFilePreviewUrl(url);
      if (file.type.startsWith('image/') && !assetImageUrl) {
        try {
          const compressed = await compressImageToDataUrl(file);
          if (compressed) setAssetImageUrl(compressed);
        } catch {
          // fallback
        }
      }
      runOcrOnSource(file);
    }
  };

  const handleSelectSampleDoc = (index: number) => {
    setSelectedSampleIndex(index);
    const sample = SAMPLE_DOCUMENTS[index];
    setFilePreviewUrl(sample.sampleImageUrl);
    setSelectedFile(null);
    // Simulate OCR on sample text
    runOcrOnSource(`data:text/plain;charset=utf-8,${encodeURIComponent(sample.simulatedText)}`);
  };

  const runOcrOnSource = async (source: string | File) => {
    // ── Reset ALL state before starting a new extraction ──────────────────
    setExtractedOcrData(null);
    setName('');
    setBrand('');
    setModel('');
    setSerialNumber('');
    setPurchasePrice(0);
    setPurchaseDate(new Date().toISOString().split('T')[0]);
    setWarrantyExpiryDate('');
    setWarrantyDurationMonths(12);
    setWarrantyProvider('');

    setIsOcrProcessing(true);
    setOcrProgress(15);
    setOcrStatusText('Initiating OCR Optical Engine...');

    try {
      const result = await processDocumentWithOcr(source, (prog, text) => {
        setOcrProgress(prog);
        setOcrStatusText(text);
      });

      setExtractedOcrData(result);

      // Auto-fill form fields from extracted data
      if (result.assetName) setName(result.assetName);
      if (result.brand && result.brand !== 'Generic') setBrand(result.brand);
      if (result.model && result.model !== 'Standard Model') setModel(result.model);
      if (result.serialNumber && result.serialNumber !== 'N/A') setSerialNumber(result.serialNumber);
      if (result.purchasePrice) setPurchasePrice(result.purchasePrice);
      if (result.currency) setCurrency(result.currency);
      if (result.purchaseDate) setPurchaseDate(result.purchaseDate);
      if (result.warrantyExpiryDate) setWarrantyExpiryDate(result.warrantyExpiryDate);
      if (result.warrantyDurationMonths) setWarrantyDurationMonths(result.warrantyDurationMonths);
      if (result.vendorName) setWarrantyProvider(`${result.vendorName} Guarantee`);

      // Infer category from extracted name/brand/raw text
      const lower = (result.assetName + ' ' + result.brand + ' ' + (result.rawText || '')).toLowerCase();
      if (
        lower.includes('laptop') || lower.includes('notebook') || lower.includes('aspire') ||
        lower.includes('macbook') || lower.includes('thinkpad') || lower.includes('ideapad') ||
        lower.includes('vivobook') || lower.includes('zenbook') || lower.includes('pavilion') ||
        lower.includes('acer') || lower.includes('dell') || lower.includes('lenovo') || lower.includes('asus')
      ) {
        setCategory('Laptops & Computing');
      } else if (
        lower.includes('phone') || lower.includes('iphone') || lower.includes('galaxy') ||
        lower.includes('oneplus') || lower.includes('redmi') || lower.includes('realme') ||
        lower.includes('xiaomi') || lower.includes('smartphone') || lower.includes('mobile')
      ) {
        setCategory('Smartphones & Mobile');
      } else if (
        lower.includes('headphone') || lower.includes('earphone') || lower.includes('earbuds') ||
        lower.includes('airpods') || lower.includes('sony') || lower.includes('bose') ||
        lower.includes('boat') || lower.includes('noise') || lower.includes('audio')
      ) {
        setCategory('Audio & Wearables');
      } else if (
        lower.includes('dyson') || lower.includes('vacuum') || lower.includes('cleaner') ||
        lower.includes('refrigerator') || lower.includes('fridge') || lower.includes('microwave') ||
        lower.includes('washing') || lower.includes('appliance')
      ) {
        setCategory('Household Appliances');
      } else if (
        lower.includes('honda') || lower.includes('toyota') || lower.includes('car') ||
        lower.includes('sedan') || lower.includes('suv') || lower.includes('bike') || lower.includes('scooter')
      ) {
        setCategory('Vehicles & Transport');
      }
    } catch (err) {
      console.error('OCR failed:', err);
      // Show a partial result with the raw error so user knows OCR ran but found nothing
      setExtractedOcrData({
        assetName: '',
        brand: '',
        model: '',
        serialNumber: '',
        purchaseDate: '',
        purchasePrice: 0,
        currency: '',
        warrantyDurationMonths: 0,
        warrantyExpiryDate: '',
        vendorName: '',
        documentType: 'Receipt',
        rawText: err instanceof Error ? err.message : 'OCR could not read this document.',
        confidenceScore: 0,
      });
    } finally {
      setIsOcrProcessing(false);
    }
  };

  const handleAddAccessory = () => {
    if (newAccessory.trim()) {
      setAccessories([...accessories, newAccessory.trim()]);
      setNewAccessory('');
    }
  };

  const handleRemoveAccessory = (index: number) => {
    setAccessories(accessories.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim().toLowerCase())) {
      setTags([...tags, newTag.trim().toLowerCase()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter(item => item !== t));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let initialDoc = undefined;
    if (filePreviewUrl) {
      initialDoc = {
        title: extractedOcrData?.documentType ? `${extractedOcrData.documentType} - ${brand || name}` : 'Purchased Receipt Document',
        type: (extractedOcrData?.documentType || 'Invoice') as AssetDocument['type'],
        fileUrl: filePreviewUrl,
        fileType: selectedFile ? selectedFile.type : 'image/jpeg',
        fileSize: selectedFile ? `${(selectedFile.size / 1024).toFixed(0)} KB` : '420 KB',
        ocrExtractedText: extractedOcrData?.rawText || '',
        ocrConfidence: extractedOcrData?.confidenceScore || 85
      };
    } else if (assetImageUrl) {
      initialDoc = {
        title: `${brand || name.trim()} Photo`,
        type: 'Photo' as const,
        fileUrl: assetImageUrl,
        fileType: 'image/jpeg',
        fileSize: 'Photo',
        ocrExtractedText: 'Registered physical asset photo',
        ocrConfidence: 100
      };
    }

    await addAsset({
      name: name.trim(),
      brand: brand.trim() || 'Generic',
      model: model.trim() || 'Standard',
      serialNumber: serialNumber.trim() || `SN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      category,
      purchaseDate,
      purchasePrice: Number(purchasePrice) || 0,
      currency,
      currentEstimatedValue: Number(purchasePrice) * 0.85 || 0,
      condition,
      location,
      warrantyProvider: warrantyProvider.trim() || undefined,
      warrantyDurationMonths: Number(warrantyDurationMonths) || undefined,
      warrantyExpiryDate: warrantyExpiryDate || undefined,
      insuranceProvider: insuranceProvider.trim() || undefined,
      insurancePolicyNumber: insurancePolicyNumber.trim() || undefined,
      accessories,
      tags,
      notes,
      imageUrl: assetImageUrl || undefined,
      estimatedUsageFrequency: 'Weekly',
      lastUsedDate: new Date().toISOString().split('T')[0]
    }, initialDoc);

    // Reset photo & upload state
    setAssetImageUrl('');
    setSelectedFile(null);
    setFilePreviewUrl('');
    setExtractedOcrData(null);
    setSelectedSampleIndex(null);
    setIsAddAssetModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Register New Physical Asset</h2>
              <p className="text-xs text-slate-500">Optical OCR Document Scanning & Ownership Profile Creation</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddAssetModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Method Selector */}
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
                mode === 'upload' 
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span>Smart Document OCR Extraction</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('manual')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
                mode === 'manual' 
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Manual Entry</span>
            </button>
          </div>

          {/* OCR Document Upload & Sample Section */}
          {mode === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-brand-500 rounded-2xl p-6 text-center transition-all bg-slate-50/50 dark:bg-slate-800/30">
                <input
                  type="file"
                  id="document-file-input"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label 
                  htmlFor="document-file-input"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Click to upload invoice, receipt, warranty card or photo
                  </div>
                  <p className="text-xs text-slate-400">
                    Supports JPG, PNG, WebP or PDF. Our Optical Character Recognition extracts serial numbers & warranty dates.
                  </p>
                </label>
              </div>

              {/* Sample Documents for 1-Click Testing */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Or Test Instantly With Sample Verified Invoices:
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {SAMPLE_DOCUMENTS.map((doc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSampleDoc(idx)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                        selectedSampleIndex === idx 
                          ? 'border-brand-500 bg-brand-50/70 dark:bg-brand-950/40 ring-1 ring-brand-500' 
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-semibold text-slate-900 dark:text-white truncate">{doc.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{doc.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live OCR Progress Bar */}
              {isOcrProcessing && (
                <div className="p-4 bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900 rounded-2xl space-y-2 animate-pulse">
                  <div className="flex items-center justify-between text-xs font-semibold text-brand-700 dark:text-brand-300">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 animate-spin text-brand-500" />
                      {ocrStatusText}
                    </span>
                    <span>{ocrProgress}%</span>
                  </div>
                  <div className="w-full bg-brand-200 dark:bg-brand-900 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-brand-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${ocrProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* OCR Extracted Confirmation Banner */}
              {extractedOcrData && !isOcrProcessing && (
                extractedOcrData.confidenceScore > 0 ? (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                        <span>OCR Information Extracted with {extractedOcrData.confidenceScore}% Confidence</span>
                        <span className="px-2 py-0.5 bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-100 rounded-full font-mono text-[10px]">
                          {extractedOcrData.documentType}
                        </span>
                      </div>
                      <p className="text-emerald-700 dark:text-emerald-300">
                        We auto-filled the form below based on the document. Please review and confirm the details before saving.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                        <span>OCR Engine Note</span>
                      </div>
                      <p className="text-amber-700 dark:text-amber-300">
                        {extractedOcrData.rawText || "Could not automatically read text from this image. You can still enter or confirm the details below manually."}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {/* Manual Mode: Asset Picture / Photo Upload Feature */}
          {mode === 'manual' && (
            <div className="space-y-3 p-4 bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-brand-500" />
                    Physical Asset Photo Upload
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Capture or upload a picture of the item so the asset can be stored with images
                  </p>
                </div>
                {assetImageUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveAssetPhoto}
                    className="text-xs text-rose-500 hover:text-rose-600 font-medium flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove Photo
                  </button>
                )}
              </div>

              {!assetImageUrl ? (
                <div 
                  onDragOver={(e) => { e.preventDefault(); setIsDraggingImage(true); }}
                  onDragLeave={() => setIsDraggingImage(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingImage(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file && file.type.startsWith('image/')) {
                      handleAssetPhotoSelect(file);
                    }
                  }}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all bg-white dark:bg-slate-800/50 ${
                    isDraggingImage 
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20' 
                      : 'border-slate-200 dark:border-slate-700 hover:border-brand-400'
                  }`}
                >
                  <input
                    type="file"
                    id="manual-asset-photo-input"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAssetPhotoSelect(file);
                    }}
                    className="hidden"
                  />
                  <label 
                    htmlFor="manual-asset-photo-input"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-sm">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        Take photo or upload asset picture
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Supports JPG, PNG, WebP • Drag & drop or browse
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all">
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Select Photo</span>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 flex items-center justify-center max-h-60 group">
                  <img 
                    src={assetImageUrl} 
                    alt="Asset Preview" 
                    className="w-full max-h-60 object-contain" 
                  />
                  <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <input
                      type="file"
                      id="manual-asset-photo-replace-input"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleAssetPhotoSelect(file);
                      }}
                      className="hidden"
                    />
                    <label
                      htmlFor="manual-asset-photo-replace-input"
                      className="cursor-pointer px-3 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5" /> Change Photo
                    </label>
                    <button
                      type="button"
                      onClick={handleRemoveAssetPhoto}
                      className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md rounded-lg text-white text-[11px] font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Photo Attached to Asset</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Structured Confirmation Form */}
          <form id="add-asset-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Asset Photo Visual Attachment Widget */}
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 flex items-center justify-center border border-slate-300 dark:border-slate-600">
                  {assetImageUrl ? (
                    <img src={assetImageUrl} alt="Asset" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {assetImageUrl ? 'Asset Image Attached' : 'Asset Photo / Image (Optional)'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {assetImageUrl ? 'Photo will be stored with asset card & passport' : 'Attach a photo of the item for visual wallet tracking'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="form-asset-photo-input"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleAssetPhotoSelect(file);
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="form-asset-photo-input"
                  className="cursor-pointer px-3 py-1.5 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 text-brand-600 dark:text-brand-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{assetImageUrl ? 'Change Image' : 'Add Photo'}</span>
                </label>
                {assetImageUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveAssetPhoto}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-1 border-b border-slate-100 dark:border-slate-800">
              Asset Identity & Details
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Asset Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MacBook Pro 16, Sony ANC, Honda Civic"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as AssetCategory)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Brand / Manufacturer
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apple, Sony, Dyson, Honda"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Model / Variant
                </label>
                <input
                  type="text"
                  placeholder="e.g. A2991, WH-1000XM5, SV22"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Serial Number (S/N / VIN)
                </label>
                <input
                  type="text"
                  placeholder="e.g. C02XG123K9J2"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Physical Storage Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Home Office Desk, Master Closet, Garage"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Financial & Warranty Dates */}
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-2 pb-1 border-b border-slate-100 dark:border-slate-800">
              Purchase & Warranty Intelligence
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Purchase Price (INR ₹)
                </label>
                <div className="relative">
                  <span className="font-bold text-xs text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={purchasePrice || ''}
                    onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Purchase Date
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Warranty Expiry Date
                </label>
                <input
                  type="date"
                  value={warrantyExpiryDate}
                  onChange={(e) => setWarrantyExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Warranty Provider / Plan
                </label>
                <input
                  type="text"
                  placeholder="e.g. AppleCare+, 2-Yr Manufacturer Guarantee"
                  value={warrantyProvider}
                  onChange={(e) => setWarrantyProvider(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Insurance Provider (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. GEICO, Lemonade, State Farm"
                  value={insuranceProvider}
                  onChange={(e) => setInsuranceProvider(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Physical Condition
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as AssetCondition)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="Mint / Like New">Mint / Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Needs Service">Needs Service</option>
                  <option value="Damaged">Damaged</option>
                </select>
              </div>
            </div>

            {/* Associated Accessories */}
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-2 pb-1 border-b border-slate-100 dark:border-slate-800">
              Registered Accessories & Bundled Items (Used by AI Advisor)
            </div>

            <div>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g. 140W USB-C Charger, MagSafe Cable, Case, Key Fob"
                  value={newAccessory}
                  onChange={(e) => setNewAccessory(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddAccessory(); } }}
                  className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddAccessory}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-xs font-semibold rounded-xl flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {accessories.map((acc, i) => (
                  <span 
                    key={i} 
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-lg flex items-center gap-1.5"
                  >
                    <span>{acc}</span>
                    <button type="button" onClick={() => handleRemoveAccessory(i)} className="text-slate-400 hover:text-rose-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={() => setIsAddAssetModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 rounded-xl"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            form="add-asset-form"
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-2 shadow-md shadow-brand-500/20 active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Generate Asset Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
