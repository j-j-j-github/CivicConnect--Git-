'use client';

import Link from 'next/link';
import { Bell, UserCircle } from 'lucide-react';
import { useState } from 'react';

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB] font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-100 flex items-center justify-between px-8 py-4 sticky top-0 z-50 shadow-sm">
        <Link href="/citizen/dashboard" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          {/* Logo Icon */}
          <div className="w-8 h-10 flex items-center justify-center">
            <svg width="32" height="40" viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 0C16.536 0 4 12.536 4 28C4 49 32 80 32 80C32 80 60 49 60 28C60 12.536 47.464 0 32 0Z" fill="#042B6B"/>
              <rect x="20" y="16" width="24" height="18" rx="2" fill="white"/>
              <path d="M22 22H42V30H22V22Z" fill="#042B6B"/>
              <rect x="24" y="22" width="2" height="8" fill="white"/>
              <rect x="31" y="22" width="2" height="8" fill="white"/>
              <rect x="38" y="22" width="2" height="8" fill="white"/>
              <polygon points="32,18 22,22 42,22" fill="#042B6B"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#042B6B]">CivicConnect</h1>
        </Link>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
          <Link href="/citizen/dashboard" className="text-[#042B6B] font-bold">Home</Link>
          <Link href="/citizen/complaints" className="hover:text-gray-900 transition-colors">Reports</Link>
          <Link href="/citizen/map" className="hover:text-gray-900 transition-colors">Map</Link>
          <Link href="/citizen/profile" className="hover:text-gray-900 transition-colors">Profile</Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-5 relative">
          <button 
            className="relative text-gray-600 hover:text-gray-900 transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          
          {/* Notifications Popover */}
          {showNotifications && (
            <div className="absolute top-10 right-10 w-80 bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden z-50">
              <div className="p-4 border-b border-gray-100 font-bold text-gray-900">Notifications</div>
              <div className="max-h-64 overflow-y-auto">
                <div className="p-4 border-b border-gray-50 hover:bg-gray-50 text-sm">
                  <p className="font-semibold text-gray-900">Welcome to CivicConnect!</p>
                  <p className="text-gray-500 mt-1">Thank you for joining our platform to improve the city.</p>
                </div>
                <div className="p-4 hover:bg-gray-50 text-sm">
                  <p className="font-semibold text-gray-900">Report #1 Update</p>
                  <p className="text-gray-500 mt-1">Your report for "Pothole on Main St" is now In Progress.</p>
                </div>
              </div>
            </div>
          )}
          
          <Link href="/citizen/profile" className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border border-gray-300">
            {/* Placeholder avatar */}
            <UserCircle size={32} className="text-gray-400" />
          </Link>
        </div>
      </header>
      
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
