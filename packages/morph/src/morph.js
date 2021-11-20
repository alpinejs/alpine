let resolveStep = () => {}

let logger = () => {}

function breakpoint(message) {
    if (! debug) return

    message && logger(message.replace('\n', '\\n'))
   
    return new Promise(resolve => resolveStep = () => resolve())
}

export async function morph(dom, toHtml, options) {
    assignOptions(options)
    
    let toEl = createElement(toHtml)

    // If there is no x-data on the element we're morphing,
    // let's seed it with the outer Alpine scope on the page.
    if (window.Alpine && ! dom._x_dataStack) {
        toEl._x_dataStack = window.Alpine.closestDataStack(dom)
        
        toEl._x_dataStack && window.Alpine.clone(dom, toEl)
    }
    
    await breakpoint()

    patch(dom, toEl)

    return dom
}

morph.step = () => resolveStep()
morph.log = (theLogger) => {
    logger = theLogger
}

let key
,lookahead
,updating
,updated
,removing
,removed
,adding
,added
,debug

let noop = () => {}

function assignOptions(options = {}) {
    let defaultGetKey = el => el.getAttribute('key')

    updating = options.updating || noop
    updated = options.updated || noop
    removing = options.removing || noop
    removed = options.removed || noop
    adding = options.adding || noop
    added = options.added || noop
    key = options.key || defaultGetKey
    lookahead = options.lookahead || true 
    debug = options.debug || false
}

function createElement(html) {
    return document.createRange().createContextualFragment(html).firstElementChild
}

async function patch(dom, to) {
    if (dom.isEqualNode(to)) return
   
    if (differentElementNamesTypesOrKeys(dom, to)) {
        let result = patchElement(dom, to)
        
        await breakpoint('Swap elements')
       
        return result
    }

    let updateChildrenOnly = false

    if (shouldSkip(updating, dom, to, () => updateChildrenOnly = true)) return

    window.Alpine && initializeAlpineOnTo(dom, to, () => updateChildrenOnly = true)

    if (textOrComment(to)) {
        await patchNodeValue(dom, to)
        updated(dom, to)
        
        return
    }

    if (! updateChildrenOnly) {
        await patchAttributes(dom, to)
    }

    updated(dom, to)

    await patchChildren(dom, to)
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
    if (shouldSkip(removing, dom)) return

    let toCloned = to.cloneNode(true)

    if (shouldSkip(adding, toCloned)) return

    dom.parentNode.replaceChild(toCloned, dom)

    removed(dom)
    added(toCloned)
}

async function patchNodeValue(dom, to) {
    let value = to.nodeValue

    if (dom.nodeValue !== value) {
        dom.nodeValue = value

        await breakpoint('Change text node to: ' + value)
    }
}

async function patchAttributes(dom, to) {
    if (dom._x_isShown && ! to._x_isShown) {
        return
    }
    if (! dom._x_isShown && to._x_isShown) {
        return
    }

    let domAttributes = Array.from(dom.attributes)
    let toAttributes = Array.from(to.attributes)

    for (let i = domAttributes.length - 1; i >= 0; i--) {
        let name = domAttributes[i].name;

        if (! to.hasAttribute(name)) {
            dom.removeAttribute(name)
           
            await breakpoint('Remove attribute')
        }
    }

    for (let i = toAttributes.length - 1; i >= 0; i--) {
        let name = toAttributes[i].name
        let value = toAttributes[i].value

        if (dom.getAttribute(name) !== value) {
            dom.setAttribute(name, value)

            await breakpoint(`Set [${name}] attribute to: "${value}"`)
        }
    }
}

async function patchChildren(dom, to) {
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

                await breakpoint('Add element (from key)')
            } else {
                let added = addNodeTo(currentTo, dom)

                await breakpoint('Add element: ' + added.outerHTML || added.nodeValue)

                currentTo = currentTo.nextSibling

                continue
            }
        }

        if (lookahead) {
            let nextToElementSibling = currentTo.nextElementSibling

            if (nextToElementSibling && currentFrom.isEqualNode(nextToElementSibling)) {
                currentFrom = addNodeBefore(currentTo, currentFrom)

                domKey = getKey(currentFrom)
                
                await breakpoint('Move element (lookahead)')
            }
        }

        if (toKey !== domKey) {
            if (! toKey && domKey) {
                domKeyHoldovers[domKey] = currentFrom
                currentFrom = addNodeBefore(currentTo, currentFrom)
                domKeyHoldovers[domKey].remove()
                currentFrom = currentFrom.nextSibling
                currentTo = currentTo.nextSibling

                await breakpoint('No "to" key')

                continue
            }

            if (toKey && ! domKey) {
                if (domKeyDomNodeMap[toKey]) {
                    currentFrom.parentElement.replaceChild(domKeyDomNodeMap[toKey], currentFrom)
                    currentFrom = domKeyDomNodeMap[toKey]
                    
                    await breakpoint('No "from" key')
                }
            }

            if (toKey && domKey) {
                domKeyHoldovers[domKey] = currentFrom
                let domKeyNode = domKeyDomNodeMap[toKey]

                if (domKeyNode) {
                    currentFrom.parentElement.replaceChild(domKeyNode, currentFrom)
                    currentFrom = domKeyNode
                    
                    await breakpoint('Move "from" key')
                } else {
                    domKeyHoldovers[domKey] = currentFrom
                    currentFrom = addNodeBefore(currentTo, currentFrom)
                    domKeyHoldovers[domKey].remove()
                    currentFrom = currentFrom.nextSibling
                    currentTo = currentTo.nextSibling
                   
                    await breakpoint('I dont even know what this does')
                    
                    continue
                }
            }
        }

        // Patch elements
        await patch(currentFrom, currentTo)

        currentTo = currentTo && currentTo.nextSibling
        currentFrom = currentFrom && currentFrom.nextSibling
    }

    // Cleanup extra froms
    while (currentFrom) {
        if(! shouldSkip(removing, currentFrom)) {
            let domForRemoval = currentFrom

            dom.removeChild(domForRemoval)

            await breakpoint('remove el')

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

        return clone
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
}
