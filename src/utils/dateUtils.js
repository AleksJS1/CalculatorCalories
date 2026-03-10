function getStartOfDay(date) {
  const input = new Date(date);
  return new Date(input.getFullYear(), input.getMonth(), input.getDate(), 0, 0, 0, 0);
}

function getEndOfDay(date) {
  const input = new Date(date);
  return new Date(input.getFullYear(), input.getMonth(), input.getDate(), 23, 59, 59, 999);
}

function toDateOnlyString(date) {
  const input = new Date(date);
  const year = input.getFullYear();
  const month = String(input.getMonth() + 1).padStart(2, '0');
  const day = String(input.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function shiftDate(date, days) {
  const input = new Date(date);
  const shifted = new Date(input);
  shifted.setDate(shifted.getDate() + days);
  return shifted;
}

function listDateRange(endDate, daysCount) {
  const dates = [];
  const end = getEndOfDay(endDate);
  for (let index = daysCount - 1; index >= 0; index -= 1) {
    const date = shiftDate(end, -index);
    dates.push(toDateOnlyString(date));
  }
  return dates;
}

function normalizeDateInput(dateInput) {
  if (!dateInput) {
    return new Date();
  }

  const parsed = new Date(dateInput);
  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }

  return parsed;
}

function safeDate(dateInput, fallback = new Date()) {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    return new Date(fallback);
  }
  return date;
}

function getWeekBounds(dateInput) {
  const current = normalizeDateInput(dateInput);
  const day = current.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = shiftDate(getStartOfDay(current), mondayOffset);
  const sunday = shiftDate(getEndOfDay(monday), 6);
  return { monday, sunday };
}

function getMonthBounds(dateInput) {
  const current = normalizeDateInput(dateInput);
  const start = new Date(current.getFullYear(), current.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(current.getFullYear(), current.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

function compareDateOnly(left, right) {
  const leftKey = toDateOnlyString(left);
  const rightKey = toDateOnlyString(right);
  if (leftKey > rightKey) {
    return 1;
  }
  if (leftKey < rightKey) {
    return -1;
  }
  return 0;
}

function enumerateDaysBetween(start, end) {
  const result = [];
  let cursor = getStartOfDay(start);
  const target = getEndOfDay(end);

  while (cursor <= target) {
    result.push(new Date(cursor));
    cursor = shiftDate(cursor, 1);
  }

  return result;
}

module.exports = {
  getStartOfDay,
  getEndOfDay,
  toDateOnlyString,
  shiftDate,
  listDateRange,
  normalizeDateInput,
  safeDate,
  getWeekBounds,
  getMonthBounds,
  compareDateOnly,
  enumerateDaysBetween
};
