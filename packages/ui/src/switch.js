
export default function (Alpine) {
    Alpine.directive('switch', (el, directive) => {
        if      (directive.value === 'group')       handleGroup(el, Alpine)
        else if (directive.value === 'label')       handleLabel(el, Alpine)
        else if (directive.value === 'description') handleDescription(el, Alpine)
        else                                        handleRoot(el, Alpine)
    })

    Alpine.magic('switch', el => {
        let $data = Alpine.$data(el)

        return {
            get isChecked() {
                return $data.__value === true
            },
        }
    })
}

function handleGroup(el, Alpine) {
    Alpine.bind(el, {
        'x-id'() { return ['alpine-switch-label', 'alpine-switch-description'] },
        'x-data'() {
            return {
                __hasLabel: false,
                __hasDescription: false,
                __switchEl: undefined,
            }
        }
    })
}

function handleLabel(el, Alpine) {
    Alpine.bind(el, {
        'x-init'() { this.$data.__hasLabel = true },
        ':id'() { return this.$id('alpine-switch-label') },
        '@click'() {
            this.$data.__switchEl.click()
            this.$data.__switchEl.focus({ preventScroll: true })
        },
    })
}

function handleDescription(el, Alpine) {
    Alpine.bind(el, {
        'x-init'() { this.$data.__hasDescription = true },
        ':id'() { return this.$id('alpine-switch-description') },
    })
}

function handleRoot(el, Alpine) {
    Alpine.bind(el, {
        'x-data'() {
            return {
                init() {
                    // Need the "microtask" here so that x-model has a chance to initialize.
                    queueMicrotask(() => {
                        // Set our internal "selected" every time the x-modeled value changes.
                        Alpine.effect(() => {
                            this.__value = this.$el._x_model.get()
                        })
                    })
                },
                __value: undefined,
                __toggle() {
                    this.$el._x_model.set(!this.__value)
                },
            }
        },
        'x-init'() {
            if (this.$el.tagName.toLowerCase() === 'button' && !this.$el.hasAttribute('type')) this.$el.type = 'button'
            this.$data.__switchEl = this.$el
        },
        'role': 'switch',
        'tabindex': "0",
        ':aria-checked'() { return !!this.__value },
        ':aria-labelledby'() { return this.$data.__hasLabel && this.$id('alpine-switch-label') },
        ':aria-describedby'() { return this.$data.__hasDescription && this.$id('alpine-switch-description') },
        '@click.prevent'() { this.__toggle() },
        '@keyup'(e) {
            if (e.key !== 'Tab') e.preventDefault()
            if (e.key === ' ') this.__toggle()
        },
        // This is needed so that we can "cancel" the click event when we use the `Enter` key on a button.
        '@keypress.prevent'() { },
    })
}
