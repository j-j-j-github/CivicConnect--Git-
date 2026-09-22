'use client';

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import { fetchApi } from '../../../lib/api';

// Dynamically import Leaflet Map to avoid SSR window errors
const LiveMap = dynamic(() => import('../../../components/map/LiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400">
      Loading Map...
    </div>
  ),
});

export default function MapPage() {
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const data = await fetchApi('/complaints/my');
        if (data && Array.isArray(data)) {
          setIncidents(data);
        } else if (data && data.data && Array.isArray(data.data)) {
          // Fallback just in case the API wraps it in a data property
          setIncidents(data.data);
        } else {
          setIncidents([]);
        }
      } catch (error) {
        console.error('Failed to fetch complaints for map:', error);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-[#1E3A8A]">
          <MapPin size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Civic Map</h1>
          <p className="text-gray-500 mt-1">Explore reported civic issues in your area.</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <LiveMap incidents={incidents} />
      </div>
    </div>
  );
}
