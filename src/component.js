import { walk, saferEval, saferEvalNoReturn, getXAttrs, debounce } from './utils'
import { handleForDirective } from './directives/for'
import { handleAttributeBindingDirective } from './directives/bind'
import { handleShowDirective } from './directives/show'
import { handleIfDirective } from './directives/if'
import { registerModelListener } from './directives/model'
import { registerListener } from './directives/on'

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

            return callback(el)
        })
    }

    initializeElements(rootEl, extraVars = () => {}) {
        this.walkAndSkipNestedComponents(rootEl, el => {
            // Don't touch spawns from for loop
            if (el.__x_for_key !== undefined) return false

            this.initializeElement(el, extraVars)
        }, el => {
            el.__x = new Component(el)
        })

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

    updateElements(rootEl, extraVars = () => {}) {
        this.walkAndSkipNestedComponents(rootEl, el => {
            // Don't touch spawns from for loop (and check if the root is actually a for loop in a parent, don't skip it.)
            if (el.__x_for_key !== undefined && ! el.isSameNode(this.$el)) return false

            this.updateElement(el, extraVars)
        }, el => {
            el.__x = new Component(el)
        })
    }

    updateElement(el, extraVars) {
        this.resolveBoundAttributes(el, false, extraVars)
    }

    registerListeners(el, extraVars) {
        getXAttrs(el).forEach(({ type, value, modifiers, expression }) => {
            switch (type) {
                case 'on':
                    registerListener(this, el, value, modifiers, expression, extraVars)
                    break;

                case 'model':
                    registerModelListener(this, el, modifiers, expression, extraVars)
                    break;
                default:
                    break;
            }
        })
    }

    resolveBoundAttributes(el, initialUpdate = false, extraVars) {
        getXAttrs(el).forEach(({ type, value, modifiers, expression }) => {
            switch (type) {
                case 'model':
                    handleAttributeBindingDirective(this, el, 'value', expression, extraVars)
                    break;

                case 'bind':
                    // The :key binding on an x-for is special, ignore it.
                    if (el.tagName.toLowerCase() === 'template' && value === 'key') return

                    handleAttributeBindingDirective(this, el, value, expression, extraVars)
                    break;

                case 'text':
                    var output = this.evaluateReturnExpression(expression, extraVars);

                    // If nested model key is undefined, set the default value to empty string.
                    if (output === undefined && expression.match(/\./).length) {
                        output = ''
                    }

                    el.innerText = output
                    break;

                case 'html':
                    el.innerHTML = this.evaluateReturnExpression(expression, extraVars)
                    break;

                case 'show':
                    var output = this.evaluateReturnExpression(expression, extraVars)

                    handleShowDirective(el, output, initialUpdate)
                    break;

                case 'if':
                    var output = this.evaluateReturnExpression(expression, extraVars)

                    handleIfDirective(el, output, initialUpdate)
                    break;

                case 'for':
                    handleForDirective(this, el, expression, initialUpdate)
                    break;

                case 'cloak':
                    el.removeAttribute('x-cloak')
                    break;

                default:
                    break;
            }
        })
    }

    evaluateReturnExpression(expression, extraVars = () => {}) {
        return saferEval(expression, this.$data, extraVars())
    }

    evaluateCommandExpression(expression, extraVars = () => {}) {
        saferEvalNoReturn(expression, this.$data, extraVars())
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
                const closestParentComponent = mutations[i].target.closest('[x-data]')
                if (! (closestParentComponent && closestParentComponent.isSameNode(this.$el))) return

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
