
export function registerElement(name, callback) {
    class CustomAlpineElement extends HTMLElement {
        constructor() {
            super()

            this._x_virtualDirectives = callback(this)
        }
    }

    customElements.define('x-'+name, CustomAlpineElement)
}
