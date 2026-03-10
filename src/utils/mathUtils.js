function round(value, precision = 2) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function sum(values) {
  return values.reduce((accumulator, value) => accumulator + toNumber(value), 0);
}

function average(values) {
  if (!values || values.length === 0) {
    return 0;
  }
  return sum(values) / values.length;
}

function percentage(part, total) {
  if (!total) {
    return 0;
  }
  return (part / total) * 100;
}

function signedDifference(current, target) {
  return round(current - target, 2);
}

function mapRange(value, inMin, inMax, outMin, outMax) {
  if (inMax === inMin) {
    return outMin;
  }
  const ratio = (value - inMin) / (inMax - inMin);
  return outMin + ratio * (outMax - outMin);
}

function calculateTrendSlope(points) {
  if (!points || points.length < 2) {
    return 0;
  }

  const n = points.length;
  const xMean = average(points.map((_, index) => index + 1));
  const yMean = average(points);

  let numerator = 0;
  let denominator = 0;

  points.forEach((y, index) => {
    const x = index + 1;
    numerator += (x - xMean) * (y - yMean);
    denominator += (x - xMean) ** 2;
  });

  if (denominator === 0) {
    return 0;
  }

  return numerator / denominator;
}

function formatSigned(value) {
  const normalized = toNumber(value, 0);
  if (normalized > 0) {
    return `+${round(normalized, 2)}`;
  }
  return String(round(normalized, 2));
}

function median(values) {
  if (!values || values.length === 0) {
    return 0;
  }

  const sorted = values.slice().sort((left, right) => left - right);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }

  return sorted[mid];
}

module.exports = {
  round,
  clamp,
  toNumber,
  sum,
  average,
  percentage,
  signedDifference,
  mapRange,
  calculateTrendSlope,
  formatSigned,
  median
};
