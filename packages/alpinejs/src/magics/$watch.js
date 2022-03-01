import { magic } from '../magics'

magic('watch', (el, { evaluateLater, effect }) => (key, callback) => {
    let evaluate = evaluateLater(key)

    let firstTime = true

    let oldValue

    effect(() => evaluate(value => {
        // JSON.stringify touches every single property at any level enabling deep watching
        JSON.stringify(value)

        if (! firstTime) {
            // We have to queue this watcher as a microtask so that
            // the watcher doesn't pick up its own dependencies.
            queueMicrotask(() => {
                callback(value, oldValue)

                oldValue = value
            })
        } else {
            oldValue = value
        }

        firstTime = false
    }))
})
