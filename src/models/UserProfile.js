const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 14, max: 100 },
    sex: { type: String, required: true, enum: ['male', 'female'] },
    heightCm: { type: Number, required: true, min: 120, max: 240 },
    weightKg: { type: Number, required: true, min: 30, max: 350 },
    activityLevel: {
      type: String,
      required: true,
      enum: ['sedentary', 'light', 'moderate', 'active', 'athlete']
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
);

userProfileSchema.pre('save', function updateTimestamp(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('UserProfile', userProfileSchema);
