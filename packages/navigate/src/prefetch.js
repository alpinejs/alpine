
// Warning: this could cause some memory leaks
let prefetches = {}

export function prefetchHtml(destination, callback) {
    let path = destination.pathname

    if (prefetches[path]) return

    prefetches[path] = { finished: false, html: null, whenFinished: () => {} }

    fetch(path).then(i => i.text()).then(html => {
        callback(html)
    })
}

export function storeThePrefetchedHtmlForWhenALinkIsClicked(html, destination) {
    let state = prefetches[destination.pathname]
    state.html = html
    state.finished = true
    state.whenFinished()
}

export function getPretchedHtmlOr(destination, receive, ifNoPrefetchExists) {
    let uri = destination.pathname + destination.search

    if (! prefetches[uri]) return ifNoPrefetchExists()

    if (prefetches[uri].finished) {
        let html = prefetches[uri].html

        delete prefetches[uri]

        return receive(html)
    } else {
        prefetches[uri].whenFinished = () => {
            let html = prefetches[uri].html

            delete prefetches[uri]

            receive(html)
        }
    }
}

