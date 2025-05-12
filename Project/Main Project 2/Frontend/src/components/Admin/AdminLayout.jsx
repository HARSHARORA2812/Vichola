import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Avatar,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Report as ReportIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  Notifications as NotificationIcon,
} from '@mui/icons-material';
import axios from 'axios';

const drawerWidth = 260;

// Animated components using Framer Motion
const MotionIconButton = motion(IconButton);
const MotionListItem = motion(ListItem);
const MotionDrawer = motion(Drawer);
const MotionBox = motion(Box);

const AdminLayout = () => {
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const navigate = useNavigate();
  const [username, setUsername] = useState('Admin');

  useEffect(() => {
    // Verify admin access whenever this component loads
    const verifyAdminAccess = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          console.error('No token found, redirecting to login');
          navigate('/admin/login');
          return;
        }

        // Use relative endpoint
        const response = await axios.get('/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // If we get here, the user has admin access
        console.log('Admin access verified:', response.data);
        
        // Get user details
        // const userResponse = await axios.get('/api/auth/me', {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        try {
          const userResponse = await axios.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUsername(userResponse.data.data.username || 'Admin');
        } catch (error) {
          console.error('Failed to fetch user details:', error);
        }
      } catch (error) {
        console.error('Admin access verification failed:', error.response?.status, error.response?.data);
        // Redirect to login if unauthorized
        navigate('/admin/login');
      }
    };

    verifyAdminAccess();
  }, [navigate]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'User Management', icon: <PeopleIcon />, path: '/admin/users' },
    { text: 'Reports', icon: <ReportIcon />, path: '/admin/reports' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
  ];

  // Random avatar color based on username
  const getAvatarColor = (name) => {
    const colors = [
      '#3f51b5', '#f44336', '#e91e63', '#9c27b0', '#673ab7',
      '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
    ];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // Animation variants
  const listItemVariants = {
    hover: { 
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
      x: 10,
      transition: { duration: 0.2 }
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          background: 'linear-gradient(90deg, #1a237e 0%, #283593 100%)',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.2)',
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar>
          <MotionIconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ marginRight: 5 }}
            whileHover={{ rotate: 180, transition: { duration: 0.3 } }}
          >
            <MenuIcon />
          </MotionIconButton>
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: '1px' }}>
              BICHOLA ADMIN
            </Typography>
          </MotionBox>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Notifications">
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                  <NotificationIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Box
              component={motion.div}
              whileHover={{ scale: 1.05 }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '4px 12px',
                borderRadius: '20px',
                transition: 'all 0.3s',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
              onClick={() => navigate('/')}
            >
              <HomeIcon sx={{ mr: 1 }} />
              <Typography variant="body1">Home</Typography>
            </Box>
            <Box
              component={motion.div}
              whileHover={{ scale: 1.05 }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '4px 12px',
                borderRadius: '20px',
                transition: 'all 0.3s',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
              onClick={handleLogout}
            >
              <LogoutIcon sx={{ mr: 1 }} />
              <Typography variant="body1">Logout</Typography>
            </Box>
            <Tooltip title={username}>
              <Avatar 
                sx={{ 
                  bgcolor: getAvatarColor(username),
                  width: 40,
                  height: 40,
                  ml: 1,
                  border: '2px solid white'
                }}
              >
                {username.charAt(0).toUpperCase()}
              </Avatar>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          '& .MuiDrawer-paper': {
            background: 'linear-gradient(180deg, #1a237e 0%, #283593 100%)',
            color: 'white',
            borderRight: 'none',
          },
          ...(open && {
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden',
              background: 'linear-gradient(180deg, #1a237e 0%, #283593 100%)',
              color: 'white',
              borderRight: 'none',
            },
          }),
          ...(!open && {
            '& .MuiDrawer-paper': {
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              overflowX: 'hidden',
              width: theme.spacing(7),
              background: 'linear-gradient(180deg, #1a237e 0%, #283593 100%)',
              color: 'white',
              borderRight: 'none',
              [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9),
              },
            },
          }),
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: open ? 'space-between' : 'center' }}>
            {open && (
              <Typography 
                variant="h6" 
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                sx={{ 
                  fontWeight: 'bold', 
                  pl: 2,
                  background: 'linear-gradient(90deg, #fff, #e0e0e0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                BICHOLA
              </Typography>
            )}
            <MotionIconButton 
              onClick={handleDrawerToggle}
              color="inherit"
              whileHover={{ rotate: 180, transition: { duration: 0.3 } }}
            >
              <ChevronLeftIcon />
            </MotionIconButton>
          </Box>
        </Toolbar>
        <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
        <List sx={{ pt: 2 }}>
          {menuItems.map((item) => {
            const isActive = window.location.pathname === item.path;
            return (
              <MotionListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
                whileHover="hover"
                variants={listItemVariants}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  mb: 1,
                  mx: 1,
                  borderRadius: '8px',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: isActive ? 'white' : 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ 
                    opacity: open ? 1 : 0,
                    '& .MuiTypography-root': {
                      fontWeight: isActive ? 'bold' : 'normal',
                    }
                  }}
                />
                {isActive && open && (
                  <Box
                    component={motion.div}
                    layoutId="activeIndicator"
                    sx={{
                      width: 4,
                      height: 20,
                      borderRadius: 4,
                      backgroundColor: 'white',
                      position: 'absolute',
                      right: 0
                    }}
                  />
                )}
              </MotionListItem>
            );
          })}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          mt: '64px',
          backgroundColor: '#f5f5f5',
          minHeight: '100vh'
        }}
      >
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{ height: '100%' }}
        >
          <Outlet />
        </MotionBox>
      </Box>
    </Box>
  );
};

export default AdminLayout; 