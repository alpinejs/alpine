import { dom, createElement, textOrComment} from './dom.js'

let resolveStep = () => {}

let logger = () => {}

export async function morph(from, toHtml, options) {
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
        ,debug


    function breakpoint(message) {
        if (! debug) return

        logger((message || '').replace('\n', '\\n'), fromEl, toEl)

        return new Promise(resolve => resolveStep = () => resolve())
    }

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
        debug = options.debug || false
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

        let isInsideWall = false

        while (currentTo) {
            // If "<!-- end -->"
            if (
                currentTo.nodeType === 8
                && currentTo.textContent === ' end '
            ) {
                isInsideWall = false
                currentTo = dom(currentTo).nodes().next()
                currentFrom = dom(currentFrom).nodes().next()
                continue
            }

            if (insideWall)

            if (isInsideWall) {
                console.log(currentFrom, currentTo)
            }

            let toKey = getKey(currentTo)
            let domKey = getKey(currentFrom)

            // Add new elements
            if (! currentFrom) {
                if (toKey && domKeyHoldovers[toKey]) {
                    let holdover = domKeyHoldovers[toKey]

                    dom(from).append(holdover)
                    currentFrom = holdover

                    await breakpoint('Add element (from key)')
                } else {
                    let added = addNodeTo(currentTo, from) || {}

                    await breakpoint('Add element: ' + (added.outerHTML || added.nodeValue))

                    currentTo = dom(currentTo).nodes().next()

                    continue
                }
            }

            // If "<!-- if -->"
            if (
                currentTo.nodeType === 8
                && currentTo.textContent === ' if '
                && currentFrom.nodeType === 8
                && currentFrom.textContent === ' if '
            ) {
                isInsideWall = true
                currentTo = dom(currentTo).nodes().next()
                currentFrom = dom(currentFrom).nodes().next()
                continue
            }

            if (lookahead) {
                let nextToElementSibling = dom(currentTo).next()

                let found = false

                while (!found && nextToElementSibling) {
                    if (currentFrom.isEqualNode(nextToElementSibling)) {
                        found = true

                        currentFrom = addNodeBefore(currentTo, currentFrom)

                        domKey = getKey(currentFrom)

                        await breakpoint('Move element (lookahead)')
                    }

                    nextToElementSibling = dom(nextToElementSibling).next()
                }
            }

            if (toKey !== domKey) {
                if (! toKey && domKey) {
                    domKeyHoldovers[domKey] = currentFrom
                    currentFrom = addNodeBefore(currentTo, currentFrom)
                    domKeyHoldovers[domKey].remove()
                    currentFrom = dom(currentFrom).nodes().next()
                    currentTo = dom(currentTo).nodes().next()

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

                        await breakpoint('Swap elements with keys')

                        continue
                    }
                }
            }

            // Get next from sibling before patching in case the node is replaced
            let currentFromNext = currentFrom && dom(currentFrom).nodes().next()

            // Patch elements
            await patch(currentFrom, currentTo)

            currentTo = currentTo && dom(currentTo).nodes().next()
            currentFrom = currentFromNext
        }

        // Cleanup extra forms.
        let removals = []

        // We need to collect the "removals" first before actually
        // removing them so we don't mess with the order of things.
        while (currentFrom) {
            if(! shouldSkip(removing, currentFrom)) removals.push(currentFrom)

            currentFrom = dom(currentFrom).nodes().next()
        }

        // Now we can do the actual removals.
        while (removals.length) {
            let domForRemoval = removals.shift()

            domForRemoval.remove()

            await breakpoint('remove el')

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

    function addNodeTo(node, parent) {
        if(! shouldSkip(adding, node)) {
            let clone = node.cloneNode(true)

            dom(parent).append(clone)

            added(clone)

            return clone
        }

        return null;
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

    await breakpoint()

    await patch(from, toEl)

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
