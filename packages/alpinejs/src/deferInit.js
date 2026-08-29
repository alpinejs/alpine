import { findClosest, initTree } from './lifecycle'
import { flushPendingMutations } from './mutation'
import { handleError } from './utils/error'
import { directives } from './directives'
import { interceptClone } from './clone'

// A tree can be suspended while an asynchronous prerequisite loads — a script
// module that registers Alpine.data() providers, for example. While suspended,
// nothing inside the tree initializes: directives don't evaluate, added nodes
// wait, and attribute changes are held for later. When every registered
// promise has settled, the tree initializes in place.
let activeDefers = 0

export function deferInit(el, promise) {
    let record = el._x_deferInit

    if (! record) {
        record = el._x_deferInit = {
            pending: 0,
            ownsIgnore: ! el._x_ignore,
            queuedAttributes: new Map,
        }

        // Suspension rides on the ignore flag so every existing guard — the
        // walker, directive handlers, added-node initialization — already
        // respects the boundary. If something else set the flag first, it
        // owns the tree and we leave the flag alone when we're done...
        if (record.ownsIgnore) el._x_ignore = true

        activeDefers++
    }

    record.pending++

    Promise.resolve(promise).catch(error => {
        // A rejected prerequisite must not leave the tree suspended forever.
        // Surface the error, then initialize anyway. The handler itself may
        // throw (custom error handlers can) — rethrow out of band so the
        // settle below still runs...
        try {
            handleError(error, el)
        } catch (error) {
            setTimeout(() => { throw error }, 0)
        }
    }).then(() => settle(el, record))
}

function settle(el, record) {
    record.pending--

    if (record.pending > 0) return

    // Deliver any mutations the observer is still holding while the tree is
    // still suspended, so pending attribute changes land in the queue below
    // instead of firing against a half-ready tree...
    flushPendingMutations()

    // Handlers that ran during that flush may have registered a new
    // prerequisite on this same element — its chain will settle later...
    if (record.pending > 0) return

    // ...and if the suspension was already torn down (or replaced) by the
    // time this chain ran, there's nothing left for it to do...
    if (el._x_deferInit !== record) return

    delete el._x_deferInit

    if (record.ownsIgnore) delete el._x_ignore

    activeDefers--

    // The element left the DOM while it was suspended. If it re-enters later,
    // the mutation observer will initialize it like any other added node...
    if (! el.isConnected) return

    replayQueuedAttributes(record)

    initTree(el)
}

// While a tree is suspended, Alpine's attributes-added handler routes the
// mutation here instead of evaluating directives against a tree that isn't
// ready. Everything queued is replayed when the tree resumes...
export function queueAttributesForDeferredTree(el, attrs) {
    if (activeDefers === 0) return false

    let root = findClosest(el, i => i._x_deferInit)

    if (! root) return false

    queueInto(root._x_deferInit, el, attrs.map(({ name }) => name))

    return true
}

function queueInto(record, el, names) {
    let entry = record.queuedAttributes.get(el)

    // The marker pins the entry to this incarnation of the element. If the
    // element is destroyed and re-initialized before the replay (it moved out
    // of the suspended tree, say), the fresh initialization already applied
    // its attributes and a stale entry must not apply them again...
    if (! entry || entry.marker !== el._x_marker) {
        entry = { marker: el._x_marker, names: new Set }

        record.queuedAttributes.set(el, entry)
    }

    names.forEach(name => entry.names.add(name))
}

function replayQueuedAttributes(record) {
    record.queuedAttributes.forEach((entry, el) => {
        if (! el.isConnected) return

        // Elements without a marker are picked up by the tree walk that
        // follows — replaying here would process their attributes twice...
        if (! el._x_marker) return

        // A different marker means the element was re-initialized since the
        // attributes were queued, which already applied them...
        if (el._x_marker !== entry.marker) return

        // If an enclosing tree is still suspended, this isn't the moment to
        // evaluate anything — hand the entry over so it replays when that
        // tree resumes...
        let suspendedAncestor = findClosest(el, i => i._x_deferInit)

        if (suspendedAncestor) {
            queueInto(suspendedAncestor._x_deferInit, el, Array.from(entry.names))

            return
        }

        let attrs = Array.from(entry.names)
            .filter(name => el.hasAttribute(name))
            .map(name => ({ name, value: el.getAttribute(name) }))

        if (attrs.length === 0) return

        directives(el, attrs).forEach(handle => handle())
    })
}

// Morphing evaluates directives on detached clones of live elements, where
// the suspension flag on the live tree can't be seen. Carry it over so a
// suspended tree stays suspended through a morph...
interceptClone((from, to) => {
    if (activeDefers === 0) return

    if (! from || from.nodeType !== 1 || ! to || to.nodeType !== 1) return

    if (findClosest(from, i => i._x_deferInit)) to._x_ignore = true
})
