let onAttributeRemoveds = new WeakMap
let onAttributeAddeds = []
let onElRemovedByEl = new WeakMap
let onElRemoveds = []
let onElAddeds = []

export function onElAdded(callback) {
    onElAddeds.push(callback)
}

export function onElRemoved(el, callback) {
    if (typeof el === 'function' && callback === undefined) {
        onElRemoveds.push(el)
    } else {
        if (! onElRemovedByEl.has(el)) onElRemovedByEl.set(el, [])

        onElRemovedByEl.get(el).push(callback)
    }
}

export function onAttributesAdded(callback) {
    onAttributeAddeds.push(callback)
}

export function onAttributeRemoved(el, name, callback) {
    if (! onAttributeRemoveds.has(el)) onAttributeRemoveds.set(el, {})
    if (! onAttributeRemoveds.get(el)[name]) onAttributeRemoveds.get(el)[name] = []

    onAttributeRemoveds.get(el)[name].push(callback)
}

let observer = new MutationObserver(onMutate)

let currentlyObserving = false

export function startObservingMutations() {
    observer.observe(document, { subtree: true, childList: true, attributes: true, attributeOldValue: true })

    currentlyObserving = true
}

export function stopObservingMutations() {
    observer.disconnect()

    currentlyObserving = false
}

let recordQueue = []
let willProcessRecordQueue = false

export function flushObserver() {
    recordQueue = recordQueue.concat(observer.takeRecords())

    if (recordQueue.length && ! willProcessRecordQueue) {
        willProcessRecordQueue = true

        queueMicrotask(() => {
            processRecordQueue()

            willProcessRecordQueue = false
        })
    }
}

function processRecordQueue() {
     onMutate(recordQueue)

     recordQueue.length = 0
}

export function mutateDom(callback) {
    if (! currentlyObserving) return callback()

    flushObserver()

    stopObservingMutations()

    let result = callback()

    startObservingMutations()

    return result
}

function onMutate(mutations) {
    let addedNodes = []
    let removedNodes = []
    let addedAttributes = new Map
    let removedAttributes = new Map

    for (let i = 0; i < mutations.length; i++) {
        if (mutations[i].target._x_ignoreMutationObserver) continue

        if (mutations[i].type === 'childList') {
            mutations[i].addedNodes.forEach(node => node.nodeType === 1 && addedNodes.push(node))
            mutations[i].removedNodes.forEach(node => node.nodeType === 1 && removedNodes.push(node))
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
            // Changed atttribute.
            } else if (el.hasAttribute(name)) {
                remove()
                add()
            // Removed atttribute.
            } else {
                remove()
            }
        }
    }

    removedAttributes.forEach((attrs, el) => {
        if (onAttributeRemoveds.get(el)) {
            attrs.forEach(name => {
                if (onAttributeRemoveds.get(el)[name]) {
                    onAttributeRemoveds.get(el)[name].forEach(i => i())
                }
            })
        }
    })

    addedAttributes.forEach((attrs, el) => {
        onAttributeAddeds.forEach(i => i(el, attrs))
    })

    for (let node of addedNodes) {
       // If an element gets moved on a page, it's registered
        // as both an "add" and "remove", so we wan't to skip those.
        if (removedNodes.includes(node)) continue

        onElAddeds.forEach(i => i(node))
    }

    for (let node of removedNodes) {
        // If an element gets moved on a page, it's registered
        // as both an "add" and "remove", so we want to skip those.
        if (addedNodes.includes(node)) continue


        if (onAttributeRemoveds.has(node)) {
            Object.entries(onAttributeRemoveds.get(node)).forEach(([key, value]) => {
                value.forEach(i => i())
            })
            onAttributeRemoveds.delete(node)
        }

        if (onElRemovedByEl.has(node)) {
            onElRemovedByEl.get(node).forEach(i => i())
            onElRemovedByEl.delete(node)
        }

        onElRemoveds.forEach(i => i(node))
    }

    addedNodes = null
    removedNodes = null
    addedAttributes = null
    removedAttributes = null
}
