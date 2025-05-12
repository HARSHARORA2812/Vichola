import express from 'express';
import { register, login, logout, getUserDetails, updateUserDetails, deleteUser, getAllUsers, verifyToken } from '../Controllers/AuthController.js';
import authMiddleware from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authMiddleware, getUserDetails);
router.put('/me', authMiddleware, updateUserDetails);
router.delete('/me', authMiddleware, deleteUser);
router.get('/', authMiddleware, getAllUsers); 
router.get('/verify-token/:token', verifyToken); // Debug route to verify tokens
router.get('/verify-token', verifyToken); // Also accept token as query param or header

export default router;