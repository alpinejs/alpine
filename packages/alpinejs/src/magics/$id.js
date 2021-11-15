import { magic } from '../magics'
import { directive } from '../directives'
import { findClosest, closestRoot } from '../lifecycle'

let globalIdMemo = {}

function generateIdMagicFunction(el) {
    function idMagic(name, key = null) {
        if (! globalIdMemo[name]) globalIdMemo[name] = 0
    
        let id = getId(el, name)
    
        return key
            ? new HtmlId(el, `${name}-${id}-${key}`)
            : new HtmlId(el, `${name}-${id}`)
    }

    idMagic.scope = function () {
        el._x_new_scope = true
    }

    return idMagic
}

magic('id', el => generateIdMagicFunction(el))

function getId(el, name) {
    let root = closestIdRoot(el, name) || closestRoot(el)

    initRoot(root, name)
        
    return root._x_ids[name]
}

class HtmlId {
    constructor(el, id) { this.id = id }
    toString() { return this.id }
}

export function closestIdRoot(el, name) {
    return findClosest(el, element => {
        if (element._x_new_scope) {
            initRoot(element, name)

            return true
        }

        if (element._x_ids && element._x_ids[name]) return true
    })
}

function initRoot(el, name) {
    if (! el._x_ids) el._x_ids = {}
    if (! el._x_ids[name]) el._x_ids[name] = ++globalIdMemo[name]
}
