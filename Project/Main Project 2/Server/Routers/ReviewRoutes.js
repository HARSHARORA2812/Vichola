import express from 'express';
import { addReview, getReviews, deleteReview } from '../Controllers/reviewController.js';
import protect from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addReview);
router.get('/', getReviews);
router.delete('/:id', protect, deleteReview);

export default router;