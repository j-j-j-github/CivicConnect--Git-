'use client';

import { useState, useEffect } from 'react';
import { MapPin, ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';
import { fetchApi } from '../../../lib/api';
import Link from 'next/link';

// Dynamically import Leaflet Map to avoid SSR window errors
const LiveMap = dynamic(() => import('../../../components/map/LiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400">
      Loading Map...
    </div>
  ),
});

export default function AdminMapPage() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        // Admins fetch ALL complaints, not just 'my' complaints
        const data = await fetchApi('/complaints');
        if (data && Array.isArray(data)) {
          setIncidents(data);
        } else if (data && data.data && Array.isArray(data.data)) {
          setIncidents(data.data);
        } else {
          setIncidents([]);
        }
      } catch (error) {
        console.error('Failed to fetch complaints for map:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-700">
            <MapPin size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">City-Wide Heatmap (Admin)</h1>
            <p className="text-gray-500 mt-1">Global view of all reported civic issues across the city.</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
             <div className="w-full h-[600px] bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400">
               Loading Map...
             </div>
          ) : (
            <LiveMap incidents={incidents} />
          )}
        </div>
      </div>
    </div>
  );
}
