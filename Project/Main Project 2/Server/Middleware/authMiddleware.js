import jwt from 'jsonwebtoken';
import { User } from '../Models/UserModel.js';

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded in middleware:', decoded);
        
        // Handle both 'id' and 'userId' for backwards compatibility
        const userId = decoded.id || decoded.userId;
        
        if (!userId) {
            console.error('No user ID found in token:', decoded);
            return res.status(401).json({ message: 'Invalid token format - missing user ID' });
        }
        
        const user = await User.findById(userId);

        if (!user) {
            console.log('User not found for ID:', userId);
            return res.status(404).json({ message: 'User not found' });
        }

        if (decoded.isAdmin !== undefined && decoded.isAdmin !== user.isAdmin) {
            console.log(`isAdmin mismatch - Token: ${decoded.isAdmin}, Database: ${user.isAdmin}`);
        }

        // Set user ID in req for easy access
        req.user = {
            ...user.toObject(),
            id: user._id.toString()
        };
        
        console.log(`Authenticated user: ${user.username}, ID: ${user._id}, isAdmin: ${user.isAdmin}`);
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(403).json({ message: 'Invalid token' });
    }
};

export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.isAdmin !== true) {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
};

export default authenticateToken;