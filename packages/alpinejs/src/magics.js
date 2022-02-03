import Alpine from './alpine'
import { interceptor } from './interceptor'

let magics = {}

export function magic(name, get, set) {
    magics[name] = { get, set }
}

export function injectMagics(obj, el) {
    Object.entries(magics).forEach(([name, { get, set }]) => {
        Object.defineProperty(obj, `$${name}`, {
            get() { return get(el, { Alpine, interceptor }) },
            
            set(value) {
                if (! set) throw `You cannot mutate $${name}`
                return set(value, el, { Alpine, interceptor })
            },

            enumerable: false,
        })
    })

    return obj
}
