import { magic } from '../magics'
import { watch } from '../reactivity'

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
