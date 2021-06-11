import { directive, into, mapAttributes, prefix, startingWith } from '../directives'
import { evaluateLater } from '../evaluator'
import { skipDuringClone } from '../clone'
import on from '../utils/on'

mapAttributes(startingWith('@', into(prefix('on:'))))

directive('on', skipDuringClone((el, { value, modifiers, expression }, { cleanup }) => {
    let evaluate = expression ? evaluateLater(el, expression) : () => {}

    let removeListener = on(el, value, modifiers, e => {
        evaluate(() => {}, { scope: { '$event': e }, params: [e] })
    })

    cleanup(() => removeListener())
}))
