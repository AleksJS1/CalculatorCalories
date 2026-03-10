import { apiClient } from '../apiClient.js';
import { appendOptions, clearElement, createDeleteButton, createElement, formToObject, todayInputValue, withLoading } from './dom.js';
import { compactMealItem } from './formatters.js';

export function createMealsModule({ store, onRefresh }) {
  const form = document.getElementById('meal-form');
  const list = document.getElementById('meal-list');
  const foodSelect = document.getElementById('meal-food-select');

  function normalize(payload) {
    return {
      date: payload.date,
      mealType: payload.mealType,
      foodId: payload.foodId,
      grams: Number(payload.grams)
    };
  }

  function fillFoods() {
    const foods = store.getState().foods || [];
    appendOptions(foodSelect, foods, { valueKey: '_id', labelKey: 'name' });
  }

  function render() {
    const meals = store.getState().meals || [];
    clearElement(list);

    meals.forEach((meal) => {
      const item = createElement('li');
      const text = createElement('span', {
        text: compactMealItem(meal)
      });
      const remove = createDeleteButton(async () => {
        await apiClient.deleteMeal(meal._id);
        await onRefresh();
      });
      item.append(text, remove);
      list.appendChild(item);
    });
  }

  async function submit() {
    const payload = normalize(formToObject(form));
    await apiClient.saveMeal(payload);
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
    render,
    fillFoods
  };
}
