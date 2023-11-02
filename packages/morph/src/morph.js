
let resolveStep = () => {}

let logger = () => {}

export function morph(from, toHtml, options) {
    monkeyPatchDomSetAttributeToAllowAtSymbols()

    // We're defining these globals and methods inside this function (instead of outside)
    // because it's an async function and if run twice, they would overwrite
    // each other.

    let fromEl
    let toEl
    let key, lookahead, updating, updated, removing, removed, adding, added

    function assignOptions(options = {}) {
        let defaultGetKey = el => el.getAttribute('key')
        let noop = () => {}

        updating = options.updating || noop
        updated = options.updated || noop
        removing = options.removing || noop
        removed = options.removed || noop
        adding = options.adding || noop
        added = options.added || noop
        key = options.key || defaultGetKey
        lookahead = options.lookahead || false
    }

    function patch(from, to) {
        if (differentElementNamesTypesOrKeys(from, to)) {
            return swapElements(from, to)
        }

        let updateChildrenOnly = false

        if (shouldSkip(updating, from, to, () => updateChildrenOnly = true)) return

        // Initialize the server-side HTML element with Alpine...
        if (from.nodeType === 1 && window.Alpine) {
            window.Alpine.cloneNode(from, to)
        }

        if (textOrComment(to)) {
            patchNodeValue(from, to)

            updated(from, to)

            return
        }

        if (! updateChildrenOnly) {
            patchAttributes(from, to)
        }

        updated(from, to)

        patchChildren(from, to)
    }

    function differentElementNamesTypesOrKeys(from, to) {
        return from.nodeType != to.nodeType
            || from.nodeName != to.nodeName
            || getKey(from) != getKey(to)
    }

    function swapElements(from, to) {
        if (shouldSkip(removing, from)) return

        let toCloned = to.cloneNode(true)

        if (shouldSkip(adding, toCloned)) return

        from.replaceWith(toCloned)

        removed(from)
        added(toCloned)
    }

    function patchNodeValue(from, to) {
        let value = to.nodeValue

        if (from.nodeValue !== value) {
            // Change text node...
            from.nodeValue = value
        }
    }

    function patchAttributes(from, to) {
        if (from._x_transitioning) return

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
                // Remove attribute...
                from.removeAttribute(name)
            }
        }

        for (let i = toAttributes.length - 1; i >= 0; i--) {
            let name = toAttributes[i].name
            let value = toAttributes[i].value

            if (from.getAttribute(name) !== value) {
                from.setAttribute(name, value)
            }
        }
    }

    function patchChildren(from, to) {
        // If we hit a <template x-teleport="body">,
        // let's use the teleported nodes for this patch...
        if (from._x_teleport) from = from._x_teleport
        if (to._x_teleport) to = to._x_teleport

        let fromKeys = keyToMap(from.children)
        let fromKeyHoldovers = {}

        let currentTo = getFirstNode(to)
        let currentFrom = getFirstNode(from)

        while (currentTo) {
            // If the "from" element has a dynamically bound "id" (x-bind:id="..."),
            // Let's transfer it to the "to" element so that there isn't a key mismatch...
            seedingMatchingId(currentTo, currentFrom)

            let toKey = getKey(currentTo)
            let fromKey = getKey(currentFrom)

            // Add new elements...
            if (! currentFrom) {
                if (toKey && fromKeyHoldovers[toKey]) {
                    // Add element (from key)...
                    let holdover = fromKeyHoldovers[toKey]

                    from.appendChild(holdover)

                    currentFrom = holdover
                } else {
                    if(! shouldSkip(adding, currentTo)) {
                        // Add element...
                        let clone = currentTo.cloneNode(true)

                        from.appendChild(clone)

                        added(clone)
                    }

                    currentTo = getNextSibling(to, currentTo)

                    continue
                }
            }

            // Handle conditional markers (presumably added by backends like Livewire)...
            let isIf = node => node && node.nodeType === 8 && node.textContent === '[if BLOCK]><![endif]'
            let isEnd = node => node && node.nodeType === 8 && node.textContent === '[if ENDBLOCK]><![endif]'

            if (isIf(currentTo) && isIf(currentFrom)) {
                let nestedIfCount = 0

                let fromBlockStart = currentFrom

                while (currentFrom) {
                    let next = getNextSibling(from, currentFrom)

                    if (isIf(next)) {
                        nestedIfCount++
                    } else if (isEnd(next) && nestedIfCount > 0) {
                        nestedIfCount--
                    } else if (isEnd(next) && nestedIfCount === 0) {
                        currentFrom = next

                        break;
                    }

                    currentFrom = next
                }

                let fromBlockEnd = currentFrom

                nestedIfCount = 0

                let toBlockStart = currentTo

                while (currentTo) {
                    let next = getNextSibling(to, currentTo)

                    if (isIf(next)) {
                        nestedIfCount++
                    } else if (isEnd(next) && nestedIfCount > 0) {
                        nestedIfCount--
                    } else if (isEnd(next) && nestedIfCount === 0) {
                        currentTo = next

                        break;
                    }

                    currentTo = next
                }

                let toBlockEnd = currentTo

                let fromBlock = new Block(fromBlockStart, fromBlockEnd)
                let toBlock = new Block(toBlockStart, toBlockEnd)

                patchChildren(fromBlock, toBlock)

                continue
            }

            // Lookaheads should only apply to non-text-or-comment elements...
            if (currentFrom.nodeType === 1 && lookahead && ! currentFrom.isEqualNode(currentTo)) {
                let nextToElementSibling = getNextSibling(to, currentTo)

                let found = false

                while (! found && nextToElementSibling) {
                    if (nextToElementSibling.nodeType === 1 && currentFrom.isEqualNode(nextToElementSibling)) {
                        found = true; // This ";" needs to be here...

                        currentFrom = addNodeBefore(from, currentTo, currentFrom)

                        fromKey = getKey(currentFrom)
                    }

                    nextToElementSibling = getNextSibling(to, nextToElementSibling)
                }
            }

            if (toKey !== fromKey) {
                if (! toKey && fromKey) {
                    // No "to" key...
                    fromKeyHoldovers[fromKey] = currentFrom; // This ";" needs to be here...
                    currentFrom = addNodeBefore(from, currentTo, currentFrom)
                    fromKeyHoldovers[fromKey].remove()
                    currentFrom = getNextSibling(from, currentFrom)
                    currentTo = getNextSibling(to, currentTo)

                    continue
                }

                if (toKey && ! fromKey) {
                    if (fromKeys[toKey]) {
                        // No "from" key...
                        currentFrom.replaceWith(fromKeys[toKey])
                        currentFrom = fromKeys[toKey]
                    }
                }

                if (toKey && fromKey) {
                    let fromKeyNode = fromKeys[toKey]

                    if (fromKeyNode) {
                        // Move "from" key...
                        fromKeyHoldovers[fromKey] = currentFrom
                        currentFrom.replaceWith(fromKeyNode)
                        currentFrom = fromKeyNode
                    } else {
                        // Swap elements with keys...
                        fromKeyHoldovers[fromKey] = currentFrom; // This ";" needs to be here...
                        currentFrom = addNodeBefore(from, currentTo, currentFrom)
                        fromKeyHoldovers[fromKey].remove()
                        currentFrom = getNextSibling(from, currentFrom)
                        currentTo = getNextSibling(to, currentTo)

                        continue
                    }
                }
            }

            // Get next from sibling before patching in case the node is replaced
            let currentFromNext = currentFrom && getNextSibling(from, currentFrom) //dom.next(from, fromChildren, currentFrom))

            // Patch elements
            patch(currentFrom, currentTo)

            currentTo = currentTo && getNextSibling(to, currentTo) // dom.next(from, toChildren, currentTo))

            currentFrom = currentFromNext
        }

        // Cleanup extra forms.
        let removals = []

        // We need to collect the "removals" first before actually
        // removing them so we don't mess with the order of things.
        while (currentFrom) {
            if (! shouldSkip(removing, currentFrom)) removals.push(currentFrom)

            // currentFrom = dom.next(fromChildren, currentFrom)
            currentFrom = getNextSibling(from, currentFrom)
        }

        // Now we can do the actual removals.
        while (removals.length) {
            let domForRemoval = removals.shift()

            domForRemoval.remove()

            removed(domForRemoval)
        }
    }

    function getKey(el) {
        return el && el.nodeType === 1 && key(el)
    }

    function keyToMap(els) {
        let map = {}

        for (let el of els) {
            let theKey = getKey(el)

            if (theKey) {
                map[theKey] = el
            }
        }

        return map
    }

    function addNodeBefore(parent, node, beforeMe) {
        if(! shouldSkip(adding, node)) {
            let clone = node.cloneNode(true)

            parent.insertBefore(clone, beforeMe)

            added(clone)

            return clone
        }

        return node
    }

    // Finally we morph the element

    assignOptions(options)

    fromEl = from
    toEl = typeof toHtml === 'string' ? createElement(toHtml) : toHtml

    if (window.Alpine && window.Alpine.closestDataStack && ! from._x_dataStack) {
        // Just in case a part of this template uses Alpine scope from somewhere
        // higher in the DOM tree, we'll find that state and replace it on the root
        // element so everything is synced up accurately.
        toEl._x_dataStack = window.Alpine.closestDataStack(from)

        // We will kick off a clone on the root element.
        toEl._x_dataStack && window.Alpine.cloneNode(from, toEl)
    }

    patch(from, toEl)

    // Release these for the garbage collector.
    fromEl = undefined
    toEl = undefined

    return from
}

