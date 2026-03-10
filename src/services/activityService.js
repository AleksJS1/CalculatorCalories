const { ActivityRepository } = require('../repositories/activityRepository');
const { validateActivityPayload } = require('../utils/validators');
const { round } = require('../utils/mathUtils');

const activityMet = {
  walking: 3.5,
  jogging: 7,
  running: 10,
  cycling: 7.5,
  swimming: 8,
  workout: 6,
  yoga: 2.8
};

class ActivityService {
  constructor({ activityRepository = new ActivityRepository() } = {}) {
    this.activityRepository = activityRepository;
  }

  estimateBurnedCalories({ name, durationMin, userWeightKg = 70, intensity = 'medium' }) {
    const metBase = activityMet[name?.toLowerCase()] || 4;
    const intensityMultiplier = intensity === 'high' ? 1.25 : intensity === 'low' ? 0.85 : 1;
    const hours = durationMin / 60;
    const burned = metBase * intensityMultiplier * userWeightKg * hours;
    return round(burned, 0);
  }

  async addActivity(payload) {
    const normalized = {
      ...payload,
      durationMin: Number(payload.durationMin),
      caloriesBurned: Number(payload.caloriesBurned || 0)
    };

    if (!normalized.caloriesBurned && payload.userWeightKg) {
      normalized.caloriesBurned = this.estimateBurnedCalories({
        name: normalized.name,
        durationMin: normalized.durationMin,
        userWeightKg: Number(payload.userWeightKg),
        intensity: normalized.intensity
      });
    }

    validateActivityPayload(normalized);
    return this.activityRepository.addActivity(normalized);
  }

  async removeActivity(activityId) {
    const removed = await this.activityRepository.deleteActivity(activityId);
    if (!removed) {
      throw new Error('Тренування не знайдено');
    }
    return removed;
  }

  async listByDate(date) {
    return this.activityRepository.listActivitiesByDate(date);
  }

  async getDailyBurned(date) {
    return this.activityRepository.aggregateDailyBurned(date);
  }

  summarizeIntensity(activities) {
    return activities.reduce(
      (summary, item) => {
        summary[item.intensity] = (summary[item.intensity] || 0) + 1;
        summary.totalDuration += item.durationMin;
        summary.totalBurned += item.caloriesBurned;
        return summary;
      },
      {
        low: 0,
        medium: 0,
        high: 0,
        totalDuration: 0,
        totalBurned: 0
      }
    );
  }
}

module.exports = {
  ActivityService
};
