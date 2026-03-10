const express = require('express');
const { pageController } = require('../controllers/pageController');

const pageRouter = express.Router();

pageRouter.get('/', pageController.renderDashboard);

module.exports = {
  pageRouter
};
