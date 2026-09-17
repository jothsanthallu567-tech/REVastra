import React from 'react';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/common/Badge';
import { Boxes, Store } from 'lucide-react';

export function AdminInventoryMgmt() {
  const { data } = useData();

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-white font-heading">Digital Warehouse Inventory</h1>
        <p className="text-xs text-slate-400">Quality-graded material stock published across city recovery hubs</p>
      </div>

      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Stock ID</th>
                <th className="px-6 py-4">Material Description</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Quality Grade</th>
                <th className="px-6 py-4">Available Qty</th>
                <th className="px-6 py-4">Sold Qty</th>
                <th className="px-6 py-4 text-right">Price / kg</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {data.warehouseStock.map((stk) => (
                <tr key={stk.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-purple-400">{stk.id}</td>
                  <td className="px-6 py-4 font-bold text-white">{stk.material}</td>
                  <td className="px-6 py-4 text-slate-300">{stk.category}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={stk.qualityGrade} />
                  </td>
                  <td className="px-6 py-4 font-extrabold text-emerald-400">{stk.availableQtyKg} kg</td>
                  <td className="px-6 py-4 text-slate-400">{stk.soldQtyKg} kg</td>
                  <td className="px-6 py-4 text-right font-extrabold text-white">₹{stk.pricePerKg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
