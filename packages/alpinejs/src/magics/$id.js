import { magic } from '../magics'
import { closestIdRoot, findAndIncrementId } from '../ids'

magic('id', el => (name, key = null) => {
    let root = closestIdRoot(el, name)

    let id = root
        ? root._x_ids[name]
        : findAndIncrementId(name)

    return key
        ? `${name}-${id}-${key}`
        : `${name}-${id}`
})
