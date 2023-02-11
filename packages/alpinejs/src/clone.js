import { effect, release, overrideEffect } from "./reactivity"
import { initTree, isRoot } from "./lifecycle"
import { walk } from "./utils/walk"

export let isCloning = false

export function skipDuringClone(callback, fallback = () => {}) {
    return (...args) => isCloning ? fallback(...args) : callback(...args)
}

export function onlyDuringClone(callback) {
    return (...args) => isCloning && callback(...args)
}

export function interuptCrawl(callback) {
    return (...args) => isCloning || callback(...args)
}

export function clone(oldEl, newEl) {
    if (! newEl._x_dataStack) newEl._x_dataStack = oldEl._x_dataStack

    isCloning = true

    dontRegisterReactiveSideEffects(() => {
        cloneTree(newEl)
    })

    isCloning = false
}

export function cloneTree(el) {
    let hasRunThroughFirstEl = false

    let shallowWalker = (el, callback) => {
        walk(el, (el, skip) => {
            if (hasRunThroughFirstEl && isRoot(el)) return skip()

            hasRunThroughFirstEl = true

            callback(el, skip)
        })
    }

    initTree(el, shallowWalker)
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
