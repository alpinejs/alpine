
let flushPending = false
let flushing = false
let structuralQueue = []
let structuralQueueNeedsSort = false
let queue = []
let lastFlushedIndex = -1
let queuedJobs = new Set
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
    if (! queuedJobs.has(job)) {
        queuedJobs.add(job)

        if (job._x_schedulerPriority === 'structural') {
            structuralQueue.push(job)
            structuralQueueNeedsSort = true
        } else {
            queue.push(job)
        }
    }

    queueFlush()
}

export function dequeueJob(job) {
    let structuralIndex = structuralQueue.indexOf(job)

    if (structuralIndex !== -1) {
        structuralQueue.splice(structuralIndex, 1)
        queuedJobs.delete(job)
        return
    }

    let index = queue.indexOf(job)

    if (index !== -1 && index > lastFlushedIndex) {
        queue.splice(index, 1)
        queuedJobs.delete(job)
    }
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

    while (structuralQueue.length || lastFlushedIndex + 1 < queue.length) {
        flushStructuralJobs()

        if (lastFlushedIndex + 1 < queue.length) {
            queue[++lastFlushedIndex]()
        }
    }

    structuralQueue.length = 0
    structuralQueueNeedsSort = false
    queue.length = 0
    lastFlushedIndex = -1
    queuedJobs.clear()

    flushing = false
}

function flushStructuralJobs() {
    while (structuralQueue.length) {
        if (structuralQueueNeedsSort) {
            structuralQueue.sort((a, b) => (b._x_schedulerOrder ?? Infinity) - (a._x_schedulerOrder ?? Infinity))
            structuralQueueNeedsSort = false
        }

        structuralQueue.pop()()
    }
}
