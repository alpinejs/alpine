import { magic } from '../magics'

magic('watch', (el, { evaluateLater, effect }) => (key, callback) => {
    let evaluate = evaluateLater(key)

    let firstTime = true

    let oldValue

    const deepClone = (obj) => {
        if (typeof obj !== 'object' || obj === null) {
            return obj; // Return primitives and null as is
        }

        const clone = Array.isArray(obj) ? [] : {};

        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'function') {
                    clone[key] = new Function('return ' + obj[key].toString())();
                } else {
                    clone[key] = deepClone(obj[key]);
                }
            }
        }

        return clone;
    }

    let effectReference = effect(() => evaluate(value => {
        // JSON.stringify touches every single property at any level enabling deep watching
        JSON.stringify(value)

        if (!firstTime) {
            // We have to queue this watcher as a microtask so that
            // the watcher doesn't pick up its own dependencies.
            const valueClone = deepClone(value)
            queueMicrotask(() => {
                callback(value, oldValue)

                oldValue = valueClone
            })
        } else {
            oldValue = deepClone(value)
        }

        firstTime = false
    }))

    // We want to remove this effect from the list of effects
    // stored on an element. Livewire uses that list to
    // "re-run" Alpine effects after a page load. A "watcher"
    // shuldn't be re-run like that. It will cause infinite loops.
    el._x_effects.delete(effectReference)
})
