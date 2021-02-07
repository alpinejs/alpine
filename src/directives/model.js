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
                const newValue = parseModifiers(modifiers,event.target.value)
                return event.target.checked ? currentValue.concat([newValue]) : currentValue.filter(el => !checkedAttrLooseCompare(el, newValue))
            } else {
                return event.target.checked
            }
        } else if (el.tagName.toLowerCase() === 'select' && el.multiple) {
            return parseModifiers(modifiers,Array.from(event.target.selectedOptions))
        } else {
            return parseModifiers(modifiers,event.target.value)
        }
    }
}

// suggest: A global API for model modifiers (class)
const ModelModifiersAPI = {
    number(value) {
        const number = value ? parseFloat(value) : null;
        return isNumeric(number) ? number : value;
    },
    trim(value) {
        return value ? value.trim() : value;
    },
    reverse(value) {
        return value ? value.split('').reverse().join('') : value;
    },
    addModifier(modifierName, callback) {
        // add custom modifier to API
    },
};

function parseModifiers(modifiers, value) {
    if (Array.isArray(value)) {
        return Array.from(value).map((option) => {
            let rawValue = option.value || option.text;
            modifiers.map((modifier) => {
                if (ModelModifiersAPI.hasOwnProperty(modifier)) { // we may skip this condition in API class using magic methods
                    rawValue = ModelModifiersAPI[modifier](rawValue);
                }
            });
            return rawValue;
        });
    }
    modifiers.map((modifier) => {
        if (ModelModifiersAPI.hasOwnProperty(modifier)) {
            value = ModelModifiersAPI[modifier](value);
        }
    });
    return value;
}
