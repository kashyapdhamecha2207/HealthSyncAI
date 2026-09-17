'use client';
import { useState, useEffect } from 'react';
import api from '../../../../lib/axios';
import { CreditCard, FileText, CheckCircle, Clock } from 'lucide-react';

export default function PatientInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

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

  const handlePayment = async (invoice) => {
    try {
      setProcessingId(invoice._id);
      
      // Simulate payment gateway redirect delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await api.post('/billing/payments', {
        invoiceId: invoice._id,
        amount: invoice.totalAmount,
        paymentMethod: 'credit_card'
      });
      
      alert('Payment successful!');
      fetchInvoices();
    } catch (err) {
      console.error('Payment failed:', err);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Bills & Invoices</h1>
        <p className="text-slate-600">View and securely pay your hospital bills online.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading your invoices...</div>
      ) : invoices.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center shadow-sm">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">You're all caught up!</h2>
          <p className="text-slate-600">You have no pending invoices or payment history.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {invoices.map(invoice => (
            <div key={invoice._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="flex items-start gap-4 w-full">
                <div className={`p-4 rounded-xl ${invoice.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                  <FileText size={28} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">Invoice #{invoice._id.toString().slice(-6).toUpperCase()}</h3>
                    {invoice.status === 'paid' ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold uppercase tracking-wider">Paid</span>
                    ) : (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-bold uppercase tracking-wider">Pending</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-2">Issued on {new Date(invoice.issuedDate).toLocaleDateString()}</p>
                  <p className="text-sm text-slate-500">
                    <span className="font-medium">Due Date:</span> {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="w-full sm:w-auto text-left sm:text-right flex flex-col sm:items-end justify-center">
                <p className="text-3xl font-extrabold text-slate-900 mb-4">${invoice.totalAmount.toFixed(2)}</p>
                {invoice.status === 'pending' && (
                  <button 
                    onClick={() => handlePayment(invoice)}
                    disabled={processingId === invoice._id}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md disabled:bg-blue-400"
                  >
                    <CreditCard size={18} />
                    {processingId === invoice._id ? 'Processing...' : 'Pay Now'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
