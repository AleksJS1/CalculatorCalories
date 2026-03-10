const { serviceFactory } = require('../services/serviceFactory');
const { normalizeDateInput } = require('../utils/dateUtils');

function success(res, data, status = 200) {
  return res.status(status).json({
    success: true,
    data
  });
}

function fail(next, error) {
  return next(error);
}

const apiController = {
  health(req, res) {
    return success(res, {
      service: 'calorie-calculator',
      time: new Date().toISOString()
    });
  },

  async getDashboard(req, res, next) {
    try {
      const service = serviceFactory.getDashboardService();
      const date = normalizeDateInput(req.query.date);
      const data = await service.getOverview(date);
      return success(res, data);
    } catch (error) {
      return fail(next, error);
    }
  },

  async upsertProfile(req, res, next) {
    try {
      const service = serviceFactory.getProfileService();
      const data = await service.upsertProfile(req.body);
      return success(res, data, 201);
    } catch (error) {
      return fail(next, error);
    }
  },

  async getProfile(req, res, next) {
    try {
      const service = serviceFactory.getProfileService();
      const data = await service.getCurrentProfile();
      return success(res, data);
    } catch (error) {
      return fail(next, error);
    }
  },

  async createGoal(req, res, next) {
    try {
      const service = serviceFactory.getGoalService();
      const data = await service.createGoal(req.body);
      return success(res, data, 201);
    } catch (error) {
      return fail(next, error);
    }
  },

  async generateGoal(req, res, next) {
    try {
      const service = serviceFactory.getGoalService();
      const data = await service.generateRecommendedGoal(req.query.type || 'maintain');
      return success(res, data);
    } catch (error) {
      return fail(next, error);
    }
  },

  async getActiveGoal(req, res, next) {
    try {
      const service = serviceFactory.getGoalService();
      const data = await service.getActiveGoal();
      return success(res, data);
    } catch (error) {
      return fail(next, error);
    }
  },

  async getFoods(req, res, next) {
    try {
      const service = serviceFactory.getFoodService();
      const data = await service.listFoods(req.query.q || '');
      return success(res, data);
    } catch (error) {
      return fail(next, error);
    }
  },

  async createFood(req, res, next) {
    try {
      const service = serviceFactory.getFoodService();
      const data = await service.createFood(req.body);
      return success(res, data, 201);
    } catch (error) {
      return fail(next, error);
    }
  },

  async addMeal(req, res, next) {
    try {
      const service = serviceFactory.getMealService();
      const data = await service.addMeal(req.body);
      return success(res, data, 201);
    } catch (error) {
      return fail(next, error);
    }
  },

  async removeMeal(req, res, next) {
    try {
      const service = serviceFactory.getMealService();
      const data = await service.removeMeal(req.params.id);
      return success(res, data);
    } catch (error) {
      return fail(next, error);
    }
  },

  async listMeals(req, res, next) {
    try {
      const service = serviceFactory.getMealService();
      const date = normalizeDateInput(req.query.date);
      const data = await service.listMealsByDate(date);
      return success(res, data);
    } catch (error) {
      return fail(next, error);
    }
  },

  async addActivity(req, res, next) {
    try {
      const service = serviceFactory.getActivityService();
      const data = await service.addActivity(req.body);
      return success(res, data, 201);
    } catch (error) {
      return fail(next, error);
    }
  },

  async removeActivity(req, res, next) {
    try {
      const service = serviceFactory.getActivityService();
      const data = await service.removeActivity(req.params.id);
      return success(res, data);
    } catch (error) {
      return fail(next, error);
    }
  },

  async listActivities(req, res, next) {
    try {
      const service = serviceFactory.getActivityService();
      const date = normalizeDateInput(req.query.date);
      const data = await service.listByDate(date);
      return success(res, data);
    } catch (error) {
      return fail(next, error);
    }
  },

  async addWeight(req, res, next) {
    try {
      const service = serviceFactory.getWeightService();
      const data = await service.addWeight(req.body);
      return success(res, data, 201);
    } catch (error) {
      return fail(next, error);
    }
  },

  async removeWeight(req, res, next) {
    try {
      const service = serviceFactory.getWeightService();
      const data = await service.removeWeight(req.params.id);
      return success(res, data);
    } catch (error) {
      return fail(next, error);
    }
  },

  async getWeightTrend(req, res, next) {
    try {
      const service = serviceFactory.getWeightService();
      const days = Number(req.query.days || 14);
      const data = await service.getTrend(days, req.query.endDate || new Date());
      return success(res, data);
    } catch (error) {
      return fail(next, error);
    }
  }
};

module.exports = {
  apiController
};
