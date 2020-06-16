import { walk, saferEval, saferEvalNoReturn, getXAttrs, debounce, convertClassStringToArray } from './utils'
import { handleForDirective } from './directives/for'
import { handleAttributeBindingDirective } from './directives/bind'
import { handleTextDirective } from './directives/text'
import { handleHtmlDirective } from './directives/html'
import { handleShowDirective } from './directives/show'
import { handleIfDirective } from './directives/if'
import { registerModelListener } from './directives/model'
import { registerListener } from './directives/on'
import { unwrap, wrap } from './observable'

export default class Component {
    constructor(el, seedDataForCloning = null) {
        this.$el = el

        const dataAttr = this.$el.getAttribute('x-data')
        const dataExpression = dataAttr === '' ? '{}' : dataAttr
        const initExpression = this.$el.getAttribute('x-init')

        this.unobservedData = seedDataForCloning ? seedDataForCloning : saferEval(dataExpression, { $el: this.$el })

        /* IE11-ONLY:START */
            // For IE11, add our magic properties to the original data for access.
            // The Proxy polyfill does not allow properties to be added after creation.
            this.unobservedData.$el = null
            this.unobservedData.$refs = null
            this.unobservedData.$nextTick = null
            this.unobservedData.$watch = null
        /* IE11-ONLY:END */

        // Construct a Proxy-based observable. This will be used to handle reactivity.
        let { membrane, data } = this.wrapDataInObservable(this.unobservedData)
        this.$data = data
        this.membrane = membrane

        // After making user-supplied data methods reactive, we can now add
        // our magic properties to the original data for access.
        this.unobservedData.$el = this.$el
        this.unobservedData.$refs = this.getRefsProxy()

        this.nextTickStack = []
        this.unobservedData.$nextTick = (callback) => {
            this.nextTickStack.push(callback)
        }

        this.watchers = {}
        this.unobservedData.$watch = (property, callback) => {
            if (! this.watchers[property]) this.watchers[property] = []

            this.watchers[property].push(callback)
        }

        this.showDirectiveStack = []
        this.showDirectiveLastElement

        var initReturnedCallback
        // If x-init is present AND we aren't cloning (skip x-init on clone)
        if (initExpression && ! seedDataForCloning) {
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
            // Run the callback returned from the "x-init" hook to allow the user to do stuff after
            // Alpine's got it's grubby little paws all over everything.
            initReturnedCallback.call(this.$data)
        }
    }

    getUnobservedData() {
        return unwrap(this.membrane, this.$data)
    }

