
export default function (Alpine) {
    Alpine.magic('persist', (el, { interceptor }) => {
        let alias
        let storage = localStorage

        return interceptor((initialValue, getter, setter, path, key) => {
            let lookup = alias || `_x_${path}`

            let initial = storageHas(lookup, storage)
                ? storageGet(lookup, storage)
                : initialValue

            setter(initial)

            Alpine.effect(() => {
                let value = getter()

                storageSet(lookup, value, storage)

                setter(value)
            })

            return initial
        }, func => {
            func.as = key => { alias = key; return func },
            func.using = target => { storage = target; return func }
        })
    })
}

function storageHas(key, storage) {
    return storage.getItem(key) !== null
}

function storageGet(key, storage) {
    return JSON.parse(storage.getItem(key, storage))
}

function storageSet(key, value, storage) {
    storage.setItem(key, JSON.stringify(value))
}
