import { createFocusTrap } from 'focus-trap'
import { focusable, tabbable, isFocusable } from 'tabbable'

export default function (Alpine) {
    let lastFocused
    let currentFocused 

    window.addEventListener('focusin', () => {
        lastFocused = currentFocused
        currentFocused = document.activeElement
    })

    Alpine.directive('teleport-focus', (el) => {
        let lastTarget = document.activeElement

        document.addEventListener('focusin', e => {
            // Let's check if we just crossed over the <template> portal tag.
            if (
                (el.compareDocumentPosition(e.target) & Node.DOCUMENT_POSITION_FOLLOWING
                && el.compareDocumentPosition(lastTarget) & Node.DOCUMENT_POSITION_PRECEDING)
                || (el.compareDocumentPosition(e.target) & Node.DOCUMENT_POSITION_PRECEDING
                    && el.compareDocumentPosition(lastTarget) & Node.DOCUMENT_POSITION_FOLLOWING)
            ) {
                let els = tabbable(el._x_teleport, { includeContainer: true, displayCheck: 'none' })
                // If there is a focusable, focus it, otherwise, bail and let it be past the <template>.
                if (els[0]) {
                    queueMicrotask(() => {
                        el._x_teleport._x_return_focus_to = e.target 
                        els[0].focus()

                        el._x_teleport.addEventListener('keydown', function portalListener(e) {
                            if (e.key.toLowerCase() !== 'tab') return
                            // We are tabbing away from something focusable.
                            if (! document.activeElement.isSameNode(e.target)) return
            
                            let els = focusable(el._x_teleport, { includeContainer: true })
                            let last = els.slice(-1)[0]
            
                            if (last && last.isSameNode(e.target)) {
                                el._x_teleport._x_return_focus_to.focus()
                                e.preventDefault() 
                                e.stopPropagation() 
                                el._x_teleport.removeEventListener('keydown', portalListener)
                            }
                        })
                    })
                }
            } 

            lastTarget = e.target
        })

        // document.addEventListener('focusin', e => {
        //     // If focusing is happening outside the teleported content.
        //     if (! el._x_teleport.contains(e.target)) {
        //         // AND the last focused el was inside teleport
        //         if (el._x_teleport.contains(lastTarget)) {
        //             lastOutsideTarget.focus()
        //         } else {
        //             // OTHERWISE, we know we are still outside the portal.
        //             if (
        //                 el.compareDocumentPosition(e.target) & Node.DOCUMENT_POSITION_FOLLOWING
        //                 && el.compareDocumentPosition(lastOutsideTarget) & Node.DOCUMENT_POSITION_PRECEDING
        //             ) {
        //                 // If we did, intercept this focus, and instead focus the first focusable inside the portal.

        //                 let els = tabbable(el._x_teleport, { includeContainer: true, displayCheck: 'none' })
        //                 // If there is a focusable, focus it, otherwise, bail and let it be past the <template>.
        //                 if (els[0]) {
        //                     doFocus = () => els[0].focus()
        //                 }
        //             } 
        //         }

        //         lastOutsideTarget = e.target
        //     }
           
        //     lastTarget = e.target

        //     doFocus()
        //     doFocus = () => {}
        // })
    })

    Alpine.magic('focus', el => {
        let within = el
       
        return {
            __noscroll: false, 
            __wrapAround: false, 
            within(el) { within = el; return this },
            withoutScrolling() { this.__noscroll = true; return this },
            withWrapAround() { this.__wrapAround = true; return this },
            focusable(el) {
                return isFocusable(el)
            },
            previouslyFocused() {
                return lastFocused
            },
            all() {
                if (Array.isArray(within)) return within 

                return focusable(within, { displayCheck: 'none' })
            },
            isFirst(el) {
                let els = this.all() 
                
                return els[0] && els[0].isSameNode(el)
            },
            isLast(el) {
                let els = this.all() 
                
                return els.length && els.slice(-1)[0].isSameNode(el)
            },
            getFirst() { return this.all()[0] },
            getLast() { return this.all(f).slice(-1)[0] },
            first() { this.focus(this.getFirst()) },
            last() { this.focus(this.getLast()) },
            next() {
                let list = this.all()
                let current = document.activeElement

                // Can't find currently focusable element in list.
                if (list.indexOf(current) === -1) return

                // This is the last element in the list and we want to wrap around.
                if (this.__wrapAround && list.indexOf(current) === list.length - 1) {
                    return this.focus(list[0])
                }

                this.focus(list[list.indexOf(current) + 1])
            },
            prev() { return this.previous() },
            previous() {
                let list = this.all()
                let current = document.activeElement

                // Can't find currently focusable element in list.
                if (list.indexOf(current) === -1) return

                // This is the first element in the list and we want to wrap around.
                if (this.__wrapAround && list.indexOf(current) === 0) {
                    return this.focus(list.slice(-1)[0])
                }

                this.focus(list[list.indexOf(current) - 1])
            },
            focus(el, wrapEl) {
                if (! el) return 

                setTimeout(() => {
                    if (! el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0')

                    el.focus({ preventScroll: this._noscroll })
                })
            }
        }
    })

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
