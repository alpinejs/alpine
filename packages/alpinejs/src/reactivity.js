
import { scheduler } from './scheduler'

let reactive, effect, release, raw

export function setReactivityEngine(engine) {
    reactive = engine.reactive
    release = engine.release
    effect = (callback) => engine.effect(callback, { scheduler })
    raw = engine.raw
}

export function overrideEffect(override) { effect = override }

export function elementBoundEffect(el) {
    let cleanup = () => {}

    let wrappedEffect = (callback) => {
        let effectReference = effect(callback)

        if (! el._x_effects) {
            el._x_effects = new Set

            el._x_runEffects = () => { el._x_effects.forEach(i => i()) }
        }

        el._x_effects.add(effectReference)

        cleanup = () => {
            el._x_effects.delete(effectReference)

            release(effectReference)
        }
    }

    return [wrappedEffect, () => { cleanup() }]
}

export {
    release,
    reactive,
    effect,
    raw,
}
