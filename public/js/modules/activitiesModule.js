import { apiClient } from '../apiClient.js';
import { clearElement, createDeleteButton, createElement, formToObject, todayInputValue, withLoading } from './dom.js';
import { compactActivityItem } from './formatters.js';

export function createActivitiesModule({ store, onRefresh }) {
  const form = document.getElementById('activity-form');
  const list = document.getElementById('activity-list');

  function normalize(payload) {
    return {
      date: payload.date,
      name: payload.name,
      intensity: payload.intensity,
      durationMin: Number(payload.durationMin),
      userWeightKg: payload.userWeightKg ? Number(payload.userWeightKg) : undefined
    };
  }

  function render() {
    const activities = store.getState().activities || [];
    clearElement(list);

    activities.forEach((activity) => {
      const item = createElement('li');
      const text = createElement('span', {
        text: compactActivityItem(activity)
      });
      const remove = createDeleteButton(async () => {
        await apiClient.deleteActivity(activity._id);
        await onRefresh();
      });
      item.append(text, remove);
      list.appendChild(item);
    });
  }

  async function submit() {
    const payload = normalize(formToObject(form));
    await apiClient.saveActivity(payload);
    form.reset();
    form.elements.namedItem('date').value = todayInputValue();
    await onRefresh();
  }

  function bind() {
    form.elements.namedItem('date').value = todayInputValue();

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      withLoading(button, submit).catch((error) => {
        alert(error.message);
      });
    });
  }

  return {
    bind,
    render
  };
}
