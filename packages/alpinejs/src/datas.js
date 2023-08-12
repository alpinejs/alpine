
let datas = {}

export function data(name, callback = null) {
    if (callback === null) {
        return datas[name]
    }

    datas[name] = callback
}

export function injectDataProviders(obj, context) {
    Object.entries(datas).forEach(([name, callback]) => {
        Object.defineProperty(obj, name, {
            get() {
                return (...args) => {
                    return callback.bind(context)(...args)
                }
            },

            enumerable: false,
        })
    })

    return obj
}
