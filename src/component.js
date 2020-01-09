import { walkSkippingNestedComponents, kebabCase, saferEval, saferEvalNoReturn, getXAttrs, debounce, transitionIn, transitionOut } from './utils'

export default class Component {
    constructor(el) {
        this.$el = el

        const dataAttr = this.$el.getAttribute('x-data')
        const dataExpression = dataAttr === '' ? '{}' : dataAttr
        const initExpression = this.$el.getAttribute('x-init')
        const createdExpression = this.$el.getAttribute('x-created')
        const mountedExpression = this.$el.getAttribute('x-mounted')

        const unobservedData = saferEval(dataExpression, {})

        // Construct a Proxy-based observable. This will be used to handle reactivity.
        this.$data = this.wrapDataInObservable(unobservedData)

        // Walk through the raw data and set the "this" context of any functions
        // to the observable, so data manipulations are reactive.
        Object.keys(unobservedData).forEach(key => {
            if (typeof unobservedData[key] === 'function') {
                unobservedData[key] = unobservedData[key].bind(this.$data)
            }
        })

        // After making user-supplied data methods reactive, we can now add
        // our magic properties to the original data for access.
        unobservedData.$el = this.$el
        unobservedData.$refs = this.getRefsProxy()
        unobservedData.$nextTick = (callback) => {
            this.delayRunByATick(callback)
        }

        // For $nextTick().
        this.tickStack = []
        this.collectingTickCallbacks = false

        if (initExpression) {
            console.warn('AlpineJS Warning: "x-init" is depricated and will be removed in the next major version. Use "x-created" instead.')
            this.pauseReactivity = true
            saferEvalNoReturn(this.$el.getAttribute('x-init'), this.$data)
            this.pauseReactivity = false
        }

        if (createdExpression) {
            // We want to allow data manipulation, but not trigger DOM updates just yet.
            // We haven't even initialized the elements with their Alpine bindings. I mean c'mon.
            this.pauseReactivity = true
            saferEvalNoReturn(this.$el.getAttribute('x-created'), this.$data)
            this.pauseReactivity = false
        }

        // Register all our listeners and set all our attribute bindings.
        this.initializeElements()

        // Use mutation observer to detect new elements being added within this component at run-time.
        // Alpine's just so darn flexible amirite?
        this.listenForNewElementsToInitialize()

        if (mountedExpression) {
            // Run an "x-mounted" hook to allow the user to do stuff after
            // Alpine's got it's grubby little paws all over everything.
            saferEvalNoReturn(mountedExpression, this.$data)
        }
    }

    wrapDataInObservable(data) {
        this.concernedData = []

        var self = this

        const proxyHandler = keyPrefix => ({
            set(obj, property, value) {
                const propertyName = keyPrefix ? `${keyPrefix}.${property}` : property

                const setWasSuccessful = Reflect.set(obj, property, value)

                // Don't react to data changes for cases like the `x-created` hook.
                if (self.pauseReactivity) return

                if (self.concernedData.indexOf(propertyName) === -1) {
                    self.concernedData.push(propertyName)
                }

                self.refresh()

                return setWasSuccessful
            },
            get(target, key) {
                // This is because there is no way to do something like `typeof foo === 'Proxy'`.
                if (key === 'isProxy') return true

                // If the property we are trying to get is a proxy, just return it.
                // Like in the case of $refs
                if (target[key] && target[key].isProxy) return target[key]

                // If property is a DOM node, just return it. (like in the case of this.$el)
                if (target[key] && target[key] instanceof Node) return target[key]

                // If accessing a nested property, retur this proxy recursively.
                if (typeof target[key] === 'object' && target[key] !== null) {
                    const propertyName = keyPrefix ? `${keyPrefix}.${key}` : key

                    return new Proxy(target[key], proxyHandler(propertyName))
                }

                // If none of the above, just return the flippin' value. Gawsh.
                return target[key]
            }
        })

        return new Proxy(data, proxyHandler())
    }

    delayRunByATick(callback) {
        if (this.collectingTickCallbacks) {
            this.tickStack.push(callback)
        } else {
            callback()
        }
    }

    startTick() {
        this.collectingTickCallbacks = true
    }

    clearAndEndTick() {
        this.tickStack.forEach(callable => callable())
        this.tickStack = []

        this.collectingTickCallbacks = false
    }

