const mongoose = require('mongoose');

const goalPlanSchema = new mongoose.Schema(
  {
    goalType: {
      type: String,
      required: true,
      enum: ['lose', 'maintain', 'gain']
    },
    targetWeightKg: {
      type: Number,
      required: true,
      min: 30,
      max: 350
    },
    targetCalories: {
      type: Number,
      required: true,
      min: 800,
      max: 5000
    },
    proteinRatio: { type: Number, required: true, min: 0.1, max: 0.6 },
    fatRatio: { type: Number, required: true, min: 0.1, max: 0.6 },
    carbRatio: { type: Number, required: true, min: 0.1, max: 0.8 },
    startDate: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
);

goalPlanSchema.pre('save', function updateTimestamp(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('GoalPlan', goalPlanSchema);
