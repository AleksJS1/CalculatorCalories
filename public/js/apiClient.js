const defaultHeaders = {
  'Content-Type': 'application/json'
};

function buildQuery(params = {}) {
  const entries = Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== '');
  if (entries.length === 0) {
    return '';
  }
  const search = new URLSearchParams();
  entries.forEach(([key, value]) => {
    search.set(key, String(value));
  });
  return `?${search.toString()}`;
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: defaultHeaders,
    ...options
  });

  const payload = await response.json().catch(() => ({
    success: false,
    message: 'Некоректна відповідь сервера'
  }));

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'Помилка API');
  }

  return payload.data;
}

export const apiClient = {
  getDashboard(date) {
    return request(`/api/dashboard${buildQuery({ date })}`);
  },

  getProfile() {
    return request('/api/profile');
  },

  saveProfile(payload) {
    return request('/api/profile', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  getRecommendedGoal(type) {
    return request(`/api/goals/recommended${buildQuery({ type })}`);
  },

  saveGoal(payload) {
    return request('/api/goals', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  getFoods(q = '') {
    return request(`/api/foods${buildQuery({ q })}`);
  },

  saveFood(payload) {
    return request('/api/foods', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  getMeals(date) {
    return request(`/api/meals${buildQuery({ date })}`);
  },

  saveMeal(payload) {
    return request('/api/meals', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  deleteMeal(id) {
    return request(`/api/meals/${id}`, {
      method: 'DELETE'
    });
  },

  getActivities(date) {
    return request(`/api/activities${buildQuery({ date })}`);
  },

  saveActivity(payload) {
    return request('/api/activities', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  deleteActivity(id) {
    return request(`/api/activities/${id}`, {
      method: 'DELETE'
    });
  },

  saveWeight(payload) {
    return request('/api/weights', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  deleteWeight(id) {
    return request(`/api/weights/${id}`, {
      method: 'DELETE'
    });
  },

  getWeightTrend(days = 14, endDate) {
    return request(`/api/weights/trend${buildQuery({ days, endDate })}`);
  }
};