    initializeElements() {
        walkSkippingNestedComponents(this.$el, el => {
            this.initializeElement(el)
        })
    }

    initializeElement(el) {
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

                case 'html':
                    var { output } = this.evaluateReturnExpression(expression)
                    this.updateHtmlValue(el, output)
                    break;

                case 'show':
                    var { output } = this.evaluateReturnExpression(expression)
                    this.updateVisibility(el, output, true)
                    break;

                case 'if':
                    var { output } = this.evaluateReturnExpression(expression)
                    this.updatePresence(el, output)
                    break;

                case 'cloak':
                    el.removeAttribute('x-cloak')
                    break;

                default:
                    break;
            }
        })
    }

    listenForNewElementsToInitialize() {
        const targetNode = this.$el

        const observerOptions = {
            childList: true,
            attributes: true,
            subtree: true,
        }

        const observer = new MutationObserver((mutations) => {
            for (let i=0; i < mutations.length; i++){
                // Filter out mutations triggered from child components.
                if (! mutations[i].target.closest('[x-data]').isSameNode(this.$el)) return

                if (mutations[i].type === 'attributes' && mutations[i].attributeName === 'x-data') {
                    const rawData = saferEval(mutations[i].target.getAttribute('x-data'), {})

                    Object.keys(rawData).forEach(key => {
                        if (this.$data[key] !== rawData[key]) {
                            this.$data[key] = rawData[key]
                        }
                    })
                }

                if (mutations[i].addedNodes.length > 0) {
                    mutations[i].addedNodes.forEach(node => {
                        if (node.nodeType !== 1) return

                        if (node.matches('[x-data]')) return

                        if (getXAttrs(node).length > 0) {
                            this.initializeElement(node)
                        }
                    })
                }
              }
        })

        observer.observe(targetNode, observerOptions);
    }

    refresh() {
        var self = this

        const actionByDirectiveType = {
            'model': ({el, output}) => { self.updateAttributeValue(el, 'value', output) },
            'bind': ({el, attrName, output}) => { self.updateAttributeValue(el, attrName, output) },
            'text': ({el, output}) => { self.updateTextValue(el, output) },
            'html': ({el, output}) => { self.updateHtmlValue(el, output) },
            'show': ({el, output}) => { self.updateVisibility(el, output) },
            'if': ({el, output}) => { self.updatePresence(el, output) },
        }

        const walkThenClearDependancyTracker = (rootEl, callback) => {
            walkSkippingNestedComponents(rootEl, callback)

            self.concernedData = []
            self.clearAndEndTick()
        }

        this.startTick()

        debounce(walkThenClearDependancyTracker, 5)(this.$el, function (el) {
            getXAttrs(el).forEach(({ type, value, expression }) => {
                if (! actionByDirectiveType[type]) return

                var { output, deps } = self.evaluateReturnExpression(expression)

                if (self.concernedData.filter(i => deps.includes(i)).length > 0) {
                    (actionByDirectiveType[type])({ el, attrName: value, output })
                }
            })
        })
    }

    generateExpressionForXModelListener(el, modifiers, dataKey) {
        var rightSideOfExpression = ''
        if (el.type === 'checkbox') {
            // If the data we are binding to is an array, toggle it's value inside the array.
            if (Array.isArray(this.$data[dataKey])) {
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

    registerListener(el, event, modifiers, expression) {
        if (modifiers.includes('away')) {
            const handler = e => {
                // Don't do anything if the click came form the element or within it.
                if (el.contains(e.target)) return

                // Don't do anything if this element isn't currently visible.
                if (el.offsetWidth < 1 && el.offsetHeight < 1) return

                // Now that we are sure the element is visible, AND the click
                // is from outside it, let's run the expression.
                this.runListenerHandler(expression, e)

                if (modifiers.includes('once')) {
                    document.removeEventListener(event, handler)
                }
            }

            // Listen for this event at the root level.
            document.addEventListener(event, handler)
        } else {
            const listenerTarget = modifiers.includes('window')
                ? window : (modifiers.includes('document') ? document : el)

            const handler = e => {
                const modifiersWithoutWindowOrDocument = modifiers
                    .filter(i => i !== 'window').filter(i => i !== 'document')

                if (event === 'keydown' && modifiersWithoutWindowOrDocument.length > 0 && ! modifiersWithoutWindowOrDocument.includes(kebabCase(e.key))) return

                if (modifiers.includes('prevent')) e.preventDefault()
                if (modifiers.includes('stop')) e.stopPropagation()

                this.runListenerHandler(expression, e)

                if (modifiers.includes('once')) {
                    listenerTarget.removeEventListener(event, handler)
                }
            }

            listenerTarget.addEventListener(event, handler)
        }
    }

    runListenerHandler(expression, e) {
        this.evaluateCommandExpression(expression, {
            '$event': e,
        })
    }

    evaluateReturnExpression(expression) {
        var affectedDataKeys = []

        const proxyHandler = prefix => ({
            get(object, prop) {
                // Sometimes non-proxyable values are accessed. These are of type "symbol".
                // We can ignore them.
                if (typeof prop === 'symbol') return

                const propertyName = prefix ? `${prefix}.${prop}` : prop

                // If we are accessing an object prop, we'll make this proxy recursive to build
                // a nested dependancy key.
                if (typeof object[prop] === 'object' && object[prop] !== null && ! Array.isArray(object[prop])) {
                    return new Proxy(object[prop], proxyHandler(propertyName))
                }

                affectedDataKeys.push(propertyName)

                return object[prop]
            }
        })

        const proxiedData = new Proxy(this.$data, proxyHandler())

        const result = saferEval(expression, proxiedData)

        return {
            output: result,
            deps: affectedDataKeys
        }
    }

    evaluateCommandExpression(expression, extraData) {
        saferEvalNoReturn(expression, this.$data, extraData)
    }

    updateTextValue(el, value) {
        el.innerText = value
    }

    updateHtmlValue(el, value) {
        el.innerHTML = value
    }

    updateVisibility(el, value, initialUpdate = false) {
        if (! value) {
            transitionOut(el, () => {
                el.style.display = 'none'
            }, initialUpdate)
        } else {
            transitionIn(el, () => {
                if (el.style.length === 1 && el.style.display !== '') {
                    el.removeAttribute('style')
                } else {
                    el.style.removeProperty('display')
                }
            }, initialUpdate)
        }
    }

    updatePresence(el, expressionResult) {
        if (el.nodeName.toLowerCase() !== 'template') console.warn(`Alpine: [x-if] directive should only be added to <template> tags.`)

        const elementHasAlreadyBeenAdded = el.nextElementSibling && el.nextElementSibling.__x_inserted_me === true

        if (expressionResult && ! elementHasAlreadyBeenAdded) {
            const clone = document.importNode(el.content, true);

            el.parentElement.insertBefore(clone, el.nextElementSibling)

            el.nextElementSibling.__x_inserted_me = true

            transitionIn(el.nextElementSibling, () => {})
        } else if (! expressionResult && elementHasAlreadyBeenAdded) {
            transitionOut(el.nextElementSibling, () => {
                el.nextElementSibling.remove()
            })
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
            if (typeof value === 'string') {
                el.setAttribute('class', value)
            } else if (Array.isArray(value)) {
                el.setAttribute('class', value.join(' '))
            } else {
                // Use the class object syntax that vue uses to toggle them.
                Object.keys(value).forEach(classNames => {
                    if (value[classNames]) {
                        classNames.split(' ').forEach(className => el.classList.add(className))
                    } else {
                        classNames.split(' ').forEach(className => el.classList.remove(className))
                    }
                })
            }
        } else if (['disabled', 'readonly', 'required', 'checked', 'hidden'].includes(attrName)) {
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

        // One of the goals of this is to not hold elements in memory, but rather re-evaluate
        // the DOM when the system needs something from it. This way, the framework is flexible and
        // friendly to outside DOM changes from libraries like Vue/Livewire.
        // For this reason, I'm using an "on-demand" proxy to fake a "$refs" object.
        return new Proxy({}, {
            get(object, property) {
                if (property === 'isProxy') return true

                var ref

                // We can't just query the DOM because it's hard to filter out refs in
                // nested components.
                walkSkippingNestedComponents(self.$el, el => {
                    if (el.hasAttribute('x-ref') && el.getAttribute('x-ref') === property) {
                        ref = el
                    }
                })

                return ref
            }
        })
    }
}
