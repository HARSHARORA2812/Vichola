import { User } from '../Models/UserModel.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ blocked: false });
    const reportedUsers = await User.countDocuments({ reported: true });

    res.json({
      status: 'success',
      data: {
        totalUsers,
        activeUsers,
        reportedUsers
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: 'Error fetching admin stats' 
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json({
      status: 'success',
      data: users
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: 'Error fetching users' 
    });
  }
};

export const makeAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        status: 'error',
        message: 'User not found' 
      });
    }

    user.isAdmin = true;
    await user.save();

    res.json({ 
      status: 'success',
      message: 'User has been made admin successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: 'Error making user admin' 
    });
  }
};

export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        status: 'error',
        message: 'User not found' 
      });
    }

    user.blocked = !user.blocked;
    await user.save();

    res.json({
      status: 'success',
      message: `User ${user.blocked ? 'blocked' : 'unblocked'} successfully`,
      data: { blocked: user.blocked }
    });
  } catch (error) {
   
    res.status(500).json({ 
      status: 'error',
      message: 'Error updating user block status' 
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        status: 'error',
        message: 'User not found' 
      });
    }

    res.json({ 
      status: 'success',
      message: 'User deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Error deleting user' 
    });
  }
};
