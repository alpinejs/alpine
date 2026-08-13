
let flushPending = false
let flushing = false
let queue = []
let lastFlushedIndex = -1
let queueNeedsSort = false
let transactionActive = false

export function scheduler (callback) { queueJob(callback) }

export function startTransaction() {
    transactionActive = true
}

export function commitTransaction() {
    transactionActive = false
    queueFlush()
}

function queueJob(job) {
    if (! queue.includes(job)) {
        queue.push(job)

        if (job._x_schedulerPriority !== undefined) queueNeedsSort = true
    }

    queueFlush()
}

export function dequeueJob(job) {
    let index = queue.indexOf(job)

    if (index !== -1 && index > lastFlushedIndex) queue.splice(index, 1)
}

function queueFlush() {
    if (! flushing && ! flushPending) {
        if (transactionActive) return  // Block during transaction

        flushPending = true

        queueMicrotask(flushJobs)
    }
}

export function flushJobs() {
    flushPending = false
    flushing = true

    for (let i = 0; i < queue.length; i++) {
        if (queueNeedsSort) sortPendingJobs(i)

        queue[i]()
        lastFlushedIndex = i
    }

    queue.length = 0
    lastFlushedIndex = -1
    queueNeedsSort = false

    flushing = false
}

function sortPendingJobs(start) {
    let depths = new Map
    let sorted = queue.slice(start).sort((a, b) => compareJobs(a, b, depths))

    for (let i = 0; i < sorted.length; i++) {
        queue[start + i] = sorted[i]
    }

    queueNeedsSort = false
}

function compareJobs(a, b, depths) {
    if (! isStructural(a)) return isStructural(b) ? 1 : 0
    if (! isStructural(b)) return -1

    let depthDifference = getElementDepth(a._x_schedulerPriority.el, depths)
        - getElementDepth(b._x_schedulerPriority.el, depths)

    return depthDifference || a._x_schedulerPriority.order - b._x_schedulerPriority.order
}

function isStructural(job) {
    return job._x_schedulerPriority !== undefined
}

function getElementDepth(el, depths) {
    if (depths.has(el)) return depths.get(el)

    let depth = 0
    let owner = el

    while (el) {
        depth++

        if (el._x_teleportBack) {
            el = el._x_teleportBack
        } else if (typeof ShadowRoot === 'function' && el.parentNode instanceof ShadowRoot) {
            el = el.parentNode.host
        } else {
            el = el.parentElement
        }
    }

    depths.set(owner, depth)

    return depth
}
