import { walk, onlyUnique, saferEval, hasXAttr, getXAttrs } from './utils'

export default class Component {
    constructor(el) {
        this.el = el

        this.data = saferEval(this.el.getAttribute('x-data'))

        this.registerListeners()

        this.updateBoundAttributes(() => { return true })
    }

    registerListeners() {
        // Do a sweep through the component, find out what events children are
        // listening for so we can do "event delegation" on the root.
        // The reason for using event delegation is so that new
        // DOM element listeners can potentially be added
        // and they will be detected.
        this.eventsThisComponentIsListeningFor().forEach(eventName => {
            this.el.addEventListener(eventName, e => {
                if (e.target.hasAttribute(`x-on:${eventName}`)) {
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

                    const expression = e.target.getAttribute(`x-on:${eventName}`)

                    saferEval(expression, {
                        '$data': proxiedData,
                        '$event': e,
                    })

                    this.updateBoundAttributes(isConscernedWith => {
                        return mutatedDataItems.filter(i => isConscernedWith.includes(i)).length > 0;
                    })
                }
            })
        })
    }

    eventsThisComponentIsListeningFor()
    {
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

    updateBoundAttributes(ifConcernedWith) {
        walk(this.el, el => {
            if (hasXAttr(el, 'bind')) {
                getXAttrs(el, 'bind').forEach(attr => {
                    const boundAttribute = attr.name.replace(/x-bind:/, '')
                    const expression = attr.value
                    var isConscernedWith = []

                    const proxiedData = new Proxy(this.data, {
                        get(object, prop) {
                            isConscernedWith.push(prop)

                            return object[prop]
                        }
                    })

                    const result = saferEval(expression, {"$data":  proxiedData})

                    if (ifConcernedWith(isConscernedWith)) {
                        this.updateBoundAttributeValue(el, boundAttribute, result)
                    }
                })
            }
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
