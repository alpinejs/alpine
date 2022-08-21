import { magic } from '../magics'

magic('watch', (el, { evaluateLater, effect }) => (key, callback) => {
    if (!window.structuredClone) {
        console.warn('structuredClone not available on Window object. A polyfill is needed for full watch functionality.')
    }

    let evaluate = evaluateLater(key)

    let firstTime = true

    let oldValue

    const shallowClone = (obj) => {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }

        const copy = {};

        for (const key of Object.keys(obj)) {
            if (Array.isArray(obj[key])) {
                copy[key] = [];
                for (let i = 0; i < obj[key].length; ++i) {
                    const clonedObj = shallowClone(obj[key][i]);
                    copy[key][i] = clonedObj;
                }
            } else if (typeof obj[key] === 'object') {
                const clonedObj = shallowClone(obj[key]);
                copy[key] = clonedObj;
            } else {
                copy[key] = obj[key];
            }
        }

        return copy;
    };

    const cloneArray = (arr) => {
        const clonedArr = [];

        for (let i = 0; i < arr.length; ++i) {
            if (Array.isArray(arr[i])) {
                clonedArr.push(cloneArray(arr[i]));
            } else if (arr[i] === Object(arr[i])) {
                try {
                    clonedArr.push(structuredClone(arr[i]));
                } catch (dataCloneException) {
                    clonedArr.push(structuredClone(shallowClone(arr[i])));
                }
            } else {
                clonedArr.push(arr[i]);
            }
        }

        return clonedArr;
    };

    const cloneValue = (value) => {
        if (Array.isArray(value)) {
            return cloneArray(value);
        } else if (value === Object(value)) {
            try {
                return structuredClone(value);
            }
            catch (dataCloneException) {
                return structuredClone(shallowClone(value));
            }
        } else {
            return value;
        }
    };

    let effectReference = effect(() => evaluate(value => {
        if (!firstTime) {
            // We have to queue this watcher as a microtask so that
            // the watcher doesn't pick up its own dependencies.
            const valueClone = cloneValue(value);
            queueMicrotask(() => {
                callback(value, oldValue)

                oldValue = valueClone;
            })
        } else {
            oldValue = cloneValue(value);
        }

        firstTime = false
    }))

    // We want to remove this effect from the list of effects
    // stored on an element. Livewire uses that list to
    // "re-run" Alpine effects after a page load. A "watcher"
    // shuldn't be re-run like that. It will cause infinite loops.
    el._x_effects.delete(effectReference)
})
