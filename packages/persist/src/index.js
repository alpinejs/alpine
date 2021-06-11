
export default function (Alpine) {
    Alpine.magic('persist', (el, { interceptor }) => {
        return interceptor((key, path) => {
            return {
                init(initialValue, setter) {
                    if (localStorage.getItem(path)) {
                        setter(localStorage.getItem(path))
                    } else {
                        setter(initialValue)
                    }
                },
                set(value, setter) {
                    localStorage.setItem(path, value)

                    setter(value)
                },
            }
        })
    })
}
