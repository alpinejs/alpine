
export default function (Alpine) {
    Alpine.directive('popover', (el, directive) => {
        if      (! directive.value)                 handleRoot(el, Alpine)
        else if (directive.value === 'overlay')     handleOverlay(el, Alpine)
        else if (directive.value === 'button')      handleButton(el, Alpine)
        else if (directive.value === 'panel')       handlePanel(el, Alpine)
        else if (directive.value === 'group')       handleGroup(el, Alpine)
    })

    Alpine.magic('popover', el => {
        let $data = Alpine.$data(el)

        return {
            get isOpen() {
                return $data.__isOpenState
            },
            open() {
                $data.__open()
            },
            close() {
                $data.__close()
            },
        }
    })
}

function handleRoot(el, Alpine) {
    Alpine.bind(el, {
        'x-id'() { return ['alpine-popover-button', 'alpine-popover-panel'] },
        'x-modelable': '__isOpenState',
        'x-data'() {
            return {
                init() {
                    if (this.$data.__groupEl) {
                        this.$data.__groupEl.addEventListener('__close-others', ({ detail }) => {
                            if (detail.el.isSameNode(this.$el)) return

                            this.__close(false)
                        })
                    }
                },
                __buttonEl: undefined,
                __panelEl: undefined,
                __isStatic: false,
                get __isOpen() {
                    if (this.__isStatic) return true

                    return this.__isOpenState
                },
                __isOpenState: false,
                __open() {
                    this.__isOpenState = true

                    this.$dispatch('__close-others', { el: this.$el })
                },
                __toggle() {
                    this.__isOpenState ? this.__close() : this.__open()
                },
                __close(el) {
                    if (this.__isStatic) return

                    this.__isOpenState = false

                    if (el === false) return

                    el = el || this.$data.__buttonEl

                    if (document.activeElement.isSameNode(el)) return

                    setTimeout(() => el.focus())
                },
                __contains(outer, inner) {
                    return !! Alpine.findClosest(inner, el => el.isSameNode(outer))
                }
            }
        },
        '@keydown.escape.stop.prevent'() {
            this.__close()
        },
        '@focusin.window'() {
            if (this.$data.__groupEl) {
                if (! this.$data.__contains(this.$data.__groupEl, document.activeElement)) {
                    this.$data.__close(false)
                }

                return
            }

            if (! this.$data.__contains(this.$el, document.activeElement)) {
                this.$data.__close(false)
            }
        },
    })
}

function handleButton(el, Alpine) {
    Alpine.bind(el, {
        'x-ref': 'button',
        ':id'() { return this.$id('alpine-popover-button') },
        ':aria-expanded'() { return this.$data.__isOpen },
        ':aria-controls'() { return this.$data.__isOpen && this.$id('alpine-popover-panel') },
        'x-init'() {
            if (this.$el.tagName.toLowerCase() === 'button' && !this.$el.hasAttribute('type')) this.$el.type = 'button'

            this.$data.__buttonEl = this.$el
        },
        '@click'() { this.$data.__toggle() },
        '@keydown.tab'(e) {
            if (! e.shiftKey && this.$data.__isOpen) {
                let firstFocusableEl = this.$focus.within(this.$data.__panelEl).getFirst()

                if (firstFocusableEl) {
                    e.preventDefault()
                    e.stopPropagation()

                    this.$focus.focus(firstFocusableEl)
                }
            }
        },
        '@keyup.tab'(e) {
            if (this.$data.__isOpen) {
                // Check if the last focused element was "after" this one
                let lastEl = this.$focus.previouslyFocused()

                if (! lastEl) return

                if (
                    // Make sure the last focused wasn't part of this popover.
                    (! this.$data.__buttonEl.contains(lastEl) && ! this.$data.__panelEl.contains(lastEl))
                    // Also make sure it appeared "after" this button in the DOM.
                    && (lastEl && (this.$el.compareDocumentPosition(lastEl) & Node.DOCUMENT_POSITION_FOLLOWING))
                ) {
                    e.preventDefault()
                    e.stopPropagation()

                    this.$focus.within(this.$data.__panelEl).last()
                }
            }
        },
        '@keydown.space.stop.prevent'() { this.$data.__toggle() },
        '@keydown.enter.stop.prevent'() { this.$data.__toggle() },
        // This is to stop Firefox from firing a "click".
        '@keyup.space.stop.prevent'() { },
    })
}

function handlePanel(el, Alpine) {
    Alpine.bind(el, {
        'x-init'() {
            this.$data.__isStatic = Alpine.bound(this.$el, 'static', false)
            this.$data.__panelEl = this.$el
        },
        'x-effect'() {
            this.$data.__isOpen && Alpine.bound(el, 'focus') && this.$focus.first()
        },
        'x-ref': 'panel',
        ':id'() { return this.$id('alpine-popover-panel') },
        'x-show'() { return this.$data.__isOpen },
        '@mousedown.window'($event) {
            if (! this.$data.__isOpen) return
            if (this.$data.__contains(this.$data.__buttonEl, $event.target)) return
            if (this.$data.__contains(this.$el, $event.target)) return

            if (! this.$focus.focusable($event.target)) {
                this.$data.__close()
            }
        },
        '@keydown.tab'(e) {
            if (e.shiftKey && this.$focus.isFirst(e.target)) {
                e.preventDefault()
                e.stopPropagation()
                Alpine.bound(el, 'focus') ? this.$data.__close() : this.$data.__buttonEl.focus()
            } else if (! e.shiftKey && this.$focus.isLast(e.target)) {
                e.preventDefault()
                e.stopPropagation()

                // Get the next panel button:
                let els = this.$focus.within(document).all()
                let buttonIdx = els.indexOf(this.$data.__buttonEl)

                let nextEls = els
                    .splice(buttonIdx + 1) // Elements after button
                    .filter(el => ! this.$el.contains(el)) // Ignore items in panel

                nextEls[0].focus()

                Alpine.bound(el, 'focus') && this.$data.__close(false)
            }
        },
    })
}

function handleGroup(el, Alpine) {
    Alpine.bind(el, {
        'x-ref': 'container',
        'x-data'() {
            return {
                __groupEl: this.$el,
            }
        },
    })
}

function handleOverlay(el, Alpine) {
    Alpine.bind(el, {
        'x-show'() { return this.$data.__isOpen }
    })
}
