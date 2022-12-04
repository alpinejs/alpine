import { generateContext, renderHiddenInputs } from './list-context'

export default function (Alpine) {
    Alpine.directive('listbox', (el, directive) => {
        if (! directive.value) handleRoot(el, Alpine)
        else if (directive.value === 'label') handleLabel(el, Alpine)
        else if (directive.value === 'button') handleButton(el, Alpine)
        else if (directive.value === 'options') handleOptions(el, Alpine)
        else if (directive.value === 'option') handleOption(el, Alpine)
    })

    Alpine.magic('listbox', (el) => {
        let data = Alpine.$data(el)

        if (! data.__ready) return {
            isDisabled: false,
            isOpen: false,
            selected: null,
            active: null,
        }

        return {
            get isOpen() {
                return data.__isOpen
            },
            get isDisabled() {
                return data.__isDisabled
            },
            get selected() {
                return data.__value
            },
            get active() {
                return data.__context.active
            },
        }
    })

    Alpine.magic('listboxOption', (el) => {
        let data = Alpine.$data(el)

        let stub = {
            isDisabled: false,
            isSelected: false,
            isActive: false,
        }

        if (! data.__ready) return stub

        let optionEl = Alpine.findClosest(el, i => i.__optionKey)

        if (! optionEl) return stub

        let context = data.__context

        return {
            get isActive() {
                return context.isActiveEl(optionEl)
            },
            get isSelected() {
                return context.isSelectedEl(optionEl)
            },
            get isDisabled() {
                return context.isDisabledEl(optionEl)
            },
        }
    })
}

function handleRoot(el, Alpine) {
    Alpine.bind(el, {
        [Alpine.prefixed('id')]() { return ['alpine-listbox-button', 'alpine-listbox-options', 'alpine-listbox-label'] },
        [Alpine.prefixed('modelable')]: '__value',
        [Alpine.prefixed('data')]() {
            return {
                __ready: false,
                __value: null,
                __isOpen: false,
                __context: undefined,
                __isMultiple: undefined,
                __isStatic: false,
                __isDisabled: undefined,
                __compareBy: null,
                __inputName: null,
                __orientation: 'vertical',
                init() {
                    this.__isMultiple = Alpine.bound(el, 'multiple', false)
                    this.__isDisabled = Alpine.bound(el, 'disabled', false)
                    this.__inputName = Alpine.bound(el, 'name', null)
                    this.__compareBy = Alpine.bound(el, 'by')
                    this.__orientation = Alpine.bound(el, 'horizontal', false) ? 'horizontal' : 'vertical'

                    this.__context = generateContext(this.__isMultiple, this.__orientation)

                    let defaultValue = Alpine.bound(el, 'default-value', null)

                    this.__value = defaultValue

                    // We have to wait for the rest of the HTML to initialize in Alpine before
                    // we mark this component as "ready".
                    queueMicrotask(() => {
                        this.__ready = true

                        // We have to wait again until after the "ready" processes are finished
                        // to settle up currently selected Values (this prevents this next bit
                        // of code from running multiple times on startup...)
                        queueMicrotask(() => {
                            // This "fingerprint" acts as a checksum of the last-known "value"
                            // passed into x-model. We need to track this so that we can determine
                            // from the reactive effect if it was the value that changed externally
                            // or an option was selected internally...
                            let lastValueFingerprint = false

                            Alpine.effect(() => {
                                // Accessing selected keys, so a change in it always triggers this effect...
                                this.__context.selectedKeys

                                if (lastValueFingerprint === false || lastValueFingerprint !== JSON.stringify(this.__value)) {
                                    // Here we know that the value changed externally and we can add the selection...
                                    this.__context.selectValue(this.__value, this.__compareBy)
                                } else {
                                    // Here we know that an option was selected and we can change the value...
                                    this.__value = this.__context.selectedValueOrValues()
                                }

                                // Generate the "value" checksum for comparison next time...
                                lastValueFingerprint = JSON.stringify(this.__value)

                                // Everytime the value changes, we need to re-render the hidden inputs,
                                // if a user passed the "name" prop...
                                this.__inputName && renderHiddenInputs(this.$el, this.__inputName, this.__value)
                            })
                        })
                    })
                },
                __open() {
                    this.__isOpen = true

                    this.__context.activateSelectedOrFirst()

                    // Safari needs more of a "tick" for focusing after x-show for some reason.
                    // Probably because Alpine adds an extra tick when x-showing for @click.outside
                    let nextTick = callback => requestAnimationFrame(() => requestAnimationFrame(callback))

                    nextTick(() => this.$refs.__options.focus({ preventScroll: true }))
                },
                __close() {
                    this.__isOpen = false

                    this.$nextTick(() => this.$refs.__button.focus({ preventScroll: true }))
                }
            }
        },
    })
}

