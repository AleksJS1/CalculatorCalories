const { WeightRepository } = require('../repositories/weightRepository');
const { validateWeightPayload } = require('../utils/validators');
const { listDateRange, normalizeDateInput, shiftDate, toDateOnlyString } = require('../utils/dateUtils');
const { calculateTrendSlope, round } = require('../utils/mathUtils');

class WeightService {
  constructor({ weightRepository = new WeightRepository() } = {}) {
    this.weightRepository = weightRepository;
  }

  async addWeight(payload) {
    const normalized = {
      ...payload,
      weightKg: Number(payload.weightKg)
    };
    validateWeightPayload(normalized);
    return this.weightRepository.addWeight(normalized);
  }

  async removeWeight(weightId) {
    const deleted = await this.weightRepository.deleteWeight(weightId);
    if (!deleted) {
      throw new Error('Запис ваги не знайдено');
    }
    return deleted;
  }

  async getLatestWeight() {
    return this.weightRepository.getLatestWeight();
  }

  async getTrend(days = 14, endDateInput = new Date()) {
    const endDate = normalizeDateInput(endDateInput);
    const startDate = shiftDate(endDate, -(days - 1));
    const list = await this.weightRepository.listRange(startDate, endDate);

    const dates = listDateRange(endDate, days);
    const byDate = new Map(list.map((item) => [toDateOnlyString(item.date), item.weightKg]));

    const series = dates.map((date) => ({
      date,
      weightKg: byDate.get(date) || null
    }));

    const present = series.filter((item) => item.weightKg !== null).map((item) => item.weightKg);
    const slope = calculateTrendSlope(present);

    return {
      days,
      points: series,
      slopePerDay: round(slope, 4),
      trend: slope < -0.03 ? 'down' : slope > 0.03 ? 'up' : 'stable'
    };
  }
}

module.exports = {
  WeightService
};
