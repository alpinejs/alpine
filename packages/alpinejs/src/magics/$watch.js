import { magic } from '../magics'

magic('watch', (el, { evaluateLater, effect }) => (key, callback) => {
    let evaluate = evaluateLater(key)

    let firstTime = true

    let oldValue

    let deepClone = (obj) => {
        return JSON.parse(JSON.stringify(obj))
    }

    let effectReference = effect(() => evaluate(value => {
        // JSON.stringify touches every single property at any level enabling deep watching...
        JSON.stringify(value)

        if (! firstTime) {
            // We have to clone the value so that the "old"
            // parameter doesn't hold the same reference...
            let clonedValue = deepClone(value)

            // We have to queue this watcher as a microtask so that
            // the watcher doesn't pick up its own dependencies...
            queueMicrotask(() => {
                callback(value, oldValue)

                oldValue = clonedValue
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
