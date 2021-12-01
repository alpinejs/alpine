import { directive } from "../directives"
import { addInitSelector, initTree } from "../lifecycle"
import { mutateDom } from "../mutation"
import { addScopeToNode } from "../scope"

directive('teleport', (el, { expression }, { cleanup }) => {
    let target = document.querySelector(expression)
    let clone = el.content.cloneNode(true).firstElementChild
    
    // Add reference to element on <template x-portal, and visa versa.
    el._x_teleport = clone
    clone._x_teleportBack = el

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
        target.appendChild(clone)

        initTree(clone)

        clone._x_ignore = true
    })

    cleanup(() => clone.remove())
})
