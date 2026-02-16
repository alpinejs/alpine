import { closestRoot } from '../lifecycle'
import { skipDuringClone } from '../clone'
import { directive } from '../directives'

function handler () {}

// Skip during clone because morph runs directives on detached elements
// where closestRoot() has no x-data ancestor. Refs re-register on the
// live DOM via the MutationObserver path after morph patches attributes.
handler.inline = skipDuringClone((el, { expression }, { cleanup }) => {
    let root = closestRoot(el)

    if (! root._x_refs) root._x_refs = {}

    root._x_refs[expression] = el

    cleanup(() => delete root._x_refs[expression])
})

directive('ref', handler)
