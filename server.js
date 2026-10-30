// OCR extraction server using Express, Multer, Tesseract.js, and pdf-parse
import express from "express";
import multer from "multer";
import { createWorker } from "tesseract.js";


const app = express();
const PORT = 5001;

app.use(express.json());

// Keep uploads in memory instead of writing to disk.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/tiff",
      "text/plain",
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only supported images and PDFs are allowed."));
  },
});

// Type definitions (removed for plain JS runtime)
// type WarrantyDuration = {
//   value: number;
//   unit: "months" | "years";
// };

// Type definitions (removed for plain JS runtime)
// type AssetExtraction = {
//   asset_name: string | null;
//   brand: string | null;
//   model: string | null;
//   serial_number: string | null;
//   purchase_date: string | null;
//   purchase_price: number | null;
//   warranty_duration: WarrantyDuration | null;
//   warranty_expiry_date: string | null;
//   service_information: string | null;
//   document_type: string;
//   raw_ocr_text: string;
//   needs_user_review: boolean;
// };

function findFirst(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].trim().replace(/[ \t:.-]+$/, "");
  }
  return null;
}

function normalizeDate(value) {
  if (!value) return null;
  const cleaned = value.trim();
  let year, month, day;
  let match = cleaned.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (match) {
    year = Number(match[1]); month = Number(match[2]); day = Number(match[3]);
  } else {
    match = cleaned.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
    if (!match) return null;
    day = Number(match[1]); month = Number(match[2]); year = Number(match[3]);
  }
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day ||
    year < 1900 || year > 2200
  ) {
    return null;
  }
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function extractPrice(text) {
  const patterns = [
    /(?:grand\s+total|invoice\s+total|total\s+amount|amount\s+payable|net\s+amount|amount\s+paid|total)\s*[:\-]?\s*(?:INR|Rs\.?|₹)\s*([\d,]+(?:\.\d{1,2})?)/i,
    /(?:INR|Rs\.?|₹)\s*([\d,]+(?:\.\d{1,2})?)/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m?.[1]) {
      const price = Number(m[1].replace(/,/g, ""));
      if (Number.isFinite(price)) return price;
    }
  }
  return null;
}

function extractWarrantyDuration(text) {
  const patterns = [
    /warranty\s*(?:period|duration)?\s*[:\-]?\s*(\d{1,2})\s*(years?|yrs?|months?|mos?)/i,
    /(\d{1,2})\s*(years?|yrs?|months?|mos?)\s*warranty/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m) {
      const unit = m[2].toLowerCase();
      return { value: Number(m[1]), unit: unit.startsWith("m") ? "months" : "years" };
    }
  }
  return null;
}

function addWarrantyDuration(startDate, duration) {
  if (!startDate || !duration) return null;
  const [y, m, d] = startDate.split("-").map(Number);
  const extraMonths = duration.value * (duration.unit === "years" ? 12 : 1);
  const monthIndex = m - 1 + extraMonths;
  const targetYear = y + Math.floor(monthIndex / 12);
  const targetMonth = (monthIndex % 12) + 1;
  if (targetYear > 2200) return null;
  const lastDay = new Date(Date.UTC(targetYear, targetMonth, 0)).getUTCDate();
  const targetDay = Math.min(d, lastDay);
  return `${String(targetYear)}-${String(targetMonth).padStart(2, "0")}-${String(targetDay).padStart(2, "0")}`;
}

