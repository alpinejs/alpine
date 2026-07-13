
let flushPending = false
let flushing = false
let pendingJobs = new Set
let completedJobs = new WeakSet
let repeatedJobs = new WeakSet
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
    if (jobCanBeQueued(job)) {
        // During a flush, the data a job depends on can change after it runs, so allow it back into the queue to react to that change. Allowing it back only once prevents the scheduler from getting stuck in a loop.
        if (jobHasPreviouslyRun(job)) recordJobAsRepeated(job)

        pendingJobs.add(job)
    }

    queueFlush()
}

export function dequeueJob(job) {
    pendingJobs.delete(job)
}

function jobCanBeQueued(job) {
    if (jobIsPending(job)) return false
    if (jobHasBeenRepeated(job)) return false

    return true
}

function jobIsPending(job) {
    return pendingJobs.has(job)
}

function jobHasPreviouslyRun(job) {
    return completedJobs.has(job)
}

function jobHasBeenRepeated(job) {
    return repeatedJobs.has(job)
}

function recordJobAsRepeated(job) {
    repeatedJobs.add(job)
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

    for (let job of pendingJobs) {
        job()

        pendingJobs.delete(job)
        completedJobs.add(job)
    }

    completedJobs = new WeakSet
    repeatedJobs = new WeakSet

    flushing = false
}
