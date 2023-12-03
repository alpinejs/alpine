import { magic } from '../magics'
import { effect, release } from '../reactivity'

magic('watch', (el, { evaluateLater, cleanup }) => (key, callback) => {
    let evaluate = evaluateLater(key)

    let getter = () => {
        let value

        evaluate(i => value = i)

        return value
    }

    let unwatch = watch(getter, () => {

    })

    cleanup(unwatch)
})

