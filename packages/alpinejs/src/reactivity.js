
import { scheduler, startTransaction as startTx, commitTransaction as commitTx } from './scheduler'

let reactive, effect, release, raw

let shouldSchedule = true
export function disableEffectScheduling(callback) {
    shouldSchedule = false

    callback()

    shouldSchedule = true
}

export function setReactivityEngine(engine) {
    reactive = engine.reactive
    release = engine.release
    effect = (callback) => engine.effect(callback, { scheduler: task => {
        if (shouldSchedule) {
            scheduler(task)
        } else {
            task()
        }
    } })
    raw = engine.raw
}

export function overrideEffect(override) { effect = override }

export function elementBoundEffect(el) {
    let cleanup = () => {}

    let wrappedEffect = (callback) => {
        let effectReference = effect(callback)

        if (! el._x_effects) {
            el._x_effects = new Set

            // Livewire depends on el._x_runEffects.
            el._x_runEffects = () => { el._x_effects.forEach(i => i()) }
        }

        el._x_effects.add(effectReference)

        cleanup = () => {
            if (effectReference === undefined) return

            el._x_effects.delete(effectReference)

            release(effectReference)
        }

        return effectReference
    }

    return [wrappedEffect, () => { cleanup() }]
}

export function watch(getter, callback) {
    let firstTime = true

    let oldValue
    let oldValueJSON

    let effectReference = effect(() => {
        let value = getter()

        // JSON.stringify touches every single property at any level enabling deep watching
        let newJSON = JSON.stringify(value)

        if (! firstTime) {
            // For objects, always fire (deep watching may have detected nested changes).
            // For primitives, only fire if value actually changed.
            if (typeof value === 'object' || value !== oldValue) {
                // We have to queue this watcher as a microtask so that
                // the watcher doesn't pick up its own dependencies.

                // For objects, parse the stored JSON snapshot to get a plain clone
                // of the previous state. Without this, oldValue and value are the
                // same reference and oldValue would reflect the already-mutated state.
                let previousValue = typeof oldValue === 'object'
                    ? JSON.parse(oldValueJSON)
                    : oldValue

                queueMicrotask(() => {
                    callback(value, previousValue)
                })
            }
        }

        oldValue = value
        oldValueJSON = newJSON

        firstTime = false
    })

    return () => release(effectReference)
}

export async function transaction(callback) {
    startTx()

    try {
        await callback()
        await Promise.resolve()  // Yield for mutation cleanup
    } finally {
        commitTx()
    }
}

export {
    release,
    reactive,
    effect,
    raw,
}
