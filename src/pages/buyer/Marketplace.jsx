import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Modal } from '../../components/common/Modal';
import { StatusBadge } from '../../components/common/Badge';
import { Store, Search, Filter, ShoppingCart, CheckCircle2, Building2, FileCheck2 } from 'lucide-react';

export function Marketplace() {
  const { currentUser } = useAuth();
  const { data, placeOrder } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [selectedItem, setSelectedItem] = useState(null);
  const [orderQty, setOrderQty] = useState('200');
  const [orderSuccess, setOrderSuccess] = useState(null);

  const filteredStock = data.warehouseStock.filter((item) => {
    const matchesSearch = item.material.toLowerCase().includes(searchTerm.toLowerCase()) || item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'All' || item.qualityGrade === selectedGrade;
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesGrade && matchesCat;
  });

  const handleConfirmOrder = () => {
    if (!selectedItem) return;

    const res = placeOrder({
      buyerUser: currentUser || { id: 'usr-buyer-1', name: 'EcoPolymer Ltd' },
      stockId: selectedItem.id,
      quantityKg: Number(orderQty)
    });

    if (res.success) {
      setOrderSuccess(res.order);
      setSelectedItem(null);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white font-heading">B2B Material Marketplace</h1>
          <p className="text-xs text-slate-400">
            Source quality-graded recovered materials directly from verified Resource Recovery Centres.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search PET, Cardboard, E-Waste..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {orderSuccess && (
        <div className="p-5 rounded-3xl bg-purple-500/20 border border-purple-500/40 text-purple-300 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between font-bold text-sm">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-purple-400" />
              Order Confirmed & Escrow Reserved!
            </span>
            <span className="font-mono text-xs text-white">{orderSuccess.id}</span>
          </div>
          <p className="text-xs text-slate-300">
            Ordered <strong>{orderSuccess.quantityKg} kg</strong> of {orderSuccess.materialName} for <strong>₹{orderSuccess.totalAmount.toLocaleString()}</strong>. Recovery Centre dispatch initiated.
          </p>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
          <Filter className="w-3.5 h-3.5" /> Filter Grade:
        </div>
        {['All', 'Grade A', 'Grade B', 'Grade C'].map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGrade(g)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors border ${
              selectedGrade === g
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Marketplace Listings Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStock.map((item) => (
          <div
            key={item.id}
            className="glass-panel rounded-3xl border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between overflow-hidden group"
          >
            <div>
              <div className="relative h-44 bg-slate-950 overflow-hidden">
                <img src={item.image} alt={item.material} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80" />
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <StatusBadge status={item.qualityGrade} />
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <span className="text-[10px] text-purple-400 uppercase font-extrabold tracking-wider">{item.category}</span>
                  <h3 className="text-base font-bold text-white font-heading mt-0.5">{item.material}</h3>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-b border-slate-800/80 py-2">
                  <span>Available Stock: <strong className="text-emerald-400 font-bold">{item.availableQtyKg} kg</strong></span>
                  <span>Sold: {item.soldQtyKg} kg</span>
                </div>

                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xl font-black text-white font-heading">₹{item.pricePerKg}</span>
                    <span className="text-xs text-slate-400 ml-1">/ kg</span>
                  </div>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-400" /> {item.recoveryCentre}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={() => {
                  setSelectedItem(item);
                  setOrderQty(String(Math.min(200, item.availableQtyKg)));
                }}
                disabled={item.availableQtyKg === 0}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Place Purchase Order</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Modal */}
      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title="Place B2B Material Purchase Order" maxWidth="max-w-md">
        {selectedItem && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-purple-400 font-bold uppercase">{selectedItem.category}</span>
              <h3 className="text-sm font-bold text-white">{selectedItem.material}</h3>
              <p className="text-xs text-slate-400">Quality: <strong>{selectedItem.qualityGrade}</strong> • Location: {selectedItem.recoveryCentre}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Order Quantity (kg)</label>
              <input
                type="number"
                min="10"
                max={selectedItem.availableQtyKg}
                value={orderQty}
                onChange={(e) => setOrderQty(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500 font-bold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Maximum available: {selectedItem.availableQtyKg} kg</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({orderQty} kg @ ₹{selectedItem.pricePerKg}/kg):</span>
                <span>₹{(Number(orderQty) * selectedItem.pricePerKg).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST (5%):</span>
                <span>₹{Math.round(Number(orderQty) * selectedItem.pricePerKg * 0.05).toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-white text-sm">
                <span>Estimated Invoice Total:</span>
                <span className="text-purple-300 font-heading">
                  ₹{Math.round(Number(orderQty) * selectedItem.pricePerKg * 1.05).toLocaleString()} INR
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-300 space-y-1">
              <p className="font-semibold flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-purple-400" /> Admin Acceptance & Manual Payment Flow:
              </p>
              <p className="text-slate-400 text-[10px]">
                Upon placing this order, Admin will review and generate your official <strong>Billing Invoice</strong>. You can then collect your stock at {selectedItem.recoveryCentre} by paying manually (Cash, POS or Bank Transfer).
              </p>
            </div>

            <button
              onClick={handleConfirmOrder}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Submit Order for Admin Acceptance</span>
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
