import { walk, saferEval, saferEvalNoReturn, getXAttrs, debounce, deepProxy } from './utils'
import { handleForDirective } from './directives/for'
import { handleAttributeBindingDirective } from './directives/bind'
import { handleShowDirective } from './directives/show'
import { handleIfDirective } from './directives/if'
import { registerModelListener } from './directives/model'
import { registerListener } from './directives/on'

export default class Component {
    constructor(el, seedDataForCloning = null) {
        this.$el = el

        const dataAttr = this.$el.getAttribute('x-data')
        const dataExpression = dataAttr === '' ? '{}' : dataAttr
        const initExpression = this.$el.getAttribute('x-init')

        this.unobservedData = seedDataForCloning ? seedDataForCloning : saferEval(dataExpression, {})

        /* IE11-ONLY:START */
            // For IE11, add our magic properties to the original data for access.
            // The Proxy polyfill does not allow properties to be added after creation.
            this.unobservedData.$el = null
            this.unobservedData.$refs = null
            this.unobservedData.$nextTick = null
        /* IE11-ONLY:END */

        // Construct a Proxy-based observable. This will be used to handle reactivity.
        this.$data = this.wrapDataInObservable(this.unobservedData)

        // After making user-supplied data methods reactive, we can now add
        // our magic properties to the original data for access.
        this.unobservedData.$el = this.$el
        this.unobservedData.$refs = this.getRefsProxy()

        this.nextTickStack = []
        this.unobservedData.$nextTick = (callback) => this.nextTickStack.push(callback)

        this.showDirectiveStack = []
        this.showDirectiveLastElement

        let initReturnedCallback

        // If x-init is present AND we aren't cloning (skip x-init on clone)
        if (initExpression && !seedDataForCloning) {
            // We want to allow data manipulation, but not trigger DOM updates just yet.
            // We haven't even initialized the elements with their Alpine bindings. I mean c'mon.
            this.pauseReactivity = true

            initReturnedCallback = this.evaluateReturnExpression(this.$el, initExpression)

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
    }

    getUnobservedData() {
        const rawData = {}
        const _setData = (key) => (rawData[key] = this.unobservedData[key])
        const _criteria = (i) => !['$el', '$refs', '$nextTick'].includes(i)

        Object.keys(this.unobservedData).filter(_criteria).forEach(_setData)

        return rawData
    }

    wrapDataInObservable(data) {
        const self = this

        const proxyHandler = {
            set(obj, property, value) {
                // Set the value converting it to a "Deep Proxy" when required
                // Note that if a project is not a valid object, it won't be converted to a proxy
                const setWasSuccessful = Reflect.set(obj, property, deepProxy(value, proxyHandler))

                // Don't react to data changes for cases like the `x-created` hook.
                if (self.pauseReactivity) {
                    return setWasSuccessful
                }

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
                // Provide a way to determine if this object is an Alpine proxy or not.
                if (key === '$isAlpineProxy') {
                    return true
                }

                // Just return the flippin' value. Gawsh.
                return target[key]
            }
        }

        return deepProxy(data, proxyHandler)
    }

    walkAndSkipNestedComponents(el, callback, initializeComponentCallback = (_) => { }) {
        walk(el, (el) => {
            // We've hit a component.
            if (el.hasAttribute('x-data')) {

                // If it's not the current one.
                if (!el.isSameNode(this.$el)) {

                    // Initialize it if it's not.
                    if (!el.__x) {
                        initializeComponentCallback(el)
                    }

                    // Now we'll let that sub-component deal with itself.
                    return false
                }
            }

            return callback(el)
        })
    }

    initializeElements(rootEl, extraVars = () => { }) {
        this.walkAndSkipNestedComponents(rootEl, (el) => {
            // Don't touch spawns from for loop.
            if (el.__x_for_key !== undefined) {
                return false
            }

            this.initializeElement(el, extraVars)
        }, (el) => (el.__x = new Component(el)))

        this.executeAndClearRemainingShowDirectiveStack()

        // Walk through the $nextTick stack and clear it as we go.
        while (this.nextTickStack.length > 0) {
            this.nextTickStack.shift()()
        }
    }

    initializeElement(el, extraVars) {
        // To support class attribute merging, we have to know what the element's
        // original class attribute looked like for reference.
        if (el.hasAttribute('class') && getXAttrs(el).length > 0) {
            el.__x_original_classes = el.getAttribute('class').split(' ')
        }

        this.registerListeners(el, extraVars)
        this.resolveBoundAttributes(el, true, extraVars)
    }

    updateElements(rootEl, extraVars = () => { }) {
        this.walkAndSkipNestedComponents(rootEl, (el) => {
            // Don't touch spawns from for loop
            // (and check if the root is actually a for loop in a parent, don't skip it).
            if (el.__x_for_key !== undefined && !el.isSameNode(this.$el)) {
                return false
            }

            this.updateElement(el, extraVars)
        }, (el) => (el.__x = new Component(el)))

        this.executeAndClearRemainingShowDirectiveStack()

        // Walk through the $nextTick stack and clear it as we go.
        while (this.nextTickStack.length > 0) {
            this.nextTickStack.shift()()
        }
    }

    executeAndClearRemainingShowDirectiveStack() {
        // The goal here is to start all the x-show transitions
        // and build a nested promise chain so that elements
        // only hide when the children are finished hiding.
        this.showDirectiveStack
            .reverse()
            .map((thing) => new Promise((resolve) => thing((finish) => resolve(finish))))
            .reduce((nestedPromise, promise) =>
                nestedPromise.then(() => promise.then((finish) => finish())),
                Promise.resolve(() => { }),
            )

        // We've processed the handler stack. let's clear it.
        this.showDirectiveStack = []
        this.showDirectiveLastElement = undefined
    }

    updateElement(el, extraVars) {
        this.resolveBoundAttributes(el, false, extraVars)
    }

    registerListeners(el, extraVars) {
        getXAttrs(el).forEach(({ type, value, modifiers, expression }) => {
            switch (type) {
                case 'on':
                    registerListener(this, el, value, modifiers, expression, extraVars)

                    break

                case 'model':
                    registerModelListener(this, el, modifiers, expression, extraVars)

                    break

                default:
                    break
            }
        })
    }

    resolveBoundAttributes(el, initialUpdate = false, extraVars) {
        let attrs = getXAttrs(el)

        attrs.forEach(({ type, value, modifiers, expression }) => {
            let output

            switch (type) {
                case 'model':
                    handleAttributeBindingDirective(this, el, 'value', expression, extraVars)

                    break

                case 'bind':
                    // The :key binding on an x-for is special, ignore it.
                    if (el.tagName.toLowerCase() === 'template' && value === 'key') {
                        return
                    }

                    handleAttributeBindingDirective(this, el, value, expression, extraVars)

                    break

                case 'text':
                    // If nested model key is undefined, set the default value to empty string.
                    output = this.evaluateReturnExpression(el, expression, extraVars)

                    el.innerText = output === undefined && expression.match(/\./).length ? '' : output

                    break

                case 'html':
                    el.innerHTML = this.evaluateReturnExpression(el, expression, extraVars)

                    break

                case 'show':
                    output = this.evaluateReturnExpression(el, expression, extraVars)

                    handleShowDirective(this, el, output, modifiers, initialUpdate)

                    break

                case 'if':
                    // If this element also has x-for on it, don't process x-if.
                    // We will let the "x-for" directive handle the "if"ing.
                    if (attrs.filter(({ type }) => type === 'for').length > 0) {
                        return
                    }

                    output = this.evaluateReturnExpression(el, expression, extraVars)

                    handleIfDirective(el, output, initialUpdate)

                    break

                case 'for':
                    handleForDirective(this, el, expression, initialUpdate)

                    break

                case 'cloak':
                    el.removeAttribute('x-cloak')

                    break

                default:
                    break
            }
        })
    }

    evaluateReturnExpression(el, expression, extraVars = () => { }) {
        return saferEval(expression, this.$data, {
            ...extraVars(),
            $dispatch: this.getDispatchFunction(el),
        })
    }

    evaluateCommandExpression(el, expression, extraVars = () => { }) {
        return saferEvalNoReturn(expression, this.$data, {
            ...extraVars(),
            $dispatch: this.getDispatchFunction(el),
        })
    }

    getDispatchFunction(el) {
        return el
            ? (event, detail = {}, bubbles = true) => el.dispatchEvent(new CustomEvent(event, { detail, bubbles }))
            : null
    }

    listenForNewElementsToInitialize() {
        const _attr = 'x-data'
        const targetNode = this.$el

        const observerOptions = {
            attributes: true,
            childList: true,
            subtree: true,
        }

        const observer = new MutationObserver((mutations) => {
            const _len = mutations.length

            for (let i = 0; i < _len; i++) {
                // Filter out mutations triggered from child components.
                const closestParentComponent = mutations[i].target.closest(`[${_attr}]`)

                if (!(closestParentComponent && closestParentComponent.isSameNode(this.$el))) {
                    return
                }

                if (mutations[i].type === 'attributes' && mutations[i].attributeName === _attr) {
                    const rawData = saferEval(mutations[i].target.getAttribute(_attr), {})
                    const _criteria = (i) => this.$data[i] !== rawData[i]

                    Object.keys(rawData).filter(_criteria).forEach((key) => (this.$data[key] = rawData[key]))
                }

                if (mutations[i].addedNodes.length <= 0) {
                    continue
                }

                mutations[i].addedNodes.forEach((node) => {
                    if (node.nodeType !== 1) {
                        return
                    }

                    if (node.matches(`[${_attr}]`)) {
                        node.__x = new Component(node)

                        return
                    }

                    this.initializeElements(node)
                })
            }
        })

        observer.observe(targetNode, observerOptions)
    }

    getRefsProxy() {
        const self = this
        const refObj = {}

        /* IE11-ONLY:START */
            // Add any properties up-front that might be necessary for the Proxy polyfill.
            refObj.$isRefsProxy = false
            refObj.$isAlpineProxy = false

            // If we are in IE, since the polyfill needs all properties to be defined before building the proxy,
            // we just loop on the element, look for any x-ref and create a tmp property on a fake object.
            this.walkAndSkipNestedComponents(self.$el, (el) => {
                if (el.hasAttribute('x-ref')) {
                    refObj[el.getAttribute('x-ref')] = true
                }
            })
        /* IE11-ONLY:END */

        // One of the goals of this is to not hold elements in memory, but rather re-evaluate
        // the DOM when the system needs something from it. This way, the framework is flexible and
        // friendly to outside DOM changes from libraries like Vue/Livewire.
        // For this reason, I'm using an "on-demand" proxy to fake a "$refs" object.
        return new Proxy(refObj, {
            get(_, property) {
                if (property === '$isAlpineProxy') {
                    return true
                }

                let ref

                // We can't just query the DOM because it's hard to filter out refs in
                // nested components.
                self.walkAndSkipNestedComponents(self.$el, (el) => {
                    if (el.hasAttribute('x-ref') && el.getAttribute('x-ref') === property) {
                        ref = el
                    }
                })

                return ref
            }
        })
    }
}
