import { apiClient } from './apiClient.js';
import { createStore } from './stateStore.js';
import { createProfileModule } from './modules/profileModule.js';
import { createGoalsModule } from './modules/goalsModule.js';
import { createMealsModule } from './modules/mealsModule.js';
import { createActivitiesModule } from './modules/activitiesModule.js';
import { createWeightModule } from './modules/weightModule.js';
import { createDashboardModule } from './modules/dashboardModule.js';
import { createThemeModule } from './modules/themeModule.js';

function readInitialData() {
  const node = document.getElementById('initial-data');
  if (!node || !node.textContent) {
    return {};
  }

  try {
    return JSON.parse(node.textContent);
  } catch (error) {
    return {};
  }
}

const initial = readInitialData();

const store = createStore({
  overview: initial.overview || null,
  snapshot: initial.overview?.snapshot || null,
  weeklySeries: initial.overview?.weeklySeries || [],
  weightTrend: initial.overview?.weightTrend || { points: [] },
  profile: initial.profile || null,
  goal: initial.goal || null,
  foods: initial.foods || [],
  meals: initial.overview?.snapshot?.meals || [],
  activities: []
});

async function refreshAll() {
  const now = new Date().toISOString().slice(0, 10);
  const [dashboard, meals, activities, foods, profile] = await Promise.all([
    apiClient.getDashboard(now),
    apiClient.getMeals(now),
    apiClient.getActivities(now),
    apiClient.getFoods(''),
    apiClient.getProfile()
  ]);

  store.setState({
    overview: dashboard,
    snapshot: dashboard.snapshot,
    weeklySeries: dashboard.weeklySeries,
    weightTrend: dashboard.weightTrend,
    goal: dashboard.activeGoal,
    foods,
    profile,
    meals,
    activities
  });
}

const dashboardModule = createDashboardModule({ store });
const profileModule = createProfileModule({
  store,
  onRefresh: refreshAll
});
const goalsModule = createGoalsModule({
  store,
  onRefresh: refreshAll
});
const mealsModule = createMealsModule({
  store,
  onRefresh: refreshAll
});
const activitiesModule = createActivitiesModule({
  store,
  onRefresh: refreshAll
});
const weightModule = createWeightModule({
  store,
  onRefresh: refreshAll
});
const themeModule = createThemeModule();

function renderAll() {
  profileModule.fillFromState();
  goalsModule.fillFromState();
  mealsModule.fillFoods();
  mealsModule.render();
  activitiesModule.render();
  weightModule.render();
  dashboardModule.render();
}

function bindAll() {
  themeModule.bind();
  profileModule.bind();
  goalsModule.bind();
  mealsModule.bind();
  activitiesModule.bind();
  weightModule.bind();
}

store.subscribe(() => {
  renderAll();
});

async function bootstrap() {
  bindAll();
  renderAll();

  try {
    await refreshAll();
  } catch (error) {
    alert(error.message);
  }
}

bootstrap();
