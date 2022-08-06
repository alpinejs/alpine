import { magic } from '../magics'

magic('watch', (el, { evaluateLater, effect }) => (key, callback) => {
    let evaluate = evaluateLater(key)

    let firstTime = true

    let oldValue

    const cloneArray = (arr) => {
        const clonedArr = [];

        for (let i = 0; i < arr.length; ++i) {
            if (Array.isArray(arr[i])) {
                clonedArr.push(cloneArray(arr[i]));
            } else if (arr[i] === Object(arr[i])) {
                clonedArr.push(structuredClone({ ...arr[i] }));
            } else {
                clonedArr.push(arr[i]);
            }
        }

        return clonedArr;
    };

    let effectReference = effect(() => evaluate(value => {
        // JSON.stringify touches every single property at any level enabling deep watching
        JSON.stringify(value)

        if (!firstTime) {
            // We have to queue this watcher as a microtask so that
            // the watcher doesn't pick up its own dependencies.
            queueMicrotask(() => {
                callback(value, oldValue)

                if (Array.isArray(value)) {
                    oldValue = cloneArray(value);
                } else if (value === Object(value)) {
                    oldValue = structuredClone({ ...value });
                } else {
                    oldValue = value
                }
            })
        } else {
            if (Array.isArray(value)) {
                oldValue = cloneArray(value);
            } else if (value === Object(value)) {
                oldValue = structuredClone({ ...value });
            } else {
                oldValue = value
            }
        }

        firstTime = false
    }))

    // We want to remove this effect from the list of effects
    // stored on an element. Livewire uses that list to
    // "re-run" Alpine effects after a page load. A "watcher"
    // shuldn't be re-run like that. It will cause infinite loops.
    el._x_effects.delete(effectReference)
})
