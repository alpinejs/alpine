import { evaluateLater } from '../evaluator'
import { directive } from '../directives'
import { mutateDom } from '../mutation'
import { nextTick } from '../nextTick'
import bind, { safeParseBoolean } from '../utils/bind'
import on from '../utils/on'
import { warn } from '../utils/warn'
import { isCloning } from '../clone'

directive('model', (el, { modifiers, expression }, { effect, cleanup }) => {
    // Don't register x-model if it's already been registered on this element.
    // This happens when $model eagerly evaluates x-model inside x-data...
    if (el._x_model) return

    let scopeTarget = el

    if (modifiers.includes('parent')) scopeTarget = el.parentNode

    let [ getValue, setValue ] = generateGetAndSet(evaluateLater, scopeTarget, expression)

    // Allow programmatic overriding of x-model.
    el._x_model = { get() { return getValue() }, set(value) { setValue(value) } }

    initializeRadioInput(expression, el)

    let event = determineListenerEvent(el, modifiers)

    let removeListener = registerInputEventListener(el, event, modifiers, setValue, getValue)

    modifiers.includes('fill') && initializeFilledInput(el, event,getValue)

    // Register the listener removal callback on the element, so that
    // in addition to the cleanup function, x-modelable may call it.
    // Also, make this a keyed object if we decide to reintroduce
    // "named modelables" some time in a future Alpine version.
    if (! el._x_removeModelListeners) el._x_removeModelListeners = {}
    el._x_removeModelListeners['default'] = removeListener

    cleanup(() => el._x_removeModelListeners['default']())

    handleFormResets(el, cleanup)

    el._x_forceModelUpdate = (value) => {
        // If nested model key is undefined, set the default value to empty string.
        if (value === undefined && typeof expression === 'string' && expression.match(/\./)) value = ''

        // @todo: This is nasty
        window.fromModel = true
        mutateDom(() => bind(el, 'value', value))
        delete window.fromModel
    }

    effect(() => {
        // We need to make sure we're always "getting" the value up front,
        // so that we don't run into a situation where because of the early
        // the reactive value isn't gotten and therefore disables future reactions.
        let value = getValue()

        // Don't modify the value of the input if it's focused.
        if (modifiers.includes('unintrusive') && document.activeElement.isSameNode(el)) return

        el._x_forceModelUpdate(value)
    })
})

function initializeFilledInput(el, event, getValue) {
    if ([null, ''].includes(getValue())
        || (el.type === 'checkbox' && Array.isArray(getValue()))) {
            el.dispatchEvent(new Event(event, {}));
        }
}

function determineListenerEvent(el, modifiers) {
    // If the element we are binding to is a select, a radio, or checkbox
    // we'll listen for the change event instead of the "input" event.

    return (el.tagName.toLowerCase() === 'select')
        || ['checkbox', 'radio'].includes(el.type)
        || modifiers.includes('lazy')
        ? 'change' : 'input'
}

function registerInputEventListener(el, event, modifiers, setValue, getValue) {
    // We only want to register the event listener when we're not cloning, since the
    // mutation observer handles initializing the x-model directive already when
    // the element is inserted into the DOM. Otherwise we register it twice.
    let removeListener = isCloning ? () => { } : on(el, event, modifiers, (e) => {
        setValue(getInputValue(el, modifiers, e, getValue()))
    })

    return removeListener
}

function handleFormResets(el, cleanup) {
    // If the input/select/textarea element is linked to a form
    // we listen for the reset event on the parent form (the event
    // does not trigger on the single inputs) and update
    // on nextTick so the page doesn't end up out of sync
    if (el.form) {
        let removeResetListener = on(el.form, 'reset', [], (e) => {
            nextTick(() => el._x_model && el._x_model.set(el.value))
        })

        cleanup(() => removeResetListener())
    }
}

function initializeRadioInput(expression, el) {
    if (typeof expression === 'string' && el.type === 'radio') {
        // Radio buttons only work properly when they share a name attribute.
        // People might assume we take care of that for them, because
        // they already set a shared "x-model" attribute.
        mutateDom(() => {
            if (!el.hasAttribute('name')) el.setAttribute('name', expression)
        })
    }
}

function generateGetAndSet(evaluateLater, scopeTarget, expression) {
    let evaluateGet = evaluateLater(scopeTarget, expression)
    let evaluateSet

    if (typeof expression === 'string') {
        evaluateSet = evaluateLater(scopeTarget, `${expression} = __placeholder`)
    } else if (typeof expression === 'function' && typeof expression() === 'string') {
        evaluateSet = evaluateLater(scopeTarget, `${expression()} = __placeholder`)
    } else {
        evaluateSet = () => { }
    }

    let getResult = () => {
        let result

        evaluateGet(value => result = value)

        return result
    }

    let getValue = () => {
        let result = getResult()

        return isGetterSetter(result) ? result.get() : result
    }

    let setValue = value => {
        let result = getResult()

        if (isGetterSetter(result)) {
            result.set(value)
        } else {
            evaluateSet(() => { }, {
                scope: { '__placeholder': value }
            })
        }
    }

    return [ getValue, setValue ]
}

function getInputValue(el, modifiers, event, currentValue) {
    return mutateDom(() => {
        // Check for event.detail due to an issue where IE11 handles other events as a CustomEvent.
        // Safari autofill triggers event as CustomEvent and assigns value to target
        // so we return event.target.value instead of event.detail
        if (event instanceof CustomEvent && event.detail !== undefined)
            return event.detail !== null && event.detail !== undefined ? event.detail : event.target.value
        else if (el.type === 'checkbox') {
            // If the data we are binding to is an array, toggle its value inside the array.
            if (Array.isArray(currentValue)) {
                let newValue = null;

                if (modifiers.includes('number')) {
                    newValue = safeParseNumber(event.target.value)
                } else if (modifiers.includes('boolean')) {
                    newValue = safeParseBoolean(event.target.value)
                } else {
                    newValue = event.target.value
                }

                return event.target.checked ? currentValue.concat([newValue]) : currentValue.filter(el => ! checkedAttrLooseCompare(el, newValue))
            } else {
                return event.target.checked
            }
        } else if (el.tagName.toLowerCase() === 'select' && el.multiple) {
            if (modifiers.includes('number')) {
                return Array.from(event.target.selectedOptions).map(option => {
                    let rawValue = option.value || option.text
                    return safeParseNumber(rawValue)
                })
            } else if (modifiers.includes('boolean')) {
                return Array.from(event.target.selectedOptions).map(option => {
                    let rawValue = option.value || option.text
                    return safeParseBoolean(rawValue)
                })
            }

            return Array.from(event.target.selectedOptions).map(option => {
                return option.value || option.text
            })
        } else {
            if (modifiers.includes('number')) {
                return safeParseNumber(event.target.value)
            } else if (modifiers.includes('boolean')) {
                return safeParseBoolean(event.target.value)
            }

            return modifiers.includes('trim') ? event.target.value.trim() : event.target.value
        }
    })
}

function safeParseNumber(rawValue) {
    let number = rawValue ? parseFloat(rawValue) : null

    return isNumeric(number) ? number : rawValue
}

function checkedAttrLooseCompare(valueA, valueB) {
    return valueA == valueB
}

function isNumeric(subject){
    return ! Array.isArray(subject) && ! isNaN(subject)
}

function isGetterSetter(value) {
    return value !== null && typeof value === 'object' && typeof value.get === 'function' && typeof value.set === 'function'
}
