'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { 
  Users, 
  Building2, 
  User, 
  Settings, 
  BarChart3, 
  Clock, 
  FileText,
  ShieldAlert,
  Menu,
  Bell,
  Search,
  LogOut
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [adminInfo, setAdminInfo] = useState<any>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) return;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' ? 'https://civicconnect-git.onrender.com/api/v1' : 'http://localhost:3001/api/v1');
        const res = await fetch(`${apiUrl}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setAdminInfo(await res.json());
        }
      } catch (err) {}
    };
    fetchMe();
  }, []);

  const handleUpdateName = async () => {
    const newName = window.prompt("Enter your full name:", adminInfo?.full_name || "");
    if (newName && newName.trim() !== "") {
      try {
        const token = Cookies.get('token');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' ? 'https://civicconnect-git.onrender.com/api/v1' : 'http://localhost:3001/api/v1');
        const res = await fetch(`${apiUrl}/auth/profile`, {
          method: 'PATCH',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ full_name: newName.trim() })
        });
        if (res.ok) {
          setAdminInfo((prev: any) => ({ ...prev, full_name: newName.trim() }));
        }
      } catch(err) {}
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/auth/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Departments', href: '/admin/departments', icon: Building2 },
    { name: 'Officers', href: '/admin/officers', icon: User },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'SLA Tracking', href: '/admin/sla', icon: Clock },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <ShieldAlert className="w-6 h-6 mr-3 text-blue-400" />
          <span className="text-xl font-bold tracking-tight">Admin Portal</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-md hover:bg-slate-800 hover:text-blue-400 transition-all"
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-blue-400" aria-hidden="true" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors" onClick={handleUpdateName} title="Click to update your name">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                {adminInfo?.full_name ? adminInfo.full_name[0].toUpperCase() : 'A'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{adminInfo?.full_name || 'Unregistered Name'}</p>
                <p className="text-xs text-slate-400">{adminInfo?.role === 'ADMIN' ? 'System Admin' : 'Department Admin'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center md:hidden">
            <button className="text-gray-500 hover:text-gray-700">
              <Menu className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex items-center space-x-4 ml-auto">
            <button onClick={handleLogout} className="text-gray-400 hover:text-gray-600 flex items-center text-sm font-medium border-l pl-4 border-gray-200">
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
