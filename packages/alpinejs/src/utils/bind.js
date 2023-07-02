import { dontAutoEvaluateFunctions, evaluate } from '../evaluator'
import { reactive } from '../reactivity'
import { setClasses } from './classes'
import { setStyles } from './styles'

export default function bind(el, name, value, modifiers = []) {
    // Register bound data as pure observable data for other APIs to use.
    if (! el._x_bindings) el._x_bindings = reactive({})

    el._x_bindings[name] = value

    name = modifiers.includes('camel') ? camelCase(name) : name

    switch (name) {
        case 'value':
            bindInputValue(el, value)
            break;

        case 'style':
            bindStyles(el, value)
            break;

        case 'class':
            bindClasses(el, value)
            break;

        // 'selected' and 'checked' are special attributes that aren't necessarily
        // synced with their corresponding properties when updated, so both the
        // attribute and property need to be updated when bound.
        case 'selected':
        case 'checked':
            bindAttributeAndProperty(el, name, value)
            break;

        default:
            bindAttribute(el, name, value)
            break;
    }
}

function bindInputValue(el, value) {
    if (el.type === 'radio') {
        // Set radio value from x-bind:value, if no "value" attribute exists.
        // If there are any initial state values, radio will have a correct
        // "checked" value since x-bind:value is processed before x-model.
        if (el.attributes.value === undefined) {
            el.value = value
        }

        // @todo: yuck
        if (window.fromModel) {
            el.checked = checkedAttrLooseCompare(el.value, value)
        }
    } else if (el.type === 'checkbox') {
        // If we are explicitly binding a string to the :value, set the string,
        // If the value is a boolean/array/number/null/undefined, leave it alone, it will be set to "on"
        // automatically.
        if (Number.isInteger(value)) {
            el.value = value
        } else if (! Number.isInteger(value) && ! Array.isArray(value) && typeof value !== 'boolean' && ! [null, undefined].includes(value)) {
            el.value = String(value)
        } else {
            if (Array.isArray(value)) {
                el.checked = value.some(val => checkedAttrLooseCompare(val, el.value))
            } else {
                el.checked = !!value
            }
        }
    } else if (el.tagName === 'SELECT') {
        updateSelect(el, value)
    } else {
        if (el.value === value) return

        el.value = value
    }
}

function bindClasses(el, value) {
    if (el._x_undoAddedClasses) el._x_undoAddedClasses()

    el._x_undoAddedClasses = setClasses(el, value)
}

function bindStyles(el, value) {
    if (el._x_undoAddedStyles) el._x_undoAddedStyles()

    el._x_undoAddedStyles = setStyles(el, value)
}

function bindAttributeAndProperty(el, name, value) {
    bindAttribute(el, name, value)
    setPropertyIfChanged(el, name, value)
}

function bindAttribute(el, name, value) {
    if ([null, undefined, false].includes(value) && attributeShouldntBePreservedIfFalsy(name)) {
        el.removeAttribute(name)
    } else {
        if (isBooleanAttr(name)) value = name

        setIfChanged(el, name, value)
    }
}

function setIfChanged(el, attrName, value) {
    if (el.getAttribute(attrName) != value) {
        el.setAttribute(attrName, value)
    }
}

function setPropertyIfChanged(el, propName, value) {
    if (el[propName] !== value) {
        el[propName] = value
    }
}

function updateSelect(el, value) {
    const arrayWrappedValue = [].concat(value).map(value => { return value + '' })

    Array.from(el.options).forEach(option => {
        option.selected = arrayWrappedValue.includes(option.value)
    })
}

function camelCase(subject) {
    return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase())
}

function checkedAttrLooseCompare(valueA, valueB) {
    return valueA == valueB
}

function isBooleanAttr(attrName) {
    // As per HTML spec table https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute
    // Array roughly ordered by estimated usage
    const booleanAttributes = [
        'disabled','checked','required','readonly','hidden','open', 'selected',
        'autofocus', 'itemscope', 'multiple', 'novalidate','allowfullscreen',
        'allowpaymentrequest', 'formnovalidate', 'autoplay', 'controls', 'loop',
        'muted', 'playsinline', 'default', 'ismap', 'reversed', 'async', 'defer',
        'nomodule'
    ]

    return booleanAttributes.includes(attrName)
}

function attributeShouldntBePreservedIfFalsy(name) {
    return ! ['aria-pressed', 'aria-checked', 'aria-expanded', 'aria-selected'].includes(name)
}

export function getBinding(el, name, fallback) {
    // First let's get it out of Alpine bound data.
    if (el._x_bindings && el._x_bindings[name] !== undefined) return el._x_bindings[name]

    return getAttributeBinding(el, name, fallback)
}

export function extractProp(el, name, fallback, extract = true) {
    // First let's get it out of Alpine bound data.
    if (el._x_bindings && el._x_bindings[name] !== undefined) return el._x_bindings[name]

    if (el._x_inlineBindings && el._x_inlineBindings[name] !== undefined) {
        let binding = el._x_inlineBindings[name]

        binding.extract = extract

        return dontAutoEvaluateFunctions(() => {
            return evaluate(el, binding.expression)
        })
    }

    return getAttributeBinding(el, name, fallback)
}

function getAttributeBinding(el, name, fallback) {
    // If not, we'll return the literal attribute.
    let attr = el.getAttribute(name)

    // Nothing bound:
    if (attr === null) return typeof fallback === 'function' ? fallback() : fallback

    // The case of a custom attribute with no value. Ex: <div manual>
    if (attr === '') return true

    if (isBooleanAttr(name)) {
        return !! [name, 'true'].includes(attr)
    }

    return attr
}
