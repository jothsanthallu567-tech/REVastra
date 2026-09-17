import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  PackageCheck,
  FileCheck2,
  Building2,
  FileText,
  Receipt,
  Printer,
  CheckCircle2,
  Clock,
  QrCode,
  MapPin,
  Calendar,
  CreditCard,
  Download,
  AlertCircle
} from 'lucide-react';

export function BuyerOrders() {
  const { currentUser } = useAuth();
  const { data } = useData();

  const [activeTab, setActiveTab] = useState('ALL'); // ALL | INVOICES | RECEIPTS | PENDING
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);

  const myOrders = (data.orders || []).filter(
    (o) => !currentUser || o.buyerId === currentUser.id || o.buyerName === currentUser.name || currentUser.role === 'admin'
  );

  const filteredOrders = myOrders.filter((ord) => {
    if (activeTab === 'INVOICES') return ord.invoiceId && ord.status !== 'Cancelled / Rejected';
    if (activeTab === 'RECEIPTS') return ord.receiptId || ord.status === 'Stock Collected & Paid';
    if (activeTab === 'PENDING') return ord.status === 'Pending Admin Approval';
    return true;
  });

  const countPending = myOrders.filter((o) => o.status === 'Pending Admin Approval').length;
  const countInvoiced = myOrders.filter((o) => o.invoiceId && o.status !== 'Stock Collected & Paid' && o.status !== 'Cancelled / Rejected').length;
  const countPaid = myOrders.filter((o) => o.receiptId || o.status === 'Stock Collected & Paid').length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-heading">My B2B Orders & Billing Center</h1>
          <p className="text-xs text-slate-400">
            Track order status, view generated Billing Invoices, and access official Paid Receipts for manual warehouse collection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <NavLink
            to="/buyer/marketplace"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5"
          >
            <PackageCheck className="w-4 h-4" /> Browse Marketplace
          </NavLink>
        </div>
      </div>

      {/* KPI Stats / Filter Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { key: 'ALL', label: 'All Orders', count: myOrders.length, color: 'text-white', bg: 'bg-slate-900/90' },
          { key: 'PENDING', label: 'Pending Admin Approval', count: countPending, color: 'text-amber-400', bg: 'bg-amber-950/20 border-amber-500/20' },
          { key: 'INVOICES', label: 'Invoices (Ready for Pickup)', count: countInvoiced, color: 'text-cyan-400', bg: 'bg-cyan-950/20 border-cyan-500/20' },
          { key: 'RECEIPTS', label: 'Paid Receipts', count: countPaid, color: 'text-emerald-400', bg: 'bg-emerald-950/20 border-emerald-500/20' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              activeTab === tab.key
                ? 'border-purple-500 bg-purple-950/30 shadow-lg ring-1 ring-purple-500/50'
                : `border-slate-800 ${tab.bg} hover:border-slate-700`
            }`}
          >
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">{tab.label}</span>
            <span className={`text-2xl font-black font-heading ${tab.color}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">
            Showing {filteredOrders.length} {activeTab.toLowerCase()} records
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            Payment method: <strong className="text-emerald-400">Manual payment upon warehouse pickup</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Order ID & Date</th>
                <th className="px-6 py-4">Material Details</th>
                <th className="px-6 py-4">Quantity & Rate</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Order Status</th>
                <th className="px-6 py-4">Payment & Documents</th>
                <th className="px-6 py-4 text-center">Batch Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    No orders match this view.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-purple-400 block text-xs">{ord.id}</span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" /> {ord.orderDate}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-bold text-white text-xs">{ord.materialName}</p>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 text-purple-400" /> {ord.recoveryCentre}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-emerald-400 block">{ord.quantityKg} kg</span>
                      <span className="text-[10px] text-slate-400">₹{ord.pricePerKg} / kg</span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-black text-white text-sm font-heading block">
                        ₹{(ord.totalAmount || (ord.quantityKg * ord.pricePerKg)).toLocaleString()}
                      </span>
                      {ord.taxAmount ? (
                        <span className="text-[10px] text-slate-400">Incl. ₹{ord.taxAmount} GST</span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Total Net</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={ord.status} />
                      {ord.adminNotes && (
                        <span className="text-[10px] text-slate-400 block mt-1 italic max-w-xs truncate">
                          {ord.adminNotes}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 space-y-1.5">
                      {ord.receiptId || ord.status === 'Stock Collected & Paid' ? (
                        <button
                          onClick={() => setSelectedReceiptOrder(ord)}
                          className="px-3 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                          <span>View Paid Receipt</span>
                        </button>
                      ) : ord.invoiceId || ord.status === 'Order Accepted (Invoice Issued)' ? (
                        <button
                          onClick={() => setSelectedInvoiceOrder(ord)}
                          className="px-3 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <FileText className="w-3.5 h-3.5 text-cyan-400" />
                          <span>View Billing Invoice</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                          <Clock className="w-3 h-3" /> Awaiting Admin
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <NavLink
                        to={`/admin/traceability?id=${ord.batchRef}`}
                        className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:underline"
                      >
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>{ord.batchRef}</span>
                      </NavLink>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BILLING INVOICE MODAL */}
      <Modal
        isOpen={!!selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
        title="Official Billing Invoice"
        maxWidth="max-w-2xl"
      >
        {selectedInvoiceOrder && (
          <div className="space-y-6 text-slate-300 print:text-black">
            {/* Invoice Header */}
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-white font-heading">
                      REV<span className="text-emerald-400">astra</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      BILLING INVOICE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Resource Recovery & Circular Economy Directorate • GSTIN: 29AAACR1234F1Z8
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs font-mono font-bold text-cyan-400 block">
                    {selectedInvoiceOrder.invoiceId || 'INV-2026-PENDING'}
                  </span>
                  <span className="text-[11px] text-slate-400">Date: {selectedInvoiceOrder.invoiceDate || selectedInvoiceOrder.orderDate}</span>
                </div>
              </div>

              {/* Buyer and Warehouse Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Billed To (Buyer):</span>
                  <strong className="text-white block">{selectedInvoiceOrder.buyerName}</strong>
                  <p className="text-slate-400 text-[11px]">{selectedInvoiceOrder.buyerEmail || 'Registered Recycler'}</p>
                  <p className="text-slate-400 text-[11px] font-mono">GSTIN: {selectedInvoiceOrder.buyerGst || '29ABCDE1234F1Z5'}</p>
                </div>
                <div className="space-y-1 sm:text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Pickup & Collection Point:</span>
                  <strong className="text-emerald-400 block">{selectedInvoiceOrder.recoveryCentre}</strong>
                  <p className="text-slate-400 text-[11px]">{selectedInvoiceOrder.pickupAddress || 'City RRC Receiving Dock #2, Bengaluru'}</p>
                  <p className="text-amber-400 text-[11px] font-semibold">Payment Mode: Manual Payment upon Pickup</p>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div className="rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">Material Description</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3">Rate (INR)</th>
                    <th className="px-4 py-3 text-right">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  <tr>
                    <td className="px-4 py-3">
                      <strong>{selectedInvoiceOrder.materialName}</strong>
                      <span className="block text-[10px] text-slate-400">Quality Verified Stock • Batch Ref: {selectedInvoiceOrder.batchRef}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-400">{selectedInvoiceOrder.quantityKg} kg</td>
                    <td className="px-4 py-3">₹{selectedInvoiceOrder.pricePerKg} / kg</td>
                    <td className="px-4 py-3 text-right font-bold">
                      ₹{(selectedInvoiceOrder.subtotal || (selectedInvoiceOrder.quantityKg * selectedInvoiceOrder.pricePerKg)).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="px-4 py-2 text-right text-slate-400">GST (5% SGST + CGST):</td>
                    <td className="px-4 py-2 text-right font-mono">
                      ₹{(selectedInvoiceOrder.taxAmount || Math.round((selectedInvoiceOrder.quantityKg * selectedInvoiceOrder.pricePerKg) * 0.05)).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-slate-950 font-bold text-white text-sm">
                    <td colSpan="3" className="px-4 py-3 text-right">Total Amount Due:</td>
                    <td className="px-4 py-3 text-right font-heading text-cyan-300">
                      ₹{selectedInvoiceOrder.totalAmount.toLocaleString()} INR
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Payment & Pickup Instructions Alert */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-1.5">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Manual Payment & Stock Handover Instructions</span>
              </div>
              <p className="text-[11px] text-slate-300">
                1. Please bring this Billing Invoice (or quote Invoice ID <strong className="font-mono text-white">{selectedInvoiceOrder.invoiceId}</strong>) when visiting <strong>{selectedInvoiceOrder.recoveryCentre}</strong>.
              </p>
              <p className="text-[11px] text-slate-300">
                2. Inspect your material and pay the fee of <strong className="text-emerald-400 font-bold">₹{selectedInvoiceOrder.totalAmount.toLocaleString()}</strong> via Cash, POS Card, or Bank Transfer at the RRC payment counter.
              </p>
              <p className="text-[11px] text-slate-300">
                3. The Admin / Officer will mark the invoice as <strong>Paid</strong> and issue an official Paid Receipt & gatepass immediately.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white flex items-center gap-2 transition-all"
              >
                <Printer className="w-4 h-4 text-slate-400" /> Print / Save PDF
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* PAID RECEIPT MODAL */}
      <Modal
        isOpen={!!selectedReceiptOrder}
        onClose={() => setSelectedReceiptOrder(null)}
        title="Official Paid Receipt & Stock Release Gatepass"
        maxWidth="max-w-2xl"
      >
        {selectedReceiptOrder && (
          <div className="space-y-6 text-slate-300">
            <div className="p-6 rounded-3xl bg-slate-950 border border-emerald-500/40 relative overflow-hidden space-y-4">
              {/* Stamp Badge */}
              <div className="absolute top-4 right-4 rotate-12 border-2 border-emerald-400 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-1 shadow-lg">
                <CheckCircle2 className="w-4 h-4" /> PAID & RELEASED
              </div>

              <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
                <span className="text-xl font-black text-white font-heading">
                  REV<span className="text-emerald-400">astra</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  OFFICIAL PAYMENT RECEIPT
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Receipt Number:</span>
                  <span className="font-mono text-emerald-400 font-bold text-sm block">
                    {selectedReceiptOrder.receiptId || 'REC-2026-0891'}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">Invoice Ref: {selectedReceiptOrder.invoiceId || 'INV-2026-0891'}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Payment Date & Time:</span>
                  <span className="text-white font-semibold block">{selectedReceiptOrder.receiptDate || selectedReceiptOrder.orderDate}</span>
                  <span className="text-[10px] text-emerald-400 block mt-1 font-bold">Status: Verified & Settled</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Buyer Entity:</span>
                  <strong className="text-white">{selectedReceiptOrder.buyerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Recovered Material:</span>
                  <span className="text-white font-semibold">{selectedReceiptOrder.materialName} ({selectedReceiptOrder.quantityKg} kg)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Collection Warehouse:</span>
                  <span className="text-slate-200">{selectedReceiptOrder.recoveryCentre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Mode Used:</span>
                  <span className="text-cyan-300 font-semibold">{selectedReceiptOrder.paymentMode || 'Manual Cash / Bank Transfer'}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-sm">
                  <span className="text-white">Total Amount Paid:</span>
                  <span className="text-emerald-400 font-heading text-base font-black">
                    ₹{selectedReceiptOrder.totalAmount.toLocaleString()} INR
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Stock has been physically released and vehicle gatepass logged in the REVastra traceability system.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white flex items-center gap-2 transition-all"
              >
                <Printer className="w-4 h-4 text-slate-400" /> Print Official Receipt
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
