import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Matches = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [potentialMatches, setPotentialMatches] = useState([]);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // console.log('No token found, redirecting to /login');
      navigate('/login');
      return;
    }

    const fetchCurrentUserProfile = async () => {
      try {
        // console.log('Fetching current user profile...');
        const response = await axios.get('/api/profile/me', {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000, // 5-second timeout
        });
        // console.log('Profile fetched:', response.data.data);
        setCurrentUserProfile(response.data.data);
        return response.data.data;
      } catch (error) {
        // console.log('Profile fetch error:', error.message, error.response?.data);
        setError('Failed to fetch profile');
        if (error.response?.status === 401) {
          // console.log('Unauthorized, clearing token and redirecting to /login');
          localStorage.removeItem('token');
          navigate('/login');
        }
        throw error;
      }
    };

    const fetchMatches = async () => {
      try {
        // console.log('Fetching matches...');
        const response = await axios.get('/api/match', {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        });
        // console.log('Matches fetched:', response.data.data);
        setMatches(response.data.data || []);
      } catch (error) {
        // console.error('Matches fetch error:', error.message, error.response?.data);
        setError('Failed to fetch matches');
        if (error.response?.status === 401) {
          // console.log('Unauthorized, redirecting to /login');
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    const fetchPendingRequests = async () => {
      try {
        // console.log('Fetching pending requests...');
        const response = await axios.get('/api/match/pending', {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        });
        // console.log('Pending requests fetched:', response.data.data);
        setPendingRequests(response.data.data || []);
      } catch (error) {
        // console.error('Pending requests fetch error:', error.message, error.response?.data);
        setError('Failed to fetch pending requests');
        if (error.response?.status === 401) {
          // console.log('Unauthorized, redirecting to /login');
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    const fetchPotentialMatches = async (userProfile) => {
      try {
        // console.log('Fetching potential matches...');
        const response = await axios.get('/api/match/potential', {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        });
        
        // Log complete response for debugging
        // console.log('Raw potential matches response:', response);
        
        // Ensure we extract data properly regardless of format
        let matchesData = [];
        if (response.data && response.data.data) {
          matchesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          matchesData = response.data;
        }
        
        // console.log(`Processed ${matchesData.length} potential matches:`, matchesData);
        setPotentialMatches(matchesData);
      } catch (error) {
        // console.error('Potential matches fetch error:', error);
        // console.error('Error details:', error.response?.data);
        setError('Failed to fetch potential matches. ' + (error.response?.data?.message || error.message));
      }
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        // console.log('Starting data fetch...');
        const userProfile = await fetchCurrentUserProfile();
        if (userProfile) {
          // console.log('Profile fetched successfully, fetching other data...');
          await Promise.allSettled([
            fetchMatches(),
            fetchPendingRequests(),
            fetchPotentialMatches(userProfile),
          ]).then(results => {
            results.forEach((result, index) => {
              if (result.status === 'rejected') {
                // console.error(`Fetch ${index} failed:`, result.reason);
              }
            });
          });
        } else {
          // console.warn('No user profile found');
          setError('User profile not found');
        }
      } catch (error) {
        console.error('Fetch data error:', error);
      } finally {
        // console.log('Data fetch complete, setting loading to false');
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]); // Removed matches, pendingRequests to prevent loop

  const handleSendMatchRequest = async (userId) => {
    const token = localStorage.getItem('token');
    setError(null);
    try {
      // console.log('Sending match request to user:', userId);
      await axios.post(
        `/api/match/request/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, timeout: 5000 }
      );
      // console.log('Match request sent successfully');
      
      setPotentialMatches(prev => prev.filter(match => {
        const matchUserId = match.user?._id || match.userId;
        return matchUserId !== userId;
      }));
      
      setSelectedMatch(null);
      
      const response = await axios.get('/api/match/pending', {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });
      // console.log('Updated pending requests:', response.data.data);
      setPendingRequests(response.data.data || []);
      
      alert('Match request sent successfully!');
    } catch (error) {
      // console.error('Send match request error:', error.message, error.response?.data);
      setError(error.response?.data?.message || 'Failed to send match request');
    }
  };

  const handleAcceptMatch = async (matchId) => {
    const token = localStorage.getItem('token');
    setError(null);
    try {
      // console.log('Accepting match:', matchId);
      const response = await axios.put(
        `/api/match/accept/${matchId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` }, timeout: 5000 }
      );
      // console.log('Match accepted:', response.data.data);
      setPendingRequests(prev => prev.filter(req => req._id !== matchId));
      setMatches(prev => [...prev, response.data.data]);
      alert('Match accepted successfully!');
    } catch (error) {
      // console.error('Accept match error:', error.message, error.response?.data);
      setError(error.response?.data?.message || 'Failed to accept match');
    }
  };

  const handleRejectMatch = async (matchId) => {
    const token = localStorage.getItem('token');
    setError(null);
    try {
      // console.log('Rejecting match:', matchId);
      await axios.delete(`/api/match/reject/${matchId}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });
      // console.log('Match rejected');
      setPendingRequests(prev => prev.filter(req => req._id !== matchId));
      alert('Match rejected successfully!');
    } catch (error) {
      // console.error('Reject match error:', error.message, error.response?.data);
      setError(error.response?.data?.message || 'Failed to reject match');
    }
  };

  const handleNavigation = (path) => {
    // console.log('Navigating to:', path);
    setSelectedMatch(null);
    navigate(path);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-400">
                Your Matches
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl">
              Connect with people who share your vibe
            </p>
          </div>

          {/* Pending Requests Section */}
          {pendingRequests.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Match Requests</h2>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {pendingRequests.map((request) => {
                  const requester = request.user1._id === currentUserProfile?.user ? request.user2 : request.user1;
                  return (
                    <motion.div
                      key={request._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-2"
                    >
                      <div className="relative p-6">
                        <div className="flex items-center space-x-4">
                          <img
                            className="h-16 w-16 rounded-full ring-4 ring-rose-100"
                            src={requester.profile?.photos?.[0] || 'https://via.placeholder.com/150'}
                            alt={requester.profile?.name || requester.username}
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {requester.profile?.name || requester.username}
                            </h3>
                            <p className="text-sm text-rose-600">New Match Request</p>
                          </div>
                        </div>
                        <div className="mt-6 flex space-x-3">
                          <button
                            onClick={() => handleAcceptMatch(request._id)}
                            className="flex-1 bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectMatch(request._id)}
                            className="flex-1 bg-white text-rose-600 border border-rose-600 px-4 py-2 rounded-lg hover:bg-rose-50"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matches Section */}
          {matches.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Matches</h2>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {matches.map((match) => {
                  try {
                    const currentUserId = currentUserProfile?.user?._id;
                    
                    // Debug logging
                    // console.log('Current match data:', {
                    //   matchId: match._id,
                    //   currentUserId,
                    //   user1: {
                    //     id: match.user1._id,
                    //     profile: match.user1.profile
                    //   },
                    //   user2: {
                    //     id: match.user2._id,
                    //     profile: match.user2.profile
                    //   }
                    // });

                    // Determine which user is the other person
                    const otherUser = String(match.user1._id) === String(currentUserId) ? match.user2 : match.user1;
                    
                    // console.log('Selected other user:', {
                    //   id: otherUser._id,
                    //   profile: otherUser.profile
                    // });

                    if (!otherUser || !otherUser.profile) {
                      console.warn('Invalid match data - missing user or profile');
                      return null;
                    }

                    // Generate a unique key based on the match ID and other user ID
                    const key = `${match._id}-${otherUser._id}`;

                    return (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:-translate-y-2"
                      >
                        <div className="relative p-6">
                          <div className="flex items-center space-x-4">
                            <img
                              className="h-16 w-16 rounded-full ring-4 ring-rose-100"
                              src={otherUser.profile.photos?.[0] || 'https://via.placeholder.com/150'}
                              alt={otherUser.profile.name || otherUser.username}
                            />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {otherUser.profile.name || otherUser.username}
                              </h3>
                              <p className="text-sm text-rose-600">
                                {otherUser.profile.location || 'Location not set'}
                              </p>
                              <p className="text-sm text-gray-500">{otherUser.profile.age} years old</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {otherUser.profile.bio || 'No bio available'}
                            </p>
                          </div>
                          <div className="mt-6 flex space-x-3">
                            <button
                              onClick={() => handleNavigation(`/chat/${otherUser._id}`)}
                              className="flex-1 bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700"
                            >
                              Message
                            </button>
                            <button
                              onClick={() => handleNavigation(`/profile/${otherUser._id}`)}
                              className="flex-1 bg-white text-rose-600 border border-rose-600 px-4 py-2 rounded-lg hover:bg-rose-50"
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  } catch (error) {
                    console.error('Error rendering match:', error);
                    return null;
                  }
                })}
              </div>
            </div>
          )}

          {/* Potential Matches Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Potential Matches</h2>
            {potentialMatches && potentialMatches.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {potentialMatches.map((match) => {
                  // Ensure we have the user ID regardless of data structure
                  const matchUserId = match.user?._id || match.userId;
                  const isRequested = pendingRequests.some(
                    request => request.user1._id === matchUserId || request.user2._id === matchUserId
                  );

                  return (
                    <motion.div
                      key={match._id}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold text-gray-900">{match.name}</h3>
                          <span className="text-sm text-gray-500">{match.age} years</span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-gray-600">{match.location || 'No location'}</p>
                          <p className="text-gray-600">{match.occupation || 'No occupation'}</p>
                          <p className="text-gray-600">{match.education || 'No education'}</p>
                        </div>
                        <div className="mt-4 flex justify-end">
                          {isRequested ? (
                            <button
                              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md cursor-not-allowed"
                              disabled
                            >
                              Request Sent
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSendMatchRequest(matchUserId)}
                              className="px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors"
                            >
                              Send Request
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-lg shadow-md">
                <p className="text-gray-600 mb-4">No potential matches found currently.</p>
                <p className="text-gray-500 text-sm">
                  This could be due to your profile settings or the availability of other users.
                </p>
              </div>
            )}
          </div>

          {/* Selected Match Modal */}
          {selectedMatch && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden">
                <div className="relative">
                  <img
                    className="w-full h-64 object-cover"
                    src={selectedMatch.profile?.photos?.[0] || 'https://via.placeholder.com/150'}
                    alt={selectedMatch.profile?.name || selectedMatch.username}
                  />
                  <button
                    onClick={() => setSelectedMatch(null)}
                    className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-rose-50"
                  >
                    <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedMatch.profile?.name || selectedMatch.username}
                  </h2>
                  <p className="text-rose-600">{selectedMatch.profile?.location || 'Location not set'}</p>
                  <p className="text-gray-500">{selectedMatch.profile?.age} years old</p>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900">About</h3>
                    <p className="mt-2 text-gray-600">{selectedMatch.profile?.bio || 'No bio available'}</p>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900">Interests</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedMatch.profile?.interests?.length > 0 ? (
                        selectedMatch.profile.interests.map((interest, index) => (
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

                  <div className="mt-8 flex space-x-4">
                    {matches.some(match => 
                      match.user1._id === selectedMatch._id || match.user2._id === selectedMatch._id
                    ) ? (
                      <button
                        onClick={() => handleNavigation(`/chat/${selectedMatch._id}`)}
                        className="flex-1 bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700"
                      >
                        Send Message
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSendMatchRequest(selectedMatch._id)}
                        className="flex-1 bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700"
                      >
                        Send Match Request
                      </button>
                    )}
                    <button
                      onClick={() => handleNavigation(`/profile/${selectedMatch._id}`)}
                      className="flex-1 bg-white text-rose-600 border border-rose-600 px-6 py-3 rounded-lg hover:bg-rose-50"
                    >
                      View Full Profile
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Matches;