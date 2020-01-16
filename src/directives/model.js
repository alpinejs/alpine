import { registerListener } from './on'

export function registerModelListener(component, el, modifiers, expression) {
    // If the element we are binding to is a select, a radio, or checkbox
    // we'll listen for the change event instead of the "input" event.
    var event = (el.tagName.toLowerCase() === 'select')
        || ['checkbox', 'radio'].includes(el.type)
        || modifiers.includes('lazy')
        ? 'change' : 'input'

    const listenerExpression = modelListenerExpression(component, el, modifiers, expression)

    registerListener(component, el, event, modifiers, listenerExpression)
}

function modelListenerExpression(component, el, modifiers, dataKey) {
    var rightSideOfExpression = ''
    if (el.type === 'checkbox') {
        // If the data we are binding to is an array, toggle it's value inside the array.
        if (Array.isArray(component.$data[dataKey])) {
            rightSideOfExpression = `$event.target.checked ? ${dataKey}.concat([$event.target.value]) : ${dataKey}.filter(i => i !== $event.target.value)`
        } else {
            rightSideOfExpression = `$event.target.checked`
        }
    } else if (el.tagName.toLowerCase() === 'select' && el.multiple) {
        rightSideOfExpression = modifiers.includes('number')
            ? 'Array.from($event.target.selectedOptions).map(option => { return parseFloat(option.value || option.text) })'
            : 'Array.from($event.target.selectedOptions).map(option => { return option.value || option.text })'
    } else {
        rightSideOfExpression = modifiers.includes('number')
            ? 'parseFloat($event.target.value)'
            : (modifiers.includes('trim') ? '$event.target.value.trim()' : '$event.target.value')
    }

    if (el.type === 'radio') {
        // Radio buttons only work properly when they share a name attribute.
        // People might assume we take care of that for them, because
        // they already set a shared "x-model" attribute.
        if (! el.hasAttribute('name')) el.setAttribute('name', dataKey)
    }

    return `${dataKey} = ${rightSideOfExpression}`
}
