'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Home, Calendar, Pill, Stethoscope, FileText, AlertTriangle, Settings, Users, Heart, CreditCard, Package, Beaker, Bed, Bot } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // Preload all routes for instant navigation
  useEffect(() => {
    // Preload critical routes for instant navigation
    const criticalRoutes = [
      '/patient/appointments',
      '/patient/medical-records',
      '/patient/medications',
      '/patient/reminders',
      '/patient/health-tracking',
      '/patient/emergency',
      '/patient/health-timeline'
    ];
    
    // Prefetch all routes for instant navigation
    criticalRoutes.forEach(route => {
      router.prefetch(route);
    });
  }, [router]);

  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) {
      router.push('/login');
    } else {
      setUser(JSON.parse(rawUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar Navigation */}
      <aside className="w-64 glass-dark text-white border-r border-white/10 flex flex-col fixed h-full z-40 overflow-y-auto">
        <div className="p-6 overflow-y-auto">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white font-bold text-xl">+</div>
            <span className="font-bold text-lg">HealthSync Role: <span className="capitalize text-teal-300">{user.role}</span></span>
          </div>

          <nav className="space-y-2 pb-20">
            <Link href={`/${user.role}`} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              pathname === `/${user.role}` 
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 shadow-lg border-2 border-teal-400' 
                : 'bg-white/10 hover:bg-white/20'
            }`}>
              <Home size={20} className={pathname === `/${user.role}` ? 'text-white' : 'text-teal-400'} /> 
              <span className={pathname === `/${user.role}` ? 'text-white font-bold' : 'text-white'}>Dashboard</span>
            </Link>
            
            {user.role === 'patient' && (
              <>
                <Link href="/patient/appointments" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === '/patient/appointments' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg border-2 border-blue-400' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}>
                  <Calendar size={20} className={pathname === '/patient/appointments' ? 'text-white' : 'text-blue-400'} /> 
                  <span className={pathname === '/patient/appointments' ? 'text-white font-bold' : 'text-white'}>Book Appointment</span>
                </Link>
                <Link href="/patient/medications" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === '/patient/medications' 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg border-2 border-emerald-400' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}>
                  <Pill size={20} className={pathname === '/patient/medications' ? 'text-white' : 'text-emerald-400'} /> 
                  <span className={pathname === '/patient/medications' ? 'text-white font-bold' : 'text-white'}>Medications</span>
                </Link>
                <Link href="/patient/opd-history" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === '/patient/opd-history' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg border-2 border-purple-400' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}>
                  <FileText size={20} className={pathname === '/patient/opd-history' ? 'text-white' : 'text-purple-400'} /> 
                  <span className={pathname === '/patient/opd-history' ? 'text-white font-bold' : 'text-white'}>OPD History</span>
                </Link>
                
                {/* Health Management Dashboard Buttons */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-slate-400 font-semibold mb-3 uppercase tracking-wider">Health Management</p>
                  <div className="space-y-2">
                    <Link href="/patient/appointments" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      pathname === '/patient/appointments' 
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 shadow-lg border-2 border-teal-400' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}>
                      <Calendar size={18} className={pathname === '/patient/appointments' ? 'text-white' : 'text-teal-400'} /> 
                      <span className={pathname === '/patient/appointments' ? 'text-white font-bold' : 'text-white text-sm'}>Book Appointment</span>
                    </Link>
                    <Link href="/patient/medical-records" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      pathname === '/patient/medical-records'
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg border-2 border-blue-400' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}>
                      <FileText size={18} className={pathname === '/patient/medical-records' ? 'text-white' : 'text-blue-400'} /> 
                      <span className={pathname === '/patient/medical-records' ? 'text-white font-bold' : 'text-white text-sm'}>Medical Records</span>
                    </Link>
                    <Link href="/patient/medications" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      pathname === '/patient/medications'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg border-2 border-purple-400' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}>
                      <Pill size={18} className={pathname === '/patient/medications' ? 'text-white' : 'text-purple-400'} /> 
                      <span className={pathname === '/patient/medications' ? 'text-white font-bold' : 'text-white text-sm'}>Medications</span>
                    </Link>
                    <Link href="/patient/reminders" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      pathname === '/patient/reminders'
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg border-2 border-orange-400' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}>
                      <AlertTriangle size={18} className={pathname === '/patient/reminders' ? 'text-white' : 'text-orange-400'} /> 
                      <span className={pathname === '/patient/reminders' ? 'text-white font-bold' : 'text-white text-sm'}>Reminders</span>
                    </Link>
                    <Link href="/patient/health-tracking" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      pathname === '/patient/health-tracking'
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-lg border-2 border-red-400' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}>
                      <Heart size={18} className={pathname === '/patient/health-tracking' ? 'text-white' : 'text-red-400'} /> 
                      <span className={pathname === '/patient/health-tracking' ? 'text-white font-bold' : 'text-white text-sm'}>Health Tracking</span>
                    </Link>
                    <Link href="/patient/emergency" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      pathname === '/patient/emergency'
                        ? 'bg-gradient-to-r from-red-600 to-orange-600 shadow-lg border-2 border-red-500' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}>
                      <AlertTriangle size={18} className={pathname === '/patient/emergency' ? 'text-white' : 'text-red-500'} /> 
                      <span className={pathname === '/patient/emergency' ? 'text-white font-bold' : 'text-white text-sm'}>Emergency</span>
                    </Link>
                    <Link href="/patient/health-timeline" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      pathname === '/patient/health-timeline'
                        ? 'bg-gradient-to-r from-gray-500 to-slate-500 shadow-lg border-2 border-gray-400' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}>
                      <Settings size={18} className={pathname === '/patient/health-timeline' ? 'text-white' : 'text-gray-400'} /> 
                      <span className={pathname === '/patient/health-timeline' ? 'text-white font-bold' : 'text-white text-sm'}>Health Timeline</span>
                    </Link>
                    <Link href="/patient/invoices" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      pathname === '/patient/invoices'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg border-2 border-green-400' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}>
                      <CreditCard size={18} className={pathname === '/patient/invoices' ? 'text-white' : 'text-green-400'} /> 
                      <span className={pathname === '/patient/invoices' ? 'text-white font-bold' : 'text-white text-sm'}>Bills & Invoices</span>
                    </Link>
                    <Link href="/patient/symptom-checker" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      pathname === '/patient/symptom-checker'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg border-2 border-indigo-400' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}>
                      <Bot size={18} className={pathname === '/patient/symptom-checker' ? 'text-white' : 'text-indigo-400'} /> 
                      <span className={pathname === '/patient/symptom-checker' ? 'text-white font-bold' : 'text-white text-sm'}>AI Symptom Checker</span>
                    </Link>
                  </div>
                </div>
              </>
            )}
            {user.role === 'doctor' && (
              <>
                <Link href="/opd" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === '/opd' 
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg border-2 border-purple-400' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}>
                  <Stethoscope size={20} className={pathname === '/opd' ? 'text-white' : 'text-purple-400'} /> 
                  <span className={pathname === '/opd' ? 'text-white font-bold' : 'text-white'}>OPD Management</span>
                </Link>
                <Link href="/doctor/lab-orders" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === '/doctor/lab-orders' 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg border-2 border-blue-400' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}>
                  <Beaker size={20} className={pathname === '/doctor/lab-orders' ? 'text-white' : 'text-blue-400'} /> 
                  <span className={pathname === '/doctor/lab-orders' ? 'text-white font-bold' : 'text-white'}>Lab Orders</span>
                </Link>
                <Link href="/emergency" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === '/emergency' 
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 shadow-lg border-2 border-red-400' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}>
                  <AlertTriangle size={20} className={pathname === '/emergency' ? 'text-white' : 'text-red-400'} /> 
                  <span className={pathname === '/emergency' ? 'text-white font-bold' : 'text-white'}>Emergency</span>
                </Link>
              </>
            )}
            {user.role === 'admin' && (
              <>
                <Link href="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === '/admin' 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg border-2 border-amber-400' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}>
                  <Settings size={20} className={pathname === '/admin' ? 'text-white' : 'text-amber-400'} /> 
                  <span className={pathname === '/admin' ? 'text-white font-bold' : 'text-white'}>Admin Dashboard</span>
                </Link>
                <Link href="/admin/billing" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === '/admin/billing' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg border-2 border-green-400' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}>
                  <CreditCard size={20} className={pathname === '/admin/billing' ? 'text-white' : 'text-green-400'} /> 
                  <span className={pathname === '/admin/billing' ? 'text-white font-bold' : 'text-white'}>Billing Management</span>
                </Link>
                <Link href="/admin/pharmacy" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === '/admin/pharmacy' 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg border-2 border-blue-400' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}>
                  <Package size={20} className={pathname === '/admin/pharmacy' ? 'text-white' : 'text-blue-400'} /> 
                  <span className={pathname === '/admin/pharmacy' ? 'text-white font-bold' : 'text-white'}>Pharmacy & Inventory</span>
                </Link>
                <Link href="/admin/bed-management" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === '/admin/bed-management' 
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg border-2 border-pink-400' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}>
                  <Bed size={20} className={pathname === '/admin/bed-management' ? 'text-white' : 'text-pink-400'} /> 
                  <span className={pathname === '/admin/bed-management' ? 'text-white font-bold' : 'text-white'}>Bed Management</span>
                </Link>
                <Link href="/emergency" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === '/emergency' 
                    ? 'bg-gradient-to-r from-red-500 to-orange-500 shadow-lg border-2 border-red-400' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}>
                  <AlertTriangle size={20} className={pathname === '/emergency' ? 'text-white' : 'text-red-400'} /> 
                  <span className={pathname === '/emergency' ? 'text-white font-bold' : 'text-white'}>Emergency</span>
                </Link>
              </>
            )}
            {user.role === 'caregiver' && (
              <>
                <Link href="/caregiver" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === '/caregiver' 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg border-2 border-cyan-400' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}>
                  <Users size={20} className={pathname === '/caregiver' ? 'text-white' : 'text-purple-400'} /> 
                  <span className={pathname === '/caregiver' ? 'text-white font-bold' : 'text-white'}>Caregiver</span>
                </Link>
              </>
            )}
            {user.role === 'lab-technician' && (
              <>
                <Link href="/lab-technician" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === '/lab-technician' 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg border-2 border-blue-400' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}>
                  <Beaker size={20} className={pathname === '/lab-technician' ? 'text-white' : 'text-blue-400'} /> 
                  <span className={pathname === '/lab-technician' ? 'text-white font-bold' : 'text-white'}>Lab Dashboard</span>
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-300 uppercase">
              {user.name.substring(0, 2)}
            </div>
            <div>
              <div className="text-sm font-bold truncate w-32">{user.name}</div>
              <div className="text-xs text-slate-400 truncate w-32">{user.email}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors w-full p-2">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
