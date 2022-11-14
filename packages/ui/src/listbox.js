import { generateContext } from './lists-context'

export default function (Alpine) {
    Alpine.directive('listbox', (el, directive) => {
        if (! directive.value) handleRoot(el, Alpine)
        else if (directive.value === 'label') handleLabel(el, Alpine)
        else if (directive.value === 'button') handleButton(el, Alpine)
        else if (directive.value === 'options') handleOptions(el, Alpine)
        else if (directive.value === 'option') handleOption(el, Alpine)
    })

    Alpine.magic('listbox', (el, { evaluate }) => {
        let data = Alpine.$data(el)

        if (! data.__ready) return {
            isDisabled: false,
        }

        return {
            get isDisabled() {
                return data.__isDisabled
            },
        }
    })

    Alpine.magic('listboxOption', (el, { evaluate }) => {
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
        'x-id'() { return ['alpine-listbox-button', 'alpine-listbox-options', 'alpine-listbox-label'] },
        'x-modelable': '__value',
        'x-data'() {
            return {
                __ready: false,
                __value: null,
                __isOpen: false,
                __context: undefined,
                __isMultiple: undefined,
                __isDisabled: undefined,
                init() {
                    this.__isMultiple = Alpine.bound(el, 'multiple', false)
                    this.__isDisabled = Alpine.bound(el, 'disabled', false)

                    this.__context = generateContext(this.__isMultiple)

                    Alpine.effect(() => {
                        this.__value = this.__context.selectedValueOrValues()
                    })

                    setTimeout(() => {
                        this.__ready = true
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
        'x-ref': '__label',
        ':id'() { return this.$id('alpine-listbox-label') },
        '@click'() { this.$refs.__button.focus({ preventScroll: true }) },
    })
}

function handleButton(el, Alpine) {
    Alpine.bind(el, {
        'x-ref': '__button',
        ':id'() { return this.$id('alpine-listbox-button') },
        'aria-haspopup': 'true',
        ':aria-labelledby'() { return this.$id('alpine-listbox-label') },
        ':aria-expanded'() { return this.$data.__isOpen },
        ':aria-controls'() { return this.$data.__isOpen && this.$id('alpine-listbox-options') },
        'x-init'() { if (this.$el.tagName.toLowerCase() === 'button' && !this.$el.hasAttribute('type')) this.$el.type = 'button' },
        '@click'() { this.$data.__open() },
        '@keydown'(e) {
            if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.stopPropagation()
                e.preventDefault()

                this.$data.__open()
            }
        },
        '@keydown.space.stop.prevent'() { this.$data.__open() },
        '@keydown.enter.stop.prevent'() { this.$data.__open() },
    })
}

function handleOptions(el, Alpine) {
    Alpine.bind(el, {
        'x-ref': '__options',
        ':id'() { return this.$id('alpine-listbox-options') },
        'x-show'() { return this.$data.__isOpen },
        '@click.outside'() { this.$data.__close() },
        '@keydown.escape.stop.prevent'() { this.$data.__close() },
        tabindex: '0',
        'role': 'listbox',
        'aria-orientation': 'vertical',
        ':aria-labelledby'() { return this.$id('alpine-listbox-button') },
        ':aria-activedescendant'() { return this.__context.activateEl() && this.__context.activateEl().id },
        '@focus'() { this.__context.activateSelectedOrFirst() },
        'x-trap'() { return this.$data.__isOpen },
        '@keydown'(e) { this.__context.activateByKeyEvent(e) },
        '@keydown.enter.stop.prevent'() {
            this.__context.selectActive();

            this.$data.__isMultiple || this.$data.__close()
        },
        '@keydown.space.stop.prevent'() {
            this.__context.selectActive();

            this.$data.__isMultiple || this.$data.__close()
        },
    })
}

function handleOption(el, Alpine) {
    Alpine.bind(el, () => {
        return {
            ':id'() { return this.$id('alpine-listbox-option') },
            ':tabindex'() { return this.$listbox.isDisabled ? false : '-1' },
            'role': 'option',
            'x-init'() {
                queueMicrotask(() => {
                    let value = Alpine.bound(el, 'value')
                    let disabled = Alpine.bound(el, 'disabled')

                    el.__optionKey = this.$data.__context.initItem(el, value, disabled)
                })
            },
            ':aria-selected'() { return this.$listboxOption.isSelected },
            '@click'() {
                this.$data.__context.selectEl(el);
                this.$data.__isMultiple || this.$data.__close()
            },
            '@mousemove'() { this.$data.__context.activateEl(el) },
            '@mouseleave'() { this.$data.__context.deactivate() },
        }
    })
}
