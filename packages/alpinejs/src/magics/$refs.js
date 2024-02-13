import { closestRoot, findClosest } from '../lifecycle'
import { mergeProxies } from '../scope'
import { magic } from '../magics'

magic('refs', el => {
    if (el._x_refs_proxy) return el._x_refs_proxy

    el._x_refs_proxy = mergeProxies(getArrayOfRefObject(el))

    return el._x_refs_proxy
})

function getArrayOfRefObject(el) {
    let refObjects = []

    findClosest(el, (i) => {
        if (i._x_refs) refObjects.push(i._x_refs)
    })

    return refObjects
}
