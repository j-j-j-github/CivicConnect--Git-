'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, Map, Activity } from 'lucide-react';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';

// Dynamically import the map to prevent SSR issues
const LiveMap = dynamic(() => import('@/components/map/LiveMap'), { ssr: false });

export default function AnalyticsDashboard() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = Cookies.get('token');
      const compRes = await fetch('http://localhost:3001/api/v1/complaints', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (compRes.ok) {
        const data = await compRes.json();
        setComplaints(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading analytics...</div>;

  // Process data for charts
  const categoryCounts = complaints.reduce((acc: any, c: any) => {
    const cat = c.ai_category || 'Uncategorized';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const statusCounts = complaints.reduce((acc: any, c: any) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  const mapIncidents = complaints
    .filter(c => c.location_lat && c.location_lng)
    .map(c => ({
      id: c.id,
      lat: c.location_lat,
      lng: c.location_lng,
      title: `${c.title} (${c.status})`
    }));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Analytics & Map</h1>
          <p className="text-sm text-gray-500 mt-1">Platform-wide statistics and geographic complaint distribution.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <Activity className="text-blue-600" size={18} />
            <h3 className="font-bold text-gray-800">Complaint Categories</h3>
          </div>
          <div className="p-6 flex-1 flex flex-col gap-4">
            {Object.entries(categoryCounts).map(([cat, count]: any) => (
              <div key={cat} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{cat}</span>
                <div className="flex items-center gap-3 w-2/3">
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(count / complaints.length) * 100}%` }}></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <BarChart3 className="text-blue-600" size={18} />
            <h3 className="font-bold text-gray-800">Status Distribution</h3>
          </div>
          <div className="p-6 flex-1 grid grid-cols-2 gap-4">
            {Object.entries(statusCounts).map(([status, count]: any) => (
              <div key={status} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{status}</span>
                <span className="text-3xl font-black text-gray-800">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
          <Map className="text-blue-600" size={18} />
          <h3 className="font-bold text-gray-800">Geographic Complaint Heatmap</h3>
        </div>
        <div className="p-1 h-[600px]">
          {mapIncidents.length > 0 ? (
            <LiveMap incidents={mapIncidents} />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-50 text-gray-400">
              No location data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
