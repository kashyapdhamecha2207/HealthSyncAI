'use client';
import { useState, useEffect } from 'react';
import api from '../../../../lib/axios';
import { Beaker, Search, FileText, CheckCircle, Clock } from 'lucide-react';

export default function DoctorLabOrders() {
  const [orders, setOrders] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [patients, setPatients] = useState([]);
  
  // Form State
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedTest, setSelectedTest] = useState('');
  const [notes, setNotes] = useState('');
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchCatalog();
    fetchPatients();
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

  const fetchCatalog = async () => {
    try {
      const res = await api.get('/labs/tests');
      setTests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPatients = async () => {
    try {
      // Temporary fetch all users who are patients
      const res = await api.get('/users/patients');
      setPatients(res.data);
    } catch (err) {
      // Mock for now if endpoint isn't built yet
      setPatients([
        { _id: '1', name: 'John Doe' },
        { _id: '2', name: 'Jane Smith' }
      ]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setOrdering(true);
      await api.post('/labs/orders', {
        patientId: selectedPatient,
        testId: selectedTest,
        notes
      });
      setShowOrderModal(false);
      fetchOrders();
      alert('Lab test ordered successfully!');
    } catch (err) {
      alert('Failed to order lab test');
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Lab Orders</h1>
          <p className="text-slate-600">Prescribe and track laboratory tests for your patients</p>
        </div>
        <button 
          onClick={() => setShowOrderModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg transition flex items-center gap-2"
        >
          <Beaker size={18} />
          Order New Test
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">Recent Lab Orders</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-sm text-slate-500">
              <th className="p-4 font-medium">Patient</th>
              <th className="p-4 font-medium">Test Ordered</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Ordered On</th>
              <th className="p-4 font-medium text-right">Results</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">Loading orders...</td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">No lab tests ordered yet.</td>
              </tr>
            ) : orders.map(order => (
              <tr key={order._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                <td className="p-4 text-sm font-medium text-slate-900">{order.patientId?.name || 'Unknown'}</td>
                <td className="p-4 text-sm text-slate-700">{order.testId?.name || 'Unknown Test'}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  {order.status === 'completed' ? (
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View Results</button>
                  ) : (
                    <span className="text-slate-400 text-sm">Pending</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showOrderModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Lab Test</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Patient</label>
                <select 
                  required
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Choose a patient...</option>
                  {patients.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Test</label>
                <select 
                  required
                  value={selectedTest}
                  onChange={(e) => setSelectedTest(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Choose a test...</option>
                  {tests.map(t => (
                    <option key={t._id} value={t._id}>{t.name} (${t.price})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Clinical Notes (Optional)</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  rows="3"
                  placeholder="Any specific instructions for the lab technician?"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={ordering}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium disabled:bg-blue-400"
                >
                  {ordering ? 'Submitting...' : 'Submit Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
