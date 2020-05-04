import Component from './component'
import { domReady, isTesting, walk } from './utils'

const Alpine = {
    version: process.env.PKG_VERSION,
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

        this.observer.observe(document.body, observerOptions);
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

			this.observer.observe(document.body, { childList: true, attributes: true, subtree: true });
		});

		// Disconnect the the mutation observer to avoid data races, and then
		// clean up the elements created by Alpine directives before Turbolinks
		// stores it to cache, unless it's marked as permanent.
		// The mutiation observer will be reconnected by the turbolinks:load event.
		document.addEventListener('turbolinks:before-cache', () => {
			this.observer.disconnect();
			walk(document.body, (el) => {
				if (el.hasAttribute('data-turbolinks-permanent')) {
					return false;
				}

				if (el.hasAttribute('x-for')) {
					let nextEl = el.nextElementSibling;
					while (nextEl) {
						const currEl = nextEl;
						nextEl = nextEl.nextElementSibling;
						if (typeof currEl.__x_for_key !== 'undefined') {
							currEl.remove();
						}
					}
					return true;
				}

				if (el.hasAttribute('x-if')) {
					const ifEl = el.nextElementSibling;
					if (ifEl && typeof ifEl.__x_inserted_me !== 'undefined') {
						ifEl.remove();
					}
				}
				return true;
			});
		});
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
