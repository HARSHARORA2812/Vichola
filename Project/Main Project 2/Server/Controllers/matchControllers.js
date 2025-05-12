import Match from '../Models/MatchModel.js';
import Profile from '../Models/ProfileModel.js';
import { sendResponse } from '../Utils/response.js';
import mongoose from 'mongoose';

export const sendMatchRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const senderId = req.user.id; 

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, 'Invalid user ID');
    }

    if (senderId === id) {
      return sendResponse(res, 400, 'You cannot match yourself');
    }

    const senderProfile = await Profile.findOne({ user: senderId });
    const receiverProfile = await Profile.findOne({ user: id });

    if (!senderProfile || !receiverProfile) {
      return sendResponse(res, 400, 'Both users must have profiles to send a match request');
    }

    const existingMatch = await Match.findOne({
      $or: [
        { user1: senderId, user2: id },
        { user1: id, user2: senderId },
      ],
    });

    if (existingMatch) {
      return sendResponse(res, 400, 'Match request already exists or completed');
    }

    const match = new Match({ user1: senderId, user2: id, status: 'pending' });
    await match.save();

    const populatedMatch = await Match.findById(match._id)
      .populate('user1', 'username email')
      .populate('user2', 'username email')
      .populate({
        path: 'user1',
        populate: { path: 'profile', select: 'name age gender photos bio location interests' }
      })
      .populate({
        path: 'user2',
        populate: { path: 'profile', select: 'name age gender photos bio location interests' }
      });

    sendResponse(res, 201, 'Match request sent successfully', populatedMatch);
  } catch (error) {
    sendResponse(res, 500, 'Failed to send match request', error.message);
  }
};

export const acceptMatch = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, 'Invalid match ID');
    }

    const match = await Match.findById(id);

    if (!match) {
      return sendResponse(res, 404, 'Match request not found');
    }

    if (match.user2.toString() !== req.user.id) {
      return sendResponse(res, 403, 'Unauthorized to accept this match');
    }

    if (match.status === 'matched') {
      return sendResponse(res, 400, 'Match already accepted');
    }

    match.status = 'matched';
    await match.save();

    await Profile.findOneAndUpdate(
      { user: match.user1 },
      { $addToSet: { matches: match.user2 } } 
    );
    await Profile.findOneAndUpdate(
      { user: match.user2 },
      { $addToSet: { matches: match.user1 } }
    );

    const populatedMatch = await Match.findById(match._id)
      .populate('user1', 'username email')
      .populate('user2', 'username email')
      .populate({
        path: 'user1',
        populate: { path: 'profile', select: 'name age gender photos bio location interests' }
      })
      .populate({
        path: 'user2',
        populate: { path: 'profile', select: 'name age gender photos bio location interests' }
      });

    sendResponse(res, 200, 'Match accepted successfully', populatedMatch);
  } catch (error) {
    sendResponse(res, 500, 'Failed to accept match', error.message);
  }
};

export const rejectMatch = async (req, res) => {
  try {
    const { id } = req.params; 
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, 'Invalid match ID');
    }

    const match = await Match.findById(id);

    if (!match) {
      return sendResponse(res, 404, 'Match request not found');
    }

    if (match.user2.toString() !== req.user.id) {
      return sendResponse(res, 403, 'Unauthorized to reject this match');
    }

    if (match.status === 'matched') {
      return sendResponse(res, 400, 'Cannot reject an already accepted match');
    }

    await Match.findByIdAndDelete(id);

    sendResponse(res, 200, 'Match request rejected successfully');
  } catch (error) {
    sendResponse(res, 500, 'Failed to reject match', error.message);
  }
};

export const getMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [{ user1: req.user.id }, { user2: req.user.id }],
      status: 'matched',
    })
      .populate('user1', 'username email')
      .populate('user2', 'username email')
      .populate({
        path: 'user1',
        populate: { path: 'profile', select: 'name age gender photos bio location interests' }
      })
      .populate({
        path: 'user2',
        populate: { path: 'profile', select: 'name age gender photos bio location interests' }
      });

    sendResponse(res, 200, 'Matches retrieved successfully', matches);
  } catch (error) {
    sendResponse(res, 500, 'Failed to fetch matches', error.message);
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const requests = await Match.find({
      user2: req.user.id,
      status: 'pending',
    })
      .populate('user1', 'username email')
      .populate('user2', 'username email')
      .populate({
        path: 'user1',
        populate: { path: 'profile', select: 'name age gender photos bio location interests' }
      })
      .populate({
        path: 'user2',
        populate: { path: 'profile', select: 'name age gender photos bio location interests' }
      });

    sendResponse(res, 200, 'Pending requests retrieved successfully', requests);
  } catch (error) {
    sendResponse(res, 500, 'Failed to fetch pending requests', error.message);
  }
};

export const getPotentialMatches = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentUserProfile = await Profile.findOne({ user: currentUserId });
    if (!currentUserProfile) {
      return sendResponse(res, 404, 'Profile not found');
    }

    let targetGender;
    if (currentUserProfile.gender === 'Male') {
      targetGender = 'Female';
    } else if (currentUserProfile.gender === 'Female') {
      targetGender = 'Male';
    } else {
      targetGender = ['Male', 'Female'];
    }

    const existingInteractions = await Match.find({
      $or: [
        { user1: currentUserId },
        { user2: currentUserId }
      ]
    });

    const excludedUserIds = existingInteractions.map(interaction => 
      interaction.user1.toString() === currentUserId ? interaction.user2.toString() : interaction.user1.toString()
    );

    excludedUserIds.push(currentUserId);

    const potentialMatches = await Profile.find({
      user: { $nin: excludedUserIds },
      gender: Array.isArray(targetGender) ? { $in: targetGender } : targetGender
    })
    .populate('user', 'username email')
    .select('name age gender occupation education location height religion bio photos');

    console.log('Found potential profiles:', potentialMatches.length);

    const formattedMatches = potentialMatches.map(match => {
      const formattedMatch = match.toObject();
      if (formattedMatch.user && formattedMatch.user._id) {
        formattedMatch.userId = formattedMatch.user._id;
      }
      return formattedMatch;
    });
    
    if (formattedMatches.length > 0) {
      console.log('Sample potential match:', JSON.stringify(formattedMatches[0], null, 2));
    } else {
      console.log('No potential matches found. Check if there are profiles with opposite gender.');
    }

    sendResponse(res, 200, 'Potential matches found', formattedMatches);
  } catch (error) {
    sendResponse(res, 500, 'Failed to fetch potential matches', error.message);
  }
};