import { magic } from '../magics'
import { reactive } from '../reactivity'

let mediaQueries = new Map
let elementQueries = new WeakMap

magic('media', (el, { cleanup }) => {
    let queries = elementQueries.get(el)

    if (! queries) {
        queries = new Set
        elementQueries.set(el, queries)

        cleanup(() => {
            queries.forEach(releaseMediaQuery)
            queries.clear()
            elementQueries.delete(el)
        })
    }

    return query => {
        if (! queries.has(query)) {
            queries.add(query)
            retainMediaQuery(query)
        }

        return mediaQueries.get(query).state.matches
    }
})

function retainMediaQuery(query) {
    if (mediaQueries.has(query)) {
        mediaQueries.get(query).references++

        return
    }

    let mediaQuery = window.matchMedia(query)
    let state = reactive({ matches: mediaQuery.matches })
    let update = () => state.matches = mediaQuery.matches
    let removeListener

    if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', update)
        removeListener = () => mediaQuery.removeEventListener('change', update)
    } else {
        mediaQuery.addListener(update)
        removeListener = () => mediaQuery.removeListener(update)
    }

    mediaQueries.set(query, { state, references: 1, removeListener })
}

function releaseMediaQuery(query) {
    let entry = mediaQueries.get(query)

    if (! entry || --entry.references > 0) return

    entry.removeListener()
    mediaQueries.delete(query)
}
