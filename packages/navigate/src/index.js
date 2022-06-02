import { replaceUrl, pushUrl, fromSessionStorage } from './history'
import { swapPage } from './page'
import { endProgressBar, startProgressBar } from './progressBar'

export default function (Alpine) {
    setInitialPageUsingHistoryReplaceStateForFutureBackButtons()

    // Listen for back button presses...
    window.addEventListener('popstate', e => handleBackButtonPress(e, Alpine))

    // Listen for any <a> tag click...
    Array.from(document.links).forEach(el => {
        el.addEventListener('mouseenter', () => handleLinkHover(el))
        el.addEventListener('click', e => handleLinkClick(el, e))
    })

    document.addEventListener('alpine:navigated', () => {
        Array.from(document.links).forEach(el => {
            el.addEventListener('mouseenter', () => handleLinkHover(el))
            el.addEventListener('click', e => handleLinkClick(el, e))
        })
    })

    // Alpine.magic('history', (el, { interceptor }) =>  {
    //     let alias

    //     return interceptor((initialValue, getter, setter, path, key) => {
    //         let pause = false
    //         let queryKey = alias || path

    //         let value = initialValue
    //         let url = new URL(window.location.href)

    //         if (url.searchParams.has(queryKey)) {
    //             value = url.searchParams.get(queryKey)
    //         }

    //         setter(value)

    //         let object = { value }

    //         url.searchParams.set(queryKey, value)

    //         replace(url.toString(), path, object)

    //         window.addEventListener('popstate', (e) => {
    //             if (! e.state) return
    //             if (! e.state.alpine) return

    //             Object.entries(e.state.alpine).forEach(([newKey, { value }]) => {
    //                 if (newKey !== key) return

    //                 pause = true

    //                 Alpine.disableEffectScheduling(() => {
    //                     setter(value)
    //                 })

    //                 pause = false
    //             })
    //         })

    //         Alpine.effect(() => {
    //             let value = getter()

    //             if (pause) return

    //             let object = { value }

    //             let url = new URL(window.location.href)

    //             url.searchParams.set(queryKey, value)

    //             push(url.toString(), path, object)
    //         })

    //         return value
    //     }, func => {
    //         func.as = key => { alias = key; return func }
    //     })
    // })
}

function setInitialPageUsingHistoryReplaceStateForFutureBackButtons() {
    // Create a history state entry for the initial page load.
    // (This is so later hitting back can restore this page).
    let url = new URL(window.location.href, document.baseURI)

    replaceUrl(url, document.documentElement.outerHTML)
}

function handleBackButtonPress(e, Alpine) {
    let { html } = fromSessionStorage(e)

    document.dispatchEvent(new CustomEvent('alpine:navigating', { bubbles: true }))

    html && swapPage(Alpine, html, () => {
        document.dispatchEvent(new CustomEvent('alpine:navigated', { bubbles: true }))
    })

    restoreScroll()
}

// Warning: this could cause some memory leaks
let prefetches = new Map

function handleLinkHover(el) {
    if (prefetches.has(el)) return

    let destination = new URL(el.getAttribute('href'), document.baseURI)

    prefetches.set(el, { finished: false, html: null, whenFinished: () => {} })

    fetch(destination.pathname).then(i => i.text()).then(html => {
        let state = prefetches.get(el)
        state.html = html
        state.finished = true
        state.whenFinished()
    })
}

function handleLinkClick(el, e) {
    let destination = new URL(el.getAttribute('href'), document.baseURI)

    let handleHtml = html => {
        let url = new URL(window.location.href, document.baseURI)

        storeScrollRestorationDataInHTML()

        replaceUrl(url, document.documentElement.outerHTML)

        swapPage(Alpine, html, () => {
            pushUrl(destination, html)

            document.dispatchEvent(new CustomEvent('alpine:navigated', { bubbles: true }))
        })
    }

    document.dispatchEvent(new CustomEvent('alpine:navigating', { bubbles: true }))

    if (prefetches.has(el)) {
        let state = prefetches.get(el)
        if (! state.finished) {
            startProgressBar()

            state.whenFinished = () => {
                endProgressBar(() => {
                    handleHtml(state.html)
                    prefetches.delete(el)
                })
            }
        } else {
            handleHtml(state.html)
            prefetches.delete(el)
        }
    } else {
        startProgressBar()

        fetch(destination.pathname).then(i => i.text()).then(html => {
            endProgressBar(() => {
                handleHtml(html)
            })
        })
    }

    e.preventDefault()
}

function storeScrollRestorationDataInHTML() {
    document.body.setAttribute('data-scroll-x', document.body.scrollLeft)
    document.body.setAttribute('data-scroll-y', document.body.scrollTop)

    document.querySelectorAll('[x-navigate\\:scroll]').forEach(el => {
        el.setAttribute('data-scroll-x', el.scrollLeft)
        el.setAttribute('data-scroll-y', el.scrollTop)
    })
}

function restoreScroll() {
    let scroll = el => {
        el.scrollTo(Number(el.getAttribute('data-scroll-x')), Number(el.getAttribute('data-scroll-y')))
        el.removeAttribute('data-scroll-x')
        el.removeAttribute('data-scroll-y')
    }

    scroll(document.body)

    document.querySelectorAll('[x-navigate\\:scroll]').forEach(scroll)
}

function replace(url, key, object) {
    let state = window.history.state || {}

    if (! state.alpine) state.alpine = {}

    state.alpine[key] = object

    window.history.replaceState(state, '', url)
}

function push(url, key, object) {
    let state = { alpine: {...window.history.state.alpine, ...{[key]: object}} }

    window.history.pushState(state, '', url)
}