function extractAssetData(text) {
  const assetName = findFirst(text, [/^\s*(?:product\s*name|item\s*description|description|product)\s*[:#-]\s*([^\r\n]{1,100})/im]);
  const brand = findFirst(text, [/^\s*(?:brand|manufacturer|make)\s*[:#-]\s*([^\r\n]{1,100})/im]);
  const model = findFirst(text, [/^\s*(?:model(?:\s*(?:number|no\.?))?|product\s*model)\s*[:#-]\s*([^\r\n]{1,100})/im]);
  const serialNumber = findFirst(text, [/^\s*(?:serial(?:\s*(?:number|no\.?))?|service\s*tag|s\/n)\s*[:#-]\s*([^\r\n]{1,100})/im]);
  const purchaseDateRaw = findFirst(text, [/^\s*(?:purchase\s*date|date\s*of\s*purchase|invoice\s*date|bill\s*date|date)\s*[:#-]\s*(\d{4}[-/.]\d{1,2}[-/.]\d{1,2}|\d{1,2}[-/.]\d{1,2}[-/.]\d{4})/im]);
  const purchaseDate = normalizeDate(purchaseDateRaw);
  const purchasePrice = extractPrice(text);
  const warrantyDuration = extractWarrantyDuration(text);
  const expiryRaw = findFirst(text, [/^\s*(?:warranty\s*expiry\s*date|warranty\s*expiration\s*date|warranty\s*valid\s*until|valid\s*until)\s*[:#-]\s*(\d{4}[-/.]\d{1,2}[-/.]\d{1,2}|\d{1,2}[-/.]\d{1,2}[-/.]\d{4})/im]);
  const explicitExpiry = normalizeDate(expiryRaw);
  const warrantyExpiry = explicitExpiry ?? addWarrantyDuration(purchaseDate, warrantyDuration);
  const serviceInformation = findFirst(text, [/^\s*(?:service\s*details|service\s*record|work\s*performed|repair\s*details|maintenance)\s*[:#-]\s*([^\r\n]{1,200})/im]);

  const lower = text.toLowerCase();
  let documentType = "unknown";
  if (/warranty certificate|warranty card|warranty period/.test(lower)) documentType = "warranty";
  else if (/insurance policy|policy number|insured/.test(lower)) documentType = "insurance";
  else if (/service report|repair details|service record/.test(lower)) documentType = "service_record";
  else if (/invoice|tax invoice|bill no|receipt/.test(lower)) documentType = "invoice_or_receipt";
  else if (/product manual|user guide/.test(lower)) documentType = "product_manual";

  return {
    asset_name: assetName,
    brand,
    model,
    serial_number: serialNumber,
    purchase_date: purchaseDate,
    purchase_price: purchasePrice,
    warranty_duration: warrantyDuration,
    warranty_expiry_date: warrantyExpiry,
    service_information: serviceInformation,
    document_type: documentType,
    raw_ocr_text: text,
    needs_user_review: true,
  };
}

app.post("/api/ocr/extract", upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "Please upload a document." });
    return;
  }
  let text = "";
  let worker = null;
  try {
// Handle plain text files directly
    if (req.file.mimetype === "text/plain") {
      text = req.file.buffer.toString("utf-8").trim();
    } else if (req.file.mimetype === "application/pdf") {
      // Try OCR on PDF first
      worker = await createWorker();
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      const result = await worker.recognize(req.file.buffer);
      text = result.data.text.trim();
      // If OCR yields nothing, fallback to pdf-parse
      if (!text) {
        try {
          const pdfParse = (await import("pdf-parse")).default;
          const data = await pdfParse(req.file.buffer);
          text = data.text.trim();
        } catch (_) {}
      }
    } else {
      // Image handling via OCR
      worker = await createWorker();
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      const result = await worker.recognize(req.file.buffer);
      text = result.data.text.trim();
    }
    if (req.file.mimetype === "application/pdf") {
      // Attempt to extract text via OCR on PDF buffer (fallback).
      worker = await createWorker();
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      const result = await worker.recognize(req.file.buffer);
      text = result.data.text.trim();
      if (!text) {
        res.status(422).json({ error: "PDF cannot be processed – no text extracted." });
        return;
      }
    } else {
      worker = await createWorker();
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      const result = await worker.recognize(req.file.buffer);
      text = result.data.text.trim();
    }
    if (!text) {
      res.status(422).json({ error: "No readable text found. Try a clearer document." });
      return;
    }
    res.status(200).json(extractAssetData(text));
  } catch (err) {
    console.error("OCR extraction failed:", err);
    res.status(500).json({ error: "Document processing failed. Please try again." });
  } finally {
    if (worker) await worker.terminate();
  }
});

// Error handling middleware for Multer
app.use((error, _req, res, _next) => {
  if (error.code === "LIMIT_FILE_SIZE") {
    res.status(413).json({ error: "File exceeds 15 MB limit." });
    return;
  }
  res.status(400).json({ error: error.message });
});

app.get("/api/ocr/extract", (req, res) => res.json({ message: "Use POST /api/ocr/extract to upload a file" }));

app.get("/", (req, res) => res.send("OCR API is running. Use POST /api/ocr/extract to upload files."));
const server = app.listen(PORT, () => {
  console.log(`OCR API running at http://localhost:${server.address().port}`);
});


