const nutritionController = {
  health(req, res) {
    return res.json({
      success: true,
      service: 'calorie-calculator',
      time: new Date().toISOString()
    });
  }
};

module.exports = {
  nutritionController
};
