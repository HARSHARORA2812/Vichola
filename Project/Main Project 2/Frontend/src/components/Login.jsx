import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setIsLoggedIn, setIsAdmin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debug, setDebug] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing auth tokens
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (token) {
      console.log('Found existing token in localStorage');
      
      // Try to decode the token to examine its contents
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const tokenPayload = JSON.parse(atob(tokenParts[1]));
          console.log('Existing token payload:', tokenPayload);
        } else {
          console.warn('Token format invalid:', token);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
      
      if (userId) {
        console.log('Found existing userId in localStorage:', userId);
      } else {
        console.warn('No userId found in localStorage');
      }
    }
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // For debugging - log what we're sending
      console.log('Submitting login with:', formData);
      
      const response = await axios.post(
        '/api/users/login',
        formData,
        { timeout: 10000 }
      );
      
      // Log the full response for debugging
      console.log('Full login response:', response);
      
      // Check for successful response - 200 status and data with token
      if (response.status === 200 && response.data && (response.data.token || (response.data.data && response.data.data.token))) {
        console.log('Login succeeded with data:', response.data);
        
        // Save token to localStorage - check both possible locations
        const token = response.data.token || (response.data.data && response.data.data.token);
        console.log('Extracted token:', token ? 'Found' : 'Not found');
        localStorage.setItem('token', token);
        
        // Extract userId from response - check all possible locations
        let userId = null;
        
        if (response.data.userId) {
          userId = response.data.userId;
        } else if (response.data.data && response.data.data.userId) {
          userId = response.data.data.userId;
        } else if (response.data.id) {
          userId = response.data.id;
        } else if (response.data.data && response.data.data.id) {
          userId = response.data.data.id;
        } else if (response.data.data && response.data.data._id) {
          userId = response.data.data._id;
        }
        
        if (userId) {
          localStorage.setItem('userId', userId);
          console.log('Saved userId to localStorage:', userId);
        } else {
          console.warn('No userId found in response, using token to extract');
          
          // Try to extract user ID from token as a fallback
          try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const tokenPayload = JSON.parse(atob(tokenParts[1]));
              console.log('Token payload:', tokenPayload);
              const tokenUserId = tokenPayload.id || tokenPayload.userId;
              if (tokenUserId) {
                localStorage.setItem('userId', tokenUserId);
                console.log('Extracted and saved userId from token:', tokenUserId);
              }
            }
          } catch (tokenError) {
            console.error('Error extracting userId from token:', tokenError);
          }
        }
        
        // Check if the user is an admin
        let isAdmin = false;
        if (response.data.isAdmin) {
          isAdmin = response.data.isAdmin;
        } else if (response.data.data && response.data.data.isAdmin) {
          isAdmin = response.data.data.isAdmin;
        }
        
        setIsLoggedIn(true);
        setIsAdmin(isAdmin);
        navigate('/');
      } else {
        console.error('Invalid login response format:', response);
        setError('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 429) {
        setError('Too many attempts. Please try again later.');
      } else {
        setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-rose-100 to-rose-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.8 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-rose-600 hover:text-rose-700 font-medium transition-colors duration-300"
              >
                Sign up
              </Link>
            </p>
          </motion.div>

          {/* Debug Panel */}
          {process.env.NODE_ENV !== 'production' && (
            <div className="mt-8 p-4 border border-gray-300 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Info</h3>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-semibold">Token in localStorage:</span>{' '}
                  {localStorage.getItem('token') ? '✅ Present' : '❌ Missing'}
                </div>
                <div>
                  <span className="font-semibold">UserID in localStorage:</span>{' '}
                  {localStorage.getItem('userId') ? `✅ ${localStorage.getItem('userId')}` : '❌ Missing'}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const token = localStorage.getItem('token');
                    if (token) {
                      try {
                        const parts = token.split('.');
                        if (parts.length === 3) {
                          const payload = JSON.parse(atob(parts[1]));
                          alert(JSON.stringify(payload, null, 2));
                        } else {
                          alert('Invalid token format');
                        }
                      } catch (e) {
                        alert('Error decoding token: ' + e.message);
                      }
                    } else {
                      alert('No token found');
                    }
                  }}
                  className="text-xs text-rose-600 hover:text-rose-500"
                >
                  Decode JWT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;