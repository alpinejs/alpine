
export default function (Alpine) {
    let alias

    Alpine.magic('persist', (el, { interceptor }) => {
        return interceptor((initialValue, getter, setter, path, key) => {
            let lookup = alias || `_x_${path}`

            let initial = storageHas(lookup)
                ? storageGet(lookup)
                : initialValue

            setter(initial)

            Alpine.effect(() => {
                let value = getter()

                storageSet(lookup, value)

                setter(value)
            })

            return initial
        }, func => {
            func.as = key => { alias = key; return func }
        })
    })
}

function storageHas(key) {
    return localStorage.getItem(key) !== null
}

function storageGet(key) {
    return JSON.parse(localStorage.getItem(key))
}

function storageSet(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}
