import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    isAdmin: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
    reported: { type: Boolean, default: false }
}, { timestamps: true });


export const User = mongoose.models.User || mongoose.model('User', userSchema);