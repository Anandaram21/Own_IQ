import { createWorker } from "tesseract.js";
import type { OcrExtractedData } from "../types";

export interface SampleOcrDoc {
  name: string;
  category: string;
  description: string;
  sampleImageUrl: string;
  simulatedText: string;
}

export const SAMPLE_DOCUMENTS: SampleOcrDoc[] = [
  {
    name: "Apple Store Invoice - MacBook Pro",
    category: "Invoice",
    description: "Sample laptop invoice with purchase and warranty details.",
    sampleImageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
    simulatedText: `APPLE RETAIL STORE
INVOICE: INV-2024-98421
DATE: 2024-03-15
ITEM: MacBook Pro 16-inch M3 Max
BRAND: Apple
MODEL: A2991
SERIAL NO: C02XG123K9J2
PURCHASE PRICE: $2499.00 USD
1-Year Limited Apple Hardware Warranty Included.
Warranty Expiry Date: 2025-03-15`,
  },
  {
    name: "Sony Headphones Receipt",
    category: "Receipt",
    description: "Sample electronics receipt with a protection plan.",
    sampleImageUrl:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
    simulatedText: `BEST BUY STORE
RECEIPT: 84920-1124-77
DATE: 2024-05-20
PRODUCT: SONY WH-1000XM5 WIRELESS HEADPHONES
BRAND: Sony
MODEL: WH1000XM5/S
SERIAL NUMBER: S01-9876543-H
PRICE: $399.99 USD
WARRANTY: 24 MONTHS SONY MANUFACTURER WARRANTY
WARRANTY EXPIRY: 2026-05-20`,
  },
  {
    name: "Dyson Warranty Certificate",
    category: "Warranty Certificate",
    description: "Sample vacuum cleaner warranty certificate.",
    sampleImageUrl:
      "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80",
    simulatedText: `DYSON OFFICIAL GUARANTEE CERTIFICATE
DATE OF PURCHASE: 2023-11-10
PRODUCT NAME: Dyson V15 Detect Cordless Vacuum Cleaner
BRAND: Dyson
MODEL NUMBER: SV22
SERIAL NUMBER: DY-V15-894726-X
PURCHASE PRICE: $749.99 USD
GUARANTEE DURATION: 2 Years (24 Months)
EXPIRY DATE: 2025-11-10`,
  },
];

type DocumentType =
  | "Receipt"
  | "Invoice"
  | "Warranty Certificate"
  | "Service Record";

