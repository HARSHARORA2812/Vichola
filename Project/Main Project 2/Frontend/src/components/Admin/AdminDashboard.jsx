import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  CircularProgress,
  Avatar,
} from '@mui/material';
import {
  People as PeopleIcon,
  Report as ReportIcon,
  Settings as SettingsIcon,
  ArrowUpward as ArrowUpwardIcon,
  PersonAdd as PersonAddIcon,
  Warning as WarningIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    reportedUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Handle both response formats
        const data = response.data.data || response.data;
        console.log('Admin stats received:', data);
        setStats(data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
        if (error.response?.status === 403) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  const StatCard = ({ title, value, icon: Icon, color = 'primary.main' }) => (
    <motion.div variants={itemVariants}>
      <Card 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: '12px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            backgroundColor: color,
          }
        }}
      >
        <CardContent sx={{ padding: '24px' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar 
                sx={{ 
                  backgroundColor: `${color}15`,
                  width: 56, 
                  height: 56,
                  color: color
                }}
              >
                <Icon sx={{ fontSize: 30 }} />
              </Avatar>
            </Grid>
            <Grid item sx={{ flexGrow: 1 }}>
              <Typography color="textSecondary" variant="subtitle2" sx={{ mb: 0.5, fontSize: '0.875rem' }}>
                {title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{value}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        <Container maxWidth="xl">
          <motion.div variants={itemVariants}>
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 1, 
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #1a237e, #4a148c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Dashboard Overview
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
              Welcome to your admin control center
            </Typography>
          </motion.div>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                title="TOTAL USERS"
                value={stats.totalUsers}
                icon={PeopleIcon}
                color="#3f51b5"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                title="ACTIVE USERS"
                value={stats.activeUsers}
                icon={PersonAddIcon}
                color="#4caf50"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                title="REPORTED USERS"
                value={stats.reportedUsers}
                icon={WarningIcon}
                color="#f44336"
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid item xs={12}>
              <motion.div variants={itemVariants}>
                <Paper 
                  sx={{ 
                    p: 3, 
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                    Quick Actions
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={<PeopleIcon />}
                        onClick={() => navigate('/admin/users')}
                        sx={{ 
                          borderRadius: '8px', 
                          textTransform: 'none',
                          py: 1.5,
                          background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                          boxShadow: '0 6px 12px rgba(63, 81, 181, 0.25)',
                          '&:hover': {
                            boxShadow: '0 8px 16px rgba(63, 81, 181, 0.35)',
                          }
                        }}
                      >
                        Manage Users
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={<SettingsIcon />}
                        onClick={() => navigate('/admin/settings')}
                        sx={{ 
                          borderRadius: '8px', 
                          textTransform: 'none',
                          py: 1.5,
                          background: 'linear-gradient(45deg, #607d8b 30%, #78909c 90%)',
                          boxShadow: '0 6px 12px rgba(96, 125, 139, 0.25)',
                          '&:hover': {
                            boxShadow: '0 8px 16px rgba(96, 125, 139, 0.35)',
                          }
                        }}
                      >
                        Settings
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={<BlockIcon />}
                        onClick={() => navigate('/admin/users')}
                        sx={{ 
                          borderRadius: '8px', 
                          textTransform: 'none',
                          py: 1.5,
                          background: 'linear-gradient(45deg, #ff5722 30%, #ff7043 90%)',
                          boxShadow: '0 6px 12px rgba(255, 87, 34, 0.25)',
                          '&:hover': {
                            boxShadow: '0 8px 16px rgba(255, 87, 34, 0.35)',
                          }
                        }}
                      >
                        Blocked Users
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="large"
                        startIcon={<ReportIcon />}
                        onClick={() => navigate('/admin/reports')}
                        sx={{ 
                          borderRadius: '8px', 
                          textTransform: 'none',
                          py: 1.5,
                          background: 'linear-gradient(45deg, #f44336 30%, #e57373 90%)',
                          boxShadow: '0 6px 12px rgba(244, 67, 54, 0.25)',
                          '&:hover': {
                            boxShadow: '0 8px 16px rgba(244, 67, 54, 0.35)',
                          }
                        }}
                      >
                        View Reports
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </motion.div>
  );
};

export default AdminDashboard; 