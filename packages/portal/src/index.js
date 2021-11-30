export default function (Alpine) {
    let portals = new MapSet

    Alpine.directive('portal', (el, { expression }, { effect, cleanup }) => {
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
    
            Alpine.addScopeToNode(clone, {}, el)
    
            Alpine.mutateDom(() => {
                target.before(clone)
    
                Alpine.initTree(clone)
            })
    
            cleanup(() => {
                clone.remove()
               
                portals.delete(expression, init) 
            })
        }
    
        portals.add(expression, init)
    })
    
    Alpine.addInitSelector(() => `[${Alpine.prefixed('portal-target')}]`)
    Alpine.directive('portal-target', (el, { expression }) => {
        portals.each(expression, initPortal => initPortal(el))
    })
}

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