function handleLabel(el, Alpine) {
    Alpine.bind(el, {
        [Alpine.prefixed('ref')]: '__label',
        [Alpine.prefixed('bind:id')]() { return this.$id('alpine-listbox-label') },
        [Alpine.prefixed('on:click')]() { this.$refs.__button.focus({ preventScroll: true }) },
    })
}

function handleButton(el, Alpine) {
    Alpine.bind(el, {
        [Alpine.prefixed('ref')]: '__button',
        [Alpine.prefixed('bind:id')]() { return this.$id('alpine-listbox-button') },
        'aria-haspopup': 'true',
        [Alpine.prefixed('bind:aria-labelledby')]() { return this.$id('alpine-listbox-label') },
        [Alpine.prefixed('bind:aria-expanded')]() { return this.$data.__isOpen },
        [Alpine.prefixed('bind:aria-controls')]() { return this.$data.__isOpen && this.$id('alpine-listbox-options') },
        [Alpine.prefixed('init')]() { if (this.$el.tagName.toLowerCase() === 'button' && !this.$el.hasAttribute('type')) this.$el.type = 'button' },
        [Alpine.prefixed('on:click')]() { this.$data.__open() },
        [Alpine.prefixed('on:keydown')](e) {
            if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.stopPropagation()
                e.preventDefault()

                this.$data.__open()
            }
        },
        [Alpine.prefixed('on:keydown.space.stop.prevent')]() { this.$data.__open() },
        [Alpine.prefixed('on:keydown.enter.stop.prevent')]() { this.$data.__open() },
    })
}

function handleOptions(el, Alpine) {
    Alpine.bind(el, {
        [Alpine.prefixed('ref')]: '__options',
        [Alpine.prefixed('bind:id')]() { return this.$id('alpine-listbox-options') },
        [Alpine.prefixed('init')]() {
            this.$data.__isStatic = Alpine.bound(this.$el, 'static', false)
        },
        [Alpine.prefixed('show')]() { return this.$data.__isStatic ? true : this.$data.__isOpen },
        [Alpine.prefixed('on:click.outside')]() { this.$data.__close() },
        [Alpine.prefixed('on:keydown.escape.stop.prevent')]() { this.$data.__close() },
        tabindex: '0',
        'role': 'listbox',
        [Alpine.prefixed('bind:aria-orientation')]() {
            return this.$data.__orientation
        },
        [Alpine.prefixed('bind:aria-labelledby')]() { return this.$id('alpine-listbox-button') },
        [Alpine.prefixed('bind:aria-activedescendant')]() { return this.__context.activeEl() && this.__context.activeEl().id },
        [Alpine.prefixed('on:focus')]() { this.__context.activateSelectedOrFirst() },
        [Alpine.prefixed('trap')]() { return this.$data.__isOpen },
        [Alpine.prefixed('on:keydown')](e) { this.__context.activateByKeyEvent(e) },
        [Alpine.prefixed('on:keydown.enter.stop.prevent')]() {
            this.__context.selectActive();

            this.$data.__isMultiple || this.$data.__close()
        },
        [Alpine.prefixed('on:keydown.space.stop.prevent')]() {
            this.__context.selectActive();

            this.$data.__isMultiple || this.$data.__close()
        },
    })
}

function handleOption(el, Alpine) {
    Alpine.bind(el, () => {
        return {
            [Alpine.prefixed('bind:id')]() { return this.$id('alpine-listbox-option') },
            [Alpine.prefixed('bind:tabindex')]() { return this.$listbox.isDisabled ? false : '-1' },
            'role': 'option',
            [Alpine.prefixed('init')]() {
                queueMicrotask(() => {
                    let value = Alpine.bound(el, 'value')
                    let disabled = Alpine.bound(el, 'disabled')

                    el.__optionKey = this.$data.__context.initItem(el, value, disabled)
                })
            },
            [Alpine.prefixed('bind:aria-selected')]() { return this.$listboxOption.isSelected },
            [Alpine.prefixed('on:click')]() {
                if (this.$listboxOption.isDisabled) return;
                this.$data.__context.selectEl(el);
                this.$data.__isMultiple || this.$data.__close()
            },
            [Alpine.prefixed('on:mousemove')]() { this.$data.__context.activateEl(el) },
            [Alpine.prefixed('on:mouseleave')]() { this.$data.__context.deactivate() },
        }
    })
}
