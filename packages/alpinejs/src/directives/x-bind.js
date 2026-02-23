import { directive, into, mapAttributes, prefix, startingWith } from '../directives'
import { evaluateLater } from '../evaluator'
import { mutateDom } from '../mutation'
import bind from '../utils/bind'
import { applyBindingsObject, injectBindingProviders } from '../binds'

mapAttributes(startingWith(':', into(prefix('bind:'))))

let handler = (el, directive, { effect, cleanup }) => {
    let { value, modifiers, expression, original } = directive

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

    let inlineBinding = directive._x_inlineBinding || cacheInlineBinding(el, value, expression)

    if (inlineBinding.extract) {
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

handler.inline = (el, directive) => {
    let { value, expression } = directive

    if (! value) return

    directive._x_inlineBinding = cacheInlineBinding(el, value, expression)
}

directive('bind', handler)

function storeKeyForXFor(el, expression) {
    el._x_keyExpression = expression
}

function cacheInlineBinding(el, value, expression) {
    if (! el._x_inlineBindings) el._x_inlineBindings = {}

    el._x_inlineBindings[value] = { expression, extract: false }

    return el._x_inlineBindings[value]
}
