import { User } from '../Models/UserModel.js'; 
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { sendResponse } from '../Utils/response.js';
import Profile from '../Models/ProfileModel.js';

export const register = async (req, res) => {
  try {
    const { username, email, password, adminKey } = req.body;

    if (!username || !email || !password) {
      return sendResponse(res, 400, 'Username, email, and password are required');
    }
    if (username.length < 3 || username.length > 20) {
      return sendResponse(res, 400, 'Username must be between 3 and 20 characters');
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return sendResponse(res, 409, existingUser.email === email ? 'Email already registered' : 'Username already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin: false 
    });

    await newUser.save();

    const token = jwt.sign(
      { 
        userId: newUser._id, 
        username: newUser.username,
        isAdmin: false
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    sendResponse(res, 201, 'User registered successfully', { 
      username: newUser.username,
      token
    });
  } catch (error) {
    console.error('Error during registration:', error);
    sendResponse(res, 500, 'Failed to register user', error.message);
  }
};

export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return sendResponse(res, 400, 'Email and password are required');
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return sendResponse(res, 401, 'Invalid email or password');
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return sendResponse(res, 401, 'Invalid email or password');
      }
  
      const token = jwt.sign(
        { 
          id: user._id,
          username: user.username, 
          isAdmin: user.isAdmin 
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' } 
      );
  
      console.log('Sending login response with user ID:', user._id.toString());
      
      sendResponse(res, 200, 'Login successful', {
        token,
        userId: user._id.toString(),
        username: user.username,
        id: user._id,
        isAdmin: user.isAdmin || false
      });

    } catch (error) {
      console.error('Error during login:', error);
      sendResponse(res, 500, 'Login error', error.message);
    }
  };
  
export const logout = (req, res) => {
    sendResponse(res, 200, 'Logout successful');
  };

export const getUserDetails = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) return sendResponse(res, 404, 'User not found');
      sendResponse(res, 200, 'User details retrieved successfully', {
        ...user.toObject(),
        isAdmin: user.isAdmin || false
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
      sendResponse(res, 500, 'Something went wrong', error.message);
    }
  };

export const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const currentUserProfile = await Profile.findOne({ user: currentUserId });

    if (!currentUserProfile || !currentUserProfile.gender) {
      return sendResponse(res, 200, 'Your profile is incomplete. Cannot find matches.', []);
    }
    let targetGender;
    if (currentUserProfile.gender === 'Male') {
      targetGender = 'Female';
    } else if (currentUserProfile.gender === 'Female') {
      targetGender = 'Male';
    } else {
      targetGender = ['Male', 'Female'];
    }

    const potentialMatchProfiles = await Profile.find({
      gender: Array.isArray(targetGender) ? { $in: targetGender } : targetGender,
      user: { $ne: currentUserId } 
    }).populate({
        path: 'user',
        select: '-password' 
      });

    const users = potentialMatchProfiles.map(profile => profile.user).filter(user => user != null); 

    sendResponse(res, 200, 'Users retrieved successfully', users);
  } catch (error) {
    sendResponse(res, 500, 'Failed to fetch users', error.message);
  }
};

export const updateUserDetails = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username && !email && !password) {
      return sendResponse(res, 400, 'At least one field (username, email, or password) must be provided');
    }
    if (username && (username.length < 3 || username.length > 20)) {
      return sendResponse(res, 400, 'Username must be between 3 and 20 characters');
    }

    let updates = {};
    if (username) {
      const usernameExists = await User.findOne({ username, _id: { $ne: req.user.id } });
      if (usernameExists) {
        return sendResponse(res, 409, 'Username already taken');
      }
      updates.username = username;
    }
    if (email) {
      const emailExists = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (emailExists) {
        return sendResponse(res, 409, 'Email already registered');
      }
      updates.email = email;
    }
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    if (!updatedUser) {
      return sendResponse(res, 404, 'User not found');
    }

    sendResponse(res, 200, 'User details updated', updatedUser);
  } catch (error) {
    console.error('Error updating user details:', error);
    sendResponse(res, 500, 'Failed to update user details', error.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return sendResponse(res, 404, 'User not found');
    }

    if (user.profile) {
      await Profile.findByIdAndDelete(user.profile);
    }
    
    sendResponse(res, 200, 'User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    sendResponse(res, 500, 'Error deleting user', error.message);
  }
};

// Add a debug route to verify tokens
export const verifyToken = async (req, res) => {
  try {
    const token = req.params.token || req.query.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return sendResponse(res, 400, 'Token is required');
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded:', decoded);
      
      return sendResponse(res, 200, 'Token is valid', {
        userId: decoded.id || decoded.userId,
        username: decoded.username,
        isAdmin: decoded.isAdmin,
        exp: new Date(decoded.exp * 1000).toISOString(),
        iat: new Date(decoded.iat * 1000).toISOString()
      });
    } catch (error) {
      console.error('Token verification error:', error);
      return sendResponse(res, 401, 'Invalid token', { error: error.message });
    }
  } catch (error) {
    console.error('Error in verifyToken route:', error);
    return sendResponse(res, 500, 'Server error', { error: error.message });
  }
};