import { apiClient } from '../apiClient.js';
import { formToObject, setFormValues, withLoading } from './dom.js';

export function createGoalsModule({ store, onRefresh }) {
  const form = document.getElementById('goal-form');
  const recommendLose = document.getElementById('recommend-lose');
  const recommendMaintain = document.getElementById('recommend-maintain');
  const recommendGain = document.getElementById('recommend-gain');

  function normalize(payload) {
    return {
      goalType: payload.goalType,
      targetWeightKg: Number(payload.targetWeightKg),
      targetCalories: Number(payload.targetCalories),
      proteinRatio: Number(payload.proteinRatio),
      fatRatio: Number(payload.fatRatio),
      carbRatio: Number(payload.carbRatio)
    };
  }

  function fillFromState() {
    const goal = store.getState().goal;
    if (!goal) {
      return;
    }

    setFormValues(form, {
      goalType: goal.goalType,
      targetWeightKg: goal.targetWeightKg,
      targetCalories: goal.targetCalories,
      proteinRatio: goal.proteinRatio,
      fatRatio: goal.fatRatio,
      carbRatio: goal.carbRatio
    });
  }

  async function saveGoal() {
    const payload = normalize(formToObject(form));
    const saved = await apiClient.saveGoal(payload);
    store.setState({ goal: saved });
    await onRefresh();
  }

  async function loadRecommended(type) {
    const recommended = await apiClient.getRecommendedGoal(type);
    setFormValues(form, {
      goalType: recommended.goalType,
      targetWeightKg: recommended.targetWeightKg,
      targetCalories: recommended.targetCalories,
      proteinRatio: recommended.proteinRatio,
      fatRatio: recommended.fatRatio,
      carbRatio: recommended.carbRatio
    });
  }

  function bind() {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      withLoading(button, saveGoal).catch((error) => {
        alert(error.message);
      });
    });

    recommendLose.addEventListener('click', () => {
      withLoading(recommendLose, () => loadRecommended('lose')).catch((error) => alert(error.message));
    });

    recommendMaintain.addEventListener('click', () => {
      withLoading(recommendMaintain, () => loadRecommended('maintain')).catch((error) => alert(error.message));
    });

    recommendGain.addEventListener('click', () => {
      withLoading(recommendGain, () => loadRecommended('gain')).catch((error) => alert(error.message));
    });
  }

  return {
    bind,
    fillFromState
  };
}
