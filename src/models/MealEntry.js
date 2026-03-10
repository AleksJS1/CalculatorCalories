const mongoose = require('mongoose');

const mealEntrySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true, index: true },
    mealType: {
      type: String,
      required: true,
      enum: ['breakfast', 'lunch', 'dinner', 'snack']
    },
    foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: false },
    foodName: { type: String, required: true, trim: true },
    grams: { type: Number, required: true, min: 1, max: 5000 },
    calories: { type: Number, required: true, min: 0, max: 5000 },
    protein: { type: Number, required: true, min: 0, max: 300 },
    fat: { type: Number, required: true, min: 0, max: 300 },
    carbs: { type: Number, required: true, min: 0, max: 500 },
    note: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
);

mealEntrySchema.pre('save', function updateTimestamp(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('MealEntry', mealEntrySchema);
