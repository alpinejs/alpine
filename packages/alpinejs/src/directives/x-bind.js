import { directive, into, mapAttributes, prefix, startingWith } from '../directives'
import { evaluateLater } from '../evaluator'
import { mutateDom } from '../mutation'
import bind from '../utils/bind'
import { applyBindingsObject, injectBindingProviders } from '../binds'

mapAttributes(startingWith(':', into(prefix('bind:'))))

let handler = (el, { value, modifiers, expression, original }, { effect, cleanup }) => {
    if (! value) {
        let bindingProviders = {}
        injectBindingProviders(bindingProviders)

        let getBindings = evaluateLater(el, expression)

        getBindings(bindings => {
            applyBindingsObject(el, bindings, original)
        }, { scope: bindingProviders } )

        return
    }

    if (value === 'key') return storeKeyForXFor(el, expression)

    if (el._x_inlineBindings && el._x_inlineBindings[value] && el._x_inlineBindings[value].extract) {
        return
    }

    let evaluate = evaluateLater(el, expression)

    effect(() => evaluate(result => {
        // If nested object key is undefined, set the default value to empty string.
        if (result === undefined && typeof expression === 'string' && expression.match(/\./)) {
            result = ''
        }

        mutateDom(() => bind(el, value, result, modifiers))
    }))

    cleanup(() => {
        el._x_undoAddedClasses && el._x_undoAddedClasses()
        el._x_undoAddedStyles && el._x_undoAddedStyles()
    })
}

// @todo: see if I can take advantage of the object created here inside the
// non-inline handler above so we're not duplicating work twice...
handler.inline = (el, { value, modifiers, expression }) => {
    if (! value) return;

    if (! el._x_inlineBindings) el._x_inlineBindings = {}

    el._x_inlineBindings[value] = { expression, extract: false }
}

directive('bind', handler)

function storeKeyForXFor(el, expression) {
    el._x_keyExpression = expression
}
