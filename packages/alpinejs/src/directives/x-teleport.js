import { onlyDuringClone, skipDuringClone } from "../clone"
import { directive } from "../directives"
import { addInitSelector, initTree } from "../lifecycle"
import { mutateDom } from "../mutation"
import { addScopeToNode } from "../scope"
import { warn } from "../utils/warn"

let teleportContainerDuringClone = document.createElement('div')

directive('teleport', (el, { modifiers, expression }, { cleanup }) => {
    if (el.tagName.toLowerCase() !== 'template') warn('x-teleport can only be used on a <template> tag', el)

    let target = skipDuringClone(() => {
        return document.querySelector(expression)
    }, () => {
        return teleportContainerDuringClone
    })()

    if (! target) warn(`Cannot find x-teleport element for selector: "${expression}"`)

    let clone = el.content.cloneNode(true).firstElementChild

    // Add reference to element on <template x-teleport, and visa versa.
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
        if (modifiers.includes('prepend')) {
            // insert element before the target
            target.parentNode.insertBefore(clone, target)
        } else if (modifiers.includes('append')) {
            // insert element after the target
            target.parentNode.insertBefore(clone, target.nextSibling)
        } else {
            // origin
            target.appendChild(clone)
        }

        initTree(clone)

        clone._x_ignore = true
    })

    cleanup(() => clone.remove())
})
