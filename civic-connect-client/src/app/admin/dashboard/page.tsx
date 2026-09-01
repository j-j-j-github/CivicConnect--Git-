'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { Building2, Users, AlertTriangle, ShieldCheck, LogOut, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    departmentsCount: 0,
    usersCount: 12,
    complaintsCount: 24,
  });

  useEffect(() => {
    // Load some fresh stats if possible
    async function loadStats() {
      try {
        const token = Cookies.get('token');
        if (!token) return;

        const res = await fetch('http://localhost:3001/api/v1/departments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(prev => ({
            ...prev,
            departmentsCount: data.length
          }));
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadStats();
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <header className="bg-[#042B6B] text-white py-4 px-8 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <ShieldCheck size={28} className="text-orange-400" />
          <h1 className="text-xl font-bold tracking-tight">CivicConnect Administrator Portal</h1>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
        >
          <LogOut size={16} /> Logout
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-12 space-y-10">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome, Administrator</h2>
          <p className="text-gray-500 mt-1">Manage city departments, assign officials, and monitor system health.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Departments</p>
              <p className="text-4xl font-extrabold text-gray-900">{stats.departmentsCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Building2 size={24} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Registered Users</p>
              <p className="text-4xl font-extrabold text-gray-900">{stats.usersCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
              <Users size={24} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Complaints</p>
              <p className="text-4xl font-extrabold text-gray-900">{stats.complaintsCount}</p>
            </div>
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>

        {/* Administrative Sections */}
        <div className="pt-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Management Modules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Department Management Panel */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:border-[#042B6B] hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <Building2 className="text-[#042B6B] mb-3" size={32} />
                <h4 className="text-xl font-bold text-gray-900 mb-2">Department Management</h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Add new municipal entities, update descriptions, manage department configurations, or delete inactive departments.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link 
                  href="/admin/departments"
                  className="inline-flex items-center gap-2 font-bold text-[#042B6B] hover:underline"
                >
                  Configure Departments <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Officer & User Assignment Panel */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between opacity-80">
              <div>
                <Users className="text-gray-400 mb-3" size={32} />
                <h4 className="text-xl font-bold text-gray-400 mb-2">Officer Management</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Onboard new government officials and allocate them to specific departments.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <span className="inline-flex items-center gap-2 font-bold text-gray-400 cursor-not-allowed">
                  Under Construction <ArrowRight size={16} />
                </span>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
