import { closestDataStack, mergeProxies } from '../scope'
import { magic } from '../magics'
import { closestRoot } from '../lifecycle'

let memo = {}

magic('id', el => (name, key = null) => {
    if (! memo[name]) memo[name] = 0

    let root = closestRoot(el)
    let id = getId(root, el, name)

    if (key) {
        return `${name}-${id}-${key}`
    }

    return `${name}-${id}`
})

function getId(root, el, name) {
    if (! root._x_ids) root._x_ids = []

    if (root._x_ids.includes(name)) {
        return memo[name]
    } else {
        root._x_ids.push(name) 
        
        return ++memo[name]
    }
}

export function closestIdRoot(el) {
    if (! el) return

    if (el._x_ids) return el

    if (! el.parentElement) return

    return closestIdRoot(el.parentElement)
}
