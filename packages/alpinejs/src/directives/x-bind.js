import { directive, into, mapAttributes, prefix, startingWith } from '../directives'
import { evaluateLater } from '../evaluator'
import { mutateDom } from '../mutation'
import bind from '../utils/bind'
import { applyBindingsObject, injectBindingProviders } from '../binds'

mapAttributes(startingWith(':', into(prefix('bind:'))))

directive('bind', (el, { value, modifiers, expression, original }, { effect }) => {
    if (! value) {
        let bindingProviders = {}
        injectBindingProviders(bindingProviders)

        let getBindings = evaluateLater(el, expression)

        el._x_bindExpression = expression;

        getBindings(bindings => {
            applyBindingsObject(el, bindings, original)
        }, { scope: bindingProviders } )

        return
    }

    if (value === 'key') return storeKeyForXFor(el, expression)

    let evaluate = evaluateLater(el, expression)

    effect(() => evaluate(result => {
        // If nested object key is undefined, set the default value to empty string.
        if (result === undefined && expression.match(/\./)) result = ''

        mutateDom(() => bind(el, value, result, modifiers))
    }))
})


function storeKeyForXFor(el, expression) {
    el._x_keyExpression = expression
}