import QRCode from 'qrcode';

export interface AssetQrPayload {
  app: 'OwnIQ';
  version: '1.0';
  assetId: string;
  name: string;
  serialNumber: string;
  verificationUrl: string;
}

export async function generateAssetQrCode(assetId: string, name: string, serialNumber: string): Promise<string> {
  const payload: AssetQrPayload = {
    app: 'OwnIQ',
    version: '1.0',
    assetId,
    name,
    serialNumber,
    verificationUrl: `https://owniq.app/verify/${assetId}`
  };

  try {
    const dataUrl = await QRCode.toDataURL(JSON.stringify(payload), {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 320,
      color: {
        dark: '#034b83', // Brand dark blue
        light: '#ffffff'
      }
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate QR code', err);
    return '';
  }
}

export function parseAssetQrCode(rawString: string): { assetId?: string; name?: string; serialNumber?: string } | null {
  try {
    const parsed = JSON.parse(rawString);
    if (parsed.app === 'OwnIQ' && parsed.assetId) {
      return {
        assetId: parsed.assetId,
        name: parsed.name,
        serialNumber: parsed.serialNumber
      };
    }
  } catch {
    // If it's a plain string like "owniq-macbook-1" or url
    const match = rawString.match(/asset[\/=:]([A-Za-z0-9\-_]+)/i);
    if (match && match[1]) {
      return { assetId: match[1] };
    }
  }
  return null;
}
