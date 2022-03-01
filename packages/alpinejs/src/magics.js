import Alpine from './alpine'
import { getElementBoundUtilities } from './directives'
import { interceptor } from './interceptor'
import { onElRemoved } from './mutation'

let magics = {}

export function magic(name, callback) {
    magics[name] = callback
}

export function injectMagics(obj, el) {
    Object.entries(magics).forEach(([name, callback]) => {
        Object.defineProperty(obj, `$${name}`, {
            get() {
                let [utilities, cleanup] = getElementBoundUtilities(el)
                
                utilities = {interceptor, ...utilities}
                
                onElRemoved(el, cleanup)

                return callback(el, utilities)
            },

            enumerable: false,
        })
    })

    return obj
}
