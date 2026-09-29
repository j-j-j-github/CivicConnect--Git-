'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

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

export default function LiveMap({ incidents }: { incidents: any[] }) {
  // Default center (e.g. Kerala, India)
  const center: [number, number] = [10.8505, 76.2711];

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      style={{ height: '600px', width: '100%' }}
      className="rounded-xl z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {incidents.map((incident) => (
        <Marker 
          key={incident.id} 
          position={[incident.lat, incident.lng]}
          icon={icon}
        >
          <Popup>
            {incident.title}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
