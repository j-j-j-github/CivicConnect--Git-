import React from 'react';
import Link from 'next/link';
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
  Search
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: BarChart3 },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Departments', href: '/admin/departments', icon: Building2 },
    { name: 'Officers', href: '/admin/officers', icon: User },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'SLA Tracking', href: '/admin/sla', icon: Clock },
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: ShieldAlert },
    { name: 'Reports', href: '/admin/reports', icon: FileText },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
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
        
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
              AG
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Arjun Ghosh</p>
              <p className="text-xs text-slate-400">System Admin</p>
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
          
          <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-lg w-96">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Search users, tickets, or settings..." 
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative text-gray-400 hover:text-gray-600">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
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
