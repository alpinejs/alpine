
export default function (Alpine) {
    Alpine.directive('radio-group', (el, directive) => {
        if      (!directive.value)                  handleRoot(el, Alpine)
        else if (directive.value === 'option')      handleOption(el, Alpine)
        else if (directive.value === 'label')       handleLabel(el, Alpine)
        else if (directive.value === 'description') handleDescription(el, Alpine)
    })

    Alpine.magic('radioGroupOption', el => {
        let $data = Alpine.$data(el)

        return {
            get active() {
                return $data.__option === $data.__active
            },
            get checked() {
                return $data.__option === $data.__value
            },
            get disabled() {
                if ($data.__rootDisabled) return true

                return $data.__disabledOptions.has($data.__option)
            },
        }
    })
}

function handleRoot(el, Alpine) {
    let disabled = Alpine.bound(el, 'disabled');

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

                    // Add `role="none"` to all non role elements.
                    this.$nextTick(() => {
                        let walker = document.createTreeWalker(
                            this.$el,
                            NodeFilter.SHOW_ELEMENT,
                            {
                                acceptNode: node => {
                                    if (node.getAttribute('role') === 'radio') return NodeFilter.FILTER_REJECT
                                    if (node.hasAttribute('role')) return NodeFilter.FILTER_SKIP
                                    return NodeFilter.FILTER_ACCEPT
                                }
                            },
                            false
                        )

                        while (walker.nextNode()) walker.currentNode.setAttribute('role', 'none')
                    })
                },
                __value: undefined,
                __active: undefined,
                __rootEl: this.$el,
                __optionValues: [],
                __disabledOptions: new Set,
                __optionElsByValue: new Map,
                __hasLabel: false,
                __hasDescription: false,
                __rootDisabled: disabled,
                __change(value) {
                    if (this.__rootDisabled) return

                    this.__rootEl._x_model.set(value)
                },
                __addOption(option, el, disabled) {
                    // Add current element to element list for navigating.
                    let options = Alpine.raw(this.__optionValues)
                    let els = options.map(i => this.__optionElsByValue.get(i))
                    let inserted = false

                    for (let i = 0; i < els.length; i++) {
                        if (els[i].compareDocumentPosition(el) & Node.DOCUMENT_POSITION_PRECEDING) {
                            options.splice(i, 0, option)
                            this.__optionElsByValue.set(option, el)
                            inserted = true
                            break
                        }
                    }

                    if (!inserted) {
                        options.push(option)
                        this.__optionElsByValue.set(option, el)
                    }

                    disabled && this.__disabledOptions.add(option)
                },
                __isFirstOption(option) {
                    return this.__optionValues.indexOf(option) === 0
                },
                __setActive(option) {
                    this.__active = option
                },
                __focusOptionNext() {
                    let option = this.__active
                    let all = this.__optionValues.filter(i => !this.__disabledOptions.has(i))
                    let next = all[this.__optionValues.indexOf(option) + 1]
                    next = next || all[0]

                    this.__optionElsByValue.get(next).focus()
                    this.__change(next)
                },
                __focusOptionPrev() {
                    let option = this.__active
                    let all = this.__optionValues.filter(i => !this.__disabledOptions.has(i))
                    let prev = all[all.indexOf(option) - 1]
                    prev = prev || all.slice(-1)[0]

                    this.__optionElsByValue.get(prev).focus()
                    this.__change(prev)
                },
            }
        },
        'role': 'radiogroup',
        'x-id'() { return ['alpine-radiogroup-label', 'alpine-radiogroup-description'] },
        ':aria-labelledby'() { return this.__hasLabel && this.$id('alpine-radiogroup-label') },
        ':aria-describedby'() { return this.__hasDescription && this.$id('alpine-radiogroup-description') },
        '@keydown.up.prevent.stop'() { this.__focusOptionPrev() },
        '@keydown.left.prevent.stop'() { this.__focusOptionPrev() },
        '@keydown.down.prevent.stop'() { this.__focusOptionNext() },
        '@keydown.right.prevent.stop'() { this.__focusOptionNext() },
    })
}

function handleOption(el, Alpine) {
    let value = Alpine.bound(el, 'value');
    let disabled = Alpine.bound(el, 'disabled');

    Alpine.bind(el, {
        'x-init'() {
            this.$data.__addOption(value, this.$el, disabled)
        },
        'x-data'() {
            return {
                init() { },
                __option: value,
                __hasLabel: false,
                __hasDescription: false,
            }
        },
        'x-id'() { return ['alpine-radiogroup-label', 'alpine-radiogroup-description'] },
        'role': 'radio',
        ':aria-checked'() { return this.$radioGroupOption.checked },
        ':aria-disabled'() { return this.$radioGroupOption.disabled },
        ':aria-labelledby'() { return this.__hasLabel && this.$id('alpine-radiogroup-label') },
        ':aria-describedby'() { return this.__hasDescription && this.$id('alpine-radiogroup-description') },
        ':tabindex'() {
            if (this.$radioGroupOption.disabled || disabled) return -1
            if (this.$radioGroupOption.checked) return 0
            if (!this.$data.__value && this.$data.__isFirstOption(value)) return 0
            return -1
        },
        '@click'() {
            if (this.$radioGroupOption.disabled) return
            this.$data.__change(value)
            this.$el.focus()
        },
        '@focus'() {
            if (this.$radioGroupOption.disabled) return
            this.$data.__setActive(value)
        },
        '@blur'() {
            if (this.$data.__active === value) this.$data.__setActive(undefined)
        },
        '@keydown.space.stop.prevent'() { this.$data.__change(value) },
    })
}

function handleLabel(el, Alpine) {
    Alpine.bind(el, {
        'x-init'() { this.$data.__hasLabel = true },
        ':id'() { return this.$id('alpine-radiogroup-label') },
    })
}

function handleDescription(el, Alpine) {
    Alpine.bind(el, {
        'x-init'() { this.$data.__hasDescription = true },
        ':id'() { return this.$id('alpine-radiogroup-description') },
    })
}
