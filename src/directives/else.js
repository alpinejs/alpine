import { handleIfDirective } from './if'

export function handleElseDirective(el) {
    let show = true

    if (!el.previousElementSibling) {
        console.warn('AlpineJS Warning: Cannot use [x-else] if there was no previous sibling')
        show = false
    }
    else if (el.previousElementSibling.__x_inserted_me) {
        // Previous sibling appears to have been shown so do not show this else block.
        show = false
    }
    else if (el.previousElementSibling.nodeName.toLowerCase() !== 'template'
        || !el.previousElementSibling.hasAttribute('x-if')) {
        console.warn('AlpineJS Warning: Cannot use [x-else] if previous element was not a <template> element with "x-if" attribute')
        show = false
    }

    // Run regular x-if directive to show/hide tag:
    handleIfDirective(el, show)
}
