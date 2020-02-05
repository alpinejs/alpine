import { registerListener } from './on'

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
        if (event instanceof CustomEvent && event.detail) {
            return event.detail
        } else if (el.type === 'checkbox') {
            // If the data we are binding to is an array, toggle it's value inside the array.
            if (Array.isArray(currentValue)) {
                return event.target.checked ? currentValue.concat([event.target.value]) : currentValue.filter(i => i !== event.target.value)
            } else {
                return event.target.checked
            }
        } else if (el.tagName.toLowerCase() === 'select' && el.multiple) {
            return modifiers.includes('number')
                ? Array.from(event.target.selectedOptions).map(option => { return parseFloat(option.value || option.text) })
                : Array.from(event.target.selectedOptions).map(option => { return option.value || option.text })
        } else {
            return modifiers.includes('number')
                ? parseFloat(event.target.value)
                : (modifiers.includes('trim') ? event.target.value.trim() : event.target.value)
        }
    }
}
