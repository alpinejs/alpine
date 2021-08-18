import 'wicg-inert'

export default function (Alpine) {
    Alpine.directive('trap', (el, { expression }, { effect, evaluateLater }) => {
        let evaluator = evaluateLater(expression)

        let oldValue = false

        let undoTrappings = []

        effect(() => evaluator(value => {
            if (oldValue === value) return

            // Start trapping.
            if (value && ! oldValue) {
                let activeEl = document.activeElement

                undoTrappings.push(() => activeEl && setTimeout(() => activeEl.focus()))

                crawlSiblingsUp(el, (sibling) => {
                    let cache = sibling.hasAttribute('inert')

                    sibling.setAttribute('inert', 'inert')

                    undoTrappings.push(() => cache || sibling.removeAttribute('inert'))
                })

                focusFirstElement(el)
            }

            // Stop trapping.
            if (! value && oldValue) {
                while(undoTrappings.length) undoTrappings.pop()()
            }

            oldValue = !! value
        }))
    })
}

function crawlSiblingsUp(el, callback) {
    if (el.isSameNode(document.body)) return

    Array.from(el.parentNode.children).forEach(sibling => {
        if (! sibling.isSameNode(el)) callback(sibling)

        crawlSiblingsUp(el.parentNode, callback) 
    })
}

function focusFirstElement(el) {
    let autofocus = el.querySelector('[autofocus]')

    if (autofocus) {
        setTimeout(() => autofocus.focus())
    } else {
        // All focusable element types...
        let selector = 'a, button, input, textarea, select, details, [tabindex]:not([tabindex=\'-1\'])'

        let firstFocusable = Array.from(el.querySelectorAll(selector))
            // All non-disabled elements...
            .filter(el => ! el.hasAttribute('disabled'))
            [0]

        setTimeout(() => firstFocusable && firstFocusable.focus())
    }
}
