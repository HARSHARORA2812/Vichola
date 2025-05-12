import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 18 },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  occupation: { type: String, trim: true },
  education: { type: String, trim: true },
  location: { type: String, trim: true },
  height: { type: Number, min: 0 },
  religion: { type: String, trim: true },
  bio: { type: String, trim: true, maxlength: 500 },
  photos: [{ type: String }],
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
  interests: { type: [String], default: [] },
  isPremium: { type: Boolean, default: false },
  isadmin: { type: Boolean, default: false },
}, { timestamps: true });


const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);
export default Profile;