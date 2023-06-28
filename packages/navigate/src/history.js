
export function updateCurrentPageHtmlInHistoryStateForLaterBackButtonClicks() {
    // Create a history state entry for the initial page load.
    // (This is so later hitting back can restore this page).
    let url = new URL(window.location.href, document.baseURI)

    replaceUrl(url, document.documentElement.outerHTML)
}

export function whenTheBackOrForwardButtonIsClicked(callback) {
    window.addEventListener('popstate', e => {
        let state = e.state || {}

        let alpine = state.alpine || {}

        if (! alpine._html) return

        let html = fromSessionStorage(alpine._html)

        callback(html)
    })
}

export function updateUrlAndStoreLatestHtmlForFutureBackButtons(html, destination) {
    pushUrl(destination, html)
}

export function pushUrl(url, html) {
    updateUrl('pushState', url, html)
}

export function replaceUrl(url, html) {
    updateUrl('replaceState', url, html)
}

function updateUrl(method, url, html) {
    let key = (new Date).getTime()

    tryToStoreInSession(key, html)

    let state = history.state || {}

    if (! state.alpine) state.alpine = {}

    state.alpine._html = key

    // 640k character limit:
    history[method](state, document.title, url)
}

export function fromSessionStorage(timestamp) {
    let state = JSON.parse(sessionStorage.getItem('alpine:'+timestamp))

    return state
}

function tryToStoreInSession(timestamp, value) {
    // sessionStorage has a max storage limit (usally 5MB).
    // If we meet that limit, we'll start removing entries
    // (oldest first), until there's enough space to store
    // the new one.
    try {
        sessionStorage.setItem('alpine:'+timestamp, JSON.stringify(value))
    } catch (error) {
        // 22 is Chrome, 1-14 is other browsers.
        if (! [22, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].includes(error.code)) return

        let oldestTimestamp = Object.keys(sessionStorage)
            .map(key => Number(key.replace('alpine:', '')))
            .sort()
            .shift()

        if (! oldestTimestamp) return

        sessionStorage.removeItem('alpine:'+oldestTimestamp)

        tryToStoreInSession(timestamp, value)
    }
}
