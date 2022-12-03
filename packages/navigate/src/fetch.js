
export function fetchHtml(destination, callback) {
    fetch(destination.pathname).then(i => i.text()).then(html => {
        callback(html)
    })
}
