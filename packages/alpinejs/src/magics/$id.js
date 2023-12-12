import { magic } from '../magics'
import { closestIdRoot, findAndIncrementId } from '../ids'
import { interceptClone } from '../clone'

magic('id', (el, { cleanup }) => (name, key = null) => {
    // We only want $id to run once per an element's lifecycle...
    if (el._x_id) return el._x_id

    let root = closestIdRoot(el, name)

    let id = root
        ? root._x_ids[name]
        : findAndIncrementId(name)

    let output = key
        ? `${name}-${id}-${key}`
        : `${name}-${id}`

    el._x_id = output

    cleanup(() => {
        delete el._x_id
    })

    return output
})

interceptClone((from, to) => {
    // Transfer over existing ID registrations from
    // the existing dom tree over to the new one
    // so that there aren't ID mismatches...
    if (from._x_id) {
        to._x_id = from._x_id
    }
})
