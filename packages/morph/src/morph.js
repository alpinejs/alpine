
export function morph(dom, toHtml, options) {
    assignOptions(options)

    patch(dom, createElement(toHtml))

    return dom
}

let key
,lookahead
,updating
,updated
,removing
,removed
,adding
,added

let noop = () => {}

function assignOptions(options = {}) {
    let defaultGetKey = el => el.getAttribute('key')

    key = options.key || defaultGetKey
    lookahead = options.lookahead || false
    updating = options.updating || noop
    updated = options.updated || noop
    removing = options.removing || noop
    removed = options.removed || noop
    adding = options.adding || noop
    added = options.added || noop
}

function createElement(html) {
    return document.createRange().createContextualFragment(html).firstElementChild
}

function patch(dom, to) {
    if (dom.isEqualNode(to)) return

    if (differentElementNamesTypesOrKeys(dom, to)) {
        return patchElement(dom, to)
    }

    let updateChildrenOnly = false

    if (shouldSkip(updating, dom, to, () => updateChildrenOnly = true)) return

    // window.Alpine && initializeAlpineOnTo(dom, to, () => updateChildrenOnly = true)

    if (textOrComment(to)) {
        patchNodeValue(dom, to)
        updated(dom, to)
        return
    }

    if (! updateChildrenOnly) {
        patchAttributes(dom, to)
    }

    updated(dom, to)

    patchChildren(dom, to)
}

function differentElementNamesTypesOrKeys(dom, to) {
    return dom.nodeType != to.nodeType
        || dom.nodeName != to.nodeName
        || getKey(dom) != getKey(to)
}

function textOrComment(el) {
    return el.nodeType === 3
        || el.nodeType === 8
}

function patchElement(dom, to) {
    if(shouldSkip(removing, dom)) return

    let toCloned = to.cloneNode(true)

    if(shouldSkip(adding, toCloned)) return

    dom.parentNode.replaceChild(toCloned, dom)

    removed(dom)
    added(toCloned)
}

function patchNodeValue(dom, to) {
    let value = to.nodeValue

    if (dom.nodeValue !== value) dom.nodeValue = value
}

function patchAttributes(dom, to) {
    if (dom._x_isShown && ! to._x_isShown) {
        return
        // dom._x_hide()
    }
    if (! dom._x_isShown && to._x_isShown) {
        return
        // dom._x_show()
    }

    let domAttributes = Array.from(dom.attributes)
    let toAttributes = Array.from(to.attributes)

    for (let i = domAttributes.length - 1; i >= 0; i--) {
        let name = domAttributes[i].name;

        if (! to.hasAttribute(name)) dom.removeAttribute(name)
    }

    for (let i = toAttributes.length - 1; i >= 0; i--) {
        let name = toAttributes[i].name
        let value = toAttributes[i].value

        if (dom.getAttribute(name) !== value) dom.setAttribute(name, value)
    }
}

function patchChildren(dom, to) {
    let domChildren = dom.childNodes
    let toChildren = to.childNodes

    let toKeyToNodeMap = keyToMap(toChildren)
    let domKeyDomNodeMap = keyToMap(domChildren)

    let currentTo = to.firstChild
    let currentFrom = dom.firstChild

    let domKeyHoldovers = {}

    while (currentTo) {
        let toKey = getKey(currentTo)
        let domKey = getKey(currentFrom)

        // Add new elements
        if (! currentFrom) {
            if (toKey && domKeyHoldovers[toKey]) {
                let holdover = domKeyHoldovers[toKey]

                dom.appendChild(holdover)
                currentFrom = holdover
            } else {
                addNodeTo(currentTo, dom)
                currentTo = currentTo.nextSibling
                continue
            }
        }

        if (lookahead) {
            let nextToElementSibling = currentTo.nextElementSibling

            if (nextToElementSibling && currentFrom.isEqualNode(nextToElementSibling)) {
                currentFrom = addNodeBefore(currentTo, currentFrom)

                domKey = getKey(currentFrom)
            }
        }

        if (toKey !== domKey) {
            if (! toKey && domKey) {
                domKeyHoldovers[domKey] = currentFrom
                currentFrom = addNodeBefore(currentTo, currentFrom)
                domKeyHoldovers[domKey].remove()
                currentFrom = currentFrom.nextSibling
                currentTo = currentTo.nextSibling
                continue
            }

            if (toKey && ! domKey) {
                if (domKeyDomNodeMap[toKey]) {
                    currentFrom.parentElement.replaceChild(domKeyDomNodeMap[toKey], currentFrom)
                    currentFrom = domKeyDomNodeMap[toKey]
                }
            }

            if (toKey && domKey) {
                domKeyHoldovers[domKey] = currentFrom
                let domKeyNode = domKeyDomNodeMap[toKey]

                if (domKeyNode) {
                    currentFrom.parentElement.replaceChild(domKeyNode, currentFrom)
                    currentFrom = domKeyNode
                } else {
                    domKeyHoldovers[domKey] = currentFrom
                    currentFrom = addNodeBefore(currentTo, currentFrom)
                    domKeyHoldovers[domKey].remove()
                    currentFrom = currentFrom.nextSibling
                    currentTo = currentTo.nextSibling
                    continue
                }
            }
        }

        // Patch elements
        patch(currentFrom, currentTo)

        currentTo = currentTo && currentTo.nextSibling
        currentFrom = currentFrom && currentFrom.nextSibling
    }

    // Cleanup extra froms
    while (currentFrom) {
        if(! shouldSkip(removing, currentFrom)) {
            let domForRemoval = currentFrom

            dom.removeChild(domForRemoval)

            removed(domForRemoval)
        }

        currentFrom = currentFrom.nextSibling
    }
}