function parseDateStr(str: string): string {
  if (!str) return "";
  const trimmed = str.trim();
  // YYYY-MM-DD or YYYY/MM/DD
  let m = trimmed.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (m) {
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    if (y >= 1900 && y <= 2200 && mo >= 1 && mo <= 12 && d >= 1 && d <= 31) {
      return `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }
  }
  // DD-MM-YYYY or DD/MM/YYYY
  m = trimmed.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (m) {
    const d = Number(m[1]);
    const mo = Number(m[2]);
    const y = Number(m[3]);
    if (y >= 1900 && y <= 2200 && mo >= 1 && mo <= 12 && d >= 1 && d <= 31) {
      return `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }
  }
  // Textual dates e.g. "March 15, 2024" or "15 March 2024"
  const textual = trimmed.match(/([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})|(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (textual) {
    const monthNames: Record<string, number> = {
      jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3,
      apr: 4, april: 4, may: 5, jun: 6, june: 6, jul: 7, july: 7,
      aug: 8, august: 8, sep: 9, sept: 9, september: 9,
      oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12,
    };
    const monthStr = (textual[1] || textual[5]).toLowerCase();
    const dayVal = Number(textual[2] || textual[4]);
    const yearVal = Number(textual[3] || textual[6]);
    const moVal = monthNames[monthStr];
    if (moVal && yearVal >= 1900 && yearVal <= 2200) {
      return `${yearVal}-${String(moVal).padStart(2, "0")}-${String(dayVal).padStart(2, "0")}`;
    }
  }
  return "";
}

export function parseExtractedText(text: string): OcrExtractedData {
  const cleaned = text.replace(/\r/g, "\n").replace(/[ \t]+/g, " ").trim();

  // 1. Detect Brand
  const brandList = [
    "Apple", "Sony", "Dyson", "Samsung", "Dell", "Lenovo", "HP", "Acer", "Asus", "MSI",
    "Honda", "Toyota", "Bose", "Logitech", "Anker", "Canon", "Nikon", "Samsonite",
    "LG", "Philips", "Microsoft", "Nintendo", "Google", "Whirlpool", "Bosch", "Panasonic",
    "Godrej", "Voltas", "Daikin", "Haier", "Hitachi", "Xiaomi", "OnePlus", "Realme",
    "Vivo", "Oppo", "Motorola", "Nokia", "Boat", "Noise", "Fire-Boltt", "Zebronics"
  ];
  let brand = "";
  for (const b of brandList) {
    if (new RegExp(`\\b${b}\\b`, "i").test(cleaned)) {
      brand = b;
      break;
    }
  }

  // 2. Detect Vendor / Marketplace
  const vendorList = [
    "Flipkart", "Amazon", "Apple Store", "Apple", "Best Buy", "Croma", "Reliance Digital",
    "Tata Neu", "Vijay Sales", "Target", "Walmart", "Costco", "Dyson", "Home Depot"
  ];
  let vendorName = "";
  for (const v of vendorList) {
    if (new RegExp(`\\b${v}\\b`, "i").test(cleaned)) {
      vendorName = v;
      break;
    }
  }
  if (!vendorName) {
    const soldByMatch = cleaned.match(/Sold\s+By\s*:\s*([^\r\n,]+)/i);
    if (soldByMatch?.[1]) {
      vendorName = soldByMatch[1].trim();
    }
  }

  // 3. Document Type
  let documentType: DocumentType = "Receipt";
  if (/tax\s+invoice|invoice/i.test(cleaned)) documentType = "Invoice";
  else if (/warranty\s+certificate|guarantee\s+certificate/i.test(cleaned)) documentType = "Warranty Certificate";
  else if (/service\s+record|service\s+report|repair\s+details/i.test(cleaned)) documentType = "Service Record";
  else if (/bill\s+of\s+supply/i.test(cleaned)) documentType = "Invoice";
  else if (/receipt/i.test(cleaned)) documentType = "Receipt";

  // 4. Serial Number / IMEI (ignore FSN: or general header names)
  let serialNumber = "";
  const serialPatterns = [
    /(?:\[?\s*imei\s*\/?\s*serial\s*(?:no|number)?|\[?\s*serial\s*(?:no|number)?|\bs\/n\b|\bsn\b|imei|service\s*tag)[:\s#\-\[]+([A-Z0-9_\-]{6,35})/i,
    /(?:registration\s*ref)[:\s#\-]+([A-Z0-9_\-]{6,35})/i,
    /(?:serial\s*(?:no|number)?)\s*[:#\-]?\s*([A-Z0-9_\-]{6,35})/im,
  ];
  for (const p of serialPatterns) {
    const m = cleaned.match(p);
    if (m?.[1]) {
      const val = m[1].trim().replace(/[\]]/g, "");
      if (!/^(number|product|description|serial|invoice|receipt|comhpds)$/i.test(val)) {
        serialNumber = val;
        break;
      }
    }
  }

  // 5. Model
  let model = "";
  const modelPatterns = [
    /(?:model(?:\s*(?:no|number))?|product\s*model)\s*[:#\-]\s*([^\r\n,]{2,40})/i,
    // Typical tech model format with letters and hyphen (e.g. AS14H-53, WH-1000XM5)
    /\b([A-Za-z]+[0-9A-Za-z]*-[0-9A-Za-z]+)\b/,
    /\b(A\d{4})\b/, // Apple models e.g. A2991
  ];
  for (const p of modelPatterns) {
    const m = cleaned.match(p);
    if (m?.[1]) {
      const candidate = m[1].trim();
      if (!/^(number|name|title|qty)$/i.test(candidate)) {
        model = candidate;
        break;
      }
    }
  }

  // 6. Product / Asset Name
  let assetName = "";
  // If brand is known, check for a line containing brand + product name
  if (brand) {
    const brandLineMatch = cleaned.match(new RegExp(`^.*\\b(${brand}\\s+[A-Za-z0-9][^\r\n]{3,100}).*$`, "im"));
    if (brandLineMatch?.[1]) {
      assetName = brandLineMatch[1].trim().replace(/\s*Warranty.*$/i, "");
    }
  }
  if (!assetName) {
    const nameMatch = cleaned.match(/(?:product\s*name|item\s*description|description|item)\s*[:#\-]?\s*([^\r\n]{3,90})/i);
    if (nameMatch?.[1]) {
      const candidate = nameMatch[1].trim();
      if (!/qty|gross|amount|discount|taxable|igst|total/i.test(candidate)) {
        assetName = candidate;
      }
    }
  }
  if (!assetName && brand && model) {
    assetName = `${brand} ${model}`;
  } else if (!assetName && brand) {
    assetName = `${brand} Asset`;
  }

  // 7. Purchase Date
  let purchaseDate = "";
  const datePatterns = [
    /(?:invoice\s*date|bill\s*date|date\s*of\s*purchase|purchase\s*date)\s*[:#\-]?\s*(\d{1,2}[-/.]\d{1,2}[-/.]\d{4}|\d{4}[-/.]\d{1,2}[-/.]\d{1,2})/i,
    /(?:order\s*date)\s*[:#\-]?\s*(\d{1,2}[-/.]\d{1,2}[-/.]\d{4}|\d{4}[-/.]\d{1,2}[-/.]\d{1,2})/i,
    /(?:date)\s*[:#\-]?\s*(\d{1,2}[-/.]\d{1,2}[-/.]\d{4}|\d{4}[-/.]\d{1,2}[-/.]\d{1,2})/i,
  ];
  for (const p of datePatterns) {
    const m = cleaned.match(p);
    if (m?.[1]) {
      const parsed = parseDateStr(m[1]);
      if (parsed) {
        purchaseDate = parsed;
        break;
      }
    }
  }
  if (!purchaseDate) {
    // Scan all date formats in document
    const anyDate = cleaned.match(/\b(\d{1,2}[-/.]\d{1,2}[-/.]\d{4}|\d{4}[-/.]\d{1,2}[-/.]\d{1,2})\b/);
    if (anyDate?.[1]) {
      purchaseDate = parseDateStr(anyDate[1]);
    }
  }

  // 8. Purchase Price & Currency
  let currency = "USD";
  if (/₹|INR|\bRs\.?\b/i.test(cleaned)) currency = "INR";
  else if (/€|\bEUR\b/i.test(cleaned)) currency = "EUR";
  else if (/£|\bGBP\b/i.test(cleaned)) currency = "GBP";

  let purchasePrice = 0;
  const pricePatterns = [
    /(?:grand\s+total|invoice\s+total|total\s+amount|net\s+amount|amount\s+payable)\s*[:\-]?\s*(?:[₹$€£]|INR|Rs\.?|USD)?\s*([\d,]+(?:\.\d{1,2})?)/i,
    /(?:total)\s*(?:[₹$€£]|INR|Rs\.?|USD)?\s*[:\-]?\s*([\d,]+(?:\.\d{1,2})?)/i,
    /(?:purchase\s*price|price)\s*[:\-]?\s*(?:[₹$€£]|INR|Rs\.?|USD)?\s*([\d,]+(?:\.\d{1,2})?)/i,
    /(?:[₹$€£]|INR|Rs\.?)\s*([\d,]+(?:\.\d{1,2})?)/i,
  ];
  for (const p of pricePatterns) {
    const m = cleaned.match(p);
    if (m?.[1]) {
      const val = parseFloat(m[1].replace(/,/g, ""));
      if (val > 0) {
        purchasePrice = val;
        break;
      }
    }
  }

  // 9. Warranty Duration
  let warrantyDurationMonths = 12;
  const warrantyPatterns = [
    /(?:warranty|guarantee)(?:\s+(?:period|duration))?\s*[:\-]?\s*(\d{1,2})\s*(years?|yrs?|months?|mos?)/i,
    /(\d{1,2})\s*(years?|yrs?|months?|mos?)(?:\s+(?:limited\s+)?(?:manufacturer\s+)?(?:onsite\s+)?(?:service\s+)?(?:hardware\s+)?(?:warranty|guarantee))/i,
    /(?:warranty|guarantee)[^\n]{0,60}?\b(\d{1,2})\s*(years?|yrs?|months?|mos?)\b/i,
  ];
  for (const p of warrantyPatterns) {
    const m = cleaned.match(p);
    if (m?.[1] && m?.[2]) {
      const count = parseInt(m[1], 10);
      warrantyDurationMonths = m[2].toLowerCase().startsWith("y") ? count * 12 : count;
      break;
    }
  }

  // 10. Warranty Expiry Date
  let warrantyExpiryDate = "";
  const expiryPatterns = [
    /(?:warranty\s*expiry(?:\s*date)?|expiry\s*date|valid\s*till|valid\s*until)\s*[:#\-]?\s*(\d{1,2}[-/.]\d{1,2}[-/.]\d{4}|\d{4}[-/.]\d{1,2}[-/.]\d{1,2})/i,
  ];
  for (const p of expiryPatterns) {
    const m = cleaned.match(p);
    if (m?.[1]) {
      const parsed = parseDateStr(m[1]);
      if (parsed) {
        warrantyExpiryDate = parsed;
        break;
      }
    }
  }
  if (!warrantyExpiryDate && purchaseDate && warrantyDurationMonths) {
    const [y, m, d] = purchaseDate.split("-").map(Number);
    const dateObj = new Date(Date.UTC(y, m - 1 + warrantyDurationMonths, d));
    warrantyExpiryDate = dateObj.toISOString().split("T")[0];
  }

  // 11. Confidence score
  let score = 0;
  if (brand) score += 20;
  if (serialNumber) score += 25;
  if (assetName) score += 20;
  if (purchasePrice > 0) score += 15;
  if (purchaseDate) score += 10;
  if (warrantyExpiryDate) score += 10;

  return {
    assetName: assetName || (brand ? `${brand} Asset` : "Registered Asset"),
    brand: brand || "Generic",
    model: model || "Standard Model",
    serialNumber: serialNumber || "N/A",
    purchaseDate: purchaseDate || new Date().toISOString().split("T")[0],
    purchasePrice: purchasePrice || 0,
    currency,
    warrantyDurationMonths,
    warrantyExpiryDate: warrantyExpiryDate || "",
    vendorName: vendorName || "Authorized Dealer",
    documentType,
    rawText: cleaned,
    confidenceScore: Math.min(score, 98),
  };
}

export function processSampleDocument(sample: SampleOcrDoc): OcrExtractedData {
  return parseExtractedText(sample.simulatedText);
}

/**
 * Loads Mozilla pdf.js from the local /pdfjs/pdf.js static asset.
 */
async function getPdfJs(): Promise<any> {
  if (typeof window !== "undefined" && (window as any).pdfjsLib) {
    return (window as any).pdfjsLib;
  }
  return new Promise((resolve, reject) => {
    if (typeof document === "undefined") {
      reject(new Error("Document object unavailable"));
      return;
    }
    const script = document.createElement("script");
    script.src = "/pdfjs/pdf.js";
    script.onload = () => {
      const lib = (window as any).pdfjsLib;
      if (lib) {
        lib.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.js";
        resolve(lib);
      } else {
        reject(new Error("pdf.js failed to initialize"));
      }
    };
    script.onerror = () => reject(new Error("Could not load /pdfjs/pdf.js"));
    document.head.appendChild(script);
  });
}

/**
 * Extracts embedded text from a PDF, or renders pages to canvas for OCR if scanned.
 */
async function extractTextFromPdf(
  fileOrBuffer: Blob | ArrayBuffer,
  onProgress?: (progress: number, status: string) => void,
): Promise<string> {
  onProgress?.(15, "Loading PDF parsing engine...");
  const pdfjs = await getPdfJs();
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.js";

  const arrayBuffer =
    fileOrBuffer instanceof Blob
      ? await fileOrBuffer.arrayBuffer()
      : fileOrBuffer;

  onProgress?.(30, "Reading document structure...");
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;

  let fullText = "";
  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    onProgress?.(
      30 + Math.round((pageNum / pdfDoc.numPages) * 50),
      `Extracting text from page ${pageNum} of ${pdfDoc.numPages}...`
    );
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" ");
    fullText += `\n--- Page ${pageNum} ---\n` + pageText;
  }

  // If the PDF had embedded text (digital invoice like Flipkart / Amazon)
  if (fullText.replace(/--- Page \d+ ---/g, "").trim().length > 30) {
    return fullText;
  }

  // Scanned PDF fallback: render pages to canvas and run OCR
  onProgress?.(60, "Scanned PDF detected. Running optical character recognition...");
  let worker: Awaited<ReturnType<typeof createWorker>> | undefined;
  try {
    worker = await createWorker("eng");
    let ocrText = "";
    const pagesToScan = Math.min(pdfDoc.numPages, 3);
    for (let pageNum = 1; pageNum <= pagesToScan; pageNum++) {
      onProgress?.(
        60 + Math.round((pageNum / pagesToScan) * 30),
        `Recognizing scanned page ${pageNum}...`
      );
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        await page.render({ canvasContext: ctx, viewport }).promise;
        const res = await worker.recognize(canvas);
        ocrText += `\n` + (res.data?.text || "");
      }
    }
    return ocrText;
  } finally {
    if (worker) await worker.terminate();
  }
}

/**
 * Universal document OCR & extraction processor.
 * Supports:
 *  - Simulated demo data (`data:text/plain`)
 *  - PDF documents (both digital text and scanned image PDFs)
 *  - Image documents (JPG, PNG, WebP)
 */
export async function processDocumentWithOcr(
  imageSource: string | File,
  onProgress?: (progress: number, status: string) => void,
): Promise<OcrExtractedData> {
  // ─── 1. Demo Mode ──────────────────────────────────────────────────────────
  if (typeof imageSource === "string" && imageSource.startsWith("data:text/plain")) {
    onProgress?.(20, "Loading sample document...");
    const commaIdx = imageSource.indexOf(",");
    const encoded = imageSource.slice(commaIdx + 1);
    const decoded = decodeURIComponent(encoded);
    onProgress?.(60, "Parsing document fields...");
    const result = parseExtractedText(decoded);
    onProgress?.(100, "Extraction complete.");
    return result;
  }

  // ─── 2. PDF Processing ─────────────────────────────────────────────────────
  const isPdf =
    (imageSource instanceof File && (imageSource.type === "application/pdf" || imageSource.name.toLowerCase().endsWith(".pdf"))) ||
    (typeof imageSource === "string" && (imageSource.startsWith("data:application/pdf") || imageSource.toLowerCase().includes(".pdf")));

  if (isPdf) {
    try {
      const extractedText = await extractTextFromPdf(imageSource as any, onProgress);
      if (!extractedText.trim()) {
        throw new Error("No readable text found in PDF document.");
      }
      onProgress?.(92, "Extracting asset & warranty fields...");
      const result = parseExtractedText(extractedText);
      onProgress?.(100, "Extraction complete!");
      return result;
    } catch (err) {
      console.error("PDF processing error:", err);
      throw new Error(
        err instanceof Error ? err.message : "Failed to process PDF document."
      );
    }
  }

  // ─── 3. Image OCR Processing via Tesseract.js ──────────────────────────────
  let worker: Awaited<ReturnType<typeof createWorker>> | undefined;
  let objectUrl: string | undefined;

  try {
    onProgress?.(10, "Initializing OCR optical engine...");

    worker = await createWorker("eng", 1, {
      logger: (msg: { status: string; progress?: number }) => {
        if (msg.status === "recognizing text") {
          onProgress?.(
            35 + Math.round((msg.progress ?? 0) * 50),
            "Recognizing document text...",
          );
        } else if (msg.status === "loading tesseract core") {
          onProgress?.(15, "Loading OCR core...");
        } else if (msg.status === "loading language traineddata") {
          onProgress?.(25, "Loading OCR language model...");
        }
      },
    });

    onProgress?.(30, "Reading document image...");

    const source: string =
      typeof imageSource === "string"
        ? imageSource
        : (objectUrl = URL.createObjectURL(imageSource as Blob));

    const result = await worker.recognize(source);
    const extractedText = result.data?.text?.trim() || "";

    if (!extractedText) {
      throw new Error("No readable text found. Try a clearer image or PDF.");
    }

    onProgress?.(88, "Extracting asset & warranty details...");
    const extracted = parseExtractedText(extractedText);
    onProgress?.(100, "Extraction complete!");
    return extracted;
  } catch (error) {
    console.error("OCR failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "OCR processing failed. Please try again.",
    );
  } finally {
    if (worker) await worker.terminate();
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}
