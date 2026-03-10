function getEnvValue(key, fallback) {
  const value = process.env[key];
  if (typeof value === 'undefined' || value === '') {
    return fallback;
  }
  return value;
}

function parseNumber(value, fallback) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return parsed;
}

const env = {
  port: parseNumber(getEnvValue('PORT', 3000), 3000),
  mongoUri: getEnvValue('MONGODB_URI', 'mongodb://127.0.0.1:27017/calorie_calculator'),
  timezone: getEnvValue('APP_TIMEZONE', 'Europe/Kyiv'),
  nodeEnv: getEnvValue('NODE_ENV', 'development')
};

function validateEnv() {
  const errors = [];
  if (!env.mongoUri || !env.mongoUri.startsWith('mongodb')) {
    errors.push('MONGODB_URI має бути валідним mongo URI');
  }
  if (!env.port || env.port <= 0) {
    errors.push('PORT має бути більше нуля');
  }
  if (errors.length > 0) {
    throw new Error(`Помилка змінних оточення: ${errors.join('; ')}`);
  }
}

module.exports = {
  env,
  validateEnv
};
