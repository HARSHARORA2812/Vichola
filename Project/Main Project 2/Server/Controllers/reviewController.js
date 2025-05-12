import WebsiteReview from '../Models/Review.js';

export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = new WebsiteReview({ user: userId, rating, comment });
    await review.save();
    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {

    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await WebsiteReview.find().populate('user', 'username'); 
    res.status(200).json(reviews);
  } catch (error) {
    console.error('getReviews Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await WebsiteReview.findById(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (review.user.toString() !== userId) {
      return res.status(403).json({ error: 'You can only delete your own reviews' });
    }

    await review.deleteOne();
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('deleteReview Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};