function getKey(el) {
    return el && el.nodeType === 1 && key(el)
}

function keyToMap(els) {
    let map = {}

    els.forEach(el => {
        let theKey = getKey(el)

        if (theKey) {
            map[theKey] = el
        }
    })

    return map
}

function shouldSkip(hook, ...args) {
    let skip = false

    hook(...args, () => skip = true)

    return skip
}

function addNodeTo(node, parent) {
    if(! shouldSkip(adding, node)) {
        let clone = node.cloneNode(true)

        parent.appendChild(clone);

        added(clone)
    }
}

function addNodeBefore(node, beforeMe) {
    if(! shouldSkip(adding, node)) {
        let clone = node.cloneNode(true)

        beforeMe.parentElement.insertBefore(clone, beforeMe);

        added(clone)

        return clone
    }

    return beforeMe
}

function initializeAlpineOnTo(from, to, childrenOnly) {
    if (from.nodeType !== 1) return

    // If the element we are updating is an Alpine component...
    if (from._x_dataStack) {
        // Then temporarily clone it (with it's data) to the "to" element.
        // This should simulate backend Livewire being aware of Alpine changes.
        window.Alpine.clone(from, to)
    }

    // x-show elements require care because of transitions.
    if (
        Array.from(from.attributes)
            .map(attr => attr.name)
            .some(name => /x-show/.test(name))
    ) {
        if (from._x_transition) {
            // This covers @entangle('something')
            // childrenOnly()
        } else {
            // This covers x-show="$wire.something"
            //
            // If the element has x-show, we need to "reverse" the damage done by "clone",
            // so that if/when the element has a transition on it, it will occur naturally.
            // if (isHiding(from, to)) {
            //     let style = to.getAttribute('style')
            //     to.setAttribute('style', style.replace('display: none;', ''))
            // } else if (isShowing(from, to)) {
            //     to.style.display = from.style.display
            // }
        }
    }
}

function isHiding(from, to) {
    return from._x_isShown && ! to._x_isShown
}

function isShowing(from, to) {
    return ! from._x_isShown && to._x_isShown
}


// This is from Livewire:


// function alpinifyElementsForMorphdom(from, to) {
//     // If the element we are updating is an Alpine component...
//     if (from.__x) {
//         // Then temporarily clone it (with it's data) to the "to" element.
//         // This should simulate backend Livewire being aware of Alpine changes.
//         window.Alpine.clone(from.__x, to)
//     }

//     // x-show elements require care because of transitions.
//     if (
//         Array.from(from.attributes)
//             .map(attr => attr.name)
//             .some(name => /x-show/.test(name))
//     ) {
//         if (from.__x_transition) {
//             // This covers @entangle('something')
//             from.skipElUpdatingButStillUpdateChildren = true
//         } else {
//             // This covers x-show="$wire.something"
//             //
//             // If the element has x-show, we need to "reverse" the damage done by "clone",
//             // so that if/when the element has a transition on it, it will occur naturally.
//             if (isHiding(from, to)) {
//                 let style = to.getAttribute('style')

//                 if (style) {
//                     to.setAttribute('style', style.replace('display: none;', ''))
//                 }
//             } else if (isShowing(from, to)) {
//                 to.style.display = from.style.display
//             }
//         }
//     }
// }

// function isHiding(from, to) {
//     if (beforeAlpineTwoPointSevenPointThree()) {
//         return from.style.display === '' && to.style.display === 'none'
//     }

//     return from._x_isShown && ! to._x_isShown
// }

// function isShowing(from, to) {
//     if (beforeAlpineTwoPointSevenPointThree()) {
//         return from.style.display === 'none' && to.style.display === ''
//     }

//     return ! from._x_isShown && to._x_isShown
// }

// function beforeAlpineTwoPointSevenPointThree() {
//     let [major, minor, patch] = window.Alpine.version.split('.').map(i => Number(i))

//     return major <= 2 && minor <= 7 && patch <= 2
// }
