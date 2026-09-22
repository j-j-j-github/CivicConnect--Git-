'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';
import { useEffect } from 'react';

// Fix Leaflet marker icon paths in Next.js
const defaultIcon = L.icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Create custom icons based on status
const createStatusIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 1.25rem; height: 1.25rem; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
  });
};

const icons: Record<string, L.DivIcon> = {
  'Pending': createStatusIcon('gray'),
  'In Progress': createStatusIcon('orange'),
  'Resolved': createStatusIcon('green')
};

function HeatmapLayer({ points }: { points: [number, number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    
    // @ts-ignore
    const heatLayer = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}

export default function LiveMap({ incidents }: { incidents: any[] }) {
  // Center on the first incident or default to NY
  const center: [number, number] = incidents.length > 0 && incidents[0].lat && incidents[0].lng 
    ? [incidents[0].lat, incidents[0].lng] 
    : [40.7128, -74.0060];

  const heatPoints: [number, number, number][] = incidents
    .filter(inc => inc.lat && inc.lng)
    .map(inc => [inc.lat, inc.lng, 1]);

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
      
      {heatPoints.length > 0 && <HeatmapLayer points={heatPoints} />}
      
      {incidents.filter(inc => inc.lat && inc.lng).map((incident) => {
        const icon = incident.status && icons[incident.status] ? icons[incident.status] : defaultIcon;
        return (
          <Marker 
            key={incident.id} 
            position={[incident.lat, incident.lng]}
            icon={icon}
          >
            <Popup>
              <div className="text-sm min-w-[150px]">
                <strong className="block mb-2 text-base">{incident.title}</strong>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-medium">{incident.status || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Priority:</span>
                  <span className="font-medium">{incident.priority || 'Normal'}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
