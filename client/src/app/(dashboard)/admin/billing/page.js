'use client';
import { useState, useEffect } from 'react';
import api from '../../../../lib/axios';
import { CreditCard, FileText, TrendingUp, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function AdminBilling() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await api.get('/billing/invoices');
      setInvoices(res.data);
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'paid': return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Paid</span>;
      case 'overdue': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Overdue</span>;
      case 'pending': return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">Pending</span>;
      default: return <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((acc, curr) => acc + curr.totalAmount, 0);
  const pendingRevenue = invoices.filter(i => i.status === 'pending').reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto p-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Billing Management</h1>
        <p className="text-slate-600">Overview of hospital finances and patient invoices</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-green-100 text-green-600 rounded-xl">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Collected</p>
              <h3 className="text-2xl font-bold text-slate-900">${totalRevenue.toFixed(2)}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-amber-100 text-amber-600 rounded-xl">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Pending Payments</p>
              <h3 className="text-2xl font-bold text-slate-900">${pendingRevenue.toFixed(2)}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Invoices</p>
              <h3 className="text-2xl font-bold text-slate-900">{invoices.length}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">Recent Invoices</h2>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
            Generate Invoice
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm">
                <th className="p-4 font-medium">Invoice ID</th>
                <th className="p-4 font-medium">Patient</th>
                <th className="p-4 font-medium">Date Issued</th>
                <th className="p-4 font-medium">Due Date</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">Loading invoices...</td>
                </tr>
              ) : invoices.map(invoice => (
                <tr key={invoice._id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="p-4 text-sm font-medium text-slate-900">#{invoice._id.toString().slice(-6).toUpperCase()}</td>
                  <td className="p-4 text-sm text-slate-700">{invoice.patientId?.name || 'Unknown Patient'}</td>
                  <td className="p-4 text-sm text-slate-600">{new Date(invoice.issuedDate).toLocaleDateString()}</td>
                  <td className="p-4 text-sm text-slate-600">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                  <td className="p-4 text-sm font-bold text-slate-900">${invoice.totalAmount.toFixed(2)}</td>
                  <td className="p-4">{getStatusBadge(invoice.status)}</td>
                  <td className="p-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View details</button>
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
