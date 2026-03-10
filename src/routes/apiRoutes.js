const express = require('express');
const { apiController } = require('../controllers/apiController');

const apiRouter = express.Router();

apiRouter.get('/health', apiController.health);

apiRouter.get('/dashboard', apiController.getDashboard);

apiRouter.get('/profile', apiController.getProfile);
apiRouter.post('/profile', apiController.upsertProfile);

apiRouter.get('/goals/active', apiController.getActiveGoal);
apiRouter.get('/goals/recommended', apiController.generateGoal);
apiRouter.post('/goals', apiController.createGoal);

apiRouter.get('/foods', apiController.getFoods);
apiRouter.post('/foods', apiController.createFood);

apiRouter.get('/meals', apiController.listMeals);
apiRouter.post('/meals', apiController.addMeal);
apiRouter.delete('/meals/:id', apiController.removeMeal);

apiRouter.get('/activities', apiController.listActivities);
apiRouter.post('/activities', apiController.addActivity);
apiRouter.delete('/activities/:id', apiController.removeActivity);

apiRouter.get('/weights/trend', apiController.getWeightTrend);
apiRouter.post('/weights', apiController.addWeight);
apiRouter.delete('/weights/:id', apiController.removeWeight);

module.exports = {
  apiRouter
};
