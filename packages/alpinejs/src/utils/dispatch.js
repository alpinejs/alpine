
export function dispatch(el, name, detail = {}, options = {}) {
    return el.dispatchEvent(
        new CustomEvent(name, {
            detail,
            bubbles: true,
            // Allows events to pass the shadow DOM barrier.
            composed: true,
            cancelable: true,
            // Allows overriding the default event options.
            ...options
        })
    )
}
