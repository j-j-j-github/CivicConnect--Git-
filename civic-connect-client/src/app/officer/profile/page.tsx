'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { API_URL } from '@/lib/api';
import { 
  Building2, 
  User, 
  ArrowLeft,
  Mail,
  ShieldCheck,
  Calendar,
  Edit3,
  Check,
  X
} from 'lucide-react';

export default function OfficerProfile() {
  const router = useRouter();
  const [officerInfo, setOfficerInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const token = Cookies.get('token');

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }
    const fetchMe = async () => {
      try {
        const meRes = await fetch(`${API_URL}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (meRes.ok) {
          const data = await meRes.json();
          setOfficerInfo(data);
          setEditName(data.full_name || data.citizenProfile?.full_name || '');
        }
      } catch(err) {} finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token, router]);

  const handleSave = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ full_name: editName.trim() })
      });
      if (res.ok) {
        setOfficerInfo((prev: any) => ({ ...prev, full_name: editName.trim() }));
        setIsEditing(false);
      } else {
        alert('Failed to update name');
      }
    } catch(err) {
      alert('Failed to update name');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#042B6B]"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col animate-in fade-in duration-300">
      {/* Header */}
      <header className="bg-[#042B6B] text-white py-5 px-8 flex justify-between items-center shadow-lg border-b border-blue-900">
        <div className="flex items-center gap-3">
          <Building2 size={28} className="text-orange-400" />
          <h1 className="text-2xl font-black tracking-tight uppercase">CivicConnect <span className="text-orange-400 font-bold text-lg">Department Portal</span></h1>
        </div>
        <button 
          onClick={() => router.push('/officer/dashboard')}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl text-sm font-extrabold transition-all border border-white/20"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-12">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
          {/* Card Top Banner */}
          <div className="h-32 bg-gradient-to-r from-[#042B6B] to-blue-800 relative overflow-hidden">
            <div className="absolute -bottom-16 left-12 w-32 h-32 bg-white rounded-3xl shadow-lg border-4 border-white flex items-center justify-center text-[#042B6B] z-10">
              <User size={64} />
            </div>
            {/* Lanyard Graphic */}
            <div className="absolute top-0 left-28 w-4 h-full bg-orange-400/80 mx-auto transform -translate-x-1/2 z-0"></div>
            <div className="absolute top-0 right-12 text-white/20 font-black text-6xl tracking-tighter pt-4 z-0">
              ID: {officerInfo?.id?.substring(0,8).toUpperCase()}
            </div>
          </div>
          
          <div className="pt-20 px-12 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                {isEditing ? (
                  <div className="flex items-center gap-3 mb-2">
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="text-3xl font-black text-gray-900 border-b-2 border-[#042B6B] focus:outline-none focus:border-orange-500 py-1"
                      autoFocus
                    />
                    <button onClick={handleSave} disabled={saving} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                      <Check size={20} />
                    </button>
                    <button onClick={() => setIsEditing(false)} className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                    {officerInfo?.full_name || officerInfo?.citizenProfile?.full_name || 'Unregistered Name'}
                    <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-[#042B6B] transition-colors p-2 bg-gray-50 rounded-full hover:bg-blue-50">
                      <Edit3 size={18} />
                    </button>
                  </h2>
                )}
                
                <p className="text-xl text-[#042B6B] font-extrabold mt-1">Department Admin</p>
              </div>
              <div className="text-left md:text-right space-y-1">
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Access Level</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-lg border border-green-200">
                  <ShieldCheck size={16} /> Level 3
                </div>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Mail size={14} /> Official Email</p>
                  <p className="text-lg font-bold text-gray-800">{officerInfo?.email}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Building2 size={14} /> Assigned Department</p>
                  <p className="text-lg font-bold text-gray-800">{officerInfo?.department?.name || 'Unassigned'}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5"><Calendar size={14} /> Joined Date</p>
                  <p className="text-lg font-bold text-gray-800">{new Date(officerInfo?.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric'})}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">System Role</p>
                  <p className="text-lg font-bold text-gray-800 capitalize">{officerInfo?.role?.toLowerCase()}</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-xs text-gray-400 font-medium max-w-sm">
                This identity card is strictly for internal department use and confirms authorization to process citizen grievances.
              </div>
              <div className="w-16 h-16 opacity-20 hidden md:block">
                {/* QR Code placeholder */}
                <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-[#042B6B]">
                  <path d="M0,0 h30 v30 h-30 z m10,10 h10 v10 h-10 z" />
                  <path d="M70,0 h30 v30 h-30 z m10,10 h10 v10 h-10 z" />
                  <path d="M0,70 h30 v30 h-30 z m10,10 h10 v10 h-10 z" />
                  <path d="M40,0 h20 v20 h-20 z M40,80 h20 v20 h-20 z M0,40 h20 v20 h-20 z M80,40 h20 v20 h-20 z" />
                  <path d="M40,40 h20 v20 h-20 z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
