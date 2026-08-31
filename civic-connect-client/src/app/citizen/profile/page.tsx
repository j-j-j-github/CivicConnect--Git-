'use client';

import { useState, useEffect } from 'react';
import { UserCircle, Mail, Phone, MapPin, Shield, Check, X, Lock, Loader2, CheckCircle, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { fetchApi } from '../../../lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Password modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchApi('/citizens/profile');
        if (data) {
          setProfile({
            full_name: data.citizenProfile?.full_name || '',
            email: data.email || '',
            phone: data.citizenProfile?.phone || '',
            address: data.citizenProfile?.address || ''
          });
        }
      } catch (error) {
        console.error('Failed to load profile', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetchApi('/citizens/profile', {
        method: 'PATCH',
        body: JSON.stringify(profile),
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setPasswordLoading(true);
    try {
      await fetchApi('/auth/change-password', {
        method: 'PATCH',
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      setPasswordSuccess(true);
      setTimeout(() => setShowPasswordModal(false), 2000);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('civic_token');
    router.push('/auth/login');
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-600 h-8 w-8" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Profile</h1>
          <p className="text-gray-500 mt-2 text-lg">Manage your personal information and preferences.</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-semibold rounded-lg border border-red-200 transition-colors flex items-center gap-2 text-sm"
        >
          <LogOut size={16} /> Sign Out
        </button>
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
                name="full_name"
                value={profile.full_name}
                onChange={handleChange}
                className="text-2xl font-bold text-gray-900 w-full border border-gray-300 rounded px-2 py-1 mb-2" 
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-900">{profile.full_name}</h2>
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
                      disabled
                      value={profile.email}
                      className="w-full text-gray-500 font-medium bg-gray-100 p-3 rounded-lg border border-gray-300 cursor-not-allowed" 
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
                  disabled={saving}
                  className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />} Save Changes
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleLogout}
                  className="px-6 py-2 border-2 border-red-200 text-red-600 font-bold rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <LogOut size={18} /> Sign Out
                </button>
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="px-6 py-2 border-2 border-gray-200 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                >
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

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowPasswordModal(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Change Password
                    </h3>
                    <div className="mt-4">
                      {passwordSuccess ? (
                        <div className="bg-green-50 p-4 rounded-md flex items-center gap-3">
                          <CheckCircle className="text-green-500" />
                          <p className="text-green-800">Password successfully updated!</p>
                        </div>
                      ) : (
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Current Password</label>
                            <input 
                              type="password" 
                              required
                              value={passwordForm.currentPassword}
                              onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input 
                              type="password" 
                              required
                              value={passwordForm.newPassword}
                              onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                            <input 
                              type="password" 
                              required
                              value={passwordForm.confirmPassword}
                              onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                            <button
                              type="submit"
                              disabled={passwordLoading}
                              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                              {passwordLoading ? 'Updating...' : 'Update Password'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowPasswordModal(false)}
                              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
