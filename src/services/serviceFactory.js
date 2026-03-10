const { ProfileService } = require('./profileService');
const { GoalService } = require('./goalService');
const { MealService } = require('./mealService');
const { ActivityService } = require('./activityService');
const { WeightService } = require('./weightService');
const { FoodService } = require('./foodService');
const { DashboardService } = require('./dashboardService');

class ServiceFactory {
  constructor() {
    this.cache = new Map();
  }

  get(name, builder) {
    if (!this.cache.has(name)) {
      this.cache.set(name, builder());
    }
    return this.cache.get(name);
  }

  getProfileService() {
    return this.get('profile', () => new ProfileService());
  }

  getGoalService() {
    return this.get('goal', () => new GoalService());
  }

  getMealService() {
    return this.get('meal', () => new MealService());
  }

  getActivityService() {
    return this.get('activity', () => new ActivityService());
  }

  getWeightService() {
    return this.get('weight', () => new WeightService());
  }

  getFoodService() {
    return this.get('food', () => new FoodService());
  }

  getDashboardService() {
    return this.get('dashboard', () => new DashboardService());
  }
}

const serviceFactory = new ServiceFactory();

module.exports = {
  ServiceFactory,
  serviceFactory
};
