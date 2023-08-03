import { effect, release, overrideEffect } from "./reactivity"
import { initTree } from "./lifecycle"

export let isCloning = false

export function skipDuringClone(callback, fallback = () => {}) {
    return (...args) => isCloning ? fallback(...args) : callback(...args)
}

export function onlyDuringClone(callback) {
    return (...args) => isCloning && callback(...args)
}

export function clone(from, to)
{
    // Transfer over existing runtime Alpine state from
    // the existing dom tree over to the new one...
    if (from._x_dataStack) {
        to._x_dataStack = from._x_dataStack

        // Set a flag to signify the new tree is using
        // pre-seeded state (used so x-data knows when
        // and when not to initialize state)...
        to.setAttribute('data-has-alpine-state', true)
    }

    isCloning = true

    // We don't need reactive effects in the new tree.
    // Cloning is just used to seed new server HTML with
    // Alpine before "morphing" it onto live Alpine...
    dontRegisterReactiveSideEffects(() => {
        initTree(to, (el, callback) => {
            // We're hijacking the "walker" so that we
            // only initialize the element we're cloning...
            callback(el, () => {})
        })
    })

    isCloning = false
}

function dontRegisterReactiveSideEffects(callback) {
    let cache = effect

    overrideEffect((callback, el) => {
        let storedEffect = cache(callback)

        release(storedEffect)

        return () => {}
    })

    callback()

    overrideEffect(cache)
}

// If we are cloning a tree, we only want to evaluate x-data if another
// x-data context DOESN'T exist on the component.
// The reason a data context WOULD exist is that we graft root x-data state over
// from the live tree before hydrating the clone tree.
export function shouldSkipRegisteringDataDuringClone(el) {
    if (! isCloning) return false

    return el.hasAttribute('data-has-alpine-state')
}

