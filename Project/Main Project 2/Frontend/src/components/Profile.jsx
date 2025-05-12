import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    occupation: '',
    education: '',
    location: '',
    height: '',
    religion: '',
    bio: '',
    interests: [],
    photos: []
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('/api/profile/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const profileData = response.data.data;
        setProfile(profileData);
        setFormData({
          name: profileData.name || '',
          age: profileData.age?.toString() || '',
          gender: profileData.gender || '',
          occupation: profileData.occupation || '',
          education: profileData.education || '',
          location: profileData.location || '',
          height: profileData.height?.toString() || '',
          religion: profileData.religion || '',
          bio: profileData.bio || '',
          interests: profileData.interests || [],
          photos: profileData.photos || []
        });
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        if (error.response?.status === 404) {
          // Profile doesn't exist, show create form
          setEditMode(true);
        } else if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // Enhanced input validation with more specific requirements
      const requiredFields = {
        name: { label: 'Name', validate: (value) => value.length >= 2 },
        age: { label: 'Age', validate: (value) => parseInt(value) >= 18 && parseInt(value) <= 100 },
        gender: { label: 'Gender', validate: (value) => ['Male', 'Female', 'Other'].includes(value) }
      };

      const validationErrors = Object.entries(requiredFields)
        .map(([key, { label, validate }]) => {
          if (!formData[key]) return `${label} is required`;
          if (!validate(formData[key])) {
            switch (key) {
              case 'name': return 'Name must be at least 2 characters long';
              case 'age': return 'Age must be between 18 and 100';
              case 'gender': return 'Please select a valid gender';
              default: return `Invalid ${label}`;
            }
          }
          return null;
        })
        .filter(Boolean);

      if (validationErrors.length > 0) {
        setError(validationErrors[0]);
        return;
      }

      // Validate optional fields
      if (formData.height && (isNaN(parseInt(formData.height)) || parseInt(formData.height) < 100 || parseInt(formData.height) > 250)) {
        setError('Height must be between 100cm and 250cm');
        return;
      }

      if (formData.bio && formData.bio.length > 500) {
        setError('Bio must not exceed 500 characters');
        return;
      }

      // Prepare data for submission with proper type conversion
      const submitData = {
        ...formData,
        age: parseInt(formData.age),
        height: formData.height ? parseInt(formData.height) : undefined,
        interests: Array.isArray(formData.interests) 
          ? formData.interests.filter(interest => typeof interest === 'string' && interest.trim() !== '')
          : [],
        photos: Array.isArray(formData.photos) ? formData.photos : []
      };

      // Validate required fields before submission
      if (!submitData.name || !submitData.age || !submitData.gender) {
        setError('Name, age, and gender are required');
        return;
      }

      // Use relative endpoint
      const endpoint = '/api/profile/me';
      const method = profile ? 'put' : 'post';

      setLoading(true);
      const response = await axios[method](
        endpoint,
        submitData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000 // Extended timeout for larger payloads
        }
      );

      if (!response.data) {
        throw new Error('No response data received from server');      
      }
      
      // Log the response from the server BEFORE updating state
      console.log('Server response after profile save:', response.data);

      if (response.data?.data) {
        setProfile(response.data.data);
        setEditMode(false);
        setError(null);
        const successMessage = profile ? 'Profile updated successfully!' : 'Profile created successfully!';
        alert(successMessage); // TODO: Replace with toast notification
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      const errorMessage = {
        network: 'Network error. Please check your internet connection.',
        401: () => {
          localStorage.removeItem('token');
          navigate('/login');
          return 'Session expired. Please login again.';
        },
        413: 'Profile photo too large. Please use a smaller image.',
        429: 'Too many requests. Please try again later.',
        default: 'Failed to save profile. Please try again.'
      };

      if (!error.response) {
        setError(errorMessage.network);
      } else if (typeof errorMessage[error.response.status] === 'function') {
        setError(errorMessage[error.response.status]());
      } else if (errorMessage[error.response.status]) {
        setError(errorMessage[error.response.status]);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else {
        setError(errorMessage.default);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestChange = (e) => {
    const interests = e.target.value
      .split(',')
      .map(interest => interest.trim())
      .filter(interest => interest !== '');
    setFormData(prev => ({
      ...prev,
      interests
    }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show loading indicator for photo upload
    setLoading(true); 
    setError(null);

    const formDataUpload = new FormData();
    // Use 'profilePhoto' to match backend multer config
    formDataUpload.append('profilePhoto', file); 

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        setLoading(false);
        return;
      }
      
      // Use PUT method as defined in the backend route
      const response = await axios.put(
        '/api/profile/photo',
        formDataUpload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Type': 'multipart/form-data' // Axios sets this automatically for FormData
          },
          timeout: 10000 // 10 second timeout for upload
        }
      );

      if (response.data?.photoUrl) {
        const newPhotoUrl = response.data.photoUrl;
        // Update formData: replace the first photo, keep others if they exist
        setFormData(prev => ({
          ...prev,
          photos: [newPhotoUrl, ...(prev.photos?.slice(1) || [])]
        }));
        // Update profile state similarly
        setProfile(prev => {
          if (!prev) return null; // Should not happen if upload is successful
          return {
            ...prev,
            photos: [newPhotoUrl, ...(prev.photos?.slice(1) || [])]
          };
        });
        // Optionally, provide user feedback e.g., alert or toast
        // alert('Profile photo updated!'); 
      } else {
        throw new Error('Photo URL not found in response');
      }

    } catch (error) {
      console.error('Failed to upload photo:', error);
      let uploadError = 'Failed to upload photo. Please try again.';
      if (error.response) {
        uploadError = error.response.data?.message || uploadError;
        if (error.response.status === 413) { // Check specifically for Payload Too Large
          uploadError = "Image file is too large. Please upload an image smaller than 5MB.";
        } else if (error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          uploadError = "Session expired. Please login again.";
        }
      } else if (error.request) {
        uploadError = "Network error. Could not reach server.";
      }
      setError(uploadError);
    } finally {
      setLoading(false);
      // Clear the file input value so the same file can be selected again if needed
      e.target.value = null; 
    }
  };

  if (loading && !profile && !editMode) { // Show full page loading only on initial profile load
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
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="relative h-64 bg-gradient-to-r from-rose-600 to-rose-400">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="relative h-full flex items-center justify-center">
              <motion.div whileHover={{ scale: 1.05 }} className="relative">
                <div className="w-32 h-32 rounded-full ring-4 ring-white ring-opacity-50 overflow-hidden">
                  <img
                    src={profile?.photos?.[0] || 'https://via.placeholder.com/150'}
                    alt={profile?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Conditionally render upload trigger or edit button */} 
                {editMode ? (
                  // In Edit Mode: Show a clickable label with Camera icon to trigger upload
                  <label className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg hover:bg-rose-100 transition-colors duration-300 cursor-pointer">
                    <svg className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" // Hidden input triggered by label
                      aria-label="Upload profile photo"
                    />
                  </label>
                ) : (
                  // Not in Edit Mode: Show button to enable editing
                  profile && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg hover:bg-rose-100 transition-colors duration-300"
                      aria-label="Edit profile picture"
                    >
                      <svg className="h-6 w-6 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  )
                )}
              </motion.div>
            </div>
          </div>

          <div className="p-8">
            {editMode ? (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {[
                    { name: 'name', label: 'Name', type: 'text', required: true },
                    { name: 'age', label: 'Age', type: 'number', required: true, min: 18 },
                    { name: 'gender', label: 'Gender', type: 'select', options: ['', 'Male', 'Female', 'Other'], required: true },
                    { name: 'occupation', label: 'Occupation', type: 'text' },
                    { name: 'education', label: 'Education', type: 'text' },
                    { name: 'location', label: 'Location', type: 'text' },
                    { name: 'height', label: 'Height (in cm)', type: 'number', min: 0 },
                    { name: 'religion', label: 'Religion', type: 'text' },
                  ].map(field => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                      {field.type === 'select' ? (
                        <select
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          required={field.required}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                        >
                          {field.options.map(option => (
                            <option key={option} value={option}>
                              {option || 'Select Gender'}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          required={field.required}
                          min={field.min}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    maxLength={500}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Interests (comma separated)</label>
                  <input
                    type="text"
                    value={formData.interests.join(', ')}
                    onChange={handleInterestChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                    placeholder="e.g., hiking, reading, coding"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (profile) {
                        setFormData({
                          name: profile.name || '',
                          age: profile.age?.toString() || '',
                          gender: profile.gender || '',
                          occupation: profile.occupation || '',
                          education: profile.education || '',
                          location: profile.location || '',
                          height: profile.height?.toString() || '',
                          religion: profile.religion || '',
                          bio: profile.bio || '',
                          interests: profile.interests || [],
                          photos: profile.photos || []
                        });
                      } else {
                        setFormData({
                          name: '',
                          age: '',
                          gender: '',
                          occupation: '',
                          education: '',
                          location: '',
                          height: '',
                          religion: '',
                          bio: '',
                          interests: [],
                          photos: []
                        });
                      }
                      setEditMode(false);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                  >
                    {profile ? 'Save Changes' : 'Create Profile'}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900">{profile?.name}</h2>
                  <p className="mt-2 text-rose-600">{profile?.location}</p>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  {[
                    {
                      title: 'Personal Information',
                      fields: [
                        { label: 'Age', value: profile?.age ? `${profile.age} years` : '-' },
                        { label: 'Gender', value: profile?.gender || '-' },
                        { label: 'Occupation', value: profile?.occupation || '-' },
                        { label: 'Education', value: profile?.education || '-' },
                      ]
                    },
                    {
                      title: 'Additional Details',
                      fields: [
                        { label: 'Height', value: profile?.height ? `${profile.height} cm` : '-' },
                        { label: 'Religion', value: profile?.religion || '-' },
                      ]
                    }
                  ].map((section, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="bg-rose-50 rounded-xl p-6 shadow-sm"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
                      <div className="space-y-4">
                        {section.fields.map((field, i) => (
                          <div key={i}>
                            <span className="text-sm text-gray-500">{field.label}</span>
                            <p className="text-gray-900">{field.value}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-rose-50 rounded-xl p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">About Me</h3>
                  <p className="text-gray-600">{profile?.bio || 'No bio provided'}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-rose-50 rounded-xl p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile?.interests?.length > 0 ? (
                      profile.interests.map((interest, index) => (
                        <motion.span
                          key={index}
                          whileHover={{ scale: 1.1 }}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-rose-100 text-rose-800"
                        >
                          {interest}
                        </motion.span>
                      ))
                    ) : (
                      <p className="text-gray-600">No interests added</p>
                    )}
                  </div>
                </motion.div>

                <div className="flex justify-center">
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-6 py-3 border border-transparent rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                  >
                    Edit Profile
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;