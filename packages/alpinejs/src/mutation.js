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

// Two-observer pattern:
// 1. Component observer: watches subtree changes (childList + attributes)
//    inside each [x-data] component root.
// 2. Document observer: lightweight childList-only watcher on document.body
//    to detect new top-level [x-data] elements being added to the page.
//
// This reduces how often Alpine's mutation callback fires for DOM changes
// that have nothing to do with Alpine components (e.g. third-party scripts).

let componentObserver = new MutationObserver(onMutate)
let documentObserver = new MutationObserver(onDocumentMutate)

let currentlyObserving = false

let componentObserverOptions = { subtree: true, childList: true, attributes: true, attributeOldValue: true }

// Track observed components so we can re-observe after disconnect...
let observedComponents = new Set

// The root selector (e.g. "[x-data]") is set by lifecycle.js during start()
// to avoid a circular dependency with directives.js...
let rootSelector = null

export function setComponentRootSelector(selector) {
    rootSelector = selector
}

export function observeComponent(el) {
    observedComponents.add(el)

    if (! currentlyObserving) return
    if (el._x_observing) return

    el._x_observing = true

    componentObserver.observe(el, componentObserverOptions)
}

export function forgetComponent(el) {
    observedComponents.delete(el)
    delete el._x_observing
}

export function startObservingMutations() {
    // Re-observe all tracked components...
    observedComponents.forEach(el => {
        if (el.isConnected) {
            el._x_observing = true
            componentObserver.observe(el, componentObserverOptions)
        }
    })

    // Watch the document for new top-level components being added...
    if (document.body) {
        documentObserver.observe(document.body, { childList: true, subtree: true })
    }

    currentlyObserving = true
}

export function stopObservingMutations() {
    flushObserver()

    componentObserver.disconnect()
    documentObserver.disconnect()

    // Clear observation flags so they get re-set on restart...
    observedComponents.forEach(el => {
        delete el._x_observing
    })

    currentlyObserving = false
}

let queuedMutations = []

export function flushObserver() {
    let records = componentObserver.takeRecords()
    let docRecords = documentObserver.takeRecords()

    queuedMutations.push(() => records.length > 0 && onMutate(records))
    queuedMutations.push(() => docRecords.length > 0 && onDocumentMutate(docRecords))

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

function onDocumentMutate(mutations) {
    if (isCollecting) return
    if (! rootSelector) return

    for (let i = 0; i < mutations.length; i++) {
        if (mutations[i].type !== 'childList') continue

        mutations[i].addedNodes.forEach(node => {
            if (node.nodeType !== 1) return

            if (node.matches && node.matches(rootSelector)) {
                if (! node._x_marker) {
                    onElAddeds.forEach(cb => cb(node))
                }
                observeComponent(node)
            }

            if (node.querySelectorAll) {
                node.querySelectorAll(rootSelector).forEach(el => {
                    if (! el._x_marker) {
                        onElAddeds.forEach(cb => cb(el))
                    }
                    observeComponent(el)
                })
            }
        })

        mutations[i].removedNodes.forEach(node => {
            if (node.nodeType !== 1) return

            if (node.matches && node.matches(rootSelector)) {
                if (node._x_marker) {
                    onElRemoveds.forEach(cb => cb(node))
                }
                forgetComponent(node)
            }

            if (node.querySelectorAll) {
                node.querySelectorAll(rootSelector).forEach(el => {
                    if (el._x_marker) {
                        onElRemoveds.forEach(cb => cb(el))
                    }
                    forgetComponent(el)
                })
            }
        })
    }
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
