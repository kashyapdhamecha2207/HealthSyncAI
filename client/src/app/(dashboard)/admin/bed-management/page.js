'use client';
import { useState, useEffect } from 'react';
import api from '../../../../lib/axios';
import { Bed, Users, AlertTriangle, Plus, CheckCircle, Activity, Info } from 'lucide-react';

export default function BedManagement() {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWards();
  }, []);

  const fetchWards = async () => {
    try {
      const res = await api.get('/ipd/wards');
      setWards(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getBedStatusColor = (status) => {
    switch(status) {
      case 'available': return 'bg-emerald-100 border-emerald-300 text-emerald-700 hover:bg-emerald-200';
      case 'occupied': return 'bg-red-100 border-red-300 text-red-700 hover:bg-red-200';
      case 'cleaning': return 'bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200';
      case 'maintenance': return 'bg-slate-200 border-slate-300 text-slate-700 hover:bg-slate-300';
      default: return 'bg-gray-100';
    }
  };

  const getBedStatusIcon = (status) => {
    switch(status) {
      case 'available': return <CheckCircle size={16} />;
      case 'occupied': return <Users size={16} />;
      case 'cleaning': return <Activity size={16} />;
      case 'maintenance': return <AlertTriangle size={16} />;
      default: return <Info size={16} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Bed & Ward Management</h1>
          <p className="text-slate-600">Real-time IPD occupancy and admission control</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg transition flex items-center gap-2">
          <Plus size={18} />
          Add New Ward
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading hospital floor plan...</div>
      ) : wards.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center shadow-sm">
          <Bed size={48} className="text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">No Wards Configured</h2>
          <p className="text-slate-600">Click "Add New Ward" to initialize the hospital floor plan.</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {wards.map(ward => {
            const total = ward.capacity;
            const occupied = ward.beds.filter(b => b.status === 'occupied').length;
            const available = ward.beds.filter(b => b.status === 'available').length;
            const occupancyRate = total > 0 ? (occupied / total) * 100 : 0;

            return (
              <div key={ward._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{ward.name} <span className="text-sm font-medium text-slate-500 ml-2 uppercase tracking-wider px-2 py-1 bg-slate-200 rounded">{ward.type}</span></h2>
                    <p className="text-sm text-slate-600 mt-1">Floor: {ward.floor} • Base Rate: ${ward.basePricePerNight}/night</p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Occupancy</p>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${occupancyRate >= 90 ? 'bg-red-500' : occupancyRate >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${occupancyRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-slate-700">{Math.round(occupancyRate)}%</span>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-center">
                        <span className="block text-2xl font-bold text-emerald-600">{available}</span>
                        <span className="text-xs text-slate-500 font-medium">Free</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-2xl font-bold text-red-600">{occupied}</span>
                        <span className="text-xs text-slate-500 font-medium">In Use</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {ward.beds.map(bed => (
                      <button 
                        key={bed._id}
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition cursor-pointer shadow-sm ${getBedStatusColor(bed.status)}`}
                        title={`Status: ${bed.status}`}
                      >
                        <Bed size={24} className="opacity-80" />
                        <span className="font-bold">{bed.bedNumber}</span>
                        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider opacity-80">
                          {getBedStatusIcon(bed.status)}
                          {bed.status}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
