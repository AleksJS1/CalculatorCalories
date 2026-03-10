function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function createStore(initialState = {}) {
  let state = clone(initialState);
  const listeners = new Set();

  function getState() {
    return state;
  }

  function setState(partial) {
    state = {
      ...state,
      ...partial
    };
    listeners.forEach((listener) => listener(state));
  }

  function update(path, updater) {
    const segments = path.split('.');
    const nextState = clone(state);
    let cursor = nextState;

    for (let index = 0; index < segments.length - 1; index += 1) {
      const key = segments[index];
      if (typeof cursor[key] === 'undefined') {
        cursor[key] = {};
      }
      cursor = cursor[key];
    }

    const last = segments[segments.length - 1];
    cursor[last] = updater(cursor[last]);
    state = nextState;
    listeners.forEach((listener) => listener(state));
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function reset(next = {}) {
    state = clone(next);
    listeners.forEach((listener) => listener(state));
  }

  return {
    getState,
    setState,
    update,
    subscribe,
    reset
  };
}
