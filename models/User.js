import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'doctor'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: '',
    },
    firebaseUid: {
      type: String,
      default: '',
    },
    authProvider: {
      type: String,
      enum: ['email', 'google'],
      default: 'email',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Wellness questionnaire data (collected at signup)
    wellnessProfile: {
      stressLevel: { type: Number, default: 5 }, // 1-10
      sleepQuality: { type: Number, default: 5 }, // 1-10
      currentMood: { type: String, default: 'neutral' },
      concerns: [{ type: String }], // ['anxiety', 'depression', 'stress', etc.]
      goals: [{ type: String }], // ['better_sleep', 'reduce_anxiety', etc.]
      exerciseFrequency: { type: String, default: 'rarely' },
      meditationExperience: { type: Boolean, default: false },
    },
    // Tracking data (updated as user uses services)
    trackingData: {
      totalSessions: { type: Number, default: 0 },
      servicesUsed: {
        audio: { type: Number, default: 0 },
        yoga: { type: Number, default: 0 },
        reading: { type: Number, default: 0 },
        laughing: { type: Number, default: 0 },
        meditation: { type: Number, default: 0 },
      },
      moodHistory: [{
        mood: Number,
        date: { type: Date, default: Date.now },
      }],
      weeklyStats: [{
        week: String,
        mood: Number,
        sleep: Number,
        meditation: Number,
        energy: Number,
      }],
      lastActive: { type: Date, default: Date.now },
    },
    // Doctor-specific fields
    doctorProfile: {
      specialization: { type: String, default: '' },
      degree: { type: String, default: '' },
      experience: { type: Number, default: 0 },
      hospital: { type: String, default: '' },
      bio: { type: String, default: '' },
      fee: { type: Number, default: 0 },
      image: { type: String, default: '' },
      availableDays: [{ type: String }],
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
      },
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
