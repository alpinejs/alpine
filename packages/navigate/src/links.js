
export function whenThisLinkIsClicked(el, callback) {
    el.addEventListener('click', e => {
        e.preventDefault()

        callback(el)
    })
}

export function whenThisLinkIsPressed(el, callback) {
    el.addEventListener('click', e => e.preventDefault())

    el.addEventListener('mousedown', e => {
        e.preventDefault()

        callback((whenReleased) => {
            let handler = e => {
                e.preventDefault()

                whenReleased()

                el.removeEventListener('mouseup', handler)
            }

            el.addEventListener('mouseup', handler)
        })
    })
}

export function whenThisLinkIsHoveredFor(el, ms = 60, callback) {
    el.addEventListener('mouseenter', e => {
        let timeout = setTimeout(() => {
            callback(e)
        }, ms)

        let handler = () => {
            clearTimeout(timeout)

            el.removeEventListener('mouseleave', handler)
        }

        el.addEventListener('mouseleave', handler)
    })
}

export function extractDestinationFromLink(linkEl) {
    return createUrlObjectFromString(linkEl.getAttribute('href'))
}

export function createUrlObjectFromString(urlString) {
    return new URL(urlString, document.baseURI)
}
