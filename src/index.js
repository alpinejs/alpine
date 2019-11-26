/* @flow */
import Component from './component'

const minimal = {
    start: function () {
        const rootEls = document.querySelectorAll('[x-data]');

        rootEls.forEach(rootEl => {
            window.component = new Component(rootEl)
        })
    }
}

if (! window.minimal) {
    window.minimal = minimal
}

export default minimal
