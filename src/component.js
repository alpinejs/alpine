import { walk, onlyUnique, saferEval, saferEvalNoReturn, getXAttrs, debounce } from './utils'

export default class Component {
    constructor(el) {
        this.el = el

        this.data = saferEval(this.el.getAttribute('x-data'), {})

        this.concernedData = []

        this.registerListeners()

        this.updateAllBoundAttributes()
    }

    registerListeners() {
        walk(this.el, el => {
            getXAttrs(el, 'on').forEach(({ type, value, modifiers, expression }) => {
                if (modifiers.includes('away')) {
                    // Listen for this event at the root level.
                    document.addEventListener(value, e => {
                        // Don't do anything if the click came form the element or within it.
                        if (el.contains(e.target)) return

                        // Don't do anything if this element isn't currently visible.
                        if (el.offsetWidth < 1 && el.offsetHeight < 1) return

                        // Now that we are sure the element is visible, AND the click
                        // is from outside it, let's run the expression.
                        this.concernedData.push(...this.evaluateExpressionWithEvent(expression, e))
                        this.concernedData = this.concernedData.filter(onlyUnique)

                        this.updateBoundAttributes()
                    })
                } else {
                    el.addEventListener(value, e => {
                        this.concernedData.push(...this.evaluateExpressionWithEvent(expression, e))
                        this.concernedData = this.concernedData.filter(onlyUnique)

                        this.updateBoundAttributes()
                    })
                }
            })
        })
    }

    evaluateExpressionWithEvent(expression, event) {
        var mutatedDataItems = []

        // Detect if the listener action mutated some data,
        // this way we can selectively update bindings.
        const proxiedData = new Proxy(this.data, {
            set(obj, property, value) {
                const setWasSuccessful = Reflect.set(obj, property, value)

                mutatedDataItems.push(property)

                return setWasSuccessful
            }
        })

        saferEvalNoReturn(expression, proxiedData, {
            '$event': event,
        })

        return mutatedDataItems;
    }

    eventsThisComponentIsListeningFor() {
        var eventsToListenFor = []

        walk(this.el, el => {
            eventsToListenFor = eventsToListenFor.concat(
                Array.from(el.attributes)
                    .map(i => i.name)
                    .filter(i => i.search('x-on') > -1)
                    .map(i => i.replace(/x-on:/, ''))
            )
        })

        return eventsToListenFor.filter(onlyUnique)
    }

    updateBoundAttributes() {
        var self = this
        debounce(walk, 5)(this.el, function (el) {
            getXAttrs(el, 'bind').forEach(({ type, value, modifiers, expression }) => {
                var isConscernedWith = []

                const proxiedData = new Proxy(self.data, {
                    get(object, prop) {
                        isConscernedWith.push(prop)

                        return object[prop]
                    }
                })

                const result = saferEval(expression, proxiedData)

                if (self.concernedData.filter(i => isConscernedWith.includes(i)).length > 0) {
                    self.updateBoundAttributeValue(el, value, result)
                }
            })
        })
    }

    updateAllBoundAttributes() {
            walk(this.el, el => {
                getXAttrs(el, 'bind').forEach(({ type, value, modifiers, expression }) => {
                    var isConscernedWith = []

                    const proxiedData = new Proxy(this.data, {
                        get(object, prop) {
                            isConscernedWith.push(prop)

                            return object[prop]
                        }
                    })

                    const result = saferEval(expression, proxiedData)

                    this.updateBoundAttributeValue(el, value, result)
                })
            })
    }

    updateBoundAttributeValue(el, attrName, value) {
        if (attrName === 'class') {
            // Use the class object syntax that vue uses to toggle them.
            Object.keys(value).forEach(className => {
                if (value[className]) {
                    el.classList.add(className)
                } else {
                    el.classList.remove(className)
                }
            })
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
}
