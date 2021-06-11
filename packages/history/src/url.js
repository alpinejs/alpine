
export function hasQueryParam(param) {
    let queryParams = new URLSearchParams(window.location.search);

    return queryParams.has(param)
}

export function getQueryParam(param) {
    let queryParams = new URLSearchParams(window.location.search);

    return queryParams.get(param)
}

export function setQueryParam(param, value) {
    let queryParams = new URLSearchParams(window.location.search);

    queryParams.set(param, value)

    let url = urlFromQueryParams(queryParams)

    history.replaceState(history.state, '', url)
}

function urlFromParams(params = {}) {
    let queryParams = new URLSearchParams(window.location.search);

    Object.entries(params).forEach(([key, value]) => {
        queryParams.set(key, value)
    })

    let queryString = Array.from(queryParams.entries()).length > 0
        ? '?'+params.toString()
        : ''

    return window.location.origin + window.location.pathname + '?'+queryString + window.location.hash
}
