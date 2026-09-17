'use client';
import { useState, useEffect } from 'react';
import api from '../../../../lib/axios';
import { Bell, Calendar, Clock, Plus, Trash2, AlertTriangle, CheckCircle, X } from 'lucide-react';

// Force refresh - v2

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [reminderForm, setReminderForm] = useState({
    type: 'appointment',
    title: '',
    message: '',
    time: '',
    frequency: 'once'
  });
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    // Load immediately for instant performance
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reminders');
      setReminders(res.data || []);
    } catch (err) {
      console.error('Failed to fetch reminders:', err);
      setReminders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...reminderForm,
        date: new Date().toISOString().split('T')[0]
      };
      
      const res = await api.post('/reminders', payload);
      setReminders([res.data, ...reminders]);
      
      // Reset form
      setReminderForm({
        type: 'appointment',
        title: '',
        message: '',
        time: '',
        frequency: 'once'
      });
      setShowAddForm(false);
      
      alert('Reminder scheduled successfully! A confirmation email has been sent.');
    } catch (err) {
      console.error(err);
      alert('Failed to add reminder');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReminder = async (id) => {
    try {
      await api.delete(`/reminders/${id}`);
      setReminders(reminders.filter(reminder => reminder.id !== id));
      alert('Reminder deleted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to delete reminder');
    }
  };

  const handleToggleReminder = async (id) => {
    try {
      const res = await api.put(`/reminders/${id}/toggle`);
      setReminders(reminders.map(reminder => 
        reminder.id === id ? res.data : reminder
      ));
      alert(`Reminder ${res.data.active ? 'enabled' : 'disabled'} successfully!`);
    } catch (err) {
      console.error(err);
      alert('Failed to toggle reminder');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'appointment': return <Calendar size={20} className="text-blue-600" />;
      case 'medication': return <Clock size={20} className="text-purple-600" />;
      case 'custom': return <AlertTriangle size={20} className="text-orange-600" />;
      default: return <Bell size={20} className="text-gray-600" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'appointment': return 'bg-blue-100 text-blue-700';
      case 'medication': return 'bg-purple-100 text-purple-700';
      case 'custom': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <div className="glass p-8 rounded-3xl">
        <h1 className="text-3xl font-bold mb-2 text-slate-900">Reminders</h1>
        <p className="text-slate-600 mb-8">Set up custom reminders for appointments, medications, and daily activities</p>
        
        {/* Add Reminder Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
          >
            <Plus size={20} />
            <span>Add New Reminder</span>
          </button>
        </div>

        {/* Add Reminder Form */}
        {showAddForm && (
          <div className="mb-8 p-6 bg-orange-50 rounded-xl border border-orange-200">
            <h3 className="text-lg font-semibold text-orange-900 mb-4">Add New Reminder</h3>
            <form onSubmit={handleAddReminder} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">Reminder Type</label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    value={reminderForm.type}
                    onChange={(e) => setReminderForm({...reminderForm, type: e.target.value})}
                  >
                    <option value="appointment">Appointment Reminder</option>
                    <option value="medication">Medication Reminder</option>
                    <option value="custom">Custom Reminder</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    value={reminderForm.title}
                    onChange={(e) => setReminderForm({...reminderForm, title: e.target.value})}
                    placeholder="e.g., Doctor Appointment"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">Time</label>
                  <input
                    type="time"
                    required
                    className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    value={reminderForm.time}
                    onChange={(e) => setReminderForm({...reminderForm, time: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">Frequency</label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    value={reminderForm.frequency}
                    onChange={(e) => setReminderForm({...reminderForm, frequency: e.target.value})}
                  >
                    <option value="once">Once</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-orange-700 mb-2">Message</label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  value={reminderForm.message}
                  onChange={(e) => setReminderForm({...reminderForm, message: e.target.value})}
                  placeholder="Add any additional notes..."
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Add Reminder
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reminders List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
              <p className="mt-4 text-slate-600">Loading reminders...</p>
            </div>
          ) : reminders.length === 0 ? (
            <div className="text-center py-12">
              <Bell size={48} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No reminders found</p>
              <p className="text-sm text-slate-500 mt-2">Add your first reminder to get started</p>
            </div>
          ) : (
            reminders.map(reminder => (
              <div key={reminder.id} className="p-6 rounded-xl bg-white border border-slate-200 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getTypeIcon(reminder.type)}
                      <div>
                        <h3 className="font-semibold text-slate-900 text-lg">{reminder.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock size={16} className="text-slate-400" />
                          <span>{reminder.time}</span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(reminder.type)}`}>
                            {reminder.frequency}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mt-2">{reminder.message}</p>
                    </div>
                    
                    <div className="text-sm text-slate-500 mb-2">
                      <span>Created: {reminder.date}</span>
                      {reminder.active && (
                        <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <CheckCircle size={12} className="inline mr-1" />
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => handleToggleReminder(reminder.id)}
                      className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                        reminder.active 
                          ? 'bg-gray-600 text-white hover:bg-gray-700' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {reminder.active ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleDeleteReminder(reminder.id)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
