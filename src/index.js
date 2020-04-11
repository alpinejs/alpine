import Component from './component'
import { domReady, isTesting } from './utils'

const Alpine = {
    start: async function () {
        if (! isTesting()) {
            await domReady()
        }

        this.discoverComponents(el => {
            this.initializeComponent(el)
        })

        // To avoid issue with the mutation observer going mad when turbolinks
        // reload the page, we disconnect it
        document.addEventListener("turbolinks:click", () => {
            this.observer.disconnect()
        })

        // It's easier and more performant to just support Turbolinks than listen
        // to MutationObserver mutations at the document level.
        document.addEventListener("turbolinks:load", () => {
            this.discoverUninitializedComponents(el => {
                this.initializeComponent(el)
            })

            // Once done, we reconnect the mutation observer
            const targetNode = document.querySelector('body');
            const observerOptions = {
                childList: true,
                attributes: true,
                subtree: true,
            }
            this.observer.observe(targetNode, observerOptions)
        })

        this.listenForNewUninitializedComponentsAtRunTime(el => {
            this.initializeComponent(el)
        })
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

    listenForNewUninitializedComponentsAtRunTime: function (callback) {
        const targetNode = document.querySelector('body');

        const observerOptions = {
            childList: true,
            attributes: true,
            subtree: true,
        }

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

        this.observer.observe(targetNode, observerOptions)
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
