const allowedSex = ['male', 'female'];
const allowedActivityLevel = ['sedentary', 'light', 'moderate', 'active', 'athlete'];

function required(value, fieldName) {
  if (value === null || value === undefined || value === '') {
    throw new Error(`Поле ${fieldName} є обов'язковим`);
  }
}

function numberRange(value, fieldName, min, max) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Поле ${fieldName} має бути числом`);
  }
  if (parsed < min || parsed > max) {
    throw new Error(`Поле ${fieldName} має бути в межах ${min}-${max}`);
  }
}

function inSet(value, fieldName, allowedValues) {
  if (!allowedValues.includes(value)) {
    throw new Error(`Поле ${fieldName} має одне з дозволених значень`);
  }
}

function validateProfilePayload(payload) {
  required(payload.name, 'name');
  numberRange(payload.age, 'age', 14, 100);
  numberRange(payload.heightCm, 'heightCm', 120, 240);
  numberRange(payload.weightKg, 'weightKg', 30, 350);
  inSet(payload.sex, 'sex', allowedSex);
  inSet(payload.activityLevel, 'activityLevel', allowedActivityLevel);
}

function validateGoalPayload(payload) {
  required(payload.goalType, 'goalType');
  numberRange(payload.targetWeightKg, 'targetWeightKg', 30, 350);
  numberRange(payload.targetCalories, 'targetCalories', 800, 5000);
  numberRange(payload.proteinRatio, 'proteinRatio', 0.1, 0.6);
  numberRange(payload.fatRatio, 'fatRatio', 0.1, 0.6);
  numberRange(payload.carbRatio, 'carbRatio', 0.1, 0.8);

  const ratioSum = Number(payload.proteinRatio) + Number(payload.fatRatio) + Number(payload.carbRatio);
  if (Math.abs(ratioSum - 1) > 0.02) {
    throw new Error('Сума ratio макронутрієнтів має дорівнювати приблизно 1');
  }
}

function validateMealPayload(payload) {
  required(payload.foodName, 'foodName');
  numberRange(payload.grams, 'grams', 1, 5000);
  numberRange(payload.calories, 'calories', 0, 5000);
  numberRange(payload.protein, 'protein', 0, 300);
  numberRange(payload.fat, 'fat', 0, 300);
  numberRange(payload.carbs, 'carbs', 0, 500);
}

function validateWeightPayload(payload) {
  numberRange(payload.weightKg, 'weightKg', 30, 350);
}

function validateActivityPayload(payload) {
  required(payload.name, 'name');
  numberRange(payload.durationMin, 'durationMin', 1, 720);
  numberRange(payload.caloriesBurned, 'caloriesBurned', 0, 4000);
}

module.exports = {
  allowedSex,
  allowedActivityLevel,
  validateProfilePayload,
  validateGoalPayload,
  validateMealPayload,
  validateWeightPayload,
  validateActivityPayload
};
