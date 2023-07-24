
export function fetchHtml(destination, callback) {
    let uri = destination.pathname + destination.search

    fetch(uri).then(i => i.text()).then(html => {
        callback(html)
    })
}
