
export default function (Alpine) {
    Alpine.directive('switch', (el, directive) => {
        if      (directive.value === 'group')       handleGroup(el, Alpine)
        else if (directive.value === 'label')       handleLabel(el, Alpine)
        else if (directive.value === 'description') handleDescription(el, Alpine)
        else                                        handleRoot(el, Alpine)
    }).before('bind')

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

function handleRoot(el, Alpine) {
    Alpine.bind(el, {
        'x-modelable': '__value',
        'x-data'() {
            return {
                init() {
                    queueMicrotask(() => {
                        this.__value = Alpine.bound(this.$el, 'default-checked', false)
                        this.__inputName = Alpine.bound(this.$el, 'name', false)
                        this.__inputValue = Alpine.bound(this.$el, 'value', 'on')
                        this.__inputId = 'alpine-switch-'+Date.now()
                    })
                },
                __value: undefined,
                __inputName: undefined,
                __inputValue: undefined,
                __inputId: undefined,
                __toggle() {
                    this.__value = ! this.__value;
                },
            }
        },
        'x-effect'() {
            let value = this.__value

            // Only render a hidden input if the "name" prop is passed...
            if (! this.__inputName) return

            // First remove a previously appended hidden input (if it exists)...
            let nextEl = this.$el.nextElementSibling
            if (nextEl && String(nextEl.id) === String(this.__inputId)) {
                nextEl.remove()
            }

            // If the value is true, create the input and append it, otherwise,
            // we already removed it in the previous step...
            if (value) {
                let input = document.createElement('input')

                input.type = 'hidden'
                input.value = this.__inputValue
                input.name = this.__inputName
                input.id = this.__inputId

                this.$el.after(input)
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
