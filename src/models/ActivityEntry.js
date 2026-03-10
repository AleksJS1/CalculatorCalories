const mongoose = require('mongoose');

const activityEntrySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, index: true },
    name: { type: String, required: true, trim: true },
    intensity: { type: String, required: true, enum: ['low', 'medium', 'high'] },
    durationMin: { type: Number, required: true, min: 1, max: 720 },
    caloriesBurned: { type: Number, required: true, min: 0, max: 4000 },
    note: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
);

activityEntrySchema.pre('save', function updateTimestamp(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('ActivityEntry', activityEntrySchema);
