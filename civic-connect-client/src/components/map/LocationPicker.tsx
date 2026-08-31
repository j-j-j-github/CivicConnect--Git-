'use client';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icon paths in Next.js
const icon = L.icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Nominatim Reverse Geocoding
async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
      headers: {
        'Accept-Language': 'en-US,en;q=0.9',
        // Nominatim requires a user-agent for reverse geocoding
        'User-Agent': 'CivicConnect/1.0 (Development)'
      }
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.display_name || null;
  } catch (err) {
    console.error("Geocoding failed", err);
    return null;
  }
}

function LocationMarker({ location, setLocation, setAddress }: { 
  location: {lat: number, lng: number} | null, 
  setLocation: (loc: {lat: number, lng: number}) => void,
  setAddress: (addr: string) => void
}) {
  useMapEvents({
    async click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setLocation({ lat, lng });
      
      const address = await reverseGeocode(lat, lng);
      if (address) {
        setAddress(address);
      }
    },
  });

  return location === null ? null : (
    <Marker position={[location.lat, location.lng]} icon={icon}>
      <Popup>Report Location</Popup>
    </Marker>
  );
}

export default function LocationPicker({ 
  location, 
  setLocation, 
  setAddress 
}: { 
  location: {lat: number, lng: number} | null, 
  setLocation: (loc: {lat: number, lng: number}) => void,
  setAddress: (addr: string) => void
}) {
  const defaultCenter: [number, number] = [40.7128, -74.0060];
  
  return (
    <MapContainer 
      center={location ? [location.lat, location.lng] : defaultCenter} 
      zoom={location ? 15 : 12} 
      style={{ height: '300px', width: '100%' }}
      className="rounded-lg z-0 relative"
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <LocationMarker location={location} setLocation={setLocation} setAddress={setAddress} />
      
      {!location && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md text-sm font-bold text-[#1E3A8A] z-[1000] pointer-events-none border border-gray-100">
          Click on the map to place a pin
        </div>
      )}
    </MapContainer>
  );
}
