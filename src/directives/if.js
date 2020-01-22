import { transitionIn, transitionOut } from '../utils'

export function handleIfDirective(el, expressionResult, initialUpdate) {
    if (el.nodeName.toLowerCase() !== 'template') console.warn(`Alpine: [x-if] directive should only be added to <template> tags. See https://github.com/alpinejs/alpine#x-if`)

    const elementHasAlreadyBeenAdded = el.nextElementSibling && el.nextElementSibling.__x_inserted_me === true

    if (expressionResult && ! elementHasAlreadyBeenAdded) {
        const clone = document.importNode(el.content, true);

        el.parentElement.insertBefore(clone, el.nextElementSibling)

        el.nextElementSibling.__x_inserted_me = true

        transitionIn(el.nextElementSibling, () => {}, initialUpdate)
    } else if (! expressionResult && elementHasAlreadyBeenAdded) {
        transitionOut(el.nextElementSibling, () => {
            el.nextElementSibling.remove()
        }, initialUpdate)
    }
}
