import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

function Review() {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserId(response.data._id);
      } catch (error) {
        console.error('Failed to fetch current user:', error.response?.data || error.message);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get('/api/reviews', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Frontend - Fetched reviews:', response.data);
        setReviews(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch reviews:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        setLoading(false);
      }
    };

    fetchCurrentUser();
    fetchReviews();
  }, []);

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      alert('Please provide both a rating and a comment.');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found for review submission');
      return;
    }

    const reviewData = { rating: Number(rating), comment };

    try {
      console.log('Sending review payload:', reviewData);
      const response = await axios.post(
        '/api/reviews',
        reviewData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Review added:', response.data);
      setReviews([...reviews, response.data.review]);
      setRating('');
      setComment('');
    } catch (error) {
      console.error('Failed to add review:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      alert('Failed to add review. Check console for details.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found for review deletion');
      return;
    }

    try {
      await axios.delete(`/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Review deleted:', reviewId);
      setReviews(reviews.filter((review) => review._id !== reviewId));
    } catch (error) {
      console.error('Failed to delete review:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      alert('Failed to delete review. Check console for details.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-400">
              Share Your Experience
            </span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Help others find their perfect match by sharing your story
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 mb-12"
        >
          <form onSubmit={handleAddReview} className="space-y-6">
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                Rating
              </label>
              <div className="mt-2 flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value.toString())}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${
                      rating === value.toString()
                        ? 'bg-rose-500 text-white'
                        : 'bg-rose-100 text-rose-500 hover:bg-rose-200'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                Your Review
              </label>
              <textarea
                id="comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
                placeholder="Share your experience..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-600 to-rose-400 text-white py-3 px-4 rounded-lg font-medium hover:from-rose-700 hover:to-rose-500 transition-all duration-300 transform hover:scale-105"
            >
              Submit Review
            </button>
          </form>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group relative bg-white rounded-3xl shadow-xl overflow-hidden"
              onClick={() => setSelectedReview(review)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-600/10 to-rose-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                      <span className="text-rose-600 font-medium">
                        {review.user?.username?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {review.user?.username || 'Anonymous'}
                      </h3>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'text-rose-500' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  {currentUserId && review.user?._id === currentUserId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteReview(review._id);
                      }}
                      className="text-rose-600 hover:text-rose-700 transition-colors duration-200"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                <p className="text-gray-600 line-clamp-3">{review.comment}</p>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedReview(review);
                    }}
                    className="text-rose-600 hover:text-rose-700 text-sm font-medium"
                  >
                    Read More
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Review Modal */}
        {selectedReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedReview(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden transform transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center">
                      <span className="text-rose-600 text-2xl font-medium">
                        {selectedReview.user?.username?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {selectedReview.user?.username || 'Anonymous'}
                      </h3>
                      <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-5 w-5 ${i < selectedReview.rating ? 'text-rose-500' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <p className="text-gray-600 text-lg leading-relaxed">{selectedReview.comment}</p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {new Date(selectedReview.createdAt).toLocaleDateString()}
                  </span>
                  {currentUserId && selectedReview.user?._id === currentUserId && (
                    <button
                      onClick={() => handleDeleteReview(selectedReview._id)}
                      className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-300"
                    >
                      Delete Review
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Review;