
export default function (Alpine) {
    Alpine.magic('persist', (el, { interceptor }) => {
        return interceptor((initialValue, getter, setter, path, key) => {
            let initial = localStorage.getItem(path)
                ? localStorage.getItem(path)
                : initialValue

            setter(initialValue)

            Alpine.effect(() => {
                let value = getter()
                localStorage.setItem(path, value)

                setter(value)
            })

            return initial
        })
    })
}
