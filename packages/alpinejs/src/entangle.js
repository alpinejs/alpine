import { effect, release } from './reactivity'
import { dequeueJob } from './scheduler'

export function entangle({ get: outerGet, set: outerSet }, { get: innerGet, set: innerSet }) {
    let firstRun = true
    let outerHash
    let innerHash

    let reference = effect(() => {
        let outer = outerGet()
        let inner = innerGet()

        if (firstRun) {
            innerSet(cloneIfObject(outer))
            firstRun = false
        } else {
            let outerHashLatest = JSON.stringify(outer)
            let innerHashLatest = JSON.stringify(inner)

            if (outerHashLatest !== outerHash) { // If outer changed...
                innerSet(cloneIfObject(outer))
            } else if (outerHashLatest !== innerHashLatest) { // If inner changed...
                outerSet(cloneIfObject(inner))
            } else { // If nothing changed...
                // Prevent an infinite loop...
            }
        }

        outerHash = JSON.stringify(outerGet())
        innerHash = JSON.stringify(innerGet())
    })

    return () => {
        // This effect isn't tracked in an element's _x_effects, so cleanupElement()
        // never dequeues it automatically.
        dequeueJob(reference)

        release(reference)
    }
}

function cloneIfObject(value) {
    return typeof value === 'object'
        ? JSON.parse(JSON.stringify(value))
        : value
}
