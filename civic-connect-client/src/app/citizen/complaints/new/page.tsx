'use client';

import { useState, useEffect } from 'react';
import { UploadCloud, MapPin, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

interface Department {
  id: string;
  name: string;
  description: string | null;
}

export default function NewComplaintPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [departments, setDepartments] = useState<Department[]>([]);
  
  // Form State
  const [title, setTitle] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const token = Cookies.get('token');
        const res = await fetch('http://localhost:3001/api/v1/departments', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          setDepartments(data);
          if (data.length > 0) setDepartmentId(data[0].id);
        }
      } catch (e) {
        console.error('Failed to fetch departments', e);
      }
    }
    fetchDepartments();
  }, []);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setLocation({ lat, lng });

      // Reverse Geocoding to Auto-fill Address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          setAddress(results[0].formatted_address);
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const token = Cookies.get('token');
    if (!token) {
      alert('Please log in first to submit a complaint.');
      router.push('/auth/login');
      return;
    }

    if (!departmentId) {
      setError('Please select a department.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title,
        description,
        department_id: departmentId,
        priority,
        location_lat: location?.lat || null,
        location_lng: location?.lng || null,
      };

      const res = await fetch('http://localhost:3001/api/v1/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to submit complaint');
      }

      router.push('/citizen/complaints');
    } catch (err: any) {
      setError(err.message || 'Error submitting complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Submit a Complaint</h1>
        <p className="text-gray-600 mt-2">Help us build a better city by reporting issues in your area.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 text-sm font-semibold">
          <AlertCircle size={20} />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                Complaint Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Large pothole causing traffic"
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="department">
                  Target Department
                </label>
                <select
                  id="department"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
                >
                  <option value="">Select a department...</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="priority">
                  Priority Level
                </label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
                >
                  <option value="LOW">Low Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="HIGH">High Priority</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                Detailed Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Provide as much detail as possible..."
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="address">
                Street Address (Auto-filled by Map)
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Click the map below to auto-fill"
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            {/* Geo-tagging Block */}
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 flex justify-between">
                <span>Location (Pin on Map)</span>
                {location && (
                  <span className="text-xs font-bold text-[#1E3A8A]">
                    Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
                  </span>
                )}
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden h-[300px] w-full bg-gray-50 relative">
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={location || { lat: 40.7128, lng: -74.0060 }}
                    zoom={location ? 15 : 12}
                    onClick={handleMapClick}
                    options={{
                      disableDefaultUI: true,
                      zoomControl: true,
                    }}
                  >
                    {location && (
                      <Marker position={location} />
                    )}
                  </GoogleMap>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400 animate-pulse">
                    <MapPin size={32} className="mb-2" />
                    <span className="ml-2 font-medium">Loading Map...</span>
                  </div>
                )}
                {!location && isLoaded && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md text-sm font-bold text-[#1E3A8A] pointer-events-none">
                    Click on the map to place a pin
                  </div>
                )}
              </div>
            </div>

            {/* Media Upload Block */}
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Evidence (Images/Video)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-[#1E3A8A] transition-colors cursor-pointer">
                <UploadCloud size={32} className="mb-2 text-gray-400" />
                <span className="text-sm font-medium">Upload Media</span>
                <span className="text-xs text-gray-400 mt-1">PNG, JPG, MP4 up to 50MB</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-8 py-3 bg-[#1E3A8A] text-white font-semibold rounded-lg hover:bg-[#152c6b] transition-colors disabled:opacity-70"
            >
              {loading ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
