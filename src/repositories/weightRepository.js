const WeightEntry = require('../models/WeightEntry');
const { getStartOfDay, getEndOfDay } = require('../utils/dateUtils');

class WeightRepository {
  async addWeight(payload) {
    const entry = new WeightEntry(payload);
    return entry.save();
  }

  async getLatestWeight() {
    return WeightEntry.findOne({}).sort({ date: -1, createdAt: -1 }).lean();
  }

  async listRange(startDate, endDate) {
    return WeightEntry.find({
      date: { $gte: getStartOfDay(startDate), $lte: getEndOfDay(endDate) }
    })
      .sort({ date: 1 })
      .lean();
  }

  async deleteWeight(weightId) {
    return WeightEntry.findByIdAndDelete(weightId).lean();
  }
}

module.exports = {
  WeightRepository
};
