import { magic } from '../magics'
import { closestIdRoot, findAndIncrementId } from '../ids'
import { interceptClone } from '../clone'

magic('id', (el, { cleanup }) => (name, key = null) => {
    let cacheKey = `${name}${key ? `-${key}` : ''}`

    return cacheIdByNameOnElement(el, cacheKey, cleanup, () => {
        let root = closestIdRoot(el, name)

        let id = root
            ? root._x_ids[name]
            : findAndIncrementId(name)

        return key
            ? `${name}-${id}-${key}`
            : `${name}-${id}`
    })
})

interceptClone((from, to) => {
    // Transfer over existing ID registrations from
    // the existing dom tree over to the new one
    // so that there aren't ID mismatches...
    if (from._x_id) {
        to._x_id = from._x_id
    }
})

function cacheIdByNameOnElement(el, cacheKey, cleanup, callback)
{
    if (! el._x_id) el._x_id = {}

    // We only want $id to run once per an element's lifecycle...
    if (el._x_id[cacheKey]) return el._x_id[cacheKey]

    let output = callback()

    el._x_id[cacheKey] = output

    cleanup(() => {
        delete el._x_id[cacheKey]
    })

    return output
}
