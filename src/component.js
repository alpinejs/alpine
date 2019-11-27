import { walk, onlyUnique, saferEval, saferEvalNoReturn, getXAttrs, debounce } from './utils'

export default class Component {
    constructor(el) {
        this.el = el

        this.data = saferEval(this.el.getAttribute('x-data'), {})

        this.concernedData = []

        this.initialize()
    }

    initialize() {
        walk(this.el, el => {
            getXAttrs(el).forEach(({ type, value, modifiers, expression }) => {
                switch (type) {
                    case 'on':
                        var event = value
                        this.registerListener(el, event, modifiers, expression)
                        break;

                    case 'model':
                        // If the element we are binding to is a select, a radio, or checkbox
                        // we'll listen for the change event instead of the "input" event.
                        var event = (
                            el.tagName.toLowerCase() === 'select')
                            || (['checkbox', 'radio'].includes(el.type)
                            || modifiers.includes('lazy')
                            )
                                ? 'change' : 'input'

                        var rightSideOfExpression = ''
                        if (el.type === 'checkbox') {
                            // If the data we are binding to is an array, toggle it's value inside the array.
                            if (Array.isArray(this.data[expression])) {
                                rightSideOfExpression = `$event.target.checked ? ${expression}.concat([$event.target.value]) : [...${expression}.splice(0, ${expression}.indexOf($event.target.value)), ...${expression}.splice(${expression}.indexOf($event.target.value)+1)]`
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
                            if (! el.hasAttribute('name')) el.setAttribute('name', expression)
                        }

                        this.registerListener(el, event, modifiers, `${expression} = ${rightSideOfExpression}`)

                        var attrName = 'value'
                        var { output } = this.evaluateReturnExpression(expression)
                        this.updateAttributeValue(el, attrName, output)
                        break;

                    case 'bind':
                        var attrName = value
                        var { output } = this.evaluateReturnExpression(expression)
                        this.updateAttributeValue(el, attrName, output)
                        break;

                    case 'text':
                        var { output } = this.evaluateReturnExpression(expression)
                        this.updateTextValue(el, output)
                        break;

                    default:
                        break;
                }
            })
        })
    }

    refresh() {
        var self = this
        debounce(walk, 5)(this.el, function (el) {
            getXAttrs(el).forEach(({ type, value, modifiers, expression }) => {
                switch (type) {
                    case 'bind':
                        const attrName = value
                        var { output, deps } = self.evaluateReturnExpression(expression)

                        if (self.concernedData.filter(i => deps.includes(i)).length > 0) {
                            self.updateAttributeValue(el, attrName, output)
                        }
                        break;

                    case 'text':
                        var { output, deps } = self.evaluateReturnExpression(expression)

                        if (self.concernedData.filter(i => deps.includes(i)).length > 0) {
                            self.updateTextValue(el, output)
                        }
                        break;

                    default:
                        break;
                }
            })
        })
    }

    registerListener(el, event, modifiers, expression) {
        if (modifiers.includes('away')) {
            // Listen for this event at the root level.
            document.addEventListener(event, e => {
                // Don't do anything if the click came form the element or within it.
                if (el.contains(e.target)) return

                // Don't do anything if this element isn't currently visible.
                if (el.offsetWidth < 1 && el.offsetHeight < 1) return

                // Now that we are sure the element is visible, AND the click
                // is from outside it, let's run the expression.
                this.runListenerHandler(expression, e)
            })
        } else {
            el.addEventListener(event, e => {
                this.runListenerHandler(expression, e)
            })
        }
    }

    runListenerHandler(expression, e) {
        const { deps } = this.evaluateCommandExpression(expression, { '$event': e })

        this.concernedData.push(...deps)
        this.concernedData = this.concernedData.filter(onlyUnique)

        this.refresh()
    }

    evaluateReturnExpression(expression) {
        var affectedDataKeys = []

        const proxiedData = new Proxy(this.data, {
            get(object, prop) {
                affectedDataKeys.push(prop)

                return object[prop]
            }
        })

        const result = saferEval(expression, proxiedData)

        return {
            output: result,
            deps: affectedDataKeys
        }
    }

    evaluateCommandExpression(expression, extraData) {
        var affectedDataKeys = []

        const proxiedData = new Proxy(this.data, {
            set(obj, property, value) {
                const setWasSuccessful = Reflect.set(obj, property, value)

                affectedDataKeys.push(property)

                return setWasSuccessful
            }
        })

        saferEvalNoReturn(expression, proxiedData, extraData)

        return { deps: affectedDataKeys }
    }

    updateTextValue(el, value) {
        el.innerText = value
    }

    updateAttributeValue(el, attrName, value) {
        if (attrName === 'value') {
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
            } else if (el.tagName === 'SELECT') {
                this.updateSelect(el, value)
            } else {
                el.value = value
            }
        } else if (attrName === 'class') {
            if (Array.isArray(value)) {
                el.setAttribute('class', value.join(' '))
            } else {
                // Use the class object syntax that vue uses to toggle them.
                Object.keys(value).forEach(className => {
                    if (value[className]) {
                        el.classList.add(className)
                    } else {
                        el.classList.remove(className)
                    }
                })
            }
        } else if (['disabled', 'readonly', 'required', 'checked'].includes(attrName)) {
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

    updateSelect(el, value) {
        const arrayWrappedValue = [].concat(value).map(value => { return value + '' })

        Array.from(el.options).forEach(option => {
            option.selected = arrayWrappedValue.includes(option.value || option.text)
        })
    }
}
