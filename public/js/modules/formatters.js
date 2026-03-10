function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function fixed(value, precision = 1) {
  return toNumber(value).toFixed(precision);
}

export function calories(value) {
  return `${fixed(value, 0)} ккал`;
}

export function grams(value) {
  return `${fixed(value, 1)} г`;
}

export function signed(value, precision = 1) {
  const normalized = toNumber(value);
  const text = normalized.toFixed(precision);
  return normalized > 0 ? `+${text}` : text;
}

export function dateString(value) {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }
  return date.toLocaleDateString('uk-UA');
}

export function compactMealItem(meal) {
  return `${meal.foodName} (${grams(meal.grams)}): ${calories(meal.calories)} | Б:${fixed(meal.protein)} Ж:${fixed(meal.fat)} В:${fixed(meal.carbs)}`;
}

export function compactActivityItem(activity) {
  return `${activity.name} (${activity.durationMin} хв, ${activity.intensity}): ${calories(activity.caloriesBurned)}`;
}

export function compactWeightItem(weight) {
  return `${dateString(weight.date)}: ${fixed(weight.weightKg, 1)} кг`;
}

export function prettyJson(value) {
  return JSON.stringify(value, null, 2);
}

export function kpiRows(snapshot) {
  const consumed = snapshot?.consumed || {};
  const remaining = snapshot?.remaining || {};

  return [
    { label: 'Спожито', value: calories(consumed.calories || 0) },
    { label: 'Спалено', value: calories(snapshot?.burned || 0) },
    { label: 'Нетто', value: calories(snapshot?.netCalories || 0) },
    { label: 'Залишок', value: calories(remaining.calories || 0) },
    { label: 'Білки', value: grams(consumed.protein || 0) },
    { label: 'Жири', value: grams(consumed.fat || 0) },
    { label: 'Вуглеводи', value: grams(consumed.carbs || 0) }
  ];
}
