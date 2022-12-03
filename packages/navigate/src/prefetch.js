
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
    let path = destination.pathname

    if (! prefetches[path]) return ifNoPrefetchExists()

    if (prefetches[path].finished) {
        let html = prefetches[path].html

        delete prefetches[path]

        return receive(html)
    } else {
        prefetches[path].whenFinished = () => {
            let html = prefetches[path].html

            delete prefetches[path]

            receive(html)
        }
    }
}

