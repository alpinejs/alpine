
export default function (Alpine) {
    Alpine.magic('persist', (el, { interceptor }) => {
        return interceptor((initialValue, getter, setter, path, key) => {
            let initial = localStorage.getItem(path)
                ? JSON.parse(localStorage.getItem(path))
                : initialValue

            setter(initialValue)

            Alpine.effect(() => {
                let value = getter()
                localStorage.setItem(path, JSON.stringify(value))

                setter(value)
            })

            return initial
        })
    })
}
