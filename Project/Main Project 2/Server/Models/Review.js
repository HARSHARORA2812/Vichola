import { Schema, model, Types } from 'mongoose';

const websiteReviewSchema = new Schema({
  user: { type: Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const WebsiteReview = model('WebsiteReview', websiteReviewSchema);
export default WebsiteReview;
