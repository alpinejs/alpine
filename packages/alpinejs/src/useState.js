export function useState(initialState = '') {
    let state = Alpine.reactive({ value: initialState });

    const setState = (newValue) => {
        state.value = typeof newValue === 'function' ? newValue(state.value) : newValue;
    };

    return {
        get state() {
            return state.value;
        },
        setState
    };
}