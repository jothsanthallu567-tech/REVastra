import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Modal } from '../common/Modal';
import { Download, Printer, Copy, CheckCircle } from 'lucide-react';
import { getSourceQRUrl } from '../../services/qrService';

export function QRViewerModal({ isOpen, onClose, userOrSource }) {
  const [copied, setCopied] = React.useState(false);

  if (!userOrSource) return null;

  const qrCodeValue = userOrSource.qrCode || `QR-WG-${userOrSource.id}`;
  const scannableUrl = getSourceQRUrl(qrCodeValue);

  const handleCopy = () => {
    navigator.clipboard.writeText(qrCodeValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Waste Source Unique QR Identity" maxWidth="max-w-md">
      <div className="text-center space-y-4">
        <p className="text-xs text-slate-400">
          This QR code uniquely identifies your waste generation point. Show this to the REVastra collector during pickup.
        </p>

        {/* QR Code Container */}
        <div className="p-6 bg-white rounded-2xl inline-block shadow-xl border-4 border-emerald-500/30">
          <QRCodeSVG
            value={scannableUrl}
            size={180}
            level="H"
            includeMargin={true}
          />
        </div>

        <div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            {qrCodeValue}
          </span>
          <p className="mt-2 text-xs font-semibold text-slate-200">{userOrSource.name || userOrSource.address}</p>
          <p className="text-[11px] text-slate-400">{userOrSource.sourceType || 'Household'} Waste Generator</p>
        </div>

        {/* Actions */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-600/30"
          >
            <Printer className="w-4 h-4" /> Print Sticker
          </button>
        </div>
      </div>
    </Modal>
  );
}
