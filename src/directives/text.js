export function handleTextDirective(el, output, modifiers, expression, initialUpdate = false) {
    if (modifiers.includes('once') && !initialUpdate) {
        return;
    }

    // If nested model key is undefined, set the default value to empty string.
    if (output === undefined && expression.match(/\./).length) {
        output = ''
    }

    el.innerText = output
}
