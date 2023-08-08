import { updateCurrentPageHtmlInHistoryStateForLaterBackButtonClicks, updateUrlAndStoreLatestHtmlForFutureBackButtons, whenTheBackOrForwardButtonIsClicked } from "./history"
import { getPretchedHtmlOr, prefetchHtml, storeThePrefetchedHtmlForWhenALinkIsClicked } from "./prefetch"
import { createUrlObjectFromString, extractDestinationFromLink, whenThisLinkIsHoveredFor, whenThisLinkIsPressed } from "./links"
import { restoreScrollPosition, storeScrollInformationInHtmlBeforeNavigatingAway } from "./scroll"
import { putPersistantElementsBack, storePersistantElementsForLater } from "./persist"
import { finishAndHideProgressBar, showAndStartProgressBar } from "./bar"
import { transition } from "alpinejs/src/directives/x-transition"
import { swapCurrentPageWithNewHtml } from "./page"
import { fetchHtml } from "./fetch"
import { prefix } from "alpinejs/src/directives"

let enablePersist = true
let showProgressBar = true
let restoreScroll = true
let autofocus = false

export default function (Alpine) {
    Alpine.navigate = (url) => {
        navigateTo(
            createUrlObjectFromString(url)
        )
    }

    Alpine.navigate.disableProgressBar = () => {
        showProgressBar = false
    }

    Alpine.addInitSelector(() => `[${prefix('navigate')}]`)

    Alpine.directive('navigate', (el, { value, expression, modifiers }, { evaluateLater, cleanup }) => {
        let shouldPrefetchOnHover = modifiers.includes('hover')

        shouldPrefetchOnHover && whenThisLinkIsHoveredFor(el, 60, () => {
            let destination = extractDestinationFromLink(el)

            prefetchHtml(destination, html => {
                storeThePrefetchedHtmlForWhenALinkIsClicked(html, destination)
            })
        })

        whenThisLinkIsPressed(el, (whenItIsReleased) => {
            let destination = extractDestinationFromLink(el)

            prefetchHtml(destination, html => {
                storeThePrefetchedHtmlForWhenALinkIsClicked(html, destination)
            })

            whenItIsReleased(() => {
                navigateTo(destination)
            })
        })
    })

    function navigateTo(destination) {
        showProgressBar && showAndStartProgressBar()

        fetchHtmlOrUsePrefetchedHtml(destination, html => {
            fireEventForOtherLibariesToHookInto('alpine:navigating')

            restoreScroll && storeScrollInformationInHtmlBeforeNavigatingAway()

            showProgressBar && finishAndHideProgressBar()

            updateCurrentPageHtmlInHistoryStateForLaterBackButtonClicks()

            preventAlpineFromPickingUpDomChanges(Alpine, andAfterAllThis => {
                enablePersist && storePersistantElementsForLater()

                swapCurrentPageWithNewHtml(html, () => {
                    enablePersist && putPersistantElementsBack()

                    restoreScroll && restoreScrollPosition()

                    fireEventForOtherLibariesToHookInto('alpine:navigated')

                    updateUrlAndStoreLatestHtmlForFutureBackButtons(html, destination)

                    andAfterAllThis(() => {
                        autofocus && autofocusElementsWithTheAutofocusAttribute()

                        nowInitializeAlpineOnTheNewPage(Alpine)
                    })
                })
            })
        })
    }

    whenTheBackOrForwardButtonIsClicked((html) => {
        // @todo: see if there's a way to update the current HTML BEFORE
        // the back button is hit, and not AFTER:
        storeScrollInformationInHtmlBeforeNavigatingAway()
        // updateCurrentPageHtmlInHistoryStateForLaterBackButtonClicks()

        preventAlpineFromPickingUpDomChanges(Alpine, andAfterAllThis => {
            enablePersist && storePersistantElementsForLater()

            swapCurrentPageWithNewHtml(html, andThen => {
                enablePersist && putPersistantElementsBack()

                restoreScroll && restoreScrollPosition()

                fireEventForOtherLibariesToHookInto('alpine:navigated')

                andAfterAllThis(() => {
                    autofocus && autofocusElementsWithTheAutofocusAttribute()

                    nowInitializeAlpineOnTheNewPage(Alpine)
                })
            })

        })
    })

    // Because DOMContentLoaded is fired on first load,
    // we should fire alpine:navigated as a replacement as well...
    setTimeout(() => {
        fireEventForOtherLibariesToHookInto('alpine:navigated', true)
    })
}

function fetchHtmlOrUsePrefetchedHtml(fromDestination, callback) {
    getPretchedHtmlOr(fromDestination, callback, () => {
        fetchHtml(fromDestination, callback)
    })
}

function preventAlpineFromPickingUpDomChanges(Alpine, callback) {
    Alpine.stopObservingMutations()

    callback((afterAllThis) => {
        Alpine.startObservingMutations()

        setTimeout(() => {
            afterAllThis()
        })
    })
}

function fireEventForOtherLibariesToHookInto(eventName, init = false) {
    document.dispatchEvent(new CustomEvent(eventName, { bubbles: true, detail: { init } }))
}

function nowInitializeAlpineOnTheNewPage(Alpine) {
    Alpine.initTree(document.body, undefined, (el, skip) => {
        if (el._x_wasPersisted) skip()
    })
}

function autofocusElementsWithTheAutofocusAttribute() {
    document.querySelector('[autofocus]') && document.querySelector('[autofocus]').focus()
}
















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
// }



// function replace(url, key, object) {
//     let state = window.history.state || {}

//     if (! state.alpine) state.alpine = {}

//     state.alpine[key] = object

//     window.history.replaceState(state, '', url)
// }

// function push(url, key, object) {
//     let state = { alpine: {...window.history.state.alpine, ...{[key]: object}} }

//     window.history.pushState(state, '', url)
// }
