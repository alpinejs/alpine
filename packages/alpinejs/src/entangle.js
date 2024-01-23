import { effect, release } from './reactivity'

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
        release(reference)
    }
}

function cloneIfObject(value) {
    return typeof value === 'object'
        ? JSON.parse(JSON.stringify(value))
        : value
}
