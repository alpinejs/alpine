
export default function (Alpine) {
    Alpine.magic('persist', (el, { interceptor }) => {
        let alias

        return interceptor((initialValue, getter, setter, path, key) => {
            let storageKey = alias || path
            let initial = localStorage.getItem(storageKey)
                ? localStorage.getItem(storageKey)
                : initialValue

            setter(initialValue)

            Alpine.effect(() => {
                let value = getter()
                localStorage.setItem(storageKey, value)

                setter(value)
            })

            return initial
        }, func => {
            func.as = key => { alias = key; return func }
        })
    })
}
