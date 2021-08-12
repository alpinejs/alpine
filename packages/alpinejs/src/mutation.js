let onAttributeAddeds = []
let onElRemoveds = []
let onElAddeds = []

export function onElAdded(callback) {
    onElAddeds.push(callback)
}

export function onElRemoved(callback) {
    onElRemoveds.push(callback)
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
        (names === undefined || names.includes(name)) && value.forEach(i => i())

        delete el._x_attributeCleanups[name]
    })
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
        cleanupAttributes(el, attrs)
    })

    addedAttributes.forEach((attrs, el) => {
        onAttributeAddeds.forEach(i => i(el, attrs))
    })

    for (let node of addedNodes) {
       // If an element gets moved on a page, it's registered
        // as both an "add" and "remove", so we want to skip those.
        if (removedNodes.includes(node)) continue

        onElAddeds.forEach(i => i(node))
    }

    for (let node of removedNodes) {
        // If an element gets moved on a page, it's registered
        // as both an "add" and "remove", so we want to skip those.
        if (addedNodes.includes(node)) continue

        onElRemoveds.forEach(i => i(node))
    }

    addedNodes = null
    removedNodes = null
    addedAttributes = null
    removedAttributes = null
}
