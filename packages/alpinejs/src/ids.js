import { findClosest } from './lifecycle'

let globalIdMemo = {}

export function findAndIncrementId(name) {
    if (! globalIdMemo[name]) globalIdMemo[name] = 0

    return ++globalIdMemo[name]
}

export function closestIdRoot(el, name) {
    return findClosest(el, element => {
        if (element._x_ids && element._x_ids[name]) return true
    })
}

export function setIdRoot(el, name) {
    if (! el._x_ids) el._x_ids = {}
    if (! el._x_ids[name]) el._x_ids[name] = findAndIncrementId(name) 
}
