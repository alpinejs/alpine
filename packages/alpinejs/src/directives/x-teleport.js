import { skipDuringClone } from "../clone"
import { directive } from "../directives"
import { initTree, destroyTree } from "../lifecycle"
import { mutateDom } from "../mutation"
import { addScopeToNode } from "../scope"
import { warn } from "../utils/warn"

directive('teleport', (el, { modifiers, expression }, { cleanup }) => {
    if (el.tagName.toLowerCase() !== 'template') warn('x-teleport can only be used on a <template> tag', el)

    let target = getTarget(expression)

    let clone = el.content.cloneNode(true).firstElementChild

    // Add reference to element on <template x-teleport, and visa versa.
    el._x_teleport = clone
    clone._x_teleportBack = el

    // Add the key to the DOM so they can be more easily searched for and linked up...
    el.setAttribute('data-teleport-template', true)
    clone.setAttribute('data-teleport-target', true)

    // Forward event listeners:
    if (el._x_forwardEvents) {
        el._x_forwardEvents.forEach(eventName => {
            clone.addEventListener(eventName, e => {
                e.stopPropagation()

                el.dispatchEvent(new e.constructor(e.type, e))
            })
        })
    }
    
    // Add x-teleport @event listeners to the cloned node
    // This ensures template click handlers etc. still work with our new directive order
    Array.from(el.attributes)
        .filter(attr => attr.name.startsWith('@'))
        .forEach(attr => {
            const eventName = attr.name.replace('@', '')
            
            clone.addEventListener(eventName, e => {
                e.stopPropagation()
                
                // Dispatch the event on the original element
                el.dispatchEvent(new e.constructor(e.type, e))
            })
        })

    addScopeToNode(clone, {}, el)

    let placeInDom = (clone, target, modifiers) => {
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
    }

    mutateDom(() => {
        placeInDom(clone, target, modifiers)

        skipDuringClone(() => {
            initTree(clone)
        })()
    })

    el._x_teleportPutBack = () => {
        let target = getTarget(expression)

        mutateDom(() => {
            placeInDom(el._x_teleport, target, modifiers)
        })
    }

    cleanup(() =>
      mutateDom(() => {
        clone.remove()
        destroyTree(clone)
      })
    )
})

let teleportContainerDuringClone = document.createElement('div')

function getTarget(expression) {
    let target = skipDuringClone(() => {
        return document.querySelector(expression)
    }, () => {
        return teleportContainerDuringClone
    })()

    if (! target) warn(`Cannot find x-teleport element for selector: "${expression}"`)

    return target
}