    wrapDataInObservable(data) {
        var self = this

        let updateDom = debounce(function () {
            self.updateElements(self.$el)
        }, 0)

        return wrap(data, (target, key) => {
            if (self.watchers[key]) {
                // If there's a watcher for this specific key, run it.
                self.watchers[key].forEach(callback => callback(target[key]))
            } else {
                // Let's walk through the watchers with "dot-notation" (foo.bar) and see
                // if this mutation fits any of them.
                Object.keys(self.watchers)
                    .filter(i => i.includes('.'))
                    .forEach(fullDotNotationKey => {
                        let dotNotationParts = fullDotNotationKey.split('.')

                        // If this dot-notation watcher's last "part" doesn't match the current
                        // key, then skip it early for performance reasons.
                        if (key !== dotNotationParts[dotNotationParts.length - 1]) return

                        // Now, walk through the dot-notation "parts" recursively to find
                        // a match, and call the watcher if one's found.
                        dotNotationParts.reduce((comparisonData, part) => {
                            if (Object.is(target, comparisonData)) {
                                // Run the watchers.
                                self.watchers[fullDotNotationKey].forEach(callback => callback(target[key]))
                            }
                            return comparisonData[part]
                        }, self.getUnobservedData())
                    })
            }

            // Don't react to data changes for cases like the `x-created` hook.
            if (self.pauseReactivity) return

            updateDom()
        })
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

            // Don't touch spawns from if directives
            if (el.__x_inserted_me !== undefined) return false

            this.initializeElement(el, extraVars)
        }, el => {
            el.__x = new Component(el)
        })

        this.executeAndClearRemainingShowDirectiveStack()

        this.executeAndClearNextTickStack(rootEl)
    }

    initializeElement(el, extraVars) {
        // To support class attribute merging, we have to know what the element's
        // original class attribute looked like for reference.
        if (el.hasAttribute('class') && getXAttrs(el, this).length > 0) {
            el.__x_original_classes = convertClassStringToArray(el.getAttribute('class'))
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

        this.executeAndClearRemainingShowDirectiveStack()

        this.executeAndClearNextTickStack(rootEl)
    }

    executeAndClearNextTickStack(el) {
        // Skip spawns from alpine directives
        if (el === this.$el && this.nextTickStack.length > 0) {
            // We run the tick stack after the next frame to allow any
            // running transitions to pass the initial show stage.
            requestAnimationFrame(() => {
                while (this.nextTickStack.length > 0) {
                    this.nextTickStack.shift()()
                }
            })
        }
    }

    executeAndClearRemainingShowDirectiveStack() {
        // The goal here is to start all the x-show transitions
        // and build a nested promise chain so that elements
        // only hide when the children are finished hiding.
        this.showDirectiveStack.reverse().map(thing => {
            return new Promise(resolve => {
                thing(finish => {
                    resolve(finish)
                })
            })
        }).reduce((nestedPromise, promise) => {
            return nestedPromise.then(() => {
                return promise.then(finish => finish())
            })
        }, Promise.resolve(() => {}))

        // We've processed the handler stack. let's clear it.
        this.showDirectiveStack = []
        this.showDirectiveLastElement = undefined
    }

    updateElement(el, extraVars) {
        this.resolveBoundAttributes(el, false, extraVars)
    }

    registerListeners(el, extraVars) {
        getXAttrs(el, this).forEach(({ type, value, modifiers, expression }) => {
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
        let attrs = getXAttrs(el, this)
        if (el.type !== undefined && el.type === 'radio') {
            // If there's an x-model on a radio input, move it to end of attribute list
            // to ensure that x-bind:value (if present) is processed first.
            const modelIdx = attrs.findIndex((attr) => attr.type === 'model')
            if (modelIdx > -1) {
                attrs.push(attrs.splice(modelIdx, 1)[0])
            }
        }

        attrs.forEach(({ type, value, modifiers, expression }) => {
            switch (type) {
                case 'model':
                    handleAttributeBindingDirective(this, el, 'value', expression, extraVars, type)
                    break;

                case 'bind':
                    // The :key binding on an x-for is special, ignore it.
                    if (el.tagName.toLowerCase() === 'template' && value === 'key') return

                    handleAttributeBindingDirective(this, el, value, expression, extraVars, type)
                    break;

                case 'text':
                    var output = this.evaluateReturnExpression(el, expression, extraVars);

                    handleTextDirective(el, output, expression)
                    break;

                case 'html':
                    handleHtmlDirective(this, el, expression, extraVars)
                    break;

                case 'show':
                    var output = this.evaluateReturnExpression(el, expression, extraVars)

                    handleShowDirective(this, el, output, modifiers, initialUpdate)
                    break;

                case 'if':
                    // If this element also has x-for on it, don't process x-if.
                    // We will let the "x-for" directive handle the "if"ing.
                    if (attrs.filter(i => i.type === 'for').length > 0) return

                    var output = this.evaluateReturnExpression(el, expression, extraVars)

                    handleIfDirective(this, el, output, initialUpdate, extraVars)
                    break;

                case 'for':
                    handleForDirective(this, el, expression, initialUpdate, extraVars)
                    break;

                case 'cloak':
                    el.removeAttribute('x-cloak')
                    break;

                default:
                    break;
            }
        })
    }

    evaluateReturnExpression(el, expression, extraVars = () => {}) {
        return saferEval(expression, this.$data, {
            ...extraVars(),
            $dispatch: this.getDispatchFunction(el),
        })
    }

    evaluateCommandExpression(el, expression, extraVars = () => {}) {
        return saferEvalNoReturn(expression, this.$data, {
            ...extraVars(),
            $dispatch: this.getDispatchFunction(el),
        })
    }

    getDispatchFunction (el) {
        return (event, detail = {}) => {
            el.dispatchEvent(new CustomEvent(event, {
                detail,
                bubbles: true,
            }))
        }
    }

    listenForNewElementsToInitialize() {
        const targetNode = this.$el

        const observerOptions = {
            childList: true,
            attributes: true,
            subtree: true,
        }

        const observer = new MutationObserver((mutations) => {
            for (let i=0; i < mutations.length; i++) {
                // Filter out mutations triggered from child components.
                const closestParentComponent = mutations[i].target.closest('[x-data]')

                if (! (closestParentComponent && closestParentComponent.isSameNode(this.$el))) continue

                if (mutations[i].type === 'attributes' && mutations[i].attributeName === 'x-data') {
                    const rawData = saferEval(mutations[i].target.getAttribute('x-data'), { $el: this.$el })

                    Object.keys(rawData).forEach(key => {
                        if (this.$data[key] !== rawData[key]) {
                            this.$data[key] = rawData[key]
                        }
                    })
                }

                if (mutations[i].addedNodes.length > 0) {
                    mutations[i].addedNodes.forEach(node => {
                        if (node.nodeType !== 1 || node.__x_inserted_me) return

                        if (node.matches('[x-data]') && ! node.__x) {
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

        var refObj = {}

        /* IE11-ONLY:START */
            // Add any properties up-front that might be necessary for the Proxy polyfill.
            refObj.$isRefsProxy = false;
            refObj.$isAlpineProxy = false;

            // If we are in IE, since the polyfill needs all properties to be defined before building the proxy,
            // we just loop on the element, look for any x-ref and create a tmp property on a fake object.
            this.walkAndSkipNestedComponents(self.$el, el => {
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
            get(object, property) {
                if (property === '$isAlpineProxy') return true

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
