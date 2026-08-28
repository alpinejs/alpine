let deferredInits = new WeakMap()

export function getDeferredInit(el) {
    return deferredInits.get(el)
}

export function hasDeferredInit(el) {
    return deferredInits.has(el)
}

export function setDeferredInit(el, deferred) {
    deferredInits.set(el, deferred)
}

export function deleteDeferredInit(el) {
    deferredInits.delete(el)
}
