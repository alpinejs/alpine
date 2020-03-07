import { arrayUnique , isBooleanAttr } from '../utils'

export function handleAttributeBindingDirective(component, el, attrName, expression, extraVars) {
    var value = component.evaluateReturnExpression(el, expression, extraVars)

    if (attrName === 'value') {
        // If nested model key is undefined, set the default value to empty string.
        if (value === undefined && expression.match(/\./).length) {
            value = ''
        }

        if (el.type === 'radio') {
            el.checked = el.value == value
        } else if (el.type === 'checkbox') {
            if (Array.isArray(value)) {
                // I'm purposely not using Array.includes here because it's
                // strict, and because of Numeric/String mis-casting, I
                // want the "includes" to be "fuzzy".
                let valueFound = false
                value.forEach(val => {
                    if (val == el.value) {
                        valueFound = true
                    }
                })

                el.checked = valueFound
            } else {
                el.checked = !! value
            }
            // If we are explicitly binding a string to the :value, set the string,
            // If the value is a boolean, leave it alone, it will be set to "on"
            // automatically.
            if (typeof value === 'string') {
                el.value = value
            }
        } else if (el.tagName === 'SELECT') {
            updateSelect(el, value)
        } else {
            el.value = value
        }
    } else if (attrName === 'class') {
        if (Array.isArray(value)) {
            const originalClasses = el.__x_original_classes || []
            el.setAttribute('class', arrayUnique(originalClasses.concat(value)).join(' '))
        } else if (typeof value === 'object') {
            Object.keys(value).forEach(classNames => {
                if (value[classNames]) {
                    classNames.split(' ').forEach(className => el.classList.add(className))
                } else {
                    classNames.split(' ').forEach(className => el.classList.remove(className))
                }
            })
        } else {
            const originalClasses = el.__x_original_classes || []
            const newClasses = value.split(' ')
            el.setAttribute('class', arrayUnique(originalClasses.concat(newClasses)).join(' '))
        }
    } else if (isBooleanAttr(attrName)) {
        // Boolean attributes have to be explicitly added and removed, not just set.
        if (!! value) {
            el.setAttribute(attrName, '')
        } else {
            el.removeAttribute(attrName)
        }
    } else {
        el.setAttribute(attrName, value)
    }
}

function updateSelect(el, value) {
    const arrayWrappedValue = [].concat(value).map(value => { return value + '' })

    Array.from(el.options).forEach(option => {
        option.selected = arrayWrappedValue.includes(option.value || option.text)
    })
}
