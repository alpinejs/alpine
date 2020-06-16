import { arrayUnique, isBooleanAttr, convertClassStringToArray } from '../utils'

export function handleAttributeBindingDirective(component, el, attrName, expression, extraVars, attrType) {
    var value = component.evaluateReturnExpression(el, expression, extraVars)

    if (attrName === 'value') {
        // If nested model key is undefined, set the default value to empty string.
        if (value === undefined && expression.match(/\./).length) {
            value = ''
        }

        if (el.type === 'radio') {
            // Set radio value from x-bind:value, if no "value" attribute exists.
            // If there are any initial state values, radio will have a correct
            // "checked" value since x-bind:value is processed before x-model.
            if (el.attributes.value === undefined && attrType === 'bind') {
                el.value = value
            } else if (attrType !== 'bind') {
                el.checked = el.value == value
            }
        } else if (el.type === 'checkbox') {
            // If we are explicitly binding a string to the :value, set the string,
            // If the value is a boolean, leave it alone, it will be set to "on"
            // automatically.
            if (typeof value === 'string' && attrType === 'bind') {
                el.value = value
            } else if (attrType !== 'bind') {
               if (Array.isArray(value)) {
                // I'm purposely not using Array.includes here because it's
                // strict, and because of Numeric/String mis-casting, I
                // want the "includes" to be "fuzzy".
                el.checked = value.some(val => val == el.value)
              } else {
                el.checked = !! value
              }
            }
        } else if (el.tagName === 'SELECT') {
            updateSelect(el, value)
        } else {
            if (el.value === value) return

            el.value = value
        }
    } else if (attrName === 'class') {
        if (Array.isArray(value)) {
            const originalClasses = el.__x_original_classes || []
            el.setAttribute('class', arrayUnique(originalClasses.concat(value)).join(' '))
        } else if (typeof value === 'object') {
            // Sorting the keys / class names by their boolean value will ensure that
            // anything that evaluates to `false` and needs to remove classes is run first.
            const keysSortedByBooleanValue = Object.keys(value).sort((a, b) => value[a] - value[b]);

            keysSortedByBooleanValue.forEach(classNames => {
                if (value[classNames]) {
                    convertClassStringToArray(classNames).forEach(className => el.classList.add(className))
                } else {
                    convertClassStringToArray(classNames).forEach(className => el.classList.remove(className))
                }
            })
        } else {
            const originalClasses = el.__x_original_classes || []
            const newClasses = convertClassStringToArray(value)
            el.setAttribute('class', arrayUnique(originalClasses.concat(newClasses)).join(' '))
        }
    } else {
        // If an attribute's bound value is null, undefined or false, remove the attribute
        if ([null, undefined, false].includes(value)) {
            el.removeAttribute(attrName)
        } else {
            isBooleanAttr(attrName) ? setIfChanged(el, attrName, attrName) : setIfChanged(el, attrName, value)
        }
    }
}

function setIfChanged(el, attrName, value) {
    if (el.getAttribute(attrName) != value){
        el.setAttribute(attrName, value)
    }
}

function updateSelect(el, value) {
    const arrayWrappedValue = [].concat(value).map(value => { return value + '' })

    Array.from(el.options).forEach(option => {
        option.selected = arrayWrappedValue.includes(option.value || option.text)
    })
}
