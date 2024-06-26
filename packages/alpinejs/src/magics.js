import { getElementBoundUtilities } from './directives'
import { interceptor } from './interceptor'
import { onElRemoved } from './mutation'

let magics = {}

export function magic(name, callback) {
    magics[name] = callback
}

export function injectMagics(obj, el) {
    let memoizedUtilities = null;

    function getUtilities() {
        let [utilities, cleanup] = getElementBoundUtilities(el)
        memoizedUtilities = {interceptor, ...utilities}
        onElRemoved(el, cleanup)
        return memoizedUtilities;
    }
    
    Object.entries(magics).forEach(([name, callback]) => {
        Object.defineProperty(obj, `$${name}`, {
            get() {
                return callback(el, memoizedUtilities || getUtilities());
            },
            enumerable: false,
        })
    })

    return obj
}
