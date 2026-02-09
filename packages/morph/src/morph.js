let resolveStep = () => {}

let logger = () => {}

export function morph(from, toHtml, options) {
    monkeyPatchDomSetAttributeToAllowAtSymbols()

    // We're defining these globals and methods inside this function (instead of outside)
    // because it's an async function and if run twice, they would overwrite
    // each other.

    let context = createMorphContext(options)

    // Finally we morph the element

    let toEl = typeof toHtml === 'string' ? createElement(toHtml) : toHtml

    if (window.Alpine && window.Alpine.closestDataStack && ! from._x_dataStack) {
        // Just in case a part of this template uses Alpine scope from somewhere
        // higher in the DOM tree, we'll find that state and replace it on the root
        // element so everything is synced up accurately.
        toEl._x_dataStack = window.Alpine.closestDataStack(from)

        // We will kick off a clone on the root element.
        toEl._x_dataStack && window.Alpine.cloneNode(from, toEl)
    }

    context.patch(from, toEl)

    return from
}

export function morphBetween(startMarker, endMarker, toHtml, options = {}) {
    monkeyPatchDomSetAttributeToAllowAtSymbols()

    let context = createMorphContext(options)

    // Setup from block...
    let fromContainer = startMarker.parentNode
    let fromBlock = new Block(startMarker, endMarker)

    // Setup to block...
    let toContainer = typeof toHtml === 'string'
        ? (() => {
            let container = document.createElement('div')
            container.insertAdjacentHTML('beforeend', toHtml)
            return container
        })()
        : toHtml

    let toStartMarker = document.createComment('[morph-start]')
    let toEndMarker = document.createComment('[morph-end]')

    toContainer.insertBefore(toStartMarker, toContainer.firstChild)
    toContainer.appendChild(toEndMarker)

    let toBlock = new Block(toStartMarker, toEndMarker)

    if (window.Alpine && window.Alpine.closestDataStack) {
        toContainer._x_dataStack = window.Alpine.closestDataStack(fromContainer)
        toContainer._x_dataStack && window.Alpine.cloneNode(fromContainer, toContainer)
    }

    // Run the patch
    context.patchChildren(fromBlock, toBlock)
}

