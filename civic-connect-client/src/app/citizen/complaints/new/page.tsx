'use client';

import { useState, useEffect } from 'react';
import { UploadCloud, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

export default function NewComplaintPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Create new complaint object
    const newComplaint = {
      id: Date.now().toString(),
      title,
      category,
      description,
      address,
      lat: location?.lat || null,
      lng: location?.lng || null,
      status: 'Pending',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    // Save to localStorage
    const savedComplaints = JSON.parse(localStorage.getItem('civic_complaints') || '[]');
    localStorage.setItem('civic_complaints', JSON.stringify([newComplaint, ...savedComplaints]));

    // Mock submit delay
    setTimeout(() => {
      setLoading(false);
      router.push('/citizen/dashboard');
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Submit a Complaint</h1>
        <p className="text-gray-600 mt-2">Help us build a better city by reporting issues in your area.</p>
      </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">
                Category (Department)
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
              >
                <option value="">Select a category...</option>
                <option value="Public Works">Public Works (PWD)</option>
                <option value="Water Authority">Water Authority</option>
                <option value="Electricity">Electricity Board</option>
                <option value="Police">Police</option>
                <option value="Municipality">Municipality (Waste, Health)</option>
              </select>
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
