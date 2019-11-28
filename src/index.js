/* @flow */
import Component from './component'
import { domReady, isTesting } from './utils'

const projectX = {
    start: async function () {
        await domReady()

        this.discoverComponents()

        // It's easier and more performant to just support Turbolinks than listen
        // to MutationOberserver mutations at the document level.
        document.addEventListener("turbolinks:load", () => {
            this.discoverComponents()
        })

        var targetNode = document.querySelector('body');
        var observerOptions = {
            childList: true,
            attributes: true,
            subtree: true //Omit or set to false to observe only changes to the parent node.
        }

        var observer = new MutationObserver((mutations) => {
            for (var i=0; i < mutations.length; i++){
                if (mutations[i].addedNodes.length > 0) {
                    mutations[i].addedNodes.forEach(node => {
                        if (node.nodeType !== 1) return

                        if (node.matches('[x-data]')) {
                            this.initializeElement(node)
                        }
                    })
                }
              }
        });

        observer.observe(targetNode, observerOptions);
    },

    discoverComponents: function () {
        const rootEls = document.querySelectorAll('[x-data]');

        rootEls.forEach(rootEl => {
            this.initializeElement(rootEl)
        })
    },

    initializeElement: function (el) {
        if (isTesting()) {
            // This is so the (usually only one) component is accessible to Jest tests.
            window.component = new Component(el)
        } else {
            new Component(el)
        }
    }
}

if (! window.projectX && ! isTesting()) {
    window.projectX = projectX
    window.projectX.start()
}

export default projectX
