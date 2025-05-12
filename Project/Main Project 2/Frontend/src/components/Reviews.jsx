import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {

        const mockReviews = [
          {
            id: 1,
            user: {
              name: 'Sarah Johnson',
              age: 28,
              location: 'New York',
              photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            },
            rating: 5,
            title: 'Found My Perfect Match!',
            content: 'I never thought I would find someone who shares my love for hiking and photography. Thanks to this platform, I met my soulmate and we\'re planning our wedding next month!',
            date: '2024-03-15'
          },
          {
            id: 2,
            user: {
              name: 'Michael Chen',
              age: 32,
              location: 'San Francisco',
              photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            },
            rating: 5,
            title: 'Amazing Experience',
            content: 'The matching algorithm is spot on! I\'ve been on several dates and each one was better than the last. The platform makes it easy to connect with like-minded people.',
            date: '2024-03-10'
          },
          {
            id: 3,
            user: {
              name: 'Emma Wilson',
              age: 26,
              location: 'London',
              photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
            },
            rating: 5,
            title: 'Life-Changing Platform',
            content: 'I was skeptical at first, but this platform exceeded all my expectations. The community is amazing, and I\'ve made so many new friends while searching for my perfect match.',
            date: '2024-03-05'
          }
        ];
        
        setReviews(mockReviews);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

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
              Success Stories
            </span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Real stories from people who found their perfect match
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group relative bg-white rounded-3xl shadow-xl overflow-hidden"
              onClick={() => setSelectedReview(review)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-rose-600/10 to-rose-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full ring-4 ring-rose-100 overflow-hidden">
                      <img
                        src={review.user.photo}
                        alt={review.user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-rose-600 text-white rounded-full p-1">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{review.user.name}</h3>
                    <p className="text-sm text-rose-600">{review.user.location}</p>
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

                <h4 className="text-xl font-bold text-gray-900 mb-2">{review.title}</h4>
                <p className="text-gray-600 line-clamp-3">{review.content}</p>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
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
              <div className="relative">
                <img
                  className="w-full h-64 object-cover"
                  src={selectedReview.user.photo}
                  alt={selectedReview.user.name}
                />
                <button
                  onClick={() => setSelectedReview(null)}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-rose-50 transition-colors duration-300"
                >
                  <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 rounded-full ring-4 ring-rose-100 overflow-hidden">
                    <img
                      src={selectedReview.user.photo}
                      alt={selectedReview.user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedReview.user.name}</h3>
                    <p className="text-rose-600">{selectedReview.user.location}</p>
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

                <h4 className="text-2xl font-bold text-gray-900 mb-4">{selectedReview.title}</h4>
                <p className="text-gray-600 text-lg leading-relaxed">{selectedReview.content}</p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {new Date(selectedReview.date).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors duration-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Reviews; 