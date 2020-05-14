import Component from './component'
import { domReady, isTesting, walk } from './utils'

const Alpine = {
    version: process.env.PKG_VERSION,
    pauseObserver: false,
    start: async function () {
        if (! isTesting()) {
            await domReady()
        }

        this.discoverComponents(el => {
            this.initializeComponent(el)
        })

        this.listenForNewUninitializedComponentsAtRunTime();

        this.initTurbolinksListeners();
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
        const observerOptions = {
            childList: true,
            attributes: true,
            subtree: true,
        }

        const observer = new MutationObserver((mutations) => {
            if (this.pauseObserver) return

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

        observer.observe(document.body, observerOptions);
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
		// It's easier and more performant to just support Turbolinks than listen
		// to MutationObserver mutations at the document level.
		document.addEventListener('turbolinks:load', () => {
			Alpine.discoverUninitializedComponents((el) => {
				this.initializeComponent(el);
			});

            this.pauseObserver = true
		});

        // Before swapping the body, clean up any element with x-turbolinks-cached
        // which not have any Alpine attributes.
        // Note, at this point all html fragments marked as data-turbolinks-permanent
        // are already copied over from the previous page so they retain their listener
        // and custom properties and we don't want to reset them.
        document.addEventListener('turbolinks:before-render', (event) => {
            event.data.newBody.querySelectorAll('[x-generated]').forEach((el) => {
                el.removeAttribute('x-generated')
                if (typeof el.__x_for_key === 'undefined' && typeof el.__x_inserted_me === 'undefined') {
                    el.remove()
                }
            })
        })

		// Paus the the mutation observer to avoid data races, it will be resumed by the turbolinks:load event.
		// We mark as `x-generated`` all the elements that are crated by an Alpine templating directives.
		// The reason is that turbolinks caches pages using cloneNode which removes listeners and custom properties
        // So we need to propagate this infomation using a HTML attribute. I know, not ideal but I could not think
        // of a better option.
        // Note, we can't remove any Alpine generated element as yet because if they live inside an element
        // marked as data-turbolinks-permanent they need to be copied into the next page.
        // The coping process happens somewhere between before-cache and before-render.
		document.addEventListener('turbolinks:before-cache', () => {
			this.pauseObserver = true

            walk(document.body, (el) => {
                if (el.hasAttribute('x-for')) {
                    let nextEl = el.nextElementSibling;
                    while (nextEl && nextEl.__x_for_key !== 'undefined') {
                        const currEl = nextEl
                        nextEl = nextEl.nextElementSibling
                        currEl.setAttribute('x-generated', true)
                    }
                } else if (el.hasAttribute('x-if')) {
                    const ifEl = el.nextElementSibling;
                    if (ifEl && typeof ifEl.__x_inserted_me !== 'undefined') {
                        ifEl.setAttribute('x-generated', true)
                    }
                }

                return true
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
