import React from 'react';
import { Save, Shield, Bell, Database, Globe } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">System Configuration</h1>
        <p className="text-sm text-gray-500 mt-1">Manage global platform settings and default parameters.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          <button className="px-6 py-4 text-sm font-medium text-blue-600 border-b-2 border-blue-600 flex items-center whitespace-nowrap">
            <Globe className="h-4 w-4 mr-2" /> General
          </button>
          <button className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center whitespace-nowrap">
            <Shield className="h-4 w-4 mr-2" /> Security
          </button>
          <button className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center whitespace-nowrap">
            <Bell className="h-4 w-4 mr-2" /> Notifications
          </button>
          <button className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center whitespace-nowrap">
            <Database className="h-4 w-4 mr-2" /> Data Retention
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Platform Settings */}
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Identity</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
                  <input type="text" defaultValue="CivicConnect" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Municipality</label>
                  <input type="text" defaultValue="Metro City Council" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                  <input type="email" defaultValue="support@civicconnect.gov" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>
              </div>
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Global SLA Settings */}
          <section>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Global SLA Defaults</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">P1 (Critical) Resolution Time</label>
                  <div className="flex items-center">
                    <input type="number" defaultValue="24" className="w-20 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    <span className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-100 text-gray-500 sm:text-sm">hours</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">P2 (High) Resolution Time</label>
                  <div className="flex items-center">
                    <input type="number" defaultValue="48" className="w-20 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    <span className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-100 text-gray-500 sm:text-sm">hours</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">P3 (Medium) Resolution Time</label>
                  <div className="flex items-center">
                    <input type="number" defaultValue="5" className="w-20 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    <span className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-100 text-gray-500 sm:text-sm">days</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">P4 (Low) Resolution Time</label>
                  <div className="flex items-center">
                    <input type="number" defaultValue="14" className="w-20 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    <span className="inline-flex items-center px-3 py-2 rounded-r-md border border-l-0 border-gray-300 bg-gray-100 text-gray-500 sm:text-sm">days</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-4">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
