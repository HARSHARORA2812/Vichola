import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Signup from './components/SignUp.jsx';
import Login from './components/Login.jsx';
import Profile from './components/Profile.jsx';
import Matches from './components/Matches.jsx';
import Reviews from './components/Review.jsx';
import Home from './components/Home.jsx';
import UserProfile from './components/UserProfile.jsx';
import Chat from './components/Chat.jsx';
import AdminLayout from './components/Admin/AdminLayout.jsx';
import AdminDashboard from './components/Admin/AdminDashboard.jsx';
import UserManagement from './components/Admin/UserManagement.jsx';
import AdminLogin from './components/Admin/AdminLogin.jsx';
import axios from 'axios';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      
      console.log('App.jsx auth check:', { 
        hasToken: !!token, 
        hasUserId: !!userId 
      });
      
      if (!token) {
        console.log('No token found, setting logged out state');
        setIsLoggedIn(false);
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      try {
        // Verify token with backend
        const response = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log('Auth check response:', response.data);
        setIsLoggedIn(true);
    
        // Extract isAdmin status
        if (response.data && response.data.data) {
          setIsAdmin(response.data.data.isAdmin || false);
        } else {
          setIsAdmin(response.data.isAdmin || false);
        }
        
        // Make sure userId is in localStorage
        if (!userId && response.data) {
          // Try to extract from response
          const extractedId = 
            response.data.data?._id || 
            response.data.data?.id || 
            response.data._id || 
            response.data.id || 
            response.data.userId;
            
          if (extractedId) {
            console.log('Setting missing userId in localStorage:', extractedId);
            localStorage.setItem('userId', extractedId);
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        // Clear tokens on auth failure
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setIsLoggedIn(false);
        setIsAdmin(false);
        
        // Redirect to login if not already there
        if (window.location.pathname !== '/login' && 
            window.location.pathname !== '/signup' && 
            window.location.pathname !== '/') {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="app">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} isAdmin={isAdmin} />
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />
        <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} />} />
        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile/:id"
          element={isLoggedIn ? <UserProfile /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/matches"
          element={isLoggedIn ? <Matches /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/chat/:id"
          element={isLoggedIn ? <Chat /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/reviews"
          element={isLoggedIn ? <Reviews /> : <Navigate to="/login" replace />}
        />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={isAdmin ? <AdminLayout /> : <Navigate to="/admin/login" replace />}
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="reports" element={<div>Reports Page (Coming Soon)</div>} />
          <Route path="settings" element={<div>Settings Page (Coming Soon)</div>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;