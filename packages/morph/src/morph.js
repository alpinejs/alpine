let resolveStep = () => {}

let logger = () => {}

function breakpoint(message) {
    if (! debug) return

    message && logger(message.replace('\n', '\\n'))
   
    return new Promise(resolve => resolveStep = () => resolve())
}

export async function morph(from, toHtml, options) {
    assignOptions(options)
    
    let toEl = createElement(toHtml)

    // If there is no x-data on the element we're morphing,
    // let's seed it with the outer Alpine scope on the page.
    if (window.Alpine && ! from._x_dataStack) {
        toEl._x_dataStack = window.Alpine.closestDataStack(from)
        
        toEl._x_dataStack && window.Alpine.clone(from, toEl)
    }
    
    await breakpoint()

    patch(from, toEl)

    return from
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

async function patch(from, to) {
    // This is a time saver, however, it won't catch differences in nested <template> tags.
    // I'm leaving this here as I believe it's an important speed improvement, I just
    // don't see a way to enable it currently:
    //
    // if (from.isEqualNode(to)) return
   
    if (differentElementNamesTypesOrKeys(from, to)) {
        let result = patchElement(from, to)
        
        await breakpoint('Swap elements')
       
        return result
    }

    let updateChildrenOnly = false

    if (shouldSkip(updating, from, to, () => updateChildrenOnly = true)) return

    window.Alpine && initializeAlpineOnTo(from, to, () => updateChildrenOnly = true)

    if (textOrComment(to)) {
        await patchNodeValue(from, to)
        updated(from, to)
        
        return
    }

    if (! updateChildrenOnly) {
        await patchAttributes(from, to)
    }

    updated(from, to)

    await patchChildren(from, to)
}

function differentElementNamesTypesOrKeys(from, to) {
    return from.nodeType != to.nodeType
        || from.nodeName != to.nodeName
        || getKey(from) != getKey(to)
}

function textOrComment(el) {
    return el.nodeType === 3
        || el.nodeType === 8
}

function patchElement(from, to) {
    if (shouldSkip(removing, from)) return

    let toCloned = to.cloneNode(true)

    if (shouldSkip(adding, toCloned)) return

    dom(from).replace(toCloned)

    removed(from)
    added(toCloned)
}

async function patchNodeValue(from, to) {
    let value = to.nodeValue

    if (from.nodeValue !== value) {
        from.nodeValue = value

        await breakpoint('Change text node to: ' + value)
    }
}

async function patchAttributes(from, to) {
    if (from._x_isShown && ! to._x_isShown) {
        return
    }
    if (! from._x_isShown && to._x_isShown) {
        return
    }

    let domAttributes = Array.from(from.attributes)
    let toAttributes = Array.from(to.attributes)

    for (let i = domAttributes.length - 1; i >= 0; i--) {
        let name = domAttributes[i].name;

        if (! to.hasAttribute(name)) {
            from.removeAttribute(name)
           
            await breakpoint('Remove attribute')
        }
    }

    for (let i = toAttributes.length - 1; i >= 0; i--) {
        let name = toAttributes[i].name
        let value = toAttributes[i].value

        if (from.getAttribute(name) !== value) {
            from.setAttribute(name, value)

            await breakpoint(`Set [${name}] attribute to: "${value}"`)
        }
    }
}

async function patchChildren(from, to) {
    let domChildren = from.childNodes
    let toChildren = to.childNodes

    let toKeyToNodeMap = keyToMap(toChildren)
    let domKeyDomNodeMap = keyToMap(domChildren)

    let currentTo = dom(to).nodes().first()
    let currentFrom = dom(from).nodes().first()

    let domKeyHoldovers = {}

    while (currentTo) {
        let toKey = getKey(currentTo)
        let domKey = getKey(currentFrom)

        // Add new elements
        if (! currentFrom) {
            if (toKey && domKeyHoldovers[toKey]) {
                let holdover = domKeyHoldovers[toKey]

                dom.append(from, holdover)
                currentFrom = holdover

                await breakpoint('Add element (from key)')
            } else {
                let added = addNodeTo(currentTo, from)

                await breakpoint('Add element: ' + added.outerHTML || added.nodeValue)

                currentTo = dom(currentTo).nodes().next()

                continue
            }
        }

        if (lookahead) {
            let nextToElementSibling = dom(currentTo).next()

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
                currentFrom = dom(currentFrom).nodes.next()
                currentTo = dom(currentTo).nodes.next()

                await breakpoint('No "to" key')

                continue
            }

            if (toKey && ! domKey) {
                if (domKeyDomNodeMap[toKey]) {
                    currentFrom = dom(currentFrom).replace(domKeyDomNodeMap[toKey])
                    
                    await breakpoint('No "from" key')
                }
            }

            if (toKey && domKey) {
                domKeyHoldovers[domKey] = currentFrom
                let domKeyNode = domKeyDomNodeMap[toKey]

                if (domKeyNode) {
                    currentFrom = dom(currentFrom).replace(domKeyNode)
                    
                    await breakpoint('Move "from" key')
                } else {
                    domKeyHoldovers[domKey] = currentFrom
                    currentFrom = addNodeBefore(currentTo, currentFrom)
                    domKeyHoldovers[domKey].remove()
                    currentFrom = dom(currentFrom).next()
                    currentTo = dom(currentTo).next()
                   
                    await breakpoint('I dont even know what this does')
                    
                    continue
                }
            }
        }

        // Patch elements
        await patch(currentFrom, currentTo)

        currentTo = currentTo && dom(currentTo).next()
        currentFrom = currentFrom && dom(currentFrom).next()
    }

    // Cleanup extra froms
    while (currentFrom) {
        if(! shouldSkip(removing, currentFrom)) {
            let domForRemoval = currentFrom

            domForRemoval.remove()

            await breakpoint('remove el')

            removed(domForRemoval)
        }

        currentFrom = dom(currentFrom).nodes().next()
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

        dom(parent).append(clone)

        added(clone)

        return clone
    }
}

function addNodeBefore(node, beforeMe) {
    if(! shouldSkip(adding, node)) {
        let clone = node.cloneNode(true)

        dom(beforeMe).before(clone)

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

function dom(el) {
    return new DomManager(el)
}

class DomManager {
    el = undefined

    constructor(el) {
        this.el = el
    }

    traversals = {
        'first': 'firstElementChild',
        'next': 'nextElementSibling',
        'parent': 'parentElement',
    }

    nodes() {
        this.traversals = {
            'first': 'firstChild',
            'next': 'nextSibling',
            'parent': 'parentNode', 
        }; return this
    }

    first() {
        return this.teleportTo(this.el[this.traversals['first']])
    }

    next() {
        return this.teleportTo(this.teleportBack(this.el[this.traversals['next']]))
    }

    before(insertee) {
        this.el[this.traversals['parent']].insertBefore(insertee, this.el); return insertee
    }

    replace(replacement) {
        this.el[this.traversals['parent']].replaceChild(replacement, this.el); return replacement
    }
    
    append(appendee) {
        this.el.appendChild(appendee); return appendee
    }

    teleportTo(el) {
        if (! el) return el
        if (el._x_teleport) return el._x_teleport
        return el
    }

    teleportBack(el) {
        if (! el) return el
        if (el._x_teleportBack) return el._x_teleportBack
        return el
    }
}
