const { MealService } = require('./mealService');
const { ActivityService } = require('./activityService');
const { WeightService } = require('./weightService');
const { GoalService } = require('./goalService');
const { ProfileService } = require('./profileService');
const { listDateRange, normalizeDateInput, shiftDate } = require('../utils/dateUtils');
const { MealRepository } = require('../repositories/mealRepository');
const { ActivityRepository } = require('../repositories/activityRepository');

class DashboardService {
  constructor(
    {
      mealService = new MealService(),
      activityService = new ActivityService(),
      weightService = new WeightService(),
      goalService = new GoalService(),
      profileService = new ProfileService(),
      mealRepository = new MealRepository(),
      activityRepository = new ActivityRepository()
    } = {}
  ) {
    this.mealService = mealService;
    this.activityService = activityService;
    this.weightService = weightService;
    this.goalService = goalService;
    this.profileService = profileService;
    this.mealRepository = mealRepository;
    this.activityRepository = activityRepository;
  }

  async getDailySnapshot(dateInput = new Date()) {
    const date = normalizeDateInput(dateInput);
    const [dailyMeals, dailyMealTotals, dailyBurned, macroTargets, profileSummary] = await Promise.all([
      this.mealService.listMealsByDate(date),
      this.mealService.getDailyTotals(date),
      this.activityService.getDailyBurned(date),
      this.goalService.getMacroTargets(),
      this.profileService.getMetabolicSummary()
    ]);

    const netCalories = dailyMealTotals.calories - dailyBurned;
    const targets = macroTargets || { calories: 0, protein: 0, fat: 0, carbs: 0 };

    return {
      date,
      meals: dailyMeals,
      mealTypeTotals: this.mealService.calculateMealTypeTotals(dailyMeals),
      consumed: dailyMealTotals,
      burned: dailyBurned,
      netCalories,
      targets,
      remaining: {
        calories: targets.calories - netCalories,
        protein: targets.protein - dailyMealTotals.protein,
        fat: targets.fat - dailyMealTotals.fat,
        carbs: targets.carbs - dailyMealTotals.carbs
      },
      profileSummary
    };
  }

  async getWeeklySeries(endDateInput = new Date()) {
    const endDate = normalizeDateInput(endDateInput);
    const startDate = shiftDate(endDate, -6);

    const [mealRows, activityRows] = await Promise.all([
      this.mealRepository.aggregateRangeDailyTotals(startDate, endDate),
      this.activityRepository.aggregateRangeBurned(startDate, endDate)
    ]);

    const dayKeys = listDateRange(endDate, 7);
    const mealByDate = new Map(mealRows.map((row) => [row._id, row]));
    const activityByDate = new Map(activityRows.map((row) => [row._id, row]));

    return dayKeys.map((date) => {
      const meal = mealByDate.get(date);
      const activity = activityByDate.get(date);
      const consumed = meal?.calories || 0;
      const burned = activity?.caloriesBurned || 0;
      return {
        date,
        consumed,
        burned,
        net: consumed - burned
      };
    });
  }

  async getOverview(dateInput = new Date()) {
    const [snapshot, weeklySeries, weightTrend, activeGoal] = await Promise.all([
      this.getDailySnapshot(dateInput),
      this.getWeeklySeries(dateInput),
      this.weightService.getTrend(14, dateInput),
      this.goalService.getActiveGoal()
    ]);

    return {
      snapshot,
      weeklySeries,
      weightTrend,
      activeGoal
    };
  }
}

module.exports = {
  DashboardService
};
