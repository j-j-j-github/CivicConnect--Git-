'use client';

import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet Map to avoid SSR window errors
const LiveMap = dynamic(() => import('../../../components/map/LiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400">
      Loading Map...
    </div>
  ),
});

// Mock initial incidents for the map
const initialIncidents = [
  { id: '1', lat: 40.7128, lng: -74.0060, title: 'Pothole on Main St' },
  { id: '2', lat: 40.7150, lng: -74.0020, title: 'Broken Streetlight' },
];

export default function MapPage() {
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('civic_complaints');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Filter out complaints without coordinates
      const mapped = parsed.filter((c: any) => c.lat && c.lng);
      setIncidents(mapped.length > 0 ? mapped : initialIncidents);
    } else {
      setIncidents(initialIncidents);
    }
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
