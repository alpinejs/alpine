
let flushPending = false
let flushing = false
let queue = []
let lastFlushedIndex = -1
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
    if (! queue.includes(job)) queue.push(job)

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
        queue[i]()
        lastFlushedIndex = i
    }

    queue.length = 0
    lastFlushedIndex = -1

    flushing = false
}
