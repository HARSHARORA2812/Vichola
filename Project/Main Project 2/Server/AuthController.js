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