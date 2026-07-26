'use client';

import { useState, useEffect } from 'react';
import { UserCircle, Mail, Phone, MapPin, Shield, Check, X } from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Jeeval Jolly Jacob',
    email: 'jeeval@example.com',
    phone: '',
    address: ''
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('civic_profile');
    if (saved) {
      setProfile(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('civic_profile', JSON.stringify(profile));
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Profile</h1>
        <p className="text-gray-500 mt-2 text-lg">Manage your personal information and preferences.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 border-b border-gray-100">
          <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center border-4 border-white shadow-md relative flex-shrink-0">
            <UserCircle size={80} className="text-[#042B6B]" />
            <button className="absolute bottom-0 right-0 bg-white border border-gray-200 rounded-full p-2 shadow-sm text-gray-600 hover:text-blue-600 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            </button>
          </div>
          <div className="text-center md:text-left flex-1 w-full">
            {isEditing ? (
              <input 
                type="text" 
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="text-2xl font-bold text-gray-900 w-full border border-gray-300 rounded px-2 py-1 mb-2" 
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
            )}
            <p className="text-gray-500 font-medium">Citizen Account</p>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                <Shield size={14} /> Verified User
              </span>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Contact Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-500 flex items-center gap-2 mb-1">
                    <Mail size={16} /> Email Address
                  </label>
                  {isEditing ? (
                    <input 
                      type="email" 
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      className="w-full text-gray-900 font-medium bg-white p-3 rounded-lg border border-gray-300" 
                    />
                  ) : (
                    <p className="text-gray-900 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100">{profile.email}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500 flex items-center gap-2 mb-1">
                    <Phone size={16} /> Phone Number
                  </label>
                  {isEditing ? (
                    <input 
                      type="tel" 
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      placeholder="Add phone number"
                      className="w-full text-gray-900 font-medium bg-white p-3 rounded-lg border border-gray-300" 
                    />
                  ) : (
                    <p className={`font-medium p-3 rounded-lg border border-gray-100 ${profile.phone ? 'text-gray-900 bg-gray-50' : 'text-gray-400 bg-gray-50/50 italic'}`}>
                      {profile.phone || 'No phone number added'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Location</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-500 flex items-center gap-2 mb-1">
                    <MapPin size={16} /> Primary Address
                  </label>
                  {isEditing ? (
                    <textarea 
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      placeholder="Add your full address"
                      rows={3}
                      className="w-full text-gray-900 font-medium bg-white p-3 rounded-lg border border-gray-300" 
                    ></textarea>
                  ) : (
                    <p className={`font-medium p-3 rounded-lg border border-gray-100 whitespace-pre-line ${profile.address ? 'text-gray-900 bg-gray-50' : 'text-gray-400 bg-gray-50/50 italic'}`}>
                      {profile.address || 'No address added'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-4 border-t border-gray-100">
            {isEditing ? (
              <>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 border-2 border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <X size={18} /> Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Check size={18} /> Save Changes
                </button>
              </>
            ) : (
              <>
                <button className="px-6 py-2 border-2 border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-colors">
                  Change Password
                </button>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-[#042B6B] text-white font-bold rounded-lg hover:bg-[#031d4a] transition-colors"
                >
                  Edit Profile
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
