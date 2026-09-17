export const DEFAULT_NETWORK_HOST = typeof window !== 'undefined' ? window.location.origin : 'https://10.87.201.156:5173';

export function generateSourceQR(userOrSource) {
  if (userOrSource && userOrSource.qrCode) return userOrSource.qrCode;
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `QR-WG-${randNum}`;
}

export function getSourceQRUrl(qrCode, customHost) {
  let host = customHost;
  if (!host || host.includes('172.23.249.30')) {
    host = (typeof window !== 'undefined' && window.location.origin) || DEFAULT_NETWORK_HOST;
  }
  host = host.replace(/\/+$/, '');
  return `${host}/verify-source?code=${encodeURIComponent(qrCode || 'QR-WG-1001')}`;
}

export function parseQRData(qrString) {
  if (!qrString) return null;
  const trimmed = qrString.trim();

  // If it's a full URL e.g. http://172.23.249.30:5173/verify-source?code=QR-WG-1001 or /source/QR-WG-1001
  if (trimmed.includes('http://') || trimmed.includes('https://') || trimmed.includes('/verify-source') || trimmed.includes('/source/')) {
    try {
      const url = new URL(trimmed.startsWith('http') ? trimmed : `http://localhost${trimmed}`);
      const codeParam = url.searchParams.get('code');
      if (codeParam) {
        return { type: 'WASTE_SOURCE', code: codeParam, url: trimmed };
      }
      const pathSegments = url.pathname.split('/').filter(Boolean);
      const lastSegment = pathSegments[pathSegments.length - 1];
      if (lastSegment && (lastSegment.startsWith('QR-WG-') || lastSegment.startsWith('QR-'))) {
        return { type: 'WASTE_SOURCE', code: lastSegment, url: trimmed };
      }
      if (lastSegment && lastSegment.startsWith('BATCH-')) {
        return { type: 'WASTE_BATCH', code: lastSegment, url: trimmed };
      }
    } catch (_) {}
  }

  // Direct Format check e.g. QR-WG-1001 or BATCH-2026-0891
  if (trimmed.startsWith('QR-WG-') || trimmed.startsWith('QR-')) {
    return { type: 'WASTE_SOURCE', code: trimmed };
  }
  if (trimmed.startsWith('BATCH-')) {
    return { type: 'WASTE_BATCH', code: trimmed };
  }
  return { type: 'UNKNOWN', code: trimmed };
}

export function generateBatchID() {
  const year = new Date().getFullYear();
  const randSeq = Math.floor(1000 + Math.random() * 9000);
  return `BATCH-${year}-${randSeq}`;
}

export function generateOrderID() {
  const year = new Date().getFullYear();
  const randSeq = Math.floor(4000 + Math.random() * 9000);
  return `ORD-${year}-${randSeq}`;
}

export function generateInvoiceID() {
  const year = new Date().getFullYear();
  const randSeq = Math.floor(1000 + Math.random() * 9000);
  return `INV-${year}-${randSeq}`;
}

export function generateReceiptID() {
  const year = new Date().getFullYear();
  const randSeq = Math.floor(1000 + Math.random() * 9000);
  return `REC-${year}-${randSeq}`;
}

