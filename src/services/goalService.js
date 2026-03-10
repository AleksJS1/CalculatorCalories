const { GoalRepository } = require('../repositories/goalRepository');
const { ProfileRepository } = require('../repositories/profileRepository');
const { MetabolismService } = require('./metabolismService');
const { validateGoalPayload } = require('../utils/validators');

class GoalService {
  constructor(
    {
      goalRepository = new GoalRepository(),
      profileRepository = new ProfileRepository(),
      metabolismService = new MetabolismService()
    } = {}
  ) {
    this.goalRepository = goalRepository;
    this.profileRepository = profileRepository;
    this.metabolismService = metabolismService;
  }

  async getActiveGoal() {
    return this.goalRepository.getActiveGoal();
  }

  async createGoal(payload) {
    const normalized = {
      ...payload,
      targetWeightKg: Number(payload.targetWeightKg),
      targetCalories: Number(payload.targetCalories),
      proteinRatio: Number(payload.proteinRatio),
      fatRatio: Number(payload.fatRatio),
      carbRatio: Number(payload.carbRatio)
    };

    validateGoalPayload(normalized);
    return this.goalRepository.createGoal(normalized);
  }

  async generateRecommendedGoal(goalType = 'maintain') {
    const profile = await this.profileRepository.getLatestProfile();
    if (!profile) {
      throw new Error('Спочатку створіть профіль користувача');
    }

    const tdee = this.metabolismService.calculateTdee(profile);
    const targetCalories = this.metabolismService.calculateTargetCalories(goalType, tdee);

    let ratios;
    if (goalType === 'lose') {
      ratios = { proteinRatio: 0.35, fatRatio: 0.3, carbRatio: 0.35 };
    } else if (goalType === 'gain') {
      ratios = { proteinRatio: 0.3, fatRatio: 0.25, carbRatio: 0.45 };
    } else {
      ratios = { proteinRatio: 0.3, fatRatio: 0.3, carbRatio: 0.4 };
    }

    return {
      goalType,
      targetWeightKg: profile.weightKg,
      targetCalories,
      ...ratios
    };
  }

  async getMacroTargets() {
    const activeGoal = await this.goalRepository.getActiveGoal();
    if (!activeGoal) {
      return null;
    }

    const grams = this.metabolismService.macroCaloriesToGrams(
      activeGoal.targetCalories,
      activeGoal.proteinRatio,
      activeGoal.fatRatio,
      activeGoal.carbRatio
    );

    return {
      calories: activeGoal.targetCalories,
      protein: grams.proteinGrams,
      fat: grams.fatGrams,
      carbs: grams.carbsGrams,
      ratios: {
        proteinRatio: activeGoal.proteinRatio,
        fatRatio: activeGoal.fatRatio,
        carbRatio: activeGoal.carbRatio
      }
    };
  }
}

module.exports = {
  GoalService
};
