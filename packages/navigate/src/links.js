
export function whenThisLinkIsClicked(el, callback) {
    el.addEventListener('click', e => {
        e.preventDefault()

        callback(el)
    })
}

export function whenThisLinkIsHovered(el, callback) {
    el.addEventListener('mouseenter', e => {
        callback(e)
    })
}

export function extractDestinationFromLink(linkEl) {
    return new URL(linkEl.getAttribute('href'), document.baseURI)
}
