import { registerListener } from './on'
import { isNumeric, checkedAttrLooseCompare } from '../utils'

export function registerModelListener(component, el, modifiers, expression, extraVars) {
    // If the element we are binding to is a select, a radio, or checkbox
    // we'll listen for the change event instead of the "input" event.
    var event = (el.tagName.toLowerCase() === 'select')
        || ['checkbox', 'radio'].includes(el.type)
        || modifiers.includes('lazy')
        ? 'change' : 'input'

    const listenerExpression = `${expression} = rightSideOfExpression($event, ${expression})`

    registerListener(component, el, event, modifiers, listenerExpression, () => {
        return {
            ...extraVars(),
            rightSideOfExpression: generateModelAssignmentFunction(el, modifiers, expression),
        }
    })
}

function generateModelAssignmentFunction(el, modifiers, expression) {
    if (el.type === 'radio') {
        // Radio buttons only work properly when they share a name attribute.
        // People might assume we take care of that for them, because
        // they already set a shared "x-model" attribute.
        if (! el.hasAttribute('name')) el.setAttribute('name', expression)
    }

    return (event, currentValue) => {
        // Check for event.detail due to an issue where IE11 handles other events as a CustomEvent.
        if (event instanceof CustomEvent && event.detail) {
            return event.detail
        } else if (el.type === 'checkbox') {
            // If the data we are binding to is an array, toggle its value inside the array.
            if (Array.isArray(currentValue)) {
                const newValue = modifiers.includes('number') ? safeParseNumber(event.target.value) : event.target.value
                return event.target.checked ? currentValue.concat([newValue]) : currentValue.filter(el => !checkedAttrLooseCompare(el, newValue))
            } else {
                return event.target.checked
            }
        } else if (el.tagName.toLowerCase() === 'select' && el.multiple) {
            return modifiers.includes('number')
                ? Array.from(event.target.selectedOptions).map(option => {
                    const rawValue = option.value || option.text
                    return safeParseNumber(rawValue)
                })
                : Array.from(event.target.selectedOptions).map(option => {
                    return option.value || option.text
                })
        } else {
            const rawValue = event.target.value
            return modifiers.includes('number')
                ? safeParseNumber(rawValue)
                : (modifiers.includes('trim') ? rawValue.trim() : rawValue)
        }
    }
}

function safeParseNumber(rawValue) {
    const number = rawValue ? parseFloat(rawValue) : null
    return isNumeric(number) ? number : rawValue
}