// These are legacy holdovers that don't do anything anymore...
morph.step = () => {}
morph.log = () => {}

function shouldSkip(hook, ...args) {
    let skip = false

    hook(...args, () => skip = true)

    return skip
}

let patched = false

export function createElement(html) {
    const template = document.createElement('template')
    template.innerHTML = html
    return template.content.firstElementChild
}

export function textOrComment(el) {
    return el.nodeType === 3
        || el.nodeType === 8
}

// "Block"s are used when morphing with conditional markers.
// They allow us to patch isolated portions of a list of
// siblings in a DOM tree...
class Block {
    constructor(start, end) {
        // We're assuming here that the start and end caps are comment blocks...
        this.startComment = start
        this.endComment = end
    }

    get children() {
        let children = [];

        let currentNode = this.startComment.nextSibling

        while (currentNode && currentNode !== this.endComment) {
            children.push(currentNode)

            currentNode = currentNode.nextSibling
        }

        return children
    }

    appendChild(child) {
        this.endComment.before(child)
    }

    get firstChild() {
        let first = this.startComment.nextSibling

        if (first === this.endComment) return

        return first
    }

    nextNode(reference) {
        let next = reference.nextSibling

        if (next === this.endComment) return

        return next
    }

    insertBefore(newNode, reference) {
        reference.before(newNode)

        return newNode
    }
}

function getFirstNode(parent) {
    return parent.firstChild
}

function getNextSibling(parent, reference) {
    let next

    if (parent instanceof Block) {
        next =  parent.nextNode(reference)
    } else {
        next = reference.nextSibling
    }

    return next
}

function monkeyPatchDomSetAttributeToAllowAtSymbols() {
    if (patched) return

    patched = true

    // Because morphdom may add attributes to elements containing "@" symbols
    // like in the case of an Alpine `@click` directive, we have to patch
    // the standard Element.setAttribute method to allow this to work.
    let original = Element.prototype.setAttribute

    let hostDiv = document.createElement('div')

    Element.prototype.setAttribute = function newSetAttribute(name, value) {
        if (! name.includes('@')) {
            return original.call(this, name, value)
        }

        hostDiv.innerHTML = `<span ${name}="${value}"></span>`

        let attr = hostDiv.firstElementChild.getAttributeNode(name)

        hostDiv.firstElementChild.removeAttributeNode(attr)

        this.setAttributeNode(attr)
    }
}

function seedingMatchingId(to, from) {
    let fromId = from && from._x_bindings && from._x_bindings.id

    if (! fromId) return

    to.setAttribute('id', fromId)
    to.id = fromId
}
