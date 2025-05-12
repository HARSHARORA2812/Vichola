import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Paper, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use relative endpoint
      const response = await axios.post('/api/users/login', formData);
      
      console.log('Admin login response:', response.data);
      
      // Parse the response to check for admin status
      let token, isAdmin;
      
      if (response.data.token) {
        token = response.data.token;
        isAdmin = response.data.isAdmin;
      } else if (response.data.data && response.data.data.token) {
        token = response.data.data.token;
        isAdmin = response.data.data.isAdmin;
      } else {
        throw new Error('No token in response');
      }
      
      if (!isAdmin) {
        setError('Access denied. This account does not have admin privileges.');
        setLoading(false);
        return;
      }
      
      // Store the token and redirect to admin dashboard
      localStorage.setItem('token', token);
      
      // Verify admin access after login
      try {
        // Use relative endpoint
        await axios.get('/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // If successful, navigate to admin dashboard
        navigate('/admin');
      } catch (err) {
        console.error('Admin verification failed:', err);
        setError('Admin verification failed. This account may not have proper admin privileges.');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      if (error.response?.status === 401) {
        setError('Invalid email or password');
      } else if (error.response?.status === 403) {
        setError('Access denied. This account does not have admin privileges.');
      } else {
        setError(error.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 8, p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          mb: 3
        }}>
          <Box sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            borderRadius: '50%', 
            p: 1, 
            mb: 1 
          }}>
            <LockOutlinedIcon />
          </Box>
          <Typography component="h1" variant="h5">
            Admin Login
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminLogin;