import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data.data);
      } catch (error) {
        setError('Failed to load profile');
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center space-x-6">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="h-32 w-32 rounded-full ring-4 ring-rose-100 cursor-pointer object-cover"
              src={profile?.photos?.[0] || 'https://via.placeholder.com/150'}
              alt={`${profile?.name || 'User'}'s profile photo`}
              onClick={() => {
                if (profile?.photos?.[0]) {
                  setSelectedImageUrl(profile.photos[0]);
                  setIsModalOpen(true);
                }
              }}
            />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{profile?.name}</h2>
              <p className="text-rose-600">{profile?.location || 'Location not set'}</p>
              <p className="text-gray-500">{profile?.age} years old</p>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900">About</h3>
            <p className="mt-2 text-gray-600">{profile?.bio || 'No bio available'}</p>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900">Details</h3>
            <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <span className="text-sm text-gray-500">Gender</span>
                <p className="text-gray-900">{profile?.gender || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Occupation</span>
                <p className="text-gray-900">{profile?.occupation || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Education</span>
                <p className="text-gray-900">{profile?.education || '-'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Height</span>
                <p className="text-gray-900">{profile?.height ? `${profile.height} cm` : '-'}</p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900">Interests</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile?.interests?.length > 0 ? (
                profile.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-rose-100 text-rose-800"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <p className="text-gray-600">No interests listed</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        {isModalOpen && selectedImageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl max-h-[80vh] bg-white rounded-lg overflow-hidden shadow-xl cursor-default"
            >
              <img 
                src={selectedImageUrl}
                alt="Enlarged profile photo"
                className="block max-w-full max-h-[80vh] object-contain"
              />
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow hover:bg-gray-200 transition-colors"
                aria-label="Close image viewer"
              >
                <svg className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;