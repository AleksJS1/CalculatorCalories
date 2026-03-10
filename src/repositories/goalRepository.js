const GoalPlan = require('../models/GoalPlan');

class GoalRepository {
  async getActiveGoal() {
    return GoalPlan.findOne({ active: true }).sort({ createdAt: -1 }).lean();
  }

  async createGoal(payload) {
    await GoalPlan.updateMany({ active: true }, { $set: { active: false } });
    const goal = new GoalPlan(payload);
    return goal.save();
  }

  async listGoals(limit = 20) {
    return GoalPlan.find({}).sort({ createdAt: -1 }).limit(limit).lean();
  }

  async archiveGoal(goalId) {
    return GoalPlan.findByIdAndUpdate(goalId, { $set: { active: false } }, { new: true }).lean();
  }
}

module.exports = {
  GoalRepository
};
