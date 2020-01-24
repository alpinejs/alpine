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

        // It's easier and more performant to just support Turbolinks than listen
        // to MutationOberserver mutations at the document level.
        document.addEventListener("turbolinks:load", () => {
            this.discoverUninitializedComponents(el => {
                this.initializeComponent(el)
            })
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

        const observer = new MutationObserver((mutations) => {
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

        observer.observe(targetNode, observerOptions)
    },

    initializeComponent: function (el) {
        if (! el.__x) {
            el.__x = new Component(el)
        }
    }
}

if (! isTesting()) {
    window.Alpine = Alpine
    window.Alpine.start()
}

export default Alpine
