import { arrayUnique, walk, keyToModifier, saferEval, saferEvalNoReturn, getXAttrs, debounce, transitionIn, transitionOut } from './utils'

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

        // After making user-supplied data methods reactive, we can now add
        // our magic properties to the original data for access.
        unobservedData.$el = this.$el
        unobservedData.$refs = this.getRefsProxy()

        this.nextTickStack = []
        unobservedData.$nextTick = (callback) => {
            this.nextTickStack.push(callback)
        }

        var initReturnedCallback
        if (initExpression) {
            // We want to allow data manipulation, but not trigger DOM updates just yet.
            // We haven't even initialized the elements with their Alpine bindings. I mean c'mon.
            this.pauseReactivity = true
            initReturnedCallback = saferEval(this.$el.getAttribute('x-init'), this.$data)
            this.pauseReactivity = false
        }

        if (createdExpression) {
            console.warn('AlpineJS Warning: "x-created" is deprecated and will be removed in the next major version. Use "x-init" instead.')
            this.pauseReactivity = true
            saferEvalNoReturn(this.$el.getAttribute('x-created'), this.$data)
            this.pauseReactivity = false
        }

        // Register all our listeners and set all our attribute bindings.
        this.initializeElements(this.$el)

        // Use mutation observer to detect new elements being added within this component at run-time.
        // Alpine's just so darn flexible amirite?
        this.listenForNewElementsToInitialize()

        if (typeof initReturnedCallback === 'function') {
            // Run the callback returned form the "x-init" hook to allow the user to do stuff after
            // Alpine's got it's grubby little paws all over everything.
            initReturnedCallback.call(this.$data)
        }

        if (mountedExpression) {
            console.warn('AlpineJS Warning: "x-mounted" is deprecated and will be removed in the next major version. Use "x-init" (with a callback return) for the same behavior.')
            // Run an "x-mounted" hook to allow the user to do stuff after
            // Alpine's got it's grubby little paws all over everything.
            saferEvalNoReturn(mountedExpression, this.$data)
        }
    }

    wrapDataInObservable(data) {
        var self = this

        const proxyHandler = {
            set(obj, property, value) {
                const setWasSuccessful = Reflect.set(obj, property, value)

                // Don't react to data changes for cases like the `x-created` hook.
                if (self.pauseReactivity) return

                debounce(() => {
                    self.updateElements(self.$el)

                    // Walk through the $nextTick stack and clear it as we go.
                    while (self.nextTickStack.length > 0) {
                        self.nextTickStack.shift()()
                    }
                }, 0)()

                return setWasSuccessful
            },
            get(target, key) {
                // If the property we are trying to get is a proxy, just return it.
                // Like in the case of $refs
                if (target[key] && target[key].isRefsProxy) return target[key]

                // If property is a DOM node, just return it. (like in the case of this.$el)
                if (target[key] && target[key] instanceof Node) return target[key]

                // If accessing a nested property, retur this proxy recursively.
                // This enables reactivity on setting nested data.
                if (typeof target[key] === 'object' && target[key] !== null) {
                    return new Proxy(target[key], proxyHandler)
                }

                // If none of the above, just return the flippin' value. Gawsh.
                return target[key]
            }
        }

        return new Proxy(data, proxyHandler)
    }

    walkAndSkipNestedComponents(el, callback, initializeComponentCallback = () => {}) {
        walk(el, el => {
            // We've hit a component.
            if (el.hasAttribute('x-data')) {
                // If it's not the current one.
                if (! el.isSameNode(this.$el)) {
                    // Initialize it if it's not.
                    if (! el.__x) initializeComponentCallback(el)

                    // Now we'll let that sub-component deal with itself.
                    return false
                }
            }

            callback(el)
        })
    }

    initializeElements(rootEl) {
        this.walkAndSkipNestedComponents(rootEl, el => {
            this.initializeElement(el)
        }, el => {
            el.__x = new Component(el)
        })
    }

    initializeElement(el) {
        // To support class attribute merging, we have to know what the element's
        // original class attribute looked like for reference.
        if (el.hasAttribute('class') && getXAttrs(el).length > 0) {
            el.__originalClasses = el.getAttribute('class').split(' ')
        }

        this.registerListeners(el)
        this.resolveBoundAttributes(el, true)
    }

    updateElements(rootEl) {
        this.walkAndSkipNestedComponents(rootEl, el => {
            this.updateElement(el)
        }, el => {
            el.__x = new Component(el)
        })
    }

    updateElement(el) {
        this.resolveBoundAttributes(el)
    }

    registerListeners(el) {
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
                    break;
                default:
                    break;
            }
        })
    }

    resolveBoundAttributes(el, initialUpdate = false) {
        getXAttrs(el).forEach(({ type, value, modifiers, expression }) => {
            switch (type) {
                case 'model':
                    var attrName = 'value'
                    var output = this.evaluateReturnExpression(expression)
                    this.updateAttributeValue(el, attrName, output)
                    break;

                case 'bind':
                    var attrName = value
                    var output = this.evaluateReturnExpression(expression)
                    this.updateAttributeValue(el, attrName, output)
                    break;

                case 'text':
                    var output = this.evaluateReturnExpression(expression)
                    this.updateTextValue(el, output)
                    break;

                case 'html':
                    var output = this.evaluateReturnExpression(expression)
                    this.updateHtmlValue(el, output)
                    break;

                case 'show':
                    var output = this.evaluateReturnExpression(expression)
                    this.updateVisibility(el, output, initialUpdate)
                    break;

                case 'if':
                    var output = this.evaluateReturnExpression(expression)
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
                const closestParentComponent = mutations[i].target.closest('[x-data]')

                // Filter out mutations triggered from child components.
                if (closestParentComponent && ! closestParentComponent.isSameNode(this.el)) return

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

                        if (node.matches('[x-data]')) {
                            node.__x = new Component(node)
                            return
                        }

                        this.initializeElements(node)
                    })
                }
              }
        })

        observer.observe(targetNode, observerOptions);
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
                const keyModifiers = modifiers.filter(i => i !== 'window').filter(i => i !== 'document')

                // The user is scoping the keydown listener to a specific key using modifiers.
                if (event === 'keydown' && keyModifiers.length > 0) {
                    // The user is listening for a specific key.
                    if (keyModifiers.length === 1 && ! keyModifiers.includes(keyToModifier(e.key))) return

                    // The user is listening for key combinations.
                    const systemKeyModifiers = ['ctrl', 'shift', 'alt', 'meta', 'cmd', 'super']
                    const selectedSystemKeyModifiers = systemKeyModifiers.filter(modifier => keyModifiers.includes(modifier))

                    if (selectedSystemKeyModifiers.length > 0) {
                        const activelyPressedKeyModifiers = selectedSystemKeyModifiers.filter(modifier => {
                            // Alias "cmd" and "super" to "meta"
                            if (modifier === 'cmd' || modifier === 'super') modifier = 'meta'

                            return e[`${modifier}Key`]
                        })

                        if (activelyPressedKeyModifiers.length === 0) return
                    }
                }

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
        return saferEval(expression, this.$data)
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
            if (Array.isArray(value)) {
                const originalClasses = el.__originalClasses || []
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
                const originalClasses = el.__originalClasses || []
                const newClasses = value.split(' ')
                el.setAttribute('class', arrayUnique(originalClasses.concat(newClasses)).join(' '))
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
                if (property === 'isRefsProxy') return true

                var ref

                // We can't just query the DOM because it's hard to filter out refs in
                // nested components.
                self.walkAndSkipNestedComponents(self.$el, el => {
                    if (el.hasAttribute('x-ref') && el.getAttribute('x-ref') === property) {
                        ref = el
                    }
                })

                return ref
            }
        })
    }
}
