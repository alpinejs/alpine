import Component from './component'
import { domReady, isTesting } from './utils'

const Alpine = {
    version: process.env.PKG_VERSION,

    pauseMutationObserver: false,

    magicProperties: {},

    onComponentInitializeds: [],

    onBeforeComponentInitializeds: [],

    ignoreFocusedForValueBinding: false,

    start: async function () {
        if (! isTesting()) {
            await domReady()
        }

        this.discoverComponents(el => {
            this.initializeComponent(el)
        })

        // It's easier and more performant to just support Turbolinks than listen
        // to MutationObserver mutations at the document level.
        document.addEventListener("turbolinks:load", () => {
            this.discoverUninitializedComponents(el => {
                this.initializeComponent(el)
            })
        })

        this.listenForNewUninitializedComponentsAtRunTime()
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

    listenForNewUninitializedComponentsAtRunTime: function () {
        const targetNode = document.querySelector('body');

        const observerOptions = {
            childList: true,
            attributes: true,
            subtree: true,
        }

        const observer = new MutationObserver((mutations) => {
            if (this.pauseMutationObserver) return;

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
            // Wrap in a try/catch so that we don't prevent other components
            // from initializing when one component contains an error.
            try {
                el.__x = new Component(el)
            } catch (error) {
                setTimeout(() => {
                    throw error
                }, 0)
            }
        }
    },

    clone: function (component, newEl) {
        if (! newEl.__x) {
            newEl.__x = new Component(newEl, component)
        }
    },

    addMagicProperty: function (name, callback) {
        this.magicProperties[name] = callback
    },

    onComponentInitialized: function (callback) {
        this.onComponentInitializeds.push(callback)
    },

    onBeforeComponentInitialized: function (callback) {
        this.onBeforeComponentInitializeds.push(callback)
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
