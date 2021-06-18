import { directive, directives, into, mapAttributes, prefix, startingWith } from '../directives'
import { evaluateLater } from '../evaluator'
import { mutateDom } from '../mutation'
import bind from '../utils/bind'

mapAttributes(startingWith(':', into(prefix('bind:'))))

directive('bind', (el, { value, modifiers, expression, original }, { effect }) => {
    if (! value) return applyBindingsObject(el, expression, original, effect)

    if (value === 'key') return storeKeyForXFor(el, expression)

    let evaluate = evaluateLater(el, expression)

    effect(() => evaluate(result => {
        // If nested object key is undefined, set the default value to empty string.
        if (result === undefined && expression.match(/\./)) result = ''

        mutateDom(() => bind(el, value, result, modifiers))
    }))
})

function applyBindingsObject(el, expression, original, effect) {
    let getBindings = evaluateLater(el, expression)

    let cleanupRunners = []

    effect(() => {
        while (cleanupRunners.length) cleanupRunners.pop()()

        getBindings(bindings => {
            let attributes = Object.entries(bindings).map(([name, value]) => ({ name, value }))

            directives(el, attributes, original).map(handle => {
                cleanupRunners.push(handle.runCleanups)

                handle()
            })
        })

    })
}

function storeKeyForXFor(el, expression) {
    el._x_keyExpression = expression
}
