import { apiClient } from '../apiClient.js';
import { formToObject, setFormValues, withLoading } from './dom.js';

export function createProfileModule({ store, onRefresh }) {
  const form = document.getElementById('profile-form');

  function normalize(payload) {
    return {
      name: payload.name,
      age: Number(payload.age),
      sex: payload.sex,
      heightCm: Number(payload.heightCm),
      weightKg: Number(payload.weightKg),
      activityLevel: payload.activityLevel,
      date: payload.date || new Date().toISOString().slice(0, 10)
    };
  }

  function fillFromState() {
    const profile = store.getState().profile;
    if (!profile) {
      return;
    }

    setFormValues(form, {
      name: profile.name,
      age: profile.age,
      sex: profile.sex,
      heightCm: profile.heightCm,
      weightKg: profile.weightKg,
      activityLevel: profile.activityLevel
    });
  }

  async function submit() {
    const payload = normalize(formToObject(form));
    const saved = await apiClient.saveProfile(payload);
    store.setState({ profile: saved });
    await onRefresh();
  }

  function bind() {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const submitButton = form.querySelector('button[type="submit"]');
      withLoading(submitButton, submit).catch((error) => {
        alert(error.message);
      });
    });
  }

  return {
    bind,
    fillFromState
  };
}
