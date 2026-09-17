'use client';
import { useState } from 'react';
import api from '../../../../lib/axios';
import { Bot, Send, User, AlertTriangle, ShieldCheck, Stethoscope } from 'lucide-react';

export default function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am HealthSync AI. Please describe the symptoms you are experiencing, and I will help suggest the right medical department for you.' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    const userMessage = { sender: 'user', text: symptoms };
    setMessages(prev => [...prev, userMessage]);
    const currentSymptoms = symptoms;
    setSymptoms('');
    setLoading(true);

    try {
      const res = await api.post('/ai/symptom-checker', { symptoms: currentSymptoms });
      const { department, urgency, advice, disclaimer } = res.data;
      
      const aiResponse = { 
        sender: 'ai', 
        department,
        urgency,
        text: advice,
        disclaimer
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I am having trouble connecting to my knowledge base right now. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in h-[calc(100vh-100px)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <Bot className="text-indigo-600" size={32} />
          AI Symptom Checker
        </h1>
        <p className="text-slate-600 mt-2">Describe your symptoms to get a smart recommendation on which specialist to book.</p>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-4 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white'
                }`}>
                  {msg.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                
                <div className={`p-5 rounded-2xl shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-indigo-50 border border-indigo-100 text-slate-800 rounded-tr-none' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                }`}>
                  <p className="text-[15px] leading-relaxed">{msg.text}</p>
                  
                  {msg.department && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Stethoscope size={18} className="text-blue-600" />
                        <span className="font-bold text-slate-900">Recommended Department:</span>
                        <span className="font-bold text-blue-700">{msg.department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={18} className={msg.urgency === 'High' ? 'text-red-500' : msg.urgency === 'Medium' ? 'text-amber-500' : 'text-emerald-500'} />
                        <span className="font-bold text-slate-900">Urgency Level:</span>
                        <span className={`font-bold ${msg.urgency === 'High' ? 'text-red-600' : msg.urgency === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}`}>{msg.urgency}</span>
                      </div>
                    </div>
                  )}
                  
                  {msg.disclaimer && (
                    <div className="mt-3 flex items-start gap-2 text-xs text-slate-400 border-t border-slate-100 pt-3">
                      <ShieldCheck size={14} className="shrink-0 mt-0.5" />
                      <p>{msg.disclaimer}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shrink-0">
                  <Bot size={20} />
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <form onSubmit={handleSend} className="relative">
            <input 
              type="text" 
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="E.g., I have been experiencing severe chest pain and dizziness since morning..."
              className="w-full pl-6 pr-16 py-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-slate-700"
            />
            <button 
              type="submit"
              disabled={loading || !symptoms.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 transition disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
