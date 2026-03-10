const MealEntry = require('../models/MealEntry');
const { getStartOfDay, getEndOfDay } = require('../utils/dateUtils');

class MealRepository {
  async addMeal(payload) {
    const meal = new MealEntry(payload);
    return meal.save();
  }

  async listMealsByDate(date) {
    const start = getStartOfDay(date);
    const end = getEndOfDay(date);
    return MealEntry.find({ date: { $gte: start, $lte: end } })
      .sort({ createdAt: 1 })
      .lean();
  }

  async deleteMeal(mealId) {
    return MealEntry.findByIdAndDelete(mealId).lean();
  }

  async aggregateDailyTotals(date) {
    const start = getStartOfDay(date);
    const end = getEndOfDay(date);

    const [result] = await MealEntry.aggregate([
      { $match: { date: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: null,
          calories: { $sum: '$calories' },
          protein: { $sum: '$protein' },
          fat: { $sum: '$fat' },
          carbs: { $sum: '$carbs' }
        }
      }
    ]);

    return (
      result || {
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0
      }
    );
  }

  async aggregateRangeDailyTotals(startDate, endDate) {
    return MealEntry.aggregate([
      {
        $match: {
          date: {
            $gte: getStartOfDay(startDate),
            $lte: getEndOfDay(endDate)
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' }
          },
          calories: { $sum: '$calories' },
          protein: { $sum: '$protein' },
          fat: { $sum: '$fat' },
          carbs: { $sum: '$carbs' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }
}

module.exports = {
  MealRepository
};
