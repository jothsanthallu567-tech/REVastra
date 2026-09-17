import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import {
  Store,
  DollarSign,
  FileCheck2,
  FileText,
  Receipt,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Search,
  Building2,
  Calendar,
  AlertCircle,
  CreditCard,
  Send,
  Package,
  Eye,
  FilePlus2,
  ShieldCheck
} from 'lucide-react';

export function AdminMarketplaceOrders() {
  const { data, adminAcceptOrder, adminMarkOrderPaid, adminRejectOrder } = useData();

  const [activeTab, setActiveTab] = useState('ALL'); // ALL | PENDING | INVOICED | PAID
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);
  const [orderToAccept, setOrderToAccept] = useState(null);
  const [orderToPay, setOrderToPay] = useState(null);
  const [orderToReject, setOrderToReject] = useState(null);

  // Form states
  const [adminNotes, setAdminNotes] = useState('');
  const [paymentMode, setPaymentMode] = useState('Cash at Counter');
  const [transactionRef, setTransactionRef] = useState('');
  const [rejectReason, setRejectReason] = useState('Insufficient warehouse stock or scheduling conflict');

  const orders = data.orders || [];

  const filteredOrders = orders.filter((ord) => {
    const matchesTab =
      activeTab === 'ALL' ||
      (activeTab === 'PENDING' && ord.status === 'Pending Admin Approval') ||
      (activeTab === 'INVOICED' && (ord.status === 'Order Accepted (Invoice Issued)' || ord.status === 'Confirmed' || ord.invoiceId)) ||
      (activeTab === 'PAID' && (ord.status === 'Stock Collected & Paid' || !!ord.receiptId));

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      (ord.id && ord.id.toLowerCase().includes(term)) ||
      (ord.buyerName && ord.buyerName.toLowerCase().includes(term)) ||
      (ord.materialName && ord.materialName.toLowerCase().includes(term)) ||
      (ord.invoiceId && ord.invoiceId.toLowerCase().includes(term)) ||
      (ord.receiptId && ord.receiptId.toLowerCase().includes(term));

    return matchesTab && matchesSearch;
  });

  const countPending = orders.filter((o) => o.status === 'Pending Admin Approval').length;
  const countInvoiced = orders.filter((o) => (o.status === 'Order Accepted (Invoice Issued)' || o.status === 'Confirmed' || o.invoiceId) && o.status !== 'Stock Collected & Paid' && o.status !== 'Cancelled / Rejected').length;
  const countPaid = orders.filter((o) => o.status === 'Stock Collected & Paid' || !!o.receiptId).length;
  const totalRevenue = orders
    .filter((o) => o.status === 'Stock Collected & Paid' || !!o.receiptId)
    .reduce((acc, o) => acc + (o.totalAmount || 0), 0);

  const handleConfirmAccept = () => {
    if (!orderToAccept) return;
    const res = adminAcceptOrder({ orderId: orderToAccept.id, adminNotes });
    if (res && res.success) {
      const generatedInvoice = res.order;
      setOrderToAccept(null);
      setAdminNotes('');
      // Open the generated invoice automatically so admin can immediately view/print it
      setSelectedInvoiceOrder(generatedInvoice);
    } else {
      alert(res?.message || 'Error accepting order');
    }
  };

  const handleConfirmPaid = () => {
    if (!orderToPay) return;
    const res = adminMarkOrderPaid({
      orderId: orderToPay.id,
      paymentMode,
      transactionRef,
      adminNotes
    });
    if (res && res.success) {
      const paidOrder = res.order;
      setOrderToPay(null);
      setTransactionRef('');
      setAdminNotes('');
      // Open the paid receipt automatically so admin can immediately view/print it
      setSelectedReceiptOrder(paidOrder);
    } else {
      alert(res?.message || 'Error marking payment');
    }
  };

  const handleConfirmReject = () => {
    if (!orderToReject) return;
    adminRejectOrder({ orderId: orderToReject.id, reason: rejectReason });
    setOrderToReject(null);
    setRejectReason('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-white font-heading">B2B Material Orders & Invoicing Directorate</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Live Invoicing & Settlement Center
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Review commercial purchase orders, generate official Billing Invoices for buyers, verify manual warehouse payments upon stock collection, and issue official Paid Receipts.
          </p>
        </div>

        <div className="relative sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order ID, buyer, invoice..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* KPI Stats Filter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { key: 'ALL', label: 'All B2B Orders', count: orders.length, color: 'text-white', bg: 'bg-slate-900/90' },
          { key: 'PENDING', label: 'Pending Admin Approvals', count: countPending, color: 'text-amber-400', bg: 'bg-amber-950/20 border-amber-500/20' },
          { key: 'INVOICED', label: 'Invoices Issued (Awaiting Pickup)', count: countInvoiced, color: 'text-cyan-400', bg: 'bg-cyan-950/20 border-cyan-500/20' },
          { key: 'PAID', label: 'Settled Sales Revenue', count: `₹${totalRevenue.toLocaleString()}`, color: 'text-emerald-400', bg: 'bg-emerald-950/20 border-emerald-500/20' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
              activeTab === tab.key
                ? 'border-purple-500 bg-purple-950/30 shadow-lg ring-1 ring-purple-500/50'
                : `border-slate-800 ${tab.bg} hover:border-slate-700`
            }`}
          >
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">{tab.label}</span>
            <span className={`text-xl font-black font-heading ${tab.color}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">
            Commercial Orders & Invoicing Queue ({filteredOrders.length} records)
          </span>
          <span className="text-[11px] text-slate-400">
            Settlement Workflow: Order &rarr; Admin Invoice &rarr; Manual Payment &rarr; Paid Receipt
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Order ID & Date</th>
                <th className="px-6 py-4">Buyer Entity</th>
                <th className="px-6 py-4">Material & Qty</th>
                <th className="px-6 py-4">Total Amount (INR)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Admin Action</th>
                <th className="px-6 py-4 text-center">Billing Invoice & Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const subtotal = ord.subtotal || (ord.quantityKg * ord.pricePerKg);
                  const total = ord.totalAmount || subtotal;
                  return (
                    <tr key={ord.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-purple-400 block text-xs">{ord.id}</span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" /> {ord.orderDate}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <strong className="text-white block">{ord.buyerName}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">GST: {ord.buyerGst || '29ABCDE1234F1Z5'}</span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-slate-200 font-medium block">{ord.materialName}</span>
                        <span className="font-bold text-emerald-400 text-[11px]">{ord.quantityKg} kg @ ₹{ord.pricePerKg}/kg</span>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-black text-white text-sm font-heading block">
                          ₹{total.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400">{ord.paymentStatus || 'Payment on Pickup'}</span>
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={ord.status} />
                      </td>

                      <td className="px-6 py-4">
                        {ord.status === 'Pending Admin Approval' ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setOrderToAccept(ord);
                                setAdminNotes(`Order approved by Admin. Stock available for collection at ${ord.recoveryCentre}.`);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-md shadow-emerald-600/20 cursor-pointer transition-all"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Accept & Issue Bill
                            </button>
                            <button
                              onClick={() => setOrderToReject(ord)}
                              className="p-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 text-[11px] border border-rose-500/30 cursor-pointer"
                              title="Reject Order"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : ord.status === 'Order Accepted (Invoice Issued)' || (ord.invoiceId && ord.status !== 'Stock Collected & Paid') ? (
                          <button
                            onClick={() => {
                              setOrderToPay(ord);
                              setTransactionRef(`TXN-${Math.floor(100000 + Math.random() * 900000)}`);
                              setPaymentMode('Cash at Counter');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-md shadow-purple-600/20 cursor-pointer transition-all"
                          >
                            <CreditCard className="w-3.5 h-3.5" /> Mark as Paid & Release
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Settled & Dispatched
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-center space-y-1.5">
                        {ord.invoiceId ? (
                          <button
                            onClick={() => setSelectedInvoiceOrder(ord)}
                            className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-[11px] font-mono font-bold flex items-center gap-1.5 mx-auto cursor-pointer transition-all shadow-sm"
                            title="View Billing Invoice"
                          >
                            <FileText className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Invoice {ord.invoiceId}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setOrderToAccept(ord);
                              setAdminNotes(`Order approved by Admin. Stock available for collection at ${ord.recoveryCentre}.`);
                            }}
                            className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] flex items-center gap-1 mx-auto cursor-pointer"
                          >
                            <FilePlus2 className="w-3 h-3 text-amber-400" /> Create Invoice
                          </button>
                        )}

                        {ord.receiptId && (
                          <button
                            onClick={() => setSelectedReceiptOrder(ord)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-mono font-bold flex items-center gap-1.5 mx-auto cursor-pointer transition-all shadow-sm"
                            title="View Official Paid Receipt"
                          >
                            <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Receipt {ord.receiptId}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ACCEPT ORDER & GENERATE INVOICE MODAL */}
      <Modal
        isOpen={!!orderToAccept}
        onClose={() => setOrderToAccept(null)}
        title="Accept B2B Order & Issue Billing Invoice"
        maxWidth="max-w-md"
      >
        {orderToAccept && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-white">{orderToAccept.materialName}</span>
                <span className="text-purple-400 font-mono">{orderToAccept.id}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Buyer:</span>
                <span className="text-slate-200 font-medium">{orderToAccept.buyerName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Quantity & Rate:</span>
                <span className="text-emerald-400 font-bold">{orderToAccept.quantityKg} kg @ ₹{orderToAccept.pricePerKg}/kg</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST (5%):</span>
                <span>₹{(orderToAccept.taxAmount || Math.round(orderToAccept.quantityKg * orderToAccept.pricePerKg * 0.05)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-sm">
                <span className="text-white">Total Invoice Payable:</span>
                <span className="text-cyan-300 font-heading">
                  ₹{(orderToAccept.totalAmount || Math.round(orderToAccept.quantityKg * orderToAccept.pricePerKg * 1.05)).toLocaleString()} INR
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Notes & Pickup Instructions for Buyer</label>
              <textarea
                rows="3"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Stock ready for inspection and collection at RRC Alpha Dock #2. Gatepass will be issued upon cash/bank payment."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
              ></textarea>
            </div>

            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[11px] text-cyan-300 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Accepting will immediately generate an official Billing Invoice (INV-...) accessible in Buyer and Admin portals.</span>
            </div>

            <button
              onClick={handleConfirmAccept}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Issue Official Billing Invoice</span>
            </button>
          </div>
        )}
      </Modal>

      {/* MARK AS PAID & RELEASE STOCK MODAL */}
      <Modal
        isOpen={!!orderToPay}
        onClose={() => setOrderToPay(null)}
        title="Record Manual Payment & Release Stock"
        maxWidth="max-w-md"
      >
        {orderToPay && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between font-bold">
                <span className="text-white">{orderToPay.buyerName}</span>
                <span className="text-cyan-400 font-mono">{orderToPay.invoiceId || orderToPay.id}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Material & Quantity:</span>
                <span className="text-white font-semibold">{orderToPay.materialName} ({orderToPay.quantityKg} kg)</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-sm">
                <span className="text-white">Amount Collected:</span>
                <span className="text-emerald-400 font-heading text-base font-black">
                  ₹{orderToPay.totalAmount.toLocaleString()} INR
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Payment Method Received</label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="Cash at Counter">Cash at Counter</option>
                <option value="Bank Transfer / RTGS / NEFT">Bank Transfer / RTGS / NEFT</option>
                <option value="POS Debit/Credit Card">POS Debit / Credit Card</option>
                <option value="UPI / QR Payment">UPI / QR Payment</option>
                <option value="Demand Draft / Cheque">Demand Draft / Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Transaction Ref / Receipt Voucher Number</label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="e.g. CASH-VOUCHER-104 or UTR-9821873"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Marking as paid will generate the official Paid Receipt and release physical stock gatepass.</span>
            </div>

            <button
              onClick={handleConfirmPaid}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Confirm Payment & Issue Paid Receipt</span>
            </button>
          </div>
        )}
      </Modal>

      {/* REJECT ORDER MODAL */}
      <Modal
        isOpen={!!orderToReject}
        onClose={() => setOrderToReject(null)}
        title="Reject Purchase Order"
        maxWidth="max-w-md"
      >
        {orderToReject && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Are you sure you want to reject order <strong>{orderToReject.id}</strong>? Reserved stock ({orderToReject.quantityKg} kg) will be returned to inventory.
            </p>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Reason for Rejection</label>
              <textarea
                rows="2"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
              ></textarea>
            </div>
            <button
              onClick={handleConfirmReject}
              className="w-full py-2.5 rounded-xl bg-rose-600 text-xs font-bold text-white cursor-pointer"
            >
              Confirm Rejection & Cancel
            </button>
          </div>
        )}
      </Modal>

      {/* INVOICE VIEWER MODAL */}
      <Modal
        isOpen={!!selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
        title="Billing Invoice Preview & Print"
        maxWidth="max-w-2xl"
      >
        {selectedInvoiceOrder && (
          <div className="space-y-6 text-slate-300">
            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
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
                    Resource Recovery Directorate • GSTIN: 29AAACR1234F1Z8
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-cyan-400 block">{selectedInvoiceOrder.invoiceId || 'INV-2026-PENDING'}</span>
                  <span className="text-[11px] text-slate-400">Date: {selectedInvoiceOrder.invoiceDate || selectedInvoiceOrder.orderDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Buyer Details:</span>
                  <strong className="text-white block">{selectedInvoiceOrder.buyerName}</strong>
                  <span className="text-slate-400 text-[11px] block">{selectedInvoiceOrder.buyerEmail || 'procurement@ecopolymer.com'}</span>
                  <span className="text-slate-400 text-[11px] font-mono">GSTIN: {selectedInvoiceOrder.buyerGst || '29ABCDE1234F1Z5'}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Pickup Facility:</span>
                  <strong className="text-emerald-400 block">{selectedInvoiceOrder.recoveryCentre || 'City RRC Alpha North'}</strong>
                  <span className="text-slate-400 text-[11px] block">{selectedInvoiceOrder.pickupAddress || 'Dock Gate #1, Bengaluru'}</span>
                  <span className="text-amber-400 text-[11px] font-semibold block mt-0.5">Mode: Manual Warehouse Payment</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold uppercase">
                  <tr>
                    <th className="px-4 py-3">Material Description</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Rate</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-white">
                      {selectedInvoiceOrder.materialName}
                      <span className="block text-[10px] text-slate-400">Batch Ref: {selectedInvoiceOrder.batchRef || 'BATCH-2026-0891'}</span>
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-400">{selectedInvoiceOrder.quantityKg} kg</td>
                    <td className="px-4 py-3">₹{selectedInvoiceOrder.pricePerKg} / kg</td>
                    <td className="px-4 py-3 text-right font-bold">
                      ₹{(selectedInvoiceOrder.subtotal || (selectedInvoiceOrder.quantityKg * selectedInvoiceOrder.pricePerKg)).toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="px-4 py-2 text-right text-slate-400">GST (5%):</td>
                    <td className="px-4 py-2 text-right font-mono">
                      ₹{(selectedInvoiceOrder.taxAmount || Math.round((selectedInvoiceOrder.quantityKg * selectedInvoiceOrder.pricePerKg) * 0.05)).toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-slate-950 font-bold text-white text-sm">
                    <td colSpan="3" className="px-4 py-3 text-right">Total Payable Amount:</td>
                    <td className="px-4 py-3 text-right text-cyan-300 font-heading">
                      ₹{(selectedInvoiceOrder.totalAmount || Math.round((selectedInvoiceOrder.quantityKg * selectedInvoiceOrder.pricePerKg) * 1.05)).toLocaleString()} INR
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-400" /> Print Invoice
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* RECEIPT VIEWER MODAL */}
      <Modal
        isOpen={!!selectedReceiptOrder}
        onClose={() => setSelectedReceiptOrder(null)}
        title="Official Paid Receipt Preview & Gatepass"
        maxWidth="max-w-2xl"
      >
        {selectedReceiptOrder && (
          <div className="space-y-6 text-slate-300">
            <div className="p-6 rounded-3xl bg-slate-950 border border-emerald-500/40 relative space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-white font-heading">
                    REV<span className="text-emerald-400">astra</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    PAID & SETTLED
                  </span>
                </div>
                <span className="font-mono text-emerald-400 font-bold text-sm">{selectedReceiptOrder.receiptId || 'REC-2026-0891'}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Buyer Entity:</span>
                  <strong className="text-white">{selectedReceiptOrder.buyerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Material Handover:</span>
                  <span className="text-white font-semibold">{selectedReceiptOrder.materialName} ({selectedReceiptOrder.quantityKg} kg)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Mode Used:</span>
                  <span className="text-cyan-300 font-semibold">{selectedReceiptOrder.paymentMode || 'Cash at Counter'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Transaction Reference:</span>
                  <span className="text-slate-200 font-mono">{selectedReceiptOrder.transactionRef || 'TXN-981290'}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-sm">
                  <span className="text-white">Total Amount Paid:</span>
                  <span className="text-emerald-400 font-heading text-base font-black">
                    ₹{selectedReceiptOrder.totalAmount?.toLocaleString()} INR
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white flex items-center gap-2 cursor-pointer"
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
