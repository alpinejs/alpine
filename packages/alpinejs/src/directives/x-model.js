import { evaluateLater } from '../evaluator'
import { directive } from '../directives'
import { mutateDom } from '../mutation'
import bind from '../utils/bind'
import on from '../utils/on'

directive('model', (el, { modifiers, expression }, { effect, cleanup }) => {
    let evaluate = evaluateLater(el, expression)
    let assignmentExpression = `${expression} = rightSideOfExpression($event, ${expression})`
    let evaluateAssignment = evaluateLater(el, assignmentExpression)

    // If the element we are binding to is a select, a radio, or checkbox
    // we'll listen for the change event instead of the "input" event.
    var event = (el.tagName.toLowerCase() === 'select')
        || ['checkbox', 'radio'].includes(el.type)
        || modifiers.includes('lazy')
            ? 'change' : 'input'

    let assigmentFunction = generateAssignmentFunction(el, modifiers, expression)

    let removeListener = on(el, event, modifiers, (e) => {
        evaluateAssignment(() => {}, { scope: {
            '$event': e,
            rightSideOfExpression: assigmentFunction
        }})
    })

    cleanup(() => removeListener())

    // Allow programmatic overiding of x-model.
    let evaluateSetModel = evaluateLater(el, `${expression} = __placeholder`)
    el._x_model = {
        get() { 
            let result
            evaluate(value => result = value)
            return result
        },
        set(value) {
            evaluateSetModel(() => {}, { scope: { '__placeholder': value }})
        },
    }

    el._x_forceModelUpdate = () => {
        evaluate(value => {
            // If nested model key is undefined, set the default value to empty string.
            if (value === undefined && expression.match(/\./)) value = ''

            // @todo: This is nasty
            window.fromModel = true
            mutateDom(() => bind(el, 'value', value))
            delete window.fromModel
        })
    }

    effect(() => {
        // Don't modify the value of the input if it's focused.
        if (modifiers.includes('unintrusive') && document.activeElement.isSameNode(el)) return

        el._x_forceModelUpdate()
    })
})

function generateAssignmentFunction(el, modifiers, expression) {
    if (el.type === 'radio') {
        // Radio buttons only work properly when they share a name attribute.
        // People might assume we take care of that for them, because
        // they already set a shared "x-model" attribute.
        mutateDom(() => {
            if (! el.hasAttribute('name')) el.setAttribute('name', expression)
        })
    }

    return (event, currentValue) => {
        return mutateDom(() => {
            // Check for event.detail due to an issue where IE11 handles other events as a CustomEvent.
            // Safari autofill triggers event as CustomEvent and assigns value to target 
            // so we return event.target.value instead of event.detail
            if (event instanceof CustomEvent && event.detail !== undefined) {
                return event.detail || event.target.value
            } else if (el.type === 'checkbox') {
                // If the data we are binding to is an array, toggle its value inside the array.
                if (Array.isArray(currentValue)) {
                    let newValue = modifiers.includes('number') ? safeParseNumber(event.target.value) : event.target.value

                    return event.target.checked ? currentValue.concat([newValue]) : currentValue.filter(el => ! checkedAttrLooseCompare(el, newValue))
                } else {
                    return event.target.checked
                }
            } else if (el.tagName.toLowerCase() === 'select' && el.multiple) {
                return modifiers.includes('number')
                    ? Array.from(event.target.selectedOptions).map(option => {
                        let rawValue = option.value || option.text
                        return safeParseNumber(rawValue)
                    })
                    : Array.from(event.target.selectedOptions).map(option => {
                        return option.value || option.text
                    })
            } else {
                let rawValue = event.target.value
                return modifiers.includes('number')
                    ? safeParseNumber(rawValue)
                    : (modifiers.includes('trim') ? rawValue.trim() : rawValue)
            }
        })
    }
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
