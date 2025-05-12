import mongoose from 'mongoose';
import Profile from '../Models/ProfileModel.js'
import { User } from '../Models/UserModel.js';
import { sendResponse } from '../Utils/response.js'; 
import cloudinary from '../Config/cloudinaryConfig.js';

export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', 'username email');
    if (!profile) {
      return sendResponse(res, 404, 'Profile not found');
    }

    sendResponse(res, 200, 'Profile retrieved successfully', profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    sendResponse(res, 500, 'Failed to fetch profile data', error.message);
  }
};

export const createProfile = async (req, res) => {
  try {
    const {
      name, age, gender, occupation, education, location, height, religion, bio, photos,
      interests
    } = req.body;

    if (!name || !age || !gender) {
      return sendResponse(res, 400, 'Name, age, and gender are required');
    }
    if (!['Male', 'Female', 'Other'].includes(gender)) {
      return sendResponse(res, 400, 'Gender must be Male, Female, or Other');
    }
    if (age < 18) {
      return sendResponse(res, 400, 'Age must be 18 or older');
    }

    const existingProfile = await Profile.findOne({ user: req.user.id });
    if (existingProfile) {
      return sendResponse(res, 400, 'Profile already exists');
    }

    const newProfile = new Profile({
      user: req.user.id,
      name,
      age,
      gender,
      occupation,
      education,
      location,
      height,
      religion,
      bio,
      photos: photos || [],
      interests,
      isadmin: false
    });
    await newProfile.save();

    await User.findByIdAndUpdate(req.user.id, { profile: newProfile._id });

    sendResponse(res, 201, 'Profile created successfully', newProfile);
  } catch (error) {
    console.error('Error creating profile:', error);
    sendResponse(res, 500, 'Failed to create profile', error.message);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      name, age, gender, occupation, education, location, height, religion, bio, photos,
      interests
    } = req.body;

    if (gender && !['Male', 'Female', 'Other'].includes(gender)) {
      return sendResponse(res, 400, 'Gender must be Male, Female, or Other');
    }
    if (age && age < 18) {
      return sendResponse(res, 400, 'Age must be 18 or older');
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      {
        ...(name && { name }),
        ...(age && { age }),
        ...(gender && { gender }),
        ...(occupation && { occupation }),
        ...(education && { education }),
        ...(location && { location }),
        ...(height && { height }),
        ...(religion && { religion }),
        ...(bio && { bio }),
        ...(photos && { photos }),
        ...(interests && Array.isArray(interests) && { interests: interests.filter(i => typeof i === 'string' && i.trim() !== '') })
      },
      { new: true, runValidators: true } 
    );

    if (!updatedProfile) {
      return sendResponse(res, 404, 'Profile not found');
    }

    sendResponse(res, 200, 'Profile updated successfully', updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    sendResponse(res, 500, 'Failed to update profile', error.message);
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({ user: req.user.id });
    
    if (!profile) {
      return sendResponse(res, 404, 'Profile not found');
    }

    await User.findByIdAndUpdate(req.user.id, { profile: null });

    sendResponse(res, 200, 'Profile deleted successfully');
  } catch (error) {
    console.error('Error deleting profile:', error);
    sendResponse(res, 500, 'Failed to delete profile', error.message);
  }
};

export const getOtherProfile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, 'Invalid user ID');
    }

    const profile = await Profile.findOne({ user: id })
      .populate('user', 'username email')
      .select('name age gender occupation education location height religion bio photos interests');

    if (!profile) {
      return sendResponse(res, 404, 'Profile not found');
    }

    sendResponse(res, 200, 'Profile retrieved successfully', profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    sendResponse(res, 500, 'Failed to fetch profile', error.message);
  }
};

export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return sendResponse(res, 400, 'No image file provided');
    }

    // Check if profile exists
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      return sendResponse(res, 404, 'Profile not found. Please create a profile first.');
    }

    // Upload to Cloudinary using the buffer
    // You might need to adjust folder/naming conventions as desired
    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 'profile_photos', // Optional: organize uploads in Cloudinary
        public_id: `user_${req.user.id}_${Date.now()}`, // Optional: unique public ID
        overwrite: true, // Optional: replace if file with same public_id exists
      },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return sendResponse(res, 500, 'Failed to upload image', error.message);
        }

        if (!result || !result.secure_url) {
          console.error('Cloudinary upload failed: No URL returned');
          return sendResponse(res, 500, 'Image upload failed on Cloudinary');
        }

        // Update the profile's photos array (replace first photo for now)
        profile.photos = [result.secure_url, ...(profile.photos?.slice(1) || [])];
        await profile.save();

        sendResponse(res, 200, 'Profile photo updated successfully', { photoUrl: result.secure_url });
      }
    ).end(req.file.buffer);

  } catch (error) {
    console.error('Error uploading profile photo:', error);
    sendResponse(res, 500, 'Failed to process image upload', error.message);
  }
};