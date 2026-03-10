const { serviceFactory } = require('../services/serviceFactory');

const pageController = {
  async renderDashboard(req, res, next) {
    try {
      const dashboardService = serviceFactory.getDashboardService();
      const profileService = serviceFactory.getProfileService();
      const goalService = serviceFactory.getGoalService();
      const foodService = serviceFactory.getFoodService();

      const [overview, profile, goal, foods] = await Promise.all([
        dashboardService.getOverview(new Date()),
        profileService.getCurrentProfile(),
        goalService.getActiveGoal(),
        foodService.listFoods('')
      ]);

      return res.render('pages/dashboard', {
        title: 'Калькулятор калорій',
        initialData: {
          overview,
          profile,
          goal,
          foods
        }
      });
    } catch (error) {
      return next(error);
    }
  }
};

module.exports = {
  pageController
};
