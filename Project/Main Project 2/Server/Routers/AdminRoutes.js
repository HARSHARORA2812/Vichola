import express from 'express';
import { authenticateToken, isAdmin } from '../Middleware/authMiddleware.js';
import { 
  getDashboardStats, 
  getAllUsers, 
  makeAdmin, 
  toggleBlockUser, 
  deleteUser 
} from '../Controllers/AdminController.js';

const router = express.Router();


router.use(authenticateToken, isAdmin);
router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/make-admin', makeAdmin);
router.put('/users/:id/block', toggleBlockUser);
router.delete('/users/:id', deleteUser);

export default router;