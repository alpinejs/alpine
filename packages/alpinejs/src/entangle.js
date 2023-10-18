import { effect, release } from './reactivity'

export function entangle({ get: outerGet, set: outerSet }, { get: innerGet, set: innerSet }) {
    let firstRun = true
    let outerHash

    let reference = effect(() => {
        const outer = outerGet()
        const inner = innerGet()
        if (firstRun) {
            innerSet(cloneIfObject(outer))
            firstRun = false
            outerHash = JSON.stringify(outer)
        } else {
            const outerHashLatest = JSON.stringify(outer)

            if (outerHashLatest !== outerHash) { // If outer changed...
                innerSet(cloneIfObject(outer))
                outerHash = outerHashLatest
            } else { // If inner changed...
                outerSet(cloneIfObject(inner))
                outerHash = JSON.stringify(inner)
            }
        }
        JSON.stringify(innerGet())
        JSON.stringify(outerGet())
    })

    return () => {
        release(reference)
    }
}

function cloneIfObject(value) {
    return typeof value === 'object'
        ? JSON.parse(JSON.stringify(value))
        : value
}
