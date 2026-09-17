'use client';
import { useState, useEffect } from 'react';
import api from '../../../lib/axios';
import { Beaker, Activity, FileText, CheckCircle } from 'lucide-react';

export default function LabTechnicianDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/labs/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/labs/orders/${orderId}`, { status: newStatus });
      fetchOrders();
      alert(`Order marked as ${newStatus}`);
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Laboratory Dashboard</h1>
        <p className="text-slate-600">Manage incoming test orders and upload results</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Pending Orders</p>
          <h3 className="text-3xl font-bold text-amber-600 mt-2">{orders.filter(o => o.status === 'pending').length}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Processing</p>
          <h3 className="text-3xl font-bold text-blue-600 mt-2">{orders.filter(o => o.status === 'processing').length}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500">Completed Today</p>
          <h3 className="text-3xl font-bold text-green-600 mt-2">{orders.filter(o => o.status === 'completed').length}</h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Active Test Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Patient Name</th>
                <th className="p-4 font-medium">Test Required</th>
                <th className="p-4 font-medium">Ordering Doctor</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-500">Loading orders...</td></tr>
              ) : orders.map(order => (
                <tr key={order._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="p-4 text-xs font-mono text-slate-500">{order._id.toString().slice(-6).toUpperCase()}</td>
                  <td className="p-4 text-sm font-medium text-slate-900">{order.patientId?.name || 'Unknown Patient'}</td>
                  <td className="p-4 text-sm text-slate-800">{order.testId?.name || 'Unknown Test'}</td>
                  <td className="p-4 text-sm text-slate-600">Dr. {order.doctorId?.name || 'Unknown'}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      order.status === 'completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => updateStatus(order._id, 'processing')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                      >
                        Start Processing
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button 
                        onClick={() => updateStatus(order._id, 'completed')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
                      >
                        Mark Completed
                      </button>
                    )}
                    {order.status === 'completed' && (
                      <span className="text-green-600 font-medium text-sm flex items-center justify-end gap-1">
                        <CheckCircle size={16} /> Done
                      </span>
                    )}
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
