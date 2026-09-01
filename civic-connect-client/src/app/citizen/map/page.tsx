'use client';

import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';

const mapContainerStyle = {
  width: '100%',
  height: '600px'
};

const center = {
  lat: 40.7128, // Default center (e.g. New York or user's city)
  lng: -74.0060
};

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

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

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
        {isLoaded ? (
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={13}
              options={{
                disableDefaultUI: false,
                zoomControl: true,
                styles: [
                  {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                  }
                ]
              }}
            >
              {incidents.map((incident) => (
                <Marker
                  key={incident.id}
                  position={{ lat: incident.lat, lng: incident.lng }}
                  title={incident.title}
                />
              ))}
            </GoogleMap>
          </div>
        ) : (
          <div className="w-full h-[600px] bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400">
            Loading Map...
          </div>
        )}
      </div>
    </div>
  );
}
