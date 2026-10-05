import { magic } from '../magics'
import { watch } from '../reactivity'
import { skipAutoEvaluate } from '../evaluator'

magic('watch', (el, { evaluateLater, cleanup }) => (key, callback) => {
    let evaluate = evaluateLater(key)

    let getter = () => {
        let value

        evaluate(i => value = i)

        return value
    }

    let unwatch = watch(getter, callback)

    cleanup(unwatch)

    // Only skipped while the expression calling $watch() runs, so x-init="$watch(...)"
    // doesn't stop watching right away, but @click="unwatch" still does...
    return skipAutoEvaluate(unwatch)
})
