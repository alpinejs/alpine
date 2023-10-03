import { effect, release } from './reactivity'

export function entangle({ get: outerGet, set: outerSet }, { get: innerGet, set: innerSet }) {
    let firstRun = true
    let outerHash

    let reference = effect(() => {
        const outer = outerGet()
        const inner = innerGet()
        if (firstRun) {
            innerSet(outer)
            firstRun = false
        } else {
            const outerHashLatest = JSON.stringify(outer)

            if (outerHashLatest !== outerHash) { // If outer changed...
                innerSet(outer)
                outerHash = outerHashLatest
            } else { // If inner changed...
                outerSet(inner)
                outerHash = JSON.stringify(inner)
            }
        }
    })

    return () => {
        release(reference)
    }
}
