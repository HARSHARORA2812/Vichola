import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Avatar,
  InputAdornment,
  Tooltip,
  CircularProgress,
  Badge,
  Card,
  CardContent,
  Grid,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  AdminPanelSettings as AdminIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  PersonOutline as PersonIcon,
  AdminPanelSettings as SecurityIcon,
  HowToReg as VerifiedIcon,
  AccountCircle as AccountIcon,
} from '@mui/icons-material';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.05
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

const tableRowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ 
    opacity: 1, 
    y: 0,
    transition: { 
      delay: i * 0.05,
      duration: 0.3,
      ease: "easeOut"
    }
  }),
  hover: { 
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    transition: { duration: 0.2 }
  }
};

const MotionTableRow = motion(TableRow);

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    blocked: 0,
    admins: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Handle both response formats
      const data = response.data.data || response.data;
      console.log('Users fetched:', data);
      setUsers(data);

      // Calculate stats
      const activeUsers = data.filter(user => !user.blocked).length;
      const blockedUsers = data.filter(user => user.blocked).length;
      const adminUsers = data.filter(user => user.isAdmin).length;

      setStats({
        total: data.length,
        active: activeUsers,
        blocked: blockedUsers,
        admins: adminUsers,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error.response?.status === 403) {
        navigate('/login');
      }
      showSnackbar('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      const token = localStorage.getItem('token');
      console.log(`Attempting to ${isBlocked ? 'unblock' : 'block'} user ${userId}`);
      
      await axios.put(`/admin/users/${userId}/block`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log(`User ${isBlocked ? 'unblocked' : 'blocked'} successfully`);
      showSnackbar(`User ${isBlocked ? 'unblocked' : 'blocked'} successfully`, 'success');
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error(`Error ${isBlocked ? 'unblocking' : 'blocking'} user:`, error);
      showSnackbar(`Failed to ${isBlocked ? 'unblock' : 'block'} user`, 'error');
    }
  };

  const handleMakeAdmin = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      console.log(`Attempting to make user ${userId} an admin`);
      
      await axios.put(`/admin/users/${userId}/make-admin`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('User made admin successfully');
      showSnackbar('User promoted to admin successfully', 'success');
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Error making user admin:', error);
      showSnackbar('Failed to make user an admin', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      console.log(`Attempting to delete user ${userId}`);
      
      await axios.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      console.log('User deleted successfully');
      showSnackbar('User deleted successfully', 'success');
      fetchUsers(); // Refresh the user list
      handleCloseDialog();
    } catch (error) {
      console.error('Error deleting user:', error);
      showSnackbar('Failed to delete user', 'error');
    }
  };

  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
    setDialogOpen(false);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate random avatar color based on username
  const getAvatarColor = (name) => {
    const colors = [
      '#3f51b5', '#f44336', '#e91e63', '#9c27b0', '#673ab7',
      '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
    ];
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <motion.div variants={itemVariants}>
      <Card
        sx={{
          height: '100%',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
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
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                backgroundColor: `${color}15`,
                width: 48,
                height: 48,
                color: color,
                mr: 2
              }}
            >
              <Icon sx={{ fontSize: 24 }} />
            </Avatar>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {title}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {value}
              </Typography>
            </Box>
          </Box>
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
      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="lg">
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
              User Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
              View, edit, and manage user accounts
            </Typography>
          </motion.div>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={6} md={3}>
              <StatCard 
                title="TOTAL USERS" 
                value={stats.total} 
                icon={AccountIcon} 
                color="#3f51b5" 
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard 
                title="ACTIVE USERS" 
                value={stats.active} 
                icon={VerifiedIcon} 
                color="#4caf50" 
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard 
                title="BLOCKED USERS" 
                value={stats.blocked} 
                icon={BlockIcon} 
                color="#f44336" 
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <StatCard 
                title="ADMIN USERS" 
                value={stats.admins} 
                icon={SecurityIcon} 
                color="#ff9800" 
              />
            </Grid>
          </Grid>

          <motion.div variants={itemVariants}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <TextField
                placeholder="Search users by name or email"
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  width: { xs: '100%', md: 400 },
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  }
                }}
              />

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<FilterListIcon />}
                  sx={{ 
                    borderRadius: '8px', 
                    textTransform: 'none',
                    borderColor: 'rgba(0, 0, 0, 0.12)',
                    color: 'text.primary',
                  }}
                >
                  Filter
                </Button>
                <Button
                  variant="contained"
                  startIcon={<RefreshIcon />}
                  onClick={fetchUsers}
                  sx={{ 
                    borderRadius: '8px', 
                    textTransform: 'none',
                    background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                    boxShadow: '0 3px 6px rgba(63, 81, 181, 0.2)',
                  }}
                >
                  Refresh
                </Button>
              </Box>
            </Box>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Paper
              sx={{ 
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                overflow: 'hidden',
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead
                    sx={{ 
                      bgcolor: '#f5f5f5',
                      '& .MuiTableCell-head': {
                        fontWeight: 'bold',
                        color: 'text.secondary',
                      }
                    }}
                  >
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user, i) => (
                      <MotionTableRow
                        key={user._id}
                        custom={i}
                        variants={tableRowVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              sx={{ 
                                bgcolor: getAvatarColor(user.username),
                                width: 36,
                                height: 36,
                                mr: 1.5,
                              }}
                            >
                              {user.username.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography fontWeight="medium">{user.username}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.blocked ? "Blocked" : "Active"}
                            size="small"
                            color={user.blocked ? "error" : "success"}
                            sx={{ 
                              fontWeight: 'medium',
                              borderRadius: '6px',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={user.isAdmin ? <AdminIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                            label={user.isAdmin ? "Admin" : "User"}
                            size="small"
                            color={user.isAdmin ? "primary" : "default"}
                            variant={user.isAdmin ? "filled" : "outlined"}
                            sx={{ 
                              fontWeight: 'medium',
                              borderRadius: '6px',
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title={user.blocked ? "Unblock User" : "Block User"}>
                            <IconButton
                              onClick={() => handleBlockUser(user._id, user.blocked)}
                              sx={{ 
                                color: user.blocked ? 'success.main' : 'warning.main',
                                '&:hover': {
                                  backgroundColor: user.blocked ? 'success.lighter' : 'warning.lighter',
                                }
                              }}
                              size="small"
                            >
                              {user.blocked ? <CheckCircleIcon /> : <BlockIcon />}
                            </IconButton>
                          </Tooltip>
                          {!user.isAdmin && (
                            <Tooltip title="Make Admin">
                              <IconButton
                                onClick={() => handleMakeAdmin(user._id)}
                                sx={{ 
                                  color: 'primary.main',
                                  '&:hover': {
                                    backgroundColor: 'primary.lighter',
                                  }
                                }}
                                size="small"
                              >
                                <AdminIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Delete User">
                            <IconButton
                              onClick={() => handleOpenDialog(user)}
                              sx={{ 
                                color: 'error.main',
                                '&:hover': {
                                  backgroundColor: 'error.lighter',
                                }
                              }}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </MotionTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {filteredUsers.length === 0 && (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography color="text.secondary">No users found matching your search criteria</Typography>
                </Box>
              )}
            </Paper>
          </motion.div>

          <Dialog 
            open={dialogOpen} 
            onClose={handleCloseDialog}
            PaperProps={{
              sx: {
                borderRadius: '12px',
                maxWidth: '450px',
              }
            }}
          >
            <DialogTitle sx={{ pb: 1 }}>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                Confirm Delete User
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 1 }}>
              {selectedUser && (
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{ 
                        bgcolor: getAvatarColor(selectedUser.username),
                        width: 48,
                        height: 48,
                        mr: 2
                      }}
                    >
                      {selectedUser.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{selectedUser.username}</Typography>
                      <Typography variant="body2" color="text.secondary">{selectedUser.email}</Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Typography color="error">
                    This action cannot be undone. The user account and all associated data will be permanently deleted.
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button 
                onClick={handleCloseDialog}
                sx={{ 
                  borderRadius: '8px', 
                  textTransform: 'none',
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteUser(selectedUser?._id)}
                color="error"
                variant="contained"
                sx={{ 
                  borderRadius: '8px', 
                  textTransform: 'none',
                }}
              >
                Delete User
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert 
              onClose={handleCloseSnackbar} 
              severity={snackbar.severity} 
              sx={{ 
                width: '100%',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </motion.div>
  );
};

export default UserManagement;