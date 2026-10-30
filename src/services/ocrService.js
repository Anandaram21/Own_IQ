// OCR service helper (plain JavaScript)
import { createWorker } from "tesseract.js";

// Parse extracted text into structured data (same logic as provided in TypeScript, without type annotations)
export function parseExtractedText(text) {
  let assetName = '';
  let brand = '';
  let model = '';
  let serialNumber = '';
  let purchaseDate = '';
  let purchasePrice = undefined;
  let currency = 'USD';
  let warrantyDurationMonths = 12;
  let warrantyExpiryDate = '';
  let vendorName = '';
  let documentType = 'Receipt';

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  const commonBrands = [
    'Apple', 'Sony', 'Dyson', 'Samsung', 'Dell', 'Lenovo', 'HP', 'Honda',
    'Toyota', 'Bose', 'Logitech', 'Anker', 'Canon', 'Nikon', 'Samsonite',
    'LG', 'Philips', 'Microsoft', 'Nintendo', 'Google', 'Asus'
  ];
  for (const b of commonBrands) {
    const reg = new RegExp(`\\b${b}\\b`, 'i');
    if (reg.test(text)) { brand = b; break; }
  }

  const vendors = ['Apple Store', 'Best Buy', 'Amazon', 'Target', 'Walmart', 'Costco', 'Dyson', 'Home Depot'];
  for (const v of vendors) {
    if (new RegExp(v, 'i').test(text)) { vendorName = v; break; }
  }

  if (/warranty\s*certificate|guarantee\s*certificate/i.test(text)) {
    documentType = 'Warranty Certificate';
  } else if (/invoice|tax\s*invoice/i.test(text)) {
    documentType = 'Invoice';
  } else if (/receipt/i.test(text)) {
    documentType = 'Receipt';
  } else if (/service|repair/i.test(text)) {
    documentType = 'Service Record';
  }

  const serialMatch = text.match(/(?:serial\s*(?:no|number)?|s\/n|sn|registration\s*ref)[:\s#]+([A-Z0-9\-_]{6,25})/i);
  if (serialMatch && serialMatch[1]) serialNumber = serialMatch[1].trim();

  const modelMatch = text.match(/(?:model\s*(?:no|number)?|model)[:\s#]+([A-Za-z0-9\-_\/ ]{3,30})/i);
  if (modelMatch && modelMatch[1]) model = modelMatch[1].split('\n')[0].trim();

  const itemMatch = text.match(/(?:item|product(?:\s*name)?|description)[:\s]+([^\n\r]+)/i);
  if (itemMatch && itemMatch[1]) {
    assetName = itemMatch[1].replace(/brand|model|serial/gi, '').trim();
  } else if (brand && model) {
    assetName = `${brand} ${model}`;
  } else if (brand) {
    const wordsAfterBrand = text.match(new RegExp(`${brand}\\s+([A-Za-z0-9\\s]{3,25})`, 'i'));
    if (wordsAfterBrand && wordsAfterBrand[1]) assetName = `${brand} ${wordsAfterBrand[1].trim()}`;
  }

  const dateMatch = text.match(/(?:date(?:\s*of\s*purchase)?|purchase\s*date)[:\s]+([0-9]{4}[-/][0-9]{2}[-/][0-9]{2}|[0-9]{2}[-/][0-9]{2}[-/][0-9]{4}|[A-Za-z]+ \d{1,2}, \d{4})/i);
  if (dateMatch && dateMatch[1]) {
    const raw = dateMatch[1];
    const parsed = new Date(raw);
    if (!isNaN(parsed.getTime())) {
      purchaseDate = parsed.toISOString().split('T')[0];
    } else {
      purchaseDate = raw;
    }
  }

  const priceMatch = text.match(/(?:price|total|amount|subtotal)[:\s]*[\$€£]?\s*([0-9,]+\.[0-9]{2})/i) || text.match(/[\$€£]\s*([0-9,]+\.[0-9]{2})/);
  if (priceMatch && priceMatch[1]) purchasePrice = parseFloat(priceMatch[1].replace(/,/g, ''));

  if (text.includes('$') || /USD/i.test(text)) currency = 'USD';
  else if (text.includes('€') || /EUR/i.test(text)) currency = 'EUR';
  else if (text.includes('£') || /GBP/i.test(text)) currency = 'GBP';

  const warrantyMatch = text.match(/([0-9]+)\s*(?:-|–|\s)?(?:year|yr|month|mo)s?\s*(?:limited\s*)?(?:warranty|guarantee)/i);
  if (warrantyMatch && warrantyMatch[1]) {
    const num = parseInt(warrantyMatch[1], 10);
    if (/year|yr/i.test(warrantyMatch[0])) warrantyDurationMonths = num * 12;
    else warrantyDurationMonths = num;
  }

  const expiryMatch = text.match(/(?:warranty\s*expiry(?:\s*date)?|expiry\s*date|expires\s*(?:on)?)[:\s]+([0-9]{4}[-/][0-9]{2}[-/][0-9]{2}|[0-9]{2}[-/][0-9]{2}[-/][0-9]{4}|[A-Za-z]+ \d{1,2}, \d{4})/i);
  if (expiryMatch && expiryMatch[1]) {
    const p = new Date(expiryMatch[1]);
    if (!isNaN(p.getTime())) warrantyExpiryDate = p.toISOString().split('T')[0];
  } else if (purchaseDate && warrantyDurationMonths) {
    const pDate = new Date(purchaseDate);
    if (!isNaN(pDate.getTime())) {
      pDate.setMonth(pDate.getMonth() + warrantyDurationMonths);
      warrantyExpiryDate = pDate.toISOString().split('T')[0];
    }
  }

  // Confidence score heuristic
  let score = 0;
  if (brand) score += 20;
  if (serialNumber) score += 25;
  if (assetName) score += 20;
  if (purchasePrice) score += 15;
  if (purchaseDate) score += 10;
  if (warrantyExpiryDate) score += 10;

  return {
    assetName: assetName || (brand ? `${brand} Asset` : 'Registered Asset'),
    brand: brand || 'Generic',
    model: model || 'Standard Model',
    serialNumber: serialNumber || 'N/A',
    purchaseDate: purchaseDate || new Date().toISOString().split('T')[0],
    purchasePrice: purchasePrice || 0,
    currency,
    warrantyDurationMonths,
    warrantyExpiryDate: warrantyExpiryDate || '',
    vendorName: vendorName || 'Authorized Dealer',
    documentType,
    rawText: text,
    confidenceScore: Math.min(score, 98)
  };
}

export async function processDocumentWithOcr(imageSource, onProgress) {
  // Direct text sample fallback – not used in server context
  if (typeof imageSource === 'string' && imageSource.startsWith('data:text/plain;')) {
    const decoded = decodeURIComponent(imageSource.split(',')[1]);
    return parseExtractedText(decoded);
  }
  try {
    onProgress && onProgress(10, 'Initializing OCR engine...');
    const worker = await createWorker();
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    onProgress && onProgress(35, 'Running OCR on document...');
    const result = await worker.recognize(imageSource);
    onProgress && onProgress(80, 'Extracting structured fields...');
    await worker.terminate();
    const extractedText = result?.data?.text ?? '';
    onProgress && onProgress(100, 'Extraction complete');
    return parseExtractedText(extractedText);
  } catch (err) {
    console.warn('OCR error, fallback to empty result', err);
    return {
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
      documentType: undefined,
      rawText: '',
      confidenceScore: 0
    };
  }
}
