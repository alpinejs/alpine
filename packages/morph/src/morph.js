import { dom, createElement, textOrComment} from './dom.js'

let resolveStep = () => {}

let logger = () => {}

export function morph(from, toHtml, options) {
    // We're defining these globals and methods inside this function (instead of outside)
    // because it's an async function and if run twice, they would overwrite
    // each other.

    let fromEl
    let toEl
    let key
        ,lookahead
        ,updating
        ,updated
        ,removing
        ,removed
        ,adding
        ,added

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
        // This is a time saver, however, it won't catch differences in nested <template> tags.
        // I'm leaving this here as I believe it's an important speed improvement, I just
        // don't see a way to enable it currently:
        //
        // if (from.isEqualNode(to)) return

        if (differentElementNamesTypesOrKeys(from, to)) {
            // Swap elements...
            return patchElement(from, to)
        }

        let updateChildrenOnly = false

        if (shouldSkip(updating, from, to, () => updateChildrenOnly = true)) return

        window.Alpine && initializeAlpineOnTo(from, to, () => updateChildrenOnly = true)

        if (textOrComment(to)) {
            patchNodeValue(from, to)
            updated(from, to)

            return
        }

        if (! updateChildrenOnly) {
            patchAttributes(from, to)
        }

        updated(from, to)

        patchChildren(Array.from(from.childNodes), Array.from(to.childNodes), (toAppend) => {
            from.appendChild(toAppend)
        })
    }

    function differentElementNamesTypesOrKeys(from, to) {
        return from.nodeType != to.nodeType
            || from.nodeName != to.nodeName
            || getKey(from) != getKey(to)
    }

    function patchElement(from, to) {
        if (shouldSkip(removing, from)) return

        let toCloned = to.cloneNode(true)

        if (shouldSkip(adding, toCloned)) return

        dom.replace([from], from, toCloned)

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

    function patchChildren(fromChildren, toChildren, appendFn) {
        // I think I can get rid of this for now:
        let fromKeyDomNodeMap = {} // keyToMap(fromChildren)
        let fromKeyHoldovers = {}

        let currentTo = dom.first(toChildren)
        let currentFrom = dom.first(fromChildren)

        while (currentTo) {
            let toKey = getKey(currentTo)
            let fromKey = getKey(currentFrom)

            // Add new elements
            if (! currentFrom) {
                if (toKey && fromKeyHoldovers[toKey]) {
                    // Add element (from key)...
                    let holdover = fromKeyHoldovers[toKey]

                    fromChildren = dom.append(fromChildren, holdover, appendFn)
                    currentFrom = holdover
                } else {
                    if(! shouldSkip(adding, currentTo)) {
                        // Add element...
                        let clone = currentTo.cloneNode(true)

                        fromChildren = dom.append(fromChildren, clone, appendFn)

                        added(clone)
                    }

                    currentTo = dom.next(toChildren, currentTo)

                    continue
                }
            }

            // Handle conditional markers (presumably added by backends like Livewire)...
            let isIf = node => node.nodeType === 8 && node.textContent === ' __BLOCK__ '
            let isEnd = node => node.nodeType === 8 && node.textContent === ' __ENDBLOCK__ '

            if (isIf(currentTo) && isIf(currentFrom)) {
                let newFromChildren = []
                let appendPoint
                let nestedIfCount = 0
                while (currentFrom) {
                    let next = dom.next(fromChildren, currentFrom)

                    if (isIf(next)) {
                        nestedIfCount++
                    } else if (isEnd(next) && nestedIfCount > 0) {
                        nestedIfCount--
                    } else if (isEnd(next) && nestedIfCount === 0) {
                        currentFrom = dom.next(fromChildren, next)
                        appendPoint = next

                        break;
                    }

                    newFromChildren.push(next)
                    currentFrom = next
                }

                let newToChildren = []
                nestedIfCount = 0
                while (currentTo) {
                    let next = dom.next(toChildren, currentTo)

                    if (isIf(next)) {
                        nestedIfCount++
                    } else if (isEnd(next) && nestedIfCount > 0) {
                        nestedIfCount--
                    } else if (isEnd(next) && nestedIfCount === 0) {
                        currentTo = dom.next(toChildren, next)

                        break;
                    }

                    newToChildren.push(next)
                    currentTo = next
                }

                patchChildren(newFromChildren, newToChildren, node => appendPoint.before(node))

                continue
            }

            // Lookaheads should only apply to non-text-or-comment elements...
            if (currentFrom.nodeType === 1 && lookahead) {
                let nextToElementSibling = dom.next(toChildren, currentTo)

                let found = false

                while (! found && nextToElementSibling) {
                    if (currentFrom.isEqualNode(nextToElementSibling)) {
                        found = true; // This ";" needs to be here...

                        [fromChildren, currentFrom] = addNodeBefore(fromChildren, currentTo, currentFrom)

                        fromKey = getKey(currentFrom)
                    }

                    nextToElementSibling = dom.next(toChildren, nextToElementSibling)
                }
            }

            if (toKey !== fromKey) {
                if (! toKey && fromKey) {
                    // No "to" key...
                    fromKeyHoldovers[fromKey] = currentFrom; // This ";" needs to be here...
                    [fromChildren, currentFrom] = addNodeBefore(fromChildren, currentTo, currentFrom)
                    fromChildren = dom.remove(fromChildren, fromKeyHoldovers[fromKey])
                    currentFrom = dom.next(fromChildren, currentFrom)
                    currentTo = dom.next(toChildren, currentTo)

                    continue
                }

                if (toKey && ! fromKey) {
                    if (fromKeyDomNodeMap[toKey]) {
                        // No "from" key...
                        fromChildren = dom.replace(fromChildren, currentFrom, fromKeyDomNodeMap[toKey])
                        currentFrom = fromKeyDomNodeMap[toKey]
                    }
                }

                if (toKey && fromKey) {
                    let fromKeyNode = fromKeyDomNodeMap[toKey]

                    if (fromKeyNode) {
                        // Move "from" key...
                        fromKeyHoldovers[fromKey] = currentFrom
                        fromChildren = dom.replace(fromChildren, currentFrom, fromKeyNode)
                        currentFrom = fromKeyNode
                    } else {
                        // Swap elements with keys...
                        fromKeyHoldovers[fromKey] = currentFrom; // This ";" needs to be here...
                        [fromChildren, currentFrom] = addNodeBefore(fromChildren, currentTo, currentFrom)
                        fromChildren = dom.remove(fromChildren, fromKeyHoldovers[fromKey])
                        currentFrom = dom.next(fromChildren, currentFrom)
                        currentTo = dom.next(toChildren, currentTo)

                        continue
                    }
                }
            }

            // Get next from sibling before patching in case the node is replaced
            let currentFromNext = currentFrom && dom.next(fromChildren, currentFrom)

            // Patch elements
            patch(currentFrom, currentTo)

            currentTo = currentTo && dom.next(toChildren, currentTo)
            currentFrom = currentFromNext
        }

        // Cleanup extra froms.
        let removals = []

        // We need to collect the "removals" first before actually
        // removing them so we don't mess with the order of things.
        while (currentFrom) {
            if(! shouldSkip(removing, currentFrom)) removals.push(currentFrom)

            currentFrom = dom.next(fromChildren, currentFrom)
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

        els.forEach(el => {
            let theKey = getKey(el)

            if (theKey) {
                map[theKey] = el
            }
        })

        return map
    }

    function addNodeBefore(children, node, beforeMe) {
        if(! shouldSkip(adding, node)) {
            let clone = node.cloneNode(true)

            children = dom.before(children, beforeMe, clone)

            added(clone)

            return [children, clone]
        }

        return [children, node]
    }

    // Finally we morph the element

    assignOptions(options)

    fromEl = from
    toEl = typeof toHtml === 'string' ? createElement(toHtml) : toHtml

    // If there is no x-data on the element we're morphing,
    // let's seed it with the outer Alpine scope on the page.
    if (window.Alpine && window.Alpine.closestDataStack && ! from._x_dataStack) {
        toEl._x_dataStack = window.Alpine.closestDataStack(from)

        toEl._x_dataStack && window.Alpine.clone(from, toEl)
    }

    patch(from, toEl)

    // Release these for the garbage collector.
    fromEl = undefined
    toEl = undefined

    return from
}

morph.step = () => resolveStep()
morph.log = (theLogger) => {
    logger = theLogger
}

function shouldSkip(hook, ...args) {
    let skip = false

    hook(...args, () => skip = true)

    return skip
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
