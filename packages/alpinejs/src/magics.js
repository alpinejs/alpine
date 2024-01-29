import { getElementBoundUtilities } from './directives'
import { interceptor } from './interceptor'
import { onElRemoved } from './mutation'

let magics = {}

export function magic(name, callback) {
    magics[name] = callback
}

export function injectMagics(obj, el) {
    Object.entries(magics).forEach(([name, callback]) => {
        let memoizedUtilities = null;
        function getUtilities() {
            if (memoizedUtilities) {
                return memoizedUtilities;
            } else {
                let [utilities, cleanup] = getElementBoundUtilities(el)

                memoizedUtilities = {interceptor, ...utilities}

                onElRemoved(el, cleanup)
                return memoizedUtilities;
            }
        }

        Object.defineProperty(obj, `$${name}`, {
            get() {
                return callback(el, getUtilities());
            },
            enumerable: false,
        })
    })

    return obj
}
