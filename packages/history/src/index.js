
export default function history(Alpine) {
    Alpine.magic('queryString', (el, { interceptor }) =>  {
        let alias
        let alwaysShow = false
        let usePush = false

        return interceptor((initialSeedValue, getter, setter, path, key) => {
            let queryKey = alias || path

            let { initial, replace, push, pop } = track(queryKey, initialSeedValue, alwaysShow)

            setter(initial)

            if (! usePush) {
                console.log(getter())
                Alpine.effect(() => replace(getter()))
            } else {
                Alpine.effect(() => push(getter()))

                pop(async newValue => {
                    setter(newValue)

                    let tillTheEndOfTheMicrotaskQueue = () => Promise.resolve()

                    await tillTheEndOfTheMicrotaskQueue() // ...so that we preserve the internal lock...
                })
            }

            return initial
        }, func => {
            func.alwaysShow = () => { alwaysShow = true; return func }
            func.usePush = () => { usePush = true; return func }
            func.as = key => { alias = key; return func }
        })
    })

    Alpine.history = { track }
}

export function track(name, initialSeedValue, alwaysShow = false) {
    let { has, get, set, remove } = queryStringUtils()

    let url = new URL(window.location.href)
    let isInitiallyPresentInUrl = has(url, name)
    let initialValue = isInitiallyPresentInUrl ? get(url, name) : initialSeedValue
    let initialValueMemo = JSON.stringify(initialValue)
    let hasReturnedToInitialValue = (newValue) => JSON.stringify(newValue) === initialValueMemo

    if (alwaysShow) url = set(url, name, initialValue)

    replace(url, name, { value: initialValue })

    let lock = false

    let update = (strategy, newValue) => {
        if (lock) return

        let url = new URL(window.location.href)

        if (! alwaysShow && ! isInitiallyPresentInUrl && hasReturnedToInitialValue(newValue)) {
            url = remove(url, name)
        } else {
            url = set(url, name, newValue)
        }

        strategy(url, name, { value: newValue})
    }

    return {
        initial: initialValue,

        replace(newValue) { // Update via replaceState...
            update(replace, newValue)
        },

        push(newValue) { // Update via pushState...
            update(push, newValue)
        },

        pop(receiver) { // "popstate" handler...
            window.addEventListener('popstate', (e) => {
                if (! e.state || ! e.state.alpine) return

                Object.entries(e.state.alpine).forEach(([iName, { value: newValue }]) => {
                    if (iName !== name) return

                    lock = true

                    // Allow the "receiver" to be an async function in case a non-syncronous
                    // operation (like an ajax) requests needs to happen while preserving
                    // the "locking" mechanism ("lock = true" in this case)...
                    let result = receiver(newValue)

                    if (result instanceof Promise) {
                        result.finally(() => lock = false)
                    } else {
                        lock = false
                    }
                })
            })
        }
    }
}

function replace(url, key, object) {
    let state = window.history.state || {}

    if (! state.alpine) state.alpine = {}

    state.alpine[key] = unwrap(object)

    window.history.replaceState(state, '', url.toString())
}

function push(url, key, object) {
    let state = { alpine: {...window.history.state.alpine, ...{[key]: unwrap(object)}} }

    window.history.pushState(state, '', url.toString())
}

function unwrap(object) {
    return JSON.parse(JSON.stringify(object))
}

function queryStringUtils() {
    return {
        has(url, key) {
            let search = url.search

            if (! search) return false

            let data = fromQueryString(search)

            return Object.keys(data).includes(key)
        },
        get(url, key) {
            let search = url.search

            if (! search) return false

            let data = fromQueryString(search)

            return data[key]
        },
        set(url, key, value) {
            let data = fromQueryString(url.search)

            data[key] = value

            url.search = toQueryString(data)

            return url
        },
        remove(url, key) {
            let data = fromQueryString(url.search)

            delete data[key]

            url.search = toQueryString(data)

            return url
        },
    }
}

// This function converts JavaScript data to bracketed query string notation...
// { items: [['foo']] } -> "items[0][0]=foo"
function toQueryString(data) {
    let isObjecty = (subject) => typeof subject === 'object' && subject !== null

    let buildQueryStringEntries = (data, entries = {}, baseKey = '') => {
        Object.entries(data).forEach(([iKey, iValue]) => {
            let key = baseKey === '' ? iKey : `${baseKey}[${iKey}]`

            if (! isObjecty(iValue)) {
                entries[key] = encodeURIComponent(iValue)
                    .replaceAll('%20', '+') // Conform to RFC1738
            } else {
                entries = {...entries, ...buildQueryStringEntries(iValue, entries, key)}
            }
        })

        return entries
    }

    let entries = buildQueryStringEntries(data)


    return Object.entries(entries).map(([key, value]) => `${key}=${value}`).join('&')
}

// This function converts bracketed query string notation back to JS data...
// "items[0][0]=foo" -> { items: [['foo']] }
function fromQueryString(search) {
    search = search.replace('?', '')

    if (search === '') return {}

    let insertDotNotatedValueIntoData = (key, value, data) => {
        let [first, second, ...rest] = key.split('.')

        // We're at a leaf node, let's make the assigment...
        if (! second) return data[key] = value

        // This is where we fill in empty arrays/objects allong the way to the assigment...
        if (data[first] === undefined) {
            data[first] = isNaN(second) ? {} : []
        }

        // Keep deferring assignment until the full key is built up...
        insertDotNotatedValueIntoData([second, ...rest].join('.'), value, data[first])
    }

    let entries = search.split('&').map(i => i.split('='))

    let data = {}

    entries.forEach(([key, value]) => {
        // Query string params don't always have values... (`?foo=`)
        if (! value) return

        value = decodeURIComponent(value.replaceAll('+', '%20'))

        if (! key.includes('[')) {
            data[key] = value
        } else {
            // Convert to dot notation because it's easier...
            let dotNotatedKey = key.replaceAll('[', '.').replaceAll(']', '')

            insertDotNotatedValueIntoData(dotNotatedKey, value, data)
        }
    })

    return data
}

