export default function (Alpine) {
    let persist = () => {
        let alias
        let storage = localStorage

        return Alpine.interceptor((initialValue, getter, setter, path, key) => {
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
    }

    Object.defineProperty(Alpine, '$persist', { get: () => persist() })
    Alpine.magic('persist', persist)
    Alpine.persist = (key, { get, set }, storage = localStorage) => {
        let initial = storageHas(key, storage)
            ? storageGet(key, storage)
            : get()

        set(initial)

        Alpine.effect(() => {
            let value = get()

            storageSet(key, value, storage)

            set(value)
        })
    }
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
