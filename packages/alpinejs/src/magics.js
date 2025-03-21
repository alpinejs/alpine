import { getElementBoundUtilities } from './directives.js'
import { interceptor } from './interceptor.js'
import { onElRemoved } from './mutation.js'

let magics = {}

export function magic(name, callback) {
    magics[name] = callback
}

export function injectMagics(obj, el) {
    let memoizedUtilities = getUtilities(el)

    Object.entries(magics).forEach(([name, callback]) => {
        Object.defineProperty(obj, `$${name}`, {
            get() {
                return callback(el, memoizedUtilities);
            },
            enumerable: false,
        })
    })

    return obj
}

export function getUtilities(el) {
    let [utilities, cleanup] = getElementBoundUtilities(el)

    let utils = { interceptor, ...utilities }

    onElRemoved(el, cleanup)

    return utils;
}
