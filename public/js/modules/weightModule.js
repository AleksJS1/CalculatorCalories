import { apiClient } from '../apiClient.js';
import { clearElement, createDeleteButton, createElement, formToObject, todayInputValue, withLoading } from './dom.js';
import { compactWeightItem } from './formatters.js';

export function createWeightModule({ store, onRefresh }) {
  const form = document.getElementById('weight-form');
  const list = document.getElementById('weight-list');

  function render() {
    const points = store.getState().weightTrend?.points || [];
    clearElement(list);

    points
      .filter((point) => point.weightKg !== null)
      .forEach((point) => {
        const item = createElement('li');
        const text = createElement('span', {
          text: compactWeightItem({ date: point.date, weightKg: point.weightKg })
        });
        item.append(text);
        list.appendChild(item);
      });
  }

  async function submit() {
    const payload = formToObject(form);
    await apiClient.saveWeight({
      date: payload.date,
      weightKg: Number(payload.weightKg)
    });
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

    list.addEventListener('click', async (event) => {
      const button = event.target.closest('button[data-weight-id]');
      if (!button) {
        return;
      }

      await withLoading(button, async () => {
        await apiClient.deleteWeight(button.dataset.weightId);
        await onRefresh();
      }).catch((error) => {
        alert(error.message);
      });
    });
  }

  return {
    bind,
    render
  };
}
