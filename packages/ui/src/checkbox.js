
export default function (Alpine) {
    Alpine.directive('checkbox', (el, directive) => {
        if      (! directive.value)                 handleRoot(el, Alpine)
        else if (directive.value === 'group')       handleGroup(el, Alpine)
        else if (directive.value === 'label')       handleLabel(el, Alpine)
        else if (directive.value === 'description') handleDescription(el, Alpine)
    }).before('bind')

    Alpine.magic('checkbox', el => {
        let $data = Alpine.$data(el)

        return {
            get isActive() {
                return $data.__active
            },
            get isChecked() {
                if ($data.__values) return $data.__values.includes($data.__value)

                return $data.__checked;
            },
            get isDisabled() {
                let disabled = $data.__disabled

                if ($data.__rootDisabled) return true

                return disabled
            },
        }
    })
}

function handleGroup(el, Alpine) {
    Alpine.bind(el, {
        'x-modelable': '__values',
        'x-data'() {
            return {
                __values: [],
                __compareBy: undefined,
                __rootDisabled: false,

                init() {
                    queueMicrotask(() => {
                        this.__compareBy = Alpine.extractProp(el, 'by')
                        this.__rootDisabled = Alpine.bound(el, 'disabled', false);
                    });
                },

                __toggleValue(value) {
                    let index = this.__values.findIndex(j => this.__compare(j, value))

                    if (index === -1) {
                        this.__values.push(value)
                    } else {
                        this.__values.splice(index, 1)
                    }
                },
                __compare(a, b) {
                    let by = this.__compareBy

                    if (! by) by = (a, b) => Alpine.raw(a) === Alpine.raw(b)

                    if (typeof by === 'string') {
                        let property = by
                        by = (a, b) => {
                            // Handle null values
                            if ((! a || typeof a !== 'object') || (! b || typeof b !== 'object')) {
                                return Alpine.raw(a) === Alpine.raw(b)
                            }


                            return a[property] === b[property];
                        }
                    }

                    return by(a, b)
                },
            }
        },
    })
}

function handleRoot(el, Alpine) {
    let groupEl = Alpine.findClosest(el, i => {
        return i.hasAttribute('x-checkbox:group')
    })

    Alpine.bind(el, {
        ... !groupEl ? {
            'x-modelable': '__checked',
        } : {},
        'x-data'() {
            return {
                __value: undefined,
                __disabled: false,
                __hasLabel: false,
                __hasDescription: false,
                __checked: false,
                __active: false,

                init() {
                    queueMicrotask(() => {
                        this.__disabled = Alpine.bound(el, 'disabled', false)
                        this.__value = Alpine.bound(el, 'value')
                    })
                },
                __toggle() {
                    if (groupEl) {
                        this.$data.__toggleValue(this.__value)
                    } else {
                        this.__checked = !this.__checked;
                    }
                },
            }
        },
        'x-id'() { return ['alpine-checkbox-label', 'alpine-checkbox-description'] },
        'role': 'checkbox',
        ':aria-checked'() { return this.$checkbox.isChecked },
        ':aria-disabled'() { return this.$checkbox.isDisabled },
        ':aria-labelledby'() { return this.__hasLabel && this.$id('alpine-checkbox-label') },
        ':aria-describedby'() { return this.__hasDescription && this.$id('alpine-checkbox-description') },
        ':tabindex'() { return this.$checkbox.isDisabled ? -1 : 0 },
        '@click'() {
            if (this.$checkbox.isDisabled) return

            this.$data.__toggle()

            this.$el.focus()
        },
        '@focus'() {
            if (this.$checkbox.isDisabled) return

            this.__active = true
        },
        '@blur'() { this.__active = false },
        '@keydown.space.stop.prevent'() { this.__toggle() },
    })
}

function handleLabel(el, Alpine) {
    Alpine.bind(el, {
        'x-init'() { this.$data.__hasLabel = true },
        ':id'() { return this.$id('alpine-checkbox-label') },
    })
}

function handleDescription(el, Alpine) {
    Alpine.bind(el, {
        'x-init'() { this.$data.__hasDescription = true },
        ':id'() { return this.$id('alpine-checkbox-description') },
    })
}
