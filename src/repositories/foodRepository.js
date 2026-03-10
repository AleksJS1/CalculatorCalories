const FoodItem = require('../models/FoodItem');

class FoodRepository {
  async listFoods(query = '', limit = 100) {
    const filter = query
      ? {
          name: {
            $regex: query,
            $options: 'i'
          }
        }
      : {};

    return FoodItem.find(filter).sort({ name: 1 }).limit(limit).lean();
  }

  async getFoodById(foodId) {
    return FoodItem.findById(foodId).lean();
  }

  async createFood(payload) {
    const food = new FoodItem(payload);
    return food.save();
  }

  async upsertDefaultFood(payload) {
    return FoodItem.findOneAndUpdate(
      { name: payload.name },
      {
        $set: {
          category: payload.category,
          caloriesPer100g: payload.caloriesPer100g,
          proteinPer100g: payload.proteinPer100g,
          fatPer100g: payload.fatPer100g,
          carbsPer100g: payload.carbsPer100g,
          fiberPer100g: payload.fiberPer100g,
          isDefault: true
        }
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true
      }
    ).lean();
  }
}

module.exports = {
  FoodRepository
};
