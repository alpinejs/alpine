
let handleLinkClick = () => {}
let handleLinkHover = () => {}

export function whenALinkIsClicked(callback) {
    handleLinkClick = callback

    initializeLinksForClicking()
}

export function whenALinkIsHovered(callback) {
    handleLinkHover = callback

    initializeLinksForHovering()
}

export function extractDestinationFromLink(linkEl) {
    return new URL(linkEl.getAttribute('href'), document.baseURI)
}

export function hijackNewLinksOnThePage() {
    initializeLinksForClicking()
    initializeLinksForHovering()
}

function initializeLinksForClicking() {
    getLinks().forEach(el => {
        el.addEventListener('click', e => {
            e.preventDefault()

            handleLinkClick(el)
        })
    })
}

function initializeLinksForHovering() {
    getLinks()
        .filter(i => i.hasAttribute('wire:navigate.prefetch'))
        .forEach(el => {
            el.addEventListener('mouseenter', e => {
                handleLinkHover(el)
            })
        })
}

function getLinks() {
    return Array.from(document.links)
        .filter(i => i.hasAttribute('wire:navigate')
        || i.hasAttribute('wire:navigate.prefetch'))
}

