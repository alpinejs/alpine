export default function history(Alpine) {
    Alpine.magic('queryString', (el, { interceptor }) =>  {
        let alias

        return interceptor((key, path) => {
            let pause = false
            let queryKey = alias || path

            return {
                init(initialValue, set, reactiveSet, func) {
                    let value = initialValue
                    let url = new URL(window.location.href)

                    if (url.searchParams.has(queryKey)) {
                        set(url.searchParams.get(queryKey))
                        value = url.searchParams.get(queryKey)
                    }

                    let object = { value }

                    url.searchParams.set(queryKey, value)

                    replace(url.toString(), path, object)

                    window.addEventListener('popstate', (e) => {
                        if (! e.state) return
                        if (! e.state.alpine) return

                        Object.entries(e.state.alpine).forEach(([newKey, { value }]) => {
                            if (newKey !== key) return

                            pause = true

                            reactiveSet(value)

                            pause = false
                        })
                    })
                },
                set(value, set) {
                    set(value)

                    if (pause) return

                    let object = { value }

                    let url = new URL(window.location.href)

                    url.searchParams.set(queryKey, value)

                    push(url.toString(), path, object)
                },
            }
        }, func => {
            func.as = key => { alias = key; return func }
        })
    })
}

function replace(url, key, object) {
    let state = window.history.state || {}

    if (! state.alpine) state.alpine = {}

    state.alpine[key] = object

    window.history.replaceState(state, '', url)
}

function push(url, key, object) {
    let state = { alpine: {...window.history.state.alpine, ...{[key]: object}} }

    window.history.pushState(state, '', url)
}
