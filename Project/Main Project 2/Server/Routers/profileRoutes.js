import express from 'express';
import {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  getOtherProfile,
  uploadProfilePhoto
} from '../Controllers/ProfileController.js';
import protect from '../Middleware/authMiddleware.js';
import upload from '../Middleware/multerConfig.js';

const router = express.Router();

router.route('/me')
  .get(protect, getProfile)
  .put(protect, updateProfile)
  .delete(protect, deleteProfile);
  
router.route('/')
  .post(protect, createProfile);

router.route('/photo')
  .put(protect, upload.single('profilePhoto'), uploadProfilePhoto);

router.route('/:id').get(protect, getOtherProfile);

export default router;
