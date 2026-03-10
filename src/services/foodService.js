const { FoodRepository } = require('../repositories/foodRepository');
const { round } = require('../utils/mathUtils');

class FoodService {
  constructor({ foodRepository = new FoodRepository() } = {}) {
    this.foodRepository = foodRepository;
  }

  async listFoods(query = '') {
    return this.foodRepository.listFoods(query, 200);
  }

  async createFood(payload) {
    const normalized = {
      name: String(payload.name || '').trim(),
      category: payload.category,
      caloriesPer100g: Number(payload.caloriesPer100g),
      proteinPer100g: Number(payload.proteinPer100g),
      fatPer100g: Number(payload.fatPer100g),
      carbsPer100g: Number(payload.carbsPer100g),
      fiberPer100g: Number(payload.fiberPer100g || 0),
      isDefault: false
    };

    if (!normalized.name) {
      throw new Error('Назва продукту є обовʼязковою');
    }

    return this.foodRepository.createFood(normalized);
  }

  calculateForPortion(food, grams) {
    const ratio = Number(grams) / 100;
    return {
      calories: round(food.caloriesPer100g * ratio, 1),
      protein: round(food.proteinPer100g * ratio, 1),
      fat: round(food.fatPer100g * ratio, 1),
      carbs: round(food.carbsPer100g * ratio, 1),
      fiber: round(food.fiberPer100g * ratio, 1)
    };
  }

  buildFoodCard(food) {
    return {
      id: String(food._id),
      title: food.name,
      category: food.category,
      metrics: {
        calories: food.caloriesPer100g,
        protein: food.proteinPer100g,
        fat: food.fatPer100g,
        carbs: food.carbsPer100g,
        fiber: food.fiberPer100g
      }
    };
  }
}

module.exports = {
  FoodService
};
