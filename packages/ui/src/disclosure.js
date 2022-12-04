
export default function (Alpine) {
    Alpine.directive('disclosure', (el, directive) => {
        if      (! directive.value)            handleRoot(el, Alpine)
        else if (directive.value === 'panel')  handlePanel(el, Alpine)
        else if (directive.value === 'button') handleButton(el, Alpine)
    })

    Alpine.magic('disclosure', el => {
        let $data = Alpine.$data(el)

        return {
            get isOpen() {
                return $data.__isOpen
            },
            close() {
                $data.__close()
            }
        }
    })
}

function handleRoot(el, Alpine) {
    Alpine.bind(el, {
        [Alpine.prefixed('modelable')]: '__isOpen',
        [Alpine.prefixed('data')]() {
            return {
                init() {
                    queueMicrotask(() => {
                         let defaultIsOpen = Boolean(Alpine.bound(this.$el, 'default-open', false))

                         if (defaultIsOpen) this.__isOpen = defaultIsOpen
                    })
                },
                __isOpen: false,
                __close() {
                    this.__isOpen = false
                },
                __toggle() {
                    this.__isOpen = ! this.__isOpen
                },
            }
        },
        [Alpine.prefixed('id')]() { return ['alpine-disclosure-panel'] },
    })
}

function handleButton(el, Alpine) {
    Alpine.bind(el, {
        [Alpine.prefixed('init')]() {
            if (this.$el.tagName.toLowerCase() === 'button' && !this.$el.hasAttribute('type')) this.$el.type = 'button'
        },
        [Alpine.prefixed('on:click')]() {
            this.$data.__isOpen = ! this.$data.__isOpen
        },
        [Alpine.prefixed('bind:aria-expanded')]() {
            return this.$data.__isOpen
        },
        [Alpine.prefixed('bind:aria-controls')]() {
            return this.$data.$id('alpine-disclosure-panel')
        },
        [Alpine.prefixed('on:keydown.space.prevent.stop')]() { this.$data.__toggle() },
        [Alpine.prefixed('on:keydown.enter.prevent.stop')]() { this.$data.__toggle() },
        // Required for firefox, event.preventDefault() in handleKeyDown for
        // the Space key doesn't cancel the handleKeyUp, which in turn
        // triggers a *click*.
        [Alpine.prefixed('on:keyup.space.prevent')]() {},
    })
}

function handlePanel(el, Alpine) {
    Alpine.bind(el, {
        [Alpine.prefixed('show')]() {
            return this.$data.__isOpen
        },
        [Alpine.prefixed('bind:id')]() {
            return this.$data.$id('alpine-disclosure-panel')
        },
    })
}
