const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    category: {
      type: String,
      required: true,
      enum: ['protein', 'carb', 'fat', 'mixed', 'vegetable', 'fruit', 'drink']
    },
    caloriesPer100g: { type: Number, required: true, min: 0, max: 1000 },
    proteinPer100g: { type: Number, required: true, min: 0, max: 100 },
    fatPer100g: { type: Number, required: true, min: 0, max: 100 },
    carbsPer100g: { type: Number, required: true, min: 0, max: 100 },
    fiberPer100g: { type: Number, default: 0, min: 0, max: 100 },
    isDefault: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  },
  {
    versionKey: false
  }
);

foodItemSchema.pre('save', function updateTimestamp(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('FoodItem', foodItemSchema);
