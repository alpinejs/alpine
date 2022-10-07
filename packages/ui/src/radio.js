
export default function (Alpine) {
    Alpine.directive('radio', (el, directive) => {
        if      (! directive.value)                 handleRoot(el, Alpine)
        else if (directive.value === 'option')      handleOption(el, Alpine)
        else if (directive.value === 'label')       handleLabel(el, Alpine)
        else if (directive.value === 'description') handleDescription(el, Alpine)
    })

    Alpine.magic('radioOption', el => {
        let $data = Alpine.$data(el)

        return {
            get isActive() {
                return $data.__option === $data.__active
            },
            get isChecked() {
                return $data.__option === $data.__value
            },
            get isDisabled() {
                let disabled = $data.__disabled

                if ($data.__rootDisabled) return true

                return disabled
            },
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
                        this.__rootDisabled = Alpine.bound(el, 'disabled', false);
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
                __rootDisabled: false,
                __change(value) {
                    if (this.__rootDisabled) return

                    this.__value = value
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
        'x-id'() { return ['alpine-radio-label', 'alpine-radio-description'] },
        ':aria-labelledby'() { return this.__hasLabel && this.$id('alpine-radio-label') },
        ':aria-describedby'() { return this.__hasDescription && this.$id('alpine-radio-description') },
        '@keydown.up.prevent.stop'() { this.__focusOptionPrev() },
        '@keydown.left.prevent.stop'() { this.__focusOptionPrev() },
        '@keydown.down.prevent.stop'() { this.__focusOptionNext() },
        '@keydown.right.prevent.stop'() { this.__focusOptionNext() },
    })
}

function handleOption(el, Alpine) {
    Alpine.bind(el, {
        'x-data'() {
            return {
                init() {
                    queueMicrotask(() => {
                        this.__disabled = Alpine.bound(el, 'disabled', false)
                        this.__option = Alpine.bound(el, 'value')
                        this.$data.__addOption(this.__option, this.$el, this.__disabled)
                    })
                },
                __option: undefined,
                __disabled: false,
                __hasLabel: false,
                __hasDescription: false,
            }
        },
        'x-id'() { return ['alpine-radio-label', 'alpine-radio-description'] },
        'role': 'radio',
        ':aria-checked'() { return this.$radioOption.isChecked },
        ':aria-disabled'() { return this.$radioOption.isDisabled },
        ':aria-labelledby'() { return this.__hasLabel && this.$id('alpine-radio-label') },
        ':aria-describedby'() { return this.__hasDescription && this.$id('alpine-radio-description') },
        ':tabindex'()   {
            if (this.$radioOption.isDisabled) return -1
            if (this.$radioOption.isChecked) return 0
            if (! this.$data.__value && this.$data.__isFirstOption(this.$data.__option)) return 0

            return -1
        },
        '@click'() {
            if (this.$radioOption.isDisabled) return
            this.$data.__change(this.$data.__option)
            this.$el.focus()
        },
        '@focus'() {
            if (this.$radioOption.isDisabled) return
            this.$data.__setActive(this.$data.__option)
        },
        '@blur'() {
            if (this.$data.__active === this.$data.__option) this.$data.__setActive(undefined)
        },
        '@keydown.space.stop.prevent'() { this.$data.__change(this.$data.__option) },
    })
}

function handleLabel(el, Alpine) {
    Alpine.bind(el, {
        'x-init'() { this.$data.__hasLabel = true },
        ':id'() { return this.$id('alpine-radio-label') },
    })
}

function handleDescription(el, Alpine) {
    Alpine.bind(el, {
        'x-init'() { this.$data.__hasDescription = true },
        ':id'() { return this.$id('alpine-radio-description') },
    })
}
