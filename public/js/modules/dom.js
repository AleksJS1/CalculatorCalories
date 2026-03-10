export function qs(selector, root = document) {
  return root.querySelector(selector);
}

export function qsa(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}

export function createElement(tag, options = {}) {
  const element = document.createElement(tag);

  if (options.className) {
    element.className = options.className;
  }

  if (options.text) {
    element.textContent = options.text;
  }

  if (options.html) {
    element.innerHTML = options.html;
  }

  if (options.attrs) {
    Object.entries(options.attrs).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  return element;
}

export function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function formToObject(form) {
  const data = new FormData(form);
  const result = {};
  data.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

export function setFormValues(form, values = {}) {
  Object.entries(values).forEach(([key, value]) => {
    const field = form.elements.namedItem(key);
    if (!field) {
      return;
    }

    if (field.type === 'checkbox') {
      field.checked = Boolean(value);
      return;
    }

    field.value = value ?? '';
  });
}

export function createDeleteButton(onClick) {
  const button = createElement('button', { text: 'Видалити' });
  button.type = 'button';
  button.addEventListener('click', onClick);
  return button;
}

export function createInfoCell(label, value) {
  const wrapper = createElement('div', { className: 'kpi-item' });
  const title = createElement('strong', { text: label });
  const text = createElement('div', { text: String(value) });
  wrapper.append(title, text);
  return wrapper;
}

export function appendOptions(select, options, { valueKey = '_id', labelKey = 'name' } = {}) {
  clearElement(select);

  options.forEach((optionItem) => {
    const option = document.createElement('option');
    option.value = optionItem[valueKey];
    option.textContent = optionItem[labelKey];
    select.appendChild(option);
  });
}

export function withLoading(button, callback) {
  const original = button.textContent;
  button.disabled = true;
  button.textContent = 'Завантаження...';

  return Promise.resolve()
    .then(callback)
    .finally(() => {
      button.disabled = false;
      button.textContent = original;
    });
}

export function todayInputValue() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
