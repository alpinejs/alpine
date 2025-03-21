import { magic } from '../magics.js'
import { watch } from '../reactivity.js'

magic('watch', (el, { evaluateLater, cleanup }) => (key, callback) => {
    let evaluate = evaluateLater(key)

    let getter = () => {
        let value

        evaluate(i => value = i)

        return value
    }

    let unwatch = watch(getter, callback)

    cleanup(unwatch)
})
