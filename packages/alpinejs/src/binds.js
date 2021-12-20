
let binds = {}

export function bind(name, object) {
    binds[name] = typeof object !== 'function' ? () => object : object
}

export function injectBindingProviders(obj) {
    Object.entries(binds).forEach(([name, callback]) => {
        Object.defineProperty(obj, name, {
            get() {
                return (...args) => {
                    return callback(...args)
                }
            }
        })
    })

    return obj
}
