import { addScopeToNode } from '../scope'
import { directive, prefix } from '../directives'
import { addInitSelector, initTree } from '../lifecycle'
import { mutateDom } from '../mutation'

class MapSet {
    map = new Map

    get(name) {
        if (! this.map.has(name)) this.map.set(name, new Set)

        return this.map.get(name)
    }

    add(name, value) { this.get(name).add(value) }

    each(name, callback) { this.map.get(name).forEach(callback) }

    delete(name, value) {
        this.map.get(name).delete(value)
    }
}

let portals = new MapSet

directive('portal', (el, { expression }, { effect, cleanup }) => {
    let clone = el.content.cloneNode(true).firstElementChild
    // Add reference to element on <template x-portal, and visa versa.
    el._x_portal = clone
    clone._x_portal_back = el

    let init = (target) => {
        // Forward event listeners:
        if (el._x_forwardEvents) {
            el._x_forwardEvents.forEach(eventName => {
                clone.addEventListener(eventName, e => {
                    e.stopPropagation()
                    
                    el.dispatchEvent(new e.constructor(e.type, e))
                })
            })
        }

        addScopeToNode(clone, {}, el)

        mutateDom(() => {
            target.before(clone)

            initTree(clone)
        })

        cleanup(() => {
            clone.remove()
           
            portals.delete(expression, init) 
        })
    }

    portals.add(expression, init)
})

addInitSelector(() => `[${prefix('portal-target')}]`)
directive('portal-target', (el, { expression }) => {
    portals.each(expression, initPortal => initPortal(el))
})
