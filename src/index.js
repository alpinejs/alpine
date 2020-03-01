import Component from './component'
import { domReady, isTesting } from './utils'

const _isTesting = isTesting()

const Alpine = {
    async start() {
        if (!_isTesting) {
            await domReady()
        }

        this.discoverComponents(this.initializeComponent)

        // It's easier and more performant to just support Turbolinks than listen
        // to MutationObserver mutations at the document level.
        document.addEventListener(
            'turbolinks:load',
            () => this.discoverUninitializedComponents(this.initializeComponent),
        )

        this.listenForNewUninitializedComponentsAtRunTime(this.initializeComponent)
    },

    discoverComponents(callback) {
        document.querySelectorAll('[x-data]').forEach(callback)
    },

    discoverUninitializedComponents(callback, el = null) {
        const rootEls = (el || document).querySelectorAll('[x-data]')

        Array.from(rootEls).filter(el => el.__x === undefined).forEach(callback)
    },

    listenForNewUninitializedComponentsAtRunTime(callback) {
        const observerOptions = {
            attributes: true,
            childList: true,
            subtree: true,
        }

        const observer = new MutationObserver((mutations) => {
            const _len = mutations.length

            for (let i = 0; i < _len; i++) {
                if (mutations[i].addedNodes.length <= 0) {
                    continue
                }

                mutations[i].addedNodes.forEach((node) => {
                    // Discard non-element nodes (like line-breaks).
                    if (node.nodeType !== 1) {
                        return
                    }

                    // Discard any changes happening within an existing component.
                    // They will take care of themselves.
                    if (node.parentElement && node.parentElement.closest('[x-data]')) {
                        return
                    }

                    this.discoverUninitializedComponents(callback, node.parentElement)
                })
            }
        })

        observer.observe(document.body, observerOptions)
    },

    initializeComponent(el) {
        !el.__x && (el.__x = new Component(el))
    },

    clone(component, newEl) {
        !newEl.__x && (newEl.__x = new Component(newEl, component.getUnobservedData()))
    }
}

if (!_isTesting) {
    window.Alpine = Alpine

    window.Alpine.start()
}

export default Alpine
