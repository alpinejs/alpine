import { getUtilities } from "./utils/get-utlilties";

let magics = {}

export function magic(name, callback) {
    magics[name] = callback
}

export function injectMagics(obj, el) {
    let memoizedUtilities = getUtilities();

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
