export function handleTextDirective(el, output, expression) {
    // If nested model key is undefined, set the default value to empty string.
    if (output === undefined && expression.match(/\./)) {
        output = ''
    }

    if (el instanceof HTMLElement) {
        el.innerText = output
    } else {
        el.textContent = output
    }
}
