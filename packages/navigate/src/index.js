import { replaceUrl, pushUrl, fromSessionStorage } from './history'
import { swapPage } from './page'

export default function (Alpine) {
    // Create a history state entry for the initial page load.
    // (This is so later hitting back can restore this page).
    let url = new URL(window.location.href, document.baseURI)
    replaceUrl(url, document.documentElement.outerHTML)

    // Listen for back button presses...
    window.addEventListener('popstate', event => {
        let { html } = fromSessionStorage(event)

        html && swapPage(Alpine, html, () => {
            document.dispatchEvent(new CustomEvent('alpine:navigated', { bubbles: true }))
        })
    })

    // Listen for any <a> tag click...
    document.addEventListener('click', e => {
        if (e.target.tagName.toLowerCase() !== 'a') return

        let url = new URL(window.location.href, document.baseURI)
        replaceUrl(url, document.documentElement.outerHTML)

        let destination = new URL(e.target.getAttribute('href'), document.baseURI)

        document.dispatchEvent(new CustomEvent('alpine:navigating', { bubbles: true }))

        fetch(destination.pathname).then(i => i.text()).then(html => {
            swapPage(Alpine, html, () => {
                pushUrl(destination, html)

                document.dispatchEvent(new CustomEvent('alpine:navigated', { bubbles: true }))
            })
        })

        e.preventDefault()
    })

    Alpine.magic('history', (el, { interceptor }) =>  {
        let alias

        return interceptor((initialValue, getter, setter, path, key) => {
            let pause = false
            let queryKey = alias || path

            let value = initialValue
            let url = new URL(window.location.href)

            if (url.searchParams.has(queryKey)) {
                value = url.searchParams.get(queryKey)
            }

            setter(value)

            let object = { value }

            url.searchParams.set(queryKey, value)

            replace(url.toString(), path, object)

            window.addEventListener('popstate', (e) => {
                if (! e.state) return
                if (! e.state.alpine) return

                Object.entries(e.state.alpine).forEach(([newKey, { value }]) => {
                    if (newKey !== key) return

                    pause = true

                    Alpine.disableEffectScheduling(() => {
                        setter(value)
                    })

                    pause = false
                })
            })

            Alpine.effect(() => {
                let value = getter()

                if (pause) return

                let object = { value }

                let url = new URL(window.location.href)

                url.searchParams.set(queryKey, value)

                push(url.toString(), path, object)
            })

            return value
        }, func => {
            func.as = key => { alias = key; return func }
        })
    })
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
