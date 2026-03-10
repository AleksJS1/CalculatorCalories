const mongoose = require('mongoose');

const weightEntrySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, index: true },
    weightKg: { type: Number, required: true, min: 30, max: 350 },
    bodyFatPercent: { type: Number, min: 0, max: 80, default: null },
    note: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
);

weightEntrySchema.pre('save', function updateTimestamp(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('WeightEntry', weightEntrySchema);
