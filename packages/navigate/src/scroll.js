
export function storeScrollInformationInHtmlBeforeNavigatingAway() {
    document.body.setAttribute('data-scroll-x', document.body.scrollLeft)
    document.body.setAttribute('data-scroll-y', document.body.scrollTop)

    document.querySelectorAll(['[x-navigate\\:scroll]', '[wire\\:scroll]']).forEach(el => {
        el.setAttribute('data-scroll-x', el.scrollLeft)
        el.setAttribute('data-scroll-y', el.scrollTop)
    })
}

export function restoreScrollPosition() {
    let scroll = el => {
        el.scrollTo(Number(el.getAttribute('data-scroll-x')), Number(el.getAttribute('data-scroll-y')))
        el.removeAttribute('data-scroll-x')
        el.removeAttribute('data-scroll-y')
    }

    queueMicrotask(() => {
        scroll(document.body)

        document.querySelectorAll(['[x-navigate\\:scroll]', '[wire\\:scroll]']).forEach(scroll)
    })
}
