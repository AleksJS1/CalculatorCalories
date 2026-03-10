const { ProfileRepository } = require('../repositories/profileRepository');
const { WeightRepository } = require('../repositories/weightRepository');
const { MetabolismService } = require('./metabolismService');
const { validateProfilePayload } = require('../utils/validators');

class ProfileService {
  constructor(
    {
      profileRepository = new ProfileRepository(),
      weightRepository = new WeightRepository(),
      metabolismService = new MetabolismService()
    } = {}
  ) {
    this.profileRepository = profileRepository;
    this.weightRepository = weightRepository;
    this.metabolismService = metabolismService;
  }

  async getCurrentProfile() {
    return this.profileRepository.getLatestProfile();
  }

  async upsertProfile(payload) {
    const normalized = {
      ...payload,
      age: Number(payload.age),
      heightCm: Number(payload.heightCm),
      weightKg: Number(payload.weightKg)
    };

    validateProfilePayload(normalized);
    const profile = await this.profileRepository.updateLatestProfile(normalized);

    await this.weightRepository.addWeight({
      date: payload.date || new Date(),
      weightKg: normalized.weightKg,
      note: 'Автоматичний запис з профілю'
    });

    return profile;
  }

  async getMetabolicSummary() {
    const profile = await this.getCurrentProfile();
    if (!profile) {
      return null;
    }

    const bmr = this.metabolismService.calculateBmr(profile);
    const tdee = this.metabolismService.calculateTdee(profile);
    const waterMl = this.metabolismService.calculateDailyWaterMl(profile.weightKg, profile.activityLevel);

    return {
      profile,
      bmr,
      tdee,
      waterMl
    };
  }
}

module.exports = {
  ProfileService
};
