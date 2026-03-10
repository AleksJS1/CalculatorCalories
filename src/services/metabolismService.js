const { round, clamp } = require('../utils/mathUtils');

const activityMultiplierByLevel = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9
};

class MetabolismService {
  calculateBmr({ sex, age, heightCm, weightKg }) {
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
    if (sex === 'male') {
      return round(base + 5, 2);
    }
    return round(base - 161, 2);
  }

  getActivityMultiplier(activityLevel) {
    return activityMultiplierByLevel[activityLevel] || activityMultiplierByLevel.moderate;
  }

  calculateTdee(profile) {
    const bmr = this.calculateBmr(profile);
    const multiplier = this.getActivityMultiplier(profile.activityLevel);
    return round(bmr * multiplier, 2);
  }

  calculateTargetCalories(goalType, tdee) {
    if (goalType === 'lose') {
      return round(clamp(tdee - 450, 800, 5000), 0);
    }
    if (goalType === 'gain') {
      return round(clamp(tdee + 350, 800, 5000), 0);
    }
    return round(clamp(tdee, 800, 5000), 0);
  }

  calculateDailyWaterMl(weightKg, activityLevel) {
    const base = weightKg * 30;
    const bonus =
      activityLevel === 'athlete' ? 1000 : activityLevel === 'active' ? 700 : activityLevel === 'moderate' ? 450 : 250;
    return Math.round(base + bonus);
  }

  macroCaloriesToGrams(calories, proteinRatio, fatRatio, carbRatio) {
    const proteinCalories = calories * proteinRatio;
    const fatCalories = calories * fatRatio;
    const carbsCalories = calories * carbRatio;

    return {
      proteinGrams: round(proteinCalories / 4, 1),
      fatGrams: round(fatCalories / 9, 1),
      carbsGrams: round(carbsCalories / 4, 1)
    };
  }

  estimateWeightChangeKg(calorieDeltaPerDay, days = 7) {
    const caloriesPerKg = 7700;
    const totalDelta = calorieDeltaPerDay * days;
    return round(totalDelta / caloriesPerKg, 3);
  }

  evaluateDeficitLevel(calorieDelta) {
    if (calorieDelta >= 250) {
      return 'high-surplus';
    }
    if (calorieDelta > 50) {
      return 'light-surplus';
    }
    if (calorieDelta <= -550) {
      return 'aggressive-deficit';
    }
    if (calorieDelta < -200) {
      return 'moderate-deficit';
    }
    return 'maintenance-zone';
  }

  getGoalPaceAdvice(goalType, dailyDelta) {
    const estimatedPerWeek = this.estimateWeightChangeKg(dailyDelta, 7);

    if (goalType === 'lose') {
      if (estimatedPerWeek > -0.2) {
        return 'Дефіцит замалий для відчутного схуднення';
      }
      if (estimatedPerWeek < -1) {
        return 'Дефіцит зависокий, краще сповільнити темп';
      }
      return 'Темп схуднення в безпечному діапазоні';
    }

    if (goalType === 'gain') {
      if (estimatedPerWeek < 0.1) {
        return 'Профіцит замалий для стабільного набору';
      }
      if (estimatedPerWeek > 0.6) {
        return 'Профіцит зависокий, ризик набору жиру';
      }
      return 'Темп набору маси контрольований';
    }

    if (Math.abs(estimatedPerWeek) < 0.15) {
      return 'Калорійність відповідає підтримці ваги';
    }

    return 'Є відхилення від режиму підтримки';
  }
}

module.exports = {
  MetabolismService
};
