import Component from './component'
import { domReady, isTesting } from './utils'

const Alpine = {
    version: process.env.PKG_VERSION,
    start: async function () {
        if (! isTesting()) {
            await domReady()
        }

        this.discoverComponents(el => {
            this.initializeComponent(el)
        })

        this.listenForNewUninitializedComponentsAtRunTime()

        this.initTurbolinksListeners()
    },

    discoverComponents: function (callback) {
        const rootEls = document.querySelectorAll('[x-data]');

        rootEls.forEach(rootEl => {
            callback(rootEl)
        })
    },

    discoverUninitializedComponents: function (callback, el = null) {
        const rootEls = (el || document).querySelectorAll('[x-data]');

        Array.from(rootEls)
            .filter(el => el.__x === undefined)
            .forEach(rootEl => {
                callback(rootEl)
            })
    },

    listenForNewUninitializedComponentsAtRunTime: function() {
        this.observer = new MutationObserver((mutations) => {
            for (let i=0; i < mutations.length; i++){
                if (mutations[i].addedNodes.length > 0) {
                    mutations[i].addedNodes.forEach(node => {
                        // Discard non-element nodes (like line-breaks)
                        if (node.nodeType !== 1) return

                        // Discard any changes happening within an existing component.
                        // They will take care of themselves.
                        if (node.parentElement && node.parentElement.closest('[x-data]')) return

                        this.discoverUninitializedComponents((el) => {
                            this.initializeComponent(el)
                        }, node.parentElement)
                    })
                }
            }
        })

        this.observer.observe(document.body, {childList: true, attributes: true, subtree: true})
    },

    initializeComponent: function (el) {
        if (! el.__x) {
            el.__x = new Component(el)
        }
    },

    clone: function (component, newEl) {
        if (! newEl.__x) {
            newEl.__x = new Component(newEl, component.getUnobservedData())
        }
    },

    initTurbolinksListeners() {
        // To avoid issue with the mutation observer going mad when turbolinks
        // reloads a page, we disconnect it. It will be reconnected by the turbolinks:load event
        document.addEventListener("turbolinks:click", () => {
            this.observer.disconnect()
        })

        // It's easier and more performant to just support Turbolinks than listen
        // to MutationObserver mutations at the document level.
        document.addEventListener("turbolinks:load", () => {
            Alpine.discoverUninitializedComponents(el => {
                this.initializeComponent(el)
            })

            this.observer.observe(document.body, {childList: true, attributes: true, subtree: true})
        })

        // We don't want tutbolinks to cache elements created by Alpine directives
        // so we clean up the stage before letting turbolinks do its duty
        document.addEventListener("turbolinks:before-cache", () => {
            const xFors = document.querySelectorAll('template[x-for]')
            xFors.forEach((el) => {
                let nextEl = el.nextElementSibling
                while (nextEl && nextEl.__x_for_key) {
                    const currEl = nextEl
                    nextEl = nextEl.nextElementSibling
                    currEl.remove()
                }
            })
            const xIfs = document.querySelectorAll('template[x-if]')
            xIfs.forEach((el) => {
                let nextEl = el.nextElementSibling
                if (nextEl && nextEl.__x_inserted_me) {
                    nextEl.remove()
                }
            })
        })
    }
}

if (! isTesting()) {
    window.Alpine = Alpine

    if (window.deferLoadingAlpine) {
        window.deferLoadingAlpine(function () {
            window.Alpine.start()
        })
   } else {
        window.Alpine.start()
   }
}

export default Alpine
