import { createFocusTrap } from 'focus-trap';

export default function (Alpine) {
    Alpine.directive('trap', Alpine.skipDuringClone(
        (el, { expression, modifiers }, { effect, evaluateLater }) => {
            let evaluator = evaluateLater(expression)

            let oldValue = false

            let trap = createFocusTrap(el, { 
                escapeDeactivates: false,
                allowOutsideClick: true,
                fallbackFocus: () => el,
            })

            let undoInert = () => {}
            let undoDisableScrolling = () => {}

            effect(() => evaluator(value => {
                if (oldValue === value) return

                // Start trapping.
                if (value && ! oldValue) {
                    setTimeout(() => {
                        if (modifiers.includes('inert')) undoInert = setInert(el)
                        if (modifiers.includes('noscroll')) undoDisableScrolling = disableScrolling()

                        trap.activate()
                    });
                }

                // Stop trapping.
                if (! value && oldValue) {
                    undoInert()
                    undoInert = () => {}

                    undoDisableScrolling()
                    undoDisableScrolling = () => {}

                    trap.deactivate()
                }

                oldValue = !! value
            }))
        },
        // When cloning, we only want to add aria-hidden attributes to the
        // DOM and not try to actually trap, as trapping can mess with the
        // live DOM and isn't just isolated to the cloned DOM.
        (el, { expression, modifiers }, { evaluate }) => {
            if (modifiers.includes('inert') && evaluate(expression)) setInert(el)
        },
    ))
}

function setInert(el) {
    let undos = []

    crawlSiblingsUp(el, (sibling) => {
        let cache = sibling.hasAttribute('aria-hidden')

        sibling.setAttribute('aria-hidden', 'true')

        undos.push(() => cache || sibling.removeAttribute('aria-hidden'))
    })

    return () => {
        while(undos.length) undos.pop()()
    }
}

function crawlSiblingsUp(el, callback) {
    if (el.isSameNode(document.body) || ! el.parentNode) return

    Array.from(el.parentNode.children).forEach(sibling => {
        if (! sibling.isSameNode(el)) callback(sibling)

        crawlSiblingsUp(el.parentNode, callback)
    })
}

function disableScrolling() {
    let overflow = document.documentElement.style.overflow
    let paddingRight = document.documentElement.style.paddingRight

    let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    document.documentElement.style.overflow = 'hidden'
    document.documentElement.style.paddingRight = `${scrollbarWidth}px`

    return () => {
        document.documentElement.style.overflow = overflow
        document.documentElement.style.paddingRight = paddingRight
    }
}
