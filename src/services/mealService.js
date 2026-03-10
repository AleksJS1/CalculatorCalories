const { MealRepository } = require('../repositories/mealRepository');
const { FoodRepository } = require('../repositories/foodRepository');
const { validateMealPayload } = require('../utils/validators');
const { round } = require('../utils/mathUtils');

class MealService {
  constructor({ mealRepository = new MealRepository(), foodRepository = new FoodRepository() } = {}) {
    this.mealRepository = mealRepository;
    this.foodRepository = foodRepository;
  }

  calculateMealNutritionFromFood(food, grams) {
    const ratio = grams / 100;
    return {
      calories: round(food.caloriesPer100g * ratio, 1),
      protein: round(food.proteinPer100g * ratio, 1),
      fat: round(food.fatPer100g * ratio, 1),
      carbs: round(food.carbsPer100g * ratio, 1)
    };
  }

  async addMeal(payload) {
    const normalized = {
      ...payload,
      grams: Number(payload.grams),
      calories: Number(payload.calories || 0),
      protein: Number(payload.protein || 0),
      fat: Number(payload.fat || 0),
      carbs: Number(payload.carbs || 0)
    };

    if (payload.foodId) {
      const food = await this.foodRepository.getFoodById(payload.foodId);
      if (!food) {
        throw new Error('Обраний продукт не знайдено');
      }
      const nutrition = this.calculateMealNutritionFromFood(food, normalized.grams);
      normalized.foodName = food.name;
      normalized.calories = nutrition.calories;
      normalized.protein = nutrition.protein;
      normalized.fat = nutrition.fat;
      normalized.carbs = nutrition.carbs;
    }

    validateMealPayload(normalized);
    return this.mealRepository.addMeal(normalized);
  }

  async removeMeal(mealId) {
    const removed = await this.mealRepository.deleteMeal(mealId);
    if (!removed) {
      throw new Error('Запис прийому їжі не знайдено');
    }
    return removed;
  }

  async listMealsByDate(date) {
    return this.mealRepository.listMealsByDate(date);
  }

  async getDailyTotals(date) {
    const totals = await this.mealRepository.aggregateDailyTotals(date);
    return {
      calories: round(totals.calories || 0, 1),
      protein: round(totals.protein || 0, 1),
      fat: round(totals.fat || 0, 1),
      carbs: round(totals.carbs || 0, 1)
    };
  }

  groupMealsByType(meals) {
    const grouped = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: []
    };

    meals.forEach((meal) => {
      if (!grouped[meal.mealType]) {
        grouped[meal.mealType] = [];
      }
      grouped[meal.mealType].push(meal);
    });

    return grouped;
  }

  calculateMealTypeTotals(meals) {
    const grouped = this.groupMealsByType(meals);
    const result = {};

    Object.keys(grouped).forEach((key) => {
      const list = grouped[key];
      result[key] = list.reduce(
        (accumulator, item) => {
          accumulator.calories += item.calories;
          accumulator.protein += item.protein;
          accumulator.fat += item.fat;
          accumulator.carbs += item.carbs;
          return accumulator;
        },
        {
          calories: 0,
          protein: 0,
          fat: 0,
          carbs: 0
        }
      );
    });

    return result;
  }
}

module.exports = {
  MealService
};
