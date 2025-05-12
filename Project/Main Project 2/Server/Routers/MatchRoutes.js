import express from 'express';
import { sendMatchRequest, acceptMatch, rejectMatch, getMatches, getPendingRequests, getPotentialMatches } from '../Controllers/matchControllers.js'; // Adjust path
import protect from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post('/request/:id', protect, sendMatchRequest); 
router.put('/accept/:id', protect, acceptMatch);
router.delete('/reject/:id', protect, rejectMatch); 
router.get('/', protect, getMatches); 
router.get('/pending', protect, getPendingRequests);
router.get('/potential', protect, getPotentialMatches);

export default router;