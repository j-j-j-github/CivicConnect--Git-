'use client';

import { useState, useRef } from 'react';
import { UploadCloud, MapPin, Loader2, X, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { fetchApi } from '../../../../lib/api';

const LocationPicker = dynamic(() => import('../../../../components/map/LocationPicker'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] w-full items-center justify-center text-gray-400 bg-gray-50 animate-pulse border border-gray-300 rounded-lg">
      <MapPin size={32} className="mb-2" />
      <span className="ml-2 font-medium">Loading Map...</span>
    </div>
  )
});

export default function NewComplaintPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  
  // Media State
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMapClick = (e: any) => {
    // This is handled inside LocationPicker component directly now
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMediaFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let mediaUrls: string[] = [];

      // Upload media if present
      if (mediaFile) {
        setUploadingMedia(true);
        const formData = new FormData();
        formData.append('file', mediaFile);
        
        const uploadRes = await fetchApi('/storage/upload', {
          method: 'POST',
          body: formData
        });
        
        if (uploadRes && uploadRes.url) {
          mediaUrls.push(uploadRes.url);
        }
        setUploadingMedia(false);
      }

      // Create new complaint object
      await fetchApi('/complaints', {
        method: 'POST',
        body: JSON.stringify({
          title,
          category,
          description,
          latitude: location?.lat || null,
          longitude: location?.lng || null,
          media_urls: mediaUrls
        })
      });

      router.push('/citizen/dashboard');
    } catch (error) {
      console.error('Failed to submit complaint', error);
      alert('Failed to submit complaint. Please try again.');
      setLoading(false);
      setUploadingMedia(false);
    }
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
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
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
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
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
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-gray-900 focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
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
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
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
                <LocationPicker 
                  location={location} 
                  setLocation={setLocation} 
                  setAddress={setAddress} 
                />
              </div>
            </div>

            {/* Media Upload Block */}
            <div className="space-y-2 col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Evidence (Images/Video)</label>
              
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-[#1E3A8A] transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/png, image/jpeg, video/mp4" 
                  onChange={handleFileChange}
                />
                
                {mediaFile ? (
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-2">
                      <CheckCircle size={32} />
                    </div>
                    <span className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{mediaFile.name}</span>
                    <button 
                      type="button" 
                      className="mt-2 text-xs text-red-500 hover:underline flex items-center"
                      onClick={(e) => { e.stopPropagation(); setMediaFile(null); }}
                    >
                      <X size={14} className="mr-1" /> Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <UploadCloud size={32} className="mb-2 text-gray-400" />
                    <span className="text-sm font-medium">Upload Media</span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG, MP4 up to 50MB</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-8 py-3 bg-[#1E3A8A] text-white font-semibold rounded-lg hover:bg-[#152c6b] transition-colors disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center gap-2"><Loader2 className="animate-spin" size={20} /> {uploadingMedia ? 'Uploading Media...' : 'Submitting...'}</span>
              ) : 'Submit Complaint'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
