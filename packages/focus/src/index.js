import { createFocusTrap } from 'focus-trap'
import { focusable, isFocusable } from 'tabbable'

export default function (Alpine) {
    let lastFocused
    let currentFocused

    window.addEventListener('focusin', () => {
        lastFocused = currentFocused
        currentFocused = document.activeElement
    })

    Alpine.magic('focus', el => {
        let within = el

        return {
            __noscroll: false,
            __wrapAround: false,
            within(el) { within = el; return this },
            withoutScrolling() { this.__noscroll = true; return this },
            noscroll() { this.__noscroll = true; return this },
            withWrapAround() { this.__wrapAround = true; return this },
            wrap() { return this.withWrapAround() },
            focusable(el) {
                return isFocusable(el)
            },
            previouslyFocused() {
                return lastFocused
            },
            lastFocused() {
                return lastFocused
            },
            focused() {
                return currentFocused
            },
            focusables() {
                if (Array.isArray(within)) return within

                return focusable(within, { displayCheck: 'none' })
            },
            all() { return this.focusables() },
            isFirst(el) {
                let els = this.all()

                return els[0] && els[0].isSameNode(el)
            },
            isLast(el) {
                let els = this.all()

                return els.length && els.slice(-1)[0].isSameNode(el)
            },
            getFirst() { return this.all()[0] },
            getLast() { return this.all().slice(-1)[0] },
            getNext() {
                let list = this.all()
                let current = document.activeElement

                // Can't find currently focusable element in list.
                if (list.indexOf(current) === -1) return

                // This is the last element in the list and we want to wrap around.
                if (this.__wrapAround && list.indexOf(current) === list.length - 1) {
                    return list[0]
                }

                return list[list.indexOf(current) + 1]
            },
            getPrevious() {
                let list = this.all()
                let current = document.activeElement

                // Can't find currently focusable element in list.
                if (list.indexOf(current) === -1) return

                // This is the first element in the list and we want to wrap around.
                if (this.__wrapAround && list.indexOf(current) === 0) {
                    return list.slice(-1)[0]
                }

                return list[list.indexOf(current) - 1]
            },
            first() { this.focus(this.getFirst()) },
            last() { this.focus(this.getLast()) },
            next() { this.focus(this.getNext()) },
            previous() { this.focus(this.getPrevious()) },
            prev() { return this.previous() },
            focus(el) {
                if (! el) return

                setTimeout(() => {
                    if (! el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0')

                    el.focus({ preventScroll: this.__noscroll })
                })
            }
        }
    })

    Alpine.directive('trap', Alpine.skipDuringClone(
        (el, { expression, modifiers }, { effect, evaluateLater, cleanup }) => {
            let evaluator = evaluateLater(expression)

            let oldValue = false

            let options = {
                escapeDeactivates: false,
                allowOutsideClick: true,
                fallbackFocus: () => el,
            }

            if (modifiers.includes('noautofocus')) {
                options.initialFocus = false
            } else {
                let autofocusEl = el.querySelector('[autofocus]')

                if (autofocusEl) options.initialFocus = autofocusEl
            }

            let trap = createFocusTrap(el, options)

            let undoInert = () => {}
            let undoDisableScrolling = () => {}

            const releaseFocus = () => {
                undoInert()
                undoInert = () => {}

                undoDisableScrolling()
                undoDisableScrolling = () => {}

                trap.deactivate({
                    returnFocus: !modifiers.includes('noreturn')
                })
            }

            effect(() => evaluator(value => {
                if (oldValue === value) return

                // Start trapping.
                if (value && ! oldValue) {
                    if (modifiers.includes('noscroll')) undoDisableScrolling = disableScrolling()
                    if (modifiers.includes('inert')) undoInert = setInert(el)

                    // Activate the trap after a generous tick. (Needed to play nice with transitions...)
                    setTimeout(() => {
                        trap.activate()
                    }, 15)
                }

                // Stop trapping.
                if (! value && oldValue) {
                    releaseFocus()
                }

                oldValue = !! value
            }))

            cleanup(releaseFocus)
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
        if (sibling.isSameNode(el)) {
            crawlSiblingsUp(el.parentNode, callback)
        } else {
            callback(sibling)
        }
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
