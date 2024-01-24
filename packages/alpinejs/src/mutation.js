import { destroyTree } from "./lifecycle"

let onAttributeAddeds = []
let onElRemoveds = []
let onElAddeds = []

export function onElAdded(callback) {
    onElAddeds.push(callback)
}

export function onElRemoved(el, callback) {
    if (typeof callback === 'function') {
        if (! el._x_cleanups) el._x_cleanups = []
        el._x_cleanups.push(callback)
    } else {
        callback = el
        onElRemoveds.push(callback)
    }
}

export function onAttributesAdded(callback) {
    onAttributeAddeds.push(callback)
}

export function onAttributeRemoved(el, name, callback) {
    if (! el._x_attributeCleanups) el._x_attributeCleanups = {}
    if (! el._x_attributeCleanups[name]) el._x_attributeCleanups[name] = []

    el._x_attributeCleanups[name].push(callback)
}

export function cleanupAttributes(el, names) {
    if (! el._x_attributeCleanups) return

    Object.entries(el._x_attributeCleanups).forEach(([name, value]) => {
        if (names === undefined || names.includes(name)) {
            value.forEach(i => i())

            delete el._x_attributeCleanups[name]
        }
    })
}

export function cleanupElement(el) {
    if (el._x_cleanups) {
        while (el._x_cleanups.length) el._x_cleanups.pop()()
    }
}

let observer = new MutationObserver(onMutate)

let currentlyObserving = false

export function startObservingMutations() {
    observer.observe(document, { subtree: true, childList: true, attributes: true, attributeOldValue: true })

    currentlyObserving = true
}

export function stopObservingMutations() {
    flushObserver()

    observer.disconnect()

    currentlyObserving = false
}

let queuedMutations = []

export function flushObserver() {
    let records = observer.takeRecords()

    queuedMutations.push(() => records.length > 0 && onMutate(records))

    let queueLengthWhenTriggered = queuedMutations.length

    queueMicrotask(() => {
        // If these two lengths match, then we KNOW that this is the LAST
        // flush in the current event loop. This way, we can process
        // all mutations in one batch at the end of everything...
        if (queuedMutations.length === queueLengthWhenTriggered) {
            // Now Alpine can process all the mutations...
            while (queuedMutations.length > 0) queuedMutations.shift()()
        }
    })
}

export function mutateDom(callback) {
    if (! currentlyObserving) return callback()

    stopObservingMutations()

    let result = callback()

    startObservingMutations()

    return result
}

let isCollecting = false
let deferredMutations = []

export function deferMutations() {
    isCollecting = true
}

export function flushAndStopDeferringMutations() {
    isCollecting = false

    onMutate(deferredMutations)

    deferredMutations = []
}

function onMutate(mutations) {
    if (isCollecting) {
        deferredMutations = deferredMutations.concat(mutations)

        return
    }

    let addedNodes = new Set
    let removedNodes = new Set
    let addedAttributes = new Map
    let removedAttributes = new Map

    for (let i = 0; i < mutations.length; i++) {
        if (mutations[i].target._x_ignoreMutationObserver) continue

        if (mutations[i].type === 'childList') {
            mutations[i].addedNodes.forEach(node => node.nodeType === 1 && addedNodes.add(node))
            mutations[i].removedNodes.forEach(node => node.nodeType === 1 && removedNodes.add(node))
        }

        if (mutations[i].type === 'attributes') {
            let el = mutations[i].target
            let name = mutations[i].attributeName
            let oldValue = mutations[i].oldValue

            let add = () => {
                if (! addedAttributes.has(el)) addedAttributes.set(el, [])

                addedAttributes.get(el).push({ name,  value: el.getAttribute(name) })
            }

            let remove = () => {
                if (! removedAttributes.has(el)) removedAttributes.set(el, [])

                removedAttributes.get(el).push(name)
            }

            // New attribute.
            if (el.hasAttribute(name) && oldValue === null) {
                add()
            // Changed attribute.
            } else if (el.hasAttribute(name)) {
                remove()
                add()
            // Removed attribute.
            } else {
                remove()
            }
        }
    }

    removedAttributes.forEach((attrs, el) => {
        cleanupAttributes(el, attrs)
    })

    addedAttributes.forEach((attrs, el) => {
        onAttributeAddeds.forEach(i => i(el, attrs))
    })

    for (let node of removedNodes) {
        // If an element gets moved on a page, it's registered
        // as both an "add" and "remove", so we want to skip those.
        if (addedNodes.has(node)) continue

        onElRemoveds.forEach(i => i(node))

        destroyTree(node)
    }

    // Mutations are bundled together by the browser but sometimes
    // for complex cases, there may be javascript code adding a wrapper
    // and then an alpine component as a child of that wrapper in the same
    // function and the mutation observer will receive 2 different mutations.
    // when it comes time to run them, the dom contains both changes so the child
    // element would be processed twice as Alpine calls initTree on
    // both mutations. We mark all nodes as _x_ignored and only remove the flag
    // when processing the node to avoid those duplicates.
    addedNodes.forEach((node) => {
        node._x_ignoreSelf = true
        node._x_ignore = true
    })
    for (let node of addedNodes) {
        // If the node was eventually removed as part of one of his
        // parent mutations, skip it
        if (removedNodes.has(node)) continue
        if (! node.isConnected) continue

        delete node._x_ignoreSelf
        delete node._x_ignore
        onElAddeds.forEach(i => i(node))
        node._x_ignore = true
        node._x_ignoreSelf = true
    }
    addedNodes.forEach((node) => {
        delete node._x_ignoreSelf
        delete node._x_ignore
    })

    addedNodes = null
    removedNodes = null
    addedAttributes = null
    removedAttributes = null
}