function createMorphContext(options = {}) {
    let defaultGetKey = el => el.getAttribute('key')
    let noop = () => {}

    let context = {
        key: options.key || defaultGetKey,
        lookahead: options.lookahead || false,
        updating: options.updating || noop,
        updated: options.updated || noop,
        removing: options.removing || noop,
        removed: options.removed || noop,
        adding: options.adding || noop,
        added: options.added || noop
    }

    context.patch = function(from, to) {
        if (context.differentElementNamesTypesOrKeys(from, to)) {
            return context.swapElements(from, to)
        }

        let updateChildrenOnly = false
        let skipChildren = false

        // If we used `shouldSkip()` here and append the `skipChildren` function on the end, it will cause the signature of the `updating`
        // hook to change. For example, when it was `shouldSkip()` the signature was `updating: (el, toEl, childrenOnly, skip)`. But if
        // we append `skipChildren()`, it would make the signature `updating: (el, toEl, childrenOnly, skipChildren, skip)`. This is
        // a breaking change due to how the `shouldSkip()` function is structured.
        //
        // So we're using `shouldSkipChildren()` instead which doesn't have this problem as it allows us to pass in the `skipChildren()`
        // function as an earlier parameter and then append it to the `updating` hook signature manually. The signature of `updating`
        // hook is now `updating: (el, toEl, childrenOnly, skip, skipChildren)`.

        let skipUntil = predicate => context.skipUntilCondition = predicate

        if (shouldSkipChildren(context.updating, () => skipChildren = true, skipUntil, from, to, () => updateChildrenOnly = true)) return

        // Initialize the server-side HTML element with Alpine...
        if (from.nodeType === 1 && window.Alpine) {
            window.Alpine.cloneNode(from, to)

            if (from._x_teleport && to._x_teleport) {
                context.patch(from._x_teleport, to._x_teleport)
            }
        }

        if (textOrComment(to)) {
            context.patchNodeValue(from, to)

            context.updated(from, to)

            return
        }

        if (! updateChildrenOnly) {
            context.patchAttributes(from, to)
        }

        context.updated(from, to)

        if (! skipChildren) {
            context.patchChildren(from, to)
        }
    }

    context.differentElementNamesTypesOrKeys = function(from, to) {
        return from.nodeType != to.nodeType
            || from.nodeName != to.nodeName
            || context.getKey(from) != context.getKey(to)
    }

    context.swapElements = function(from, to) {
        if (shouldSkip(context.removing, from)) return

        let toCloned = to.cloneNode(true)

        if (shouldSkip(context.adding, toCloned)) return

        from.replaceWith(toCloned)

        context.removed(from)
        context.added(toCloned)
    }

    context.patchNodeValue = function(from, to) {
        let value = to.nodeValue

        if (from.nodeValue !== value) {
            // Change text node...
            from.nodeValue = value
        }
    }

    context.patchAttributes = function(from, to) {
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
                if (name === 'open' && from.nodeName === 'DIALOG' && from.open) {
                    from.close()
                } else {
                    from.removeAttribute(name)
                }
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

    context.patchChildren = function(from, to) {
        let fromKeys = context.keyToMap(from.children)
        let fromKeyHoldovers = {}

        let currentTo = getFirstNode(to)
        let currentFrom = getFirstNode(from)

        while (currentTo) {
            // If the "from" element has a dynamically bound "id" (x-bind:id="..."),
            // Let's transfer it to the "to" element so that there isn't a key mismatch...
            seedingMatchingId(currentTo, currentFrom)

            let toKey = context.getKey(currentTo)
            let fromKey = context.getKey(currentFrom)

            if (context.skipUntilCondition) {
                let fromDone = ! currentFrom || context.skipUntilCondition(currentFrom)
                let toDone   = ! currentTo   || context.skipUntilCondition(currentTo)
                if (fromDone && toDone) {
                    context.skipUntilCondition = null
                } else {
                    if (! fromDone) currentFrom = currentFrom && getNextSibling(from, currentFrom)
                    if (! toDone)   currentTo   = currentTo   && getNextSibling(to, currentTo)
                    continue
                }
            }

            // Add new elements...
            if (! currentFrom) {
                if (toKey && fromKeyHoldovers[toKey]) {
                    // Add element (from key)...
                    let holdover = fromKeyHoldovers[toKey]

                    from.appendChild(holdover)

                    currentFrom = holdover
                    fromKey = context.getKey(currentFrom)
                } else {
                    if(! shouldSkip(context.adding, currentTo)) {
                        // Add element...
                        let clone = currentTo.cloneNode(true)

                        from.appendChild(clone)

                        context.added(clone)
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

                context.patchChildren(fromBlock, toBlock)

                continue
            }

            // Lookaheads should only apply to non-text-or-comment elements...
            if (currentFrom.nodeType === 1 && context.lookahead && ! currentFrom.isEqualNode(currentTo)) {
                let nextToElementSibling = getNextSibling(to, currentTo)

                let found = false

                while (! found && nextToElementSibling) {
                    if (nextToElementSibling.nodeType === 1 && currentFrom.isEqualNode(nextToElementSibling)) {
                        found = true; // This ";" needs to be here...

                        currentFrom = context.addNodeBefore(from, currentTo, currentFrom)

                        fromKey = context.getKey(currentFrom)
                    }

                    nextToElementSibling = getNextSibling(to, nextToElementSibling)
                }
            }

            if (toKey !== fromKey) {
                if (! toKey && fromKey) {
                    // No "to" key...
                    fromKeyHoldovers[fromKey] = currentFrom; // This ";" needs to be here...
                    currentFrom = context.addNodeBefore(from, currentTo, currentFrom)
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
                        fromKey = context.getKey(currentFrom)
                    }
                }

                if (toKey && fromKey) {
                    let fromKeyNode = fromKeys[toKey]

                    if (fromKeyNode) {
                        // Move "from" key...
                        fromKeyHoldovers[fromKey] = currentFrom
                        currentFrom.replaceWith(fromKeyNode)
                        currentFrom = fromKeyNode
                        fromKey = context.getKey(currentFrom)
                    } else {
                        // Swap elements with keys...
                        fromKeyHoldovers[fromKey] = currentFrom; // This ";" needs to be here...
                        currentFrom = context.addNodeBefore(from, currentTo, currentFrom)
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
            context.patch(currentFrom, currentTo)

            currentTo = currentTo && getNextSibling(to, currentTo) // dom.next(from, toChildren, currentTo))

            currentFrom = currentFromNext
        }

        // Cleanup extra forms.
        let removals = []

        // We need to collect the "removals" first before actually
        // removing them so we don't mess with the order of things.
        while (currentFrom) {
            if (! shouldSkip(context.removing, currentFrom)) removals.push(currentFrom)

            // currentFrom = dom.next(fromChildren, currentFrom)
            currentFrom = getNextSibling(from, currentFrom)
        }

        // Now we can do the actual removals.
        while (removals.length) {
            let domForRemoval = removals.shift()

            domForRemoval.remove()

            context.removed(domForRemoval)
        }
    }

    context.getKey = function(el) {
        return el && el.nodeType === 1 && context.key(el)
    }

    context.keyToMap = function(els) {
        let map = {}

        for (let el of els) {
            let theKey = context.getKey(el)

            if (theKey) {
                map[theKey] = el
            }
        }

        return map
    }

    context.addNodeBefore = function(parent, node, beforeMe) {
        if(! shouldSkip(context.adding, node)) {
            let clone = node.cloneNode(true)

            parent.insertBefore(clone, beforeMe)

            context.added(clone)

            return clone
        }

        return node
    }

    return context
}

// These are legacy holdovers that don't do anything anymore...
morph.step = () => {}
morph.log = () => {}

function shouldSkip(hook, ...args) {
    let skip = false

    hook(...args, () => skip = true)

    return skip
}

// Due to the structure of the `shouldSkip()` function, we can't pass in the `skipChildren`
// function as an argument as it would change the signature of the existing hooks. So we
// are using this function instead which doesn't have this problem as we can pass the
// `skipChildren` function in as an earlier argument and then append it to the end
// of the hook signature manually.
function shouldSkipChildren(hook, skipChildren, skipUntil, ...args) {
    let skip = false
    hook(...args, () => skip = true, skipChildren, skipUntil)
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
    if (! to.setAttribute) return

    to.setAttribute('id', fromId)
    to.id = fromId
}
