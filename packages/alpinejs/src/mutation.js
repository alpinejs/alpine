import { dequeueJob } from "./scheduler";
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
    el._x_effects?.forEach(dequeueJob)

    while (el._x_cleanups?.length) el._x_cleanups.pop()()
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

    let addedNodes = []
    let removedNodes = new Set
    let addedAttributes = new Map
    let removedAttributes = new Map

    for (let i = 0; i < mutations.length; i++) {
        if (mutations[i].target._x_ignoreMutationObserver) continue

        if (mutations[i].type === 'childList') {
            mutations[i].removedNodes.forEach(node => {
                if (node.nodeType !== 1) return

                // No need to process removed nodes that haven't been initialized by Alpine...
                if (! node._x_marker) return

                removedNodes.add(node)
            })

            mutations[i].addedNodes.forEach(node => {
                if (node.nodeType !== 1) return

                // If the node is a removal as well, that means it's a "move" operation and we'll leave it alone...
                if (removedNodes.has(node)) {
                    removedNodes.delete(node)

                    return
                }

                // If the node has already been initialized, we'll leave it alone...
                if (node._x_marker) return;

                addedNodes.push(node)
            })
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

    // There are two special scenarios we need to account for when using the mutation
    // observer to init and destroy elements. First, when a node is "moved" on the page,
    // it's registered as both an "add" and a "remove", so we want to skip those.
    // (This is handled above by the ._x_marker conditionals...)
    // Second, when a node is "wrapped", it gets registered as a "removal" and the wrapper
    // as an "addition". We don't want to remove, then re-initialize the node, so we look
    // and see if it's inside any added nodes (wrappers) and skip it.
    // (This is handled below by the .contains conditional...)

    for (let node of removedNodes) {
        if (addedNodes.some(i => i.contains(node))) continue

        onElRemoveds.forEach(i => i(node))
    }

    for (let node of addedNodes) {
        if (! node.isConnected) continue

        onElAddeds.forEach(i => i(node))
    }

    addedNodes = null
    removedNodes = null
    addedAttributes = null
    removedAttributes = null
}
