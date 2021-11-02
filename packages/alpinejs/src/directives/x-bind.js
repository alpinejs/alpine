import { attributesOnly, directive, directives, into, mapAttributes, prefix, startingWith } from '../directives'
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

            // Ignore nested objects in bindings, as they are generally used for
            // namespaced sub-bindings like: "Dropdown.Button".
            attributes = attributes.filter((attr) => {
                return ! (typeof attr.value === 'object' && ! Array.isArray(attr.value) && attr.value !== null)
            })

            let staticAttributes = attributesOnly(attributes)
            
            // Handle binding normal HTML attributes (non-Alpine directives).
            attributes = attributes.map(attribute => {
                if (staticAttributes.find(attr => attr.name === attribute.name)) {
                    return {
                        name: `x-bind:${attribute.name}`,
                        value: `"${attribute.value}"`,
                    }
                }

                return attribute
            })

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
