import Component from './component'

var rename = {
    start: function () {
        const rootEls = document.querySelectorAll('[x-data]');

        rootEls.forEach(rootEl => {
            window.component = new Component(rootEl)
        })
    }
}

if (! window.rename) {
    window.rename = rename
}

export default rename
