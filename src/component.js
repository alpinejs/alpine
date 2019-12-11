import { walkSkippingNestedComponents, saferEval, saferEvalNoReturn, getXAttrs, debounce } from './utils'

export default class Component {
    constructor(el) {
        this.el = el

        const rawData = saferEval(this.el.getAttribute('x-data'), {})

        this.data = this.wrapDataInObservable(rawData)

        this.initialize()
    }

    wrapDataInObservable(data) {
        this.concernedData = []

        var self = this

        const proxyHandler = keyPrefix => ({
            set(obj, property, value) {
                const propertyName = keyPrefix + '.' + property

                const setWasSuccessful = Reflect.set(obj, property, value)

                if (self.concernedData.indexOf(propertyName) === -1) {
                    self.concernedData.push(propertyName)
                }

                self.refresh()

                return setWasSuccessful
            },
            get(target, key) {
                if (typeof target[key] === 'object' && target[key] !== null) {
                    return new Proxy(target[key], proxyHandler(keyPrefix + '.' + key))
                }

                return target[key]
            }
        })

        return new Proxy(data, proxyHandler())
    }

    initialize() {
        walkSkippingNestedComponents(this.el, el => {
            getXAttrs(el).forEach(({ type, value, modifiers, expression }) => {
                switch (type) {
                    case 'on':
                        var event = value
                        this.registerListener(el, event, modifiers, expression)
                        break;

                    case 'model':
                        // If the element we are binding to is a select, a radio, or checkbox
                        // we'll listen for the change event instead of the "input" event.
                        var event = (el.tagName.toLowerCase() === 'select')
                            || ['checkbox', 'radio'].includes(el.type)
                            || modifiers.includes('lazy')
                            ? 'change' : 'input'

                        const listenerExpression = this.generateExpressionForXModelListener(el, modifiers, expression)

                        this.registerListener(el, event, modifiers, listenerExpression)

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

                    case 'show':
                        var { output } = this.evaluateReturnExpression(expression)
                        this.updateVisibility(el, output)
                        break;

                    case 'cloak':
                        el.removeAttribute('x-cloak')
                        break;

                    default:
                        break;
                }
            })
        })
    }

    refresh() {
        var self = this

        const walkThenClearDependancyTracker = (rootEl, callback) => {
            walkSkippingNestedComponents(rootEl, callback)

            self.concernedData = []
        }

        debounce(walkThenClearDependancyTracker, 5)(this.el, function (el) {
            getXAttrs(el).forEach(({ type, value, modifiers, expression }) => {
                switch (type) {
                    case 'model':
                        var { output, deps } = self.evaluateReturnExpression(expression)

                        if (self.concernedData.filter(i => deps.includes(i)).length > 0) {
                            self.updateAttributeValue(el, 'value', output)
                        }
                        break;
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

                    case 'show':
                        var { output, deps } = self.evaluateReturnExpression(expression)

                        if (self.concernedData.filter(i => deps.includes(i)).length > 0) {
                            self.updateVisibility(el, output)
                        }
                        break;

                    default:
                        break;
                }
            })
        })
    }

    generateExpressionForXModelListener(el, modifiers, dataKey) {
        var rightSideOfExpression = ''
        if (el.type === 'checkbox') {
            // If the data we are binding to is an array, toggle it's value inside the array.
            if (Array.isArray(this.data[dataKey])) {
                rightSideOfExpression = `$event.target.checked ? ${dataKey}.concat([$event.target.value]) : [...${dataKey}.splice(0, ${dataKey}.indexOf($event.target.value)), ...${dataKey}.splice(${dataKey}.indexOf($event.target.value)+1)]`
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
            const node = modifiers.includes('window') ? window : el

            node.addEventListener(event, e => {
                if (modifiers.includes('prevent')) e.preventDefault()
                if (modifiers.includes('stop')) e.stopPropagation()

                this.runListenerHandler(expression, e)
            })
        }
    }

    runListenerHandler(expression, e) {
        this.evaluateCommandExpression(expression, {
            '$event': e,
            '$refs': this.getRefsProxy()
        })
    }

    evaluateReturnExpression(expression) {
        var affectedDataKeys = []

        const proxyHandler = prefix => ({
            get(object, prop) {
                if (typeof object[prop] === 'object' && object[prop] !== null && !Array.isArray(object[prop])) {
                    return new Proxy(object[prop], proxyHandler(prefix + '.' + prop))
                }

                if (typeof prop === 'string') {
                    affectedDataKeys.push(prefix + '.' + prop)
                } else {
                    affectedDataKeys.push(prop)
                }

                if (typeof object[prop] === 'object' && object[prop] !== null) {
                    return new Proxy(object[prop], proxyHandler(prefix + '.' + prop))
                }

                return object[prop]
            }
        })

        const proxiedData = new Proxy(this.data, proxyHandler())

        const result = saferEval(expression, proxiedData)

        return {
            output: result,
            deps: affectedDataKeys
        }
    }

    evaluateCommandExpression(expression, extraData) {
        saferEvalNoReturn(expression, this.data, extraData)
    }

    updateTextValue(el, value) {
        el.innerText = value
    }

    updateVisibility(el, value) {
        if (! value) {
            el.style.display = 'none'
        } else {
            if (el.style.length === 1 && el.style.display !== '') {
                el.removeAttribute('style')
            } else {
                el.style.removeProperty('display')
            }
        }
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

    getRefsProxy() {
        var self = this

        // One of the goals of this project is to not hold elements in memory, but rather re-evaluate
        // the DOM when the system needs something from it. This way, the framework is flexible and
        // friendly to outside DOM changes from libraries like Vue/Livewire.
        // For this reason, I'm using an "on-demand" proxy to fake a "$refs" object.
        return new Proxy({}, {
            get(object, property) {
                var ref

                // We can't just query the DOM because it's hard to filter out refs in
                // nested components.
                walkSkippingNestedComponents(self.el, el => {
                    if (el.hasAttribute('x-ref') && el.getAttribute('x-ref') === property) {
                        ref = el
                    }
                })

                return ref
            }
        })
    }
}
