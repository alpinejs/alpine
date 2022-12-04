
export default function (Alpine) {
    Alpine.directive('dialog', (el, directive) => {
        if      (directive.value === 'overlay')     handleOverlay(el, Alpine)
        else if (directive.value === 'panel')       handlePanel(el, Alpine)
        else if (directive.value === 'title')       handleTitle(el, Alpine)
        else if (directive.value === 'description') handleDescription(el, Alpine)
        else                                        handleRoot(el, Alpine)
    })

    Alpine.magic('dialog', el => {
        let $data = Alpine.$data(el)

        return {
            // Kept here for legacy. Remove after out of beta.
            get open() {
                return $data.__isOpen
            },
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
        [Alpine.prefixed('data')]() {
            return {
                init() {
                    // If the user chose to use :open and @close instead of x-model.
                    (Alpine.bound(el, 'open') !== undefined) && Alpine.effect(() => {
                        this.__isOpenState = Alpine.bound(el, 'open')
                    })

                    if (Alpine.bound(el, 'initial-focus') !== undefined) this.$watch('__isOpenState', () => {
                        if (! this.__isOpenState) return

                        setTimeout(() => {
                            Alpine.bound(el, 'initial-focus').focus()
                        }, 0);
                    })
                },
                __isOpenState: false,
                __close() {
                    if (Alpine.bound(el, 'open')) this.$dispatch('close')
                    else this.__isOpenState = false
                },
                get __isOpen() {
                    return Alpine.bound(el, 'static', this.__isOpenState)
                },
            }
        },
        [Alpine.prefixed('modelable')]: '__isOpenState',
        [Alpine.prefixed('id')]() { return ['alpine-dialog-title', 'alpine-dialog-description'] },
        [Alpine.prefixed('show')]() { return this.__isOpen },
        [Alpine.prefixed('trap.inert.noscroll')]() { return this.__isOpen },
        [Alpine.prefixed('on:keydown.escape')]() { this.__close() },
        [Alpine.prefixed('bind:aria-labelledby')]() { return this.$id('alpine-dialog-title') },
        [Alpine.prefixed('bind:aria-describedby')]() { return this.$id('alpine-dialog-description') },
        'role': 'dialog',
        'aria-modal': 'true',
    })
}

function handleOverlay(el, Alpine) {
    Alpine.bind(el, {
        [Alpine.prefixed('init')]() { if (this.$data.__isOpen === undefined) console.warn('"x-dialog:overlay" is missing a parent element with "x-dialog".') },
        [Alpine.prefixed('show')]() { return this.__isOpen },
        [Alpine.prefixed('on:click.prevent.stop')]() { this.$data.__close() },
    })
}

function handlePanel(el, Alpine) {
    Alpine.bind(el, {
        [Alpine.prefixed('on:click.outside')]() { this.$data.__close() },
        [Alpine.prefixed('show')]() { return this.$data.__isOpen },
    })
}

function handleTitle(el, Alpine) {
    Alpine.bind(el, {
        [Alpine.prefixed('init')]() { if (this.$data.__isOpen === undefined) console.warn('"x-dialog:title" is missing a parent element with "x-dialog".') },
        [Alpine.prefixed('bind:id')]() { return this.$id('alpine-dialog-title') },
    })
}

function handleDescription(el, Alpine) {
    Alpine.bind(el, {
        [Alpine.prefixed('bind:id')]() { return this.$id('alpine-dialog-description') },
    })
}

