export function createReducer(initialState, handlers) {
  return (state = initialState, action) => {
    if (!handlers.hasOwnProperty(action.type)) return state;

    return handlers[action.type](state, action.payload);
  };
}

export function unique(array) {
  return [...new Set(array)];
}

export function omit(object, ...keys) {
  const newKeys = Object.keys(object).filter(key => !keys.includes(key));

  return newKeys.reduce((result, key) => ({
    ...result,
    [key]: object[key]
  }), {});
}
