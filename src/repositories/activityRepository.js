const ActivityEntry = require('../models/ActivityEntry');
const { getStartOfDay, getEndOfDay } = require('../utils/dateUtils');

class ActivityRepository {
  async addActivity(payload) {
    const activity = new ActivityEntry(payload);
    return activity.save();
  }

  async listActivitiesByDate(date) {
    const start = getStartOfDay(date);
    const end = getEndOfDay(date);

    return ActivityEntry.find({ date: { $gte: start, $lte: end } })
      .sort({ createdAt: 1 })
      .lean();
  }

  async deleteActivity(activityId) {
    return ActivityEntry.findByIdAndDelete(activityId).lean();
  }

  async aggregateDailyBurned(date) {
    const start = getStartOfDay(date);
    const end = getEndOfDay(date);

    const [result] = await ActivityEntry.aggregate([
      { $match: { date: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: null,
          caloriesBurned: { $sum: '$caloriesBurned' }
        }
      }
    ]);

    return result?.caloriesBurned || 0;
  }

  async aggregateRangeBurned(startDate, endDate) {
    return ActivityEntry.aggregate([
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
          caloriesBurned: { $sum: '$caloriesBurned' }
        }
      },
      { $sort: { _id: 1 } }
    ]);
  }
}

module.exports = {
  ActivityRepository
};
