'use client';
import { useState, useEffect } from 'react';
import api from '../../../../lib/axios';
import { Package, AlertTriangle, Plus, Search, Edit2 } from 'lucide-react';

export default function AdminPharmacy() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/inventory');
      setInventory(res.data);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const lowStockItems = inventory.filter(item => item.stockQuantity <= item.lowStockThreshold);

  return (
    <div className="max-w-7xl mx-auto p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Pharmacy & Inventory</h1>
          <p className="text-slate-600">Manage medicines, consumables, and track stock levels</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition font-semibold shadow-lg">
          <Plus size={18} />
          Add New Item
        </button>
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl mb-8 flex items-start gap-4 shadow-sm">
          <div className="p-3 bg-red-100 text-red-600 rounded-full">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-800 mb-1">Low Stock Alert!</h3>
            <p className="text-red-600 text-sm mb-3">The following items are running low and need to be reordered immediately.</p>
            <div className="flex flex-wrap gap-2">
              {lowStockItems.map(item => (
                <span key={item._id} className="px-3 py-1 bg-white border border-red-200 text-red-700 rounded-full text-xs font-bold shadow-sm">
                  {item.name} ({item.stockQuantity} left)
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search inventory..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select className="bg-slate-50 border border-slate-300 text-slate-700 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>All Categories</option>
              <option>Medicines</option>
              <option>Consumables</option>
              <option>Equipment</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm">
                <th className="p-4 font-medium">Item Name</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Batch No.</th>
                <th className="p-4 font-medium">Expiry</th>
                <th className="p-4 font-medium">Unit Price</th>
                <th className="p-4 font-medium">Stock Level</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">Loading inventory data...</td>
                </tr>
              ) : inventory.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">No items found in inventory.</td>
                </tr>
              ) : inventory.map(item => (
                <tr key={item._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="p-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-3">
                      <Package size={16} className="text-slate-400" />
                      {item.name}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-600 capitalize">{item.category}</td>
                  <td className="p-4 text-sm text-slate-500">{item.batchNumber}</td>
                  <td className="p-4 text-sm text-slate-600">{new Date(item.expiryDate).toLocaleDateString()}</td>
                  <td className="p-4 text-sm font-medium text-slate-900">${item.unitPrice.toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${item.stockQuantity <= item.lowStockThreshold ? 'bg-red-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(100, (item.stockQuantity / 100) * 100)}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-bold ${item.stockQuantity <= item.lowStockThreshold ? 'text-red-600' : 'text-slate-700'}`}>
                        {item.stockQuantity}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
