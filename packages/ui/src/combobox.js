import { generateContext, renderHiddenInputs } from './list-context'

export default function (Alpine) {
    Alpine.directive('combobox', (el, directive, { evaluate }) => {
        if      (directive.value === 'input')        handleInput(el, Alpine)
        else if (directive.value === 'button')       handleButton(el, Alpine)
        else if (directive.value === 'label')        handleLabel(el, Alpine)
        else if (directive.value === 'options')      handleOptions(el, Alpine)
        else if (directive.value === 'option')       handleOption(el, Alpine, directive, evaluate)
        else                                         handleRoot(el, Alpine)
    })

    Alpine.magic('combobox', el => {
        let data = Alpine.$data(el)

        return {
            get value() {
                return data.__value
            },
            get isOpen() {
                return data.__isOpen
            },
            get isDisabled() {
                return data.__isDisabled
            },
            get activeOption() {
                let active = data.__context?.getActiveItem()

                return active && active.value
            },
            get activeIndex() {
                let active = data.__context?.getActiveItem()

                if (active) {
                    return Object.values(Alpine.raw(data.__context.items)).findIndex(i => Alpine.raw(active) == Alpine.raw(i))
                }

                return null
            },
        }
    })

    Alpine.magic('comboboxOption', el => {
        let data = Alpine.$data(el)

        let optionEl = Alpine.findClosest(el, i => i.__optionKey)

        if (! optionEl) throw 'No x-combobox:option directive found...'

        return {
            get isActive() {
                return data.__context.isActiveKey(optionEl.__optionKey)
            },
            get isSelected() {
                return data.__isSelected(optionEl)
            },
            get isDisabled() {
                return data.__context.isDisabled(optionEl.__optionKey)
            },
        }
    })
}

function handleRoot(el, Alpine) {
    Alpine.bind(el, {
        // Setup...
        'x-id'() { return ['alpine-combobox-button', 'alpine-combobox-options', 'alpine-combobox-label'] },
        'x-modelable': '__value',

        // Initialize...
        'x-data'() {
            return {
                /**
                 * Combobox state...
                 */
                __ready: false,
                __value: null,
                __isOpen: false,
                __context: undefined,
                __isMultiple: undefined,
                __isStatic: false,
                __isDisabled: undefined,
                __displayValue: undefined,
                __compareBy: null,
                __inputName: null,
                __isTyping: false,
                __hold: false,

                /**
                 * Combobox initialization...
                 */
                init() {
                    this.__isMultiple = Alpine.extractProp(el, 'multiple', false)
                    this.__isDisabled = Alpine.extractProp(el, 'disabled', false)
                    this.__inputName = Alpine.extractProp(el, 'name', null)
                    this.__nullable = Alpine.extractProp(el, 'nullable', false)
                    this.__compareBy = Alpine.extractProp(el, 'by')

                    this.__context = generateContext(this.__isMultiple, 'vertical', () => this.$data.__activateSelectedOrFirst())

                    let defaultValue = Alpine.extractProp(el, 'default-value', this.__isMultiple ? [] : null)

                    this.__value = defaultValue

                    // We have to wait again until after the "ready" processes are finished
                    // to settle up currently selected Values (this prevents this next bit
                    // of code from running multiple times on startup...)
                    queueMicrotask(() => {
                        Alpine.effect(() => {
                            // Everytime the value changes, we need to re-render the hidden inputs,
                            // if a user passed the "name" prop...
                            this.__inputName && renderHiddenInputs(this.$el, this.__inputName, this.__value)
                        })
                    })
                },
                __startTyping() {
                    this.__isTyping = true
                },
                __stopTyping(resetInput = true) {
                    this.__isTyping = false

                    if (resetInput) this.$data.__resetInput()
                },
                __resetInput() {
                    let input = this.$refs.__input
                    if (! input) return

                    let value = this.$data.__getCurrentValue()

                    input.value = value
                    input.dispatchEvent(new Event('change'))
                },
                __getCurrentValue() {
                    if (! this.$refs.__input) return ''
                    if (! this.__value) return ''
                    if (this.$data.__displayValue && this.__value !== undefined) return this.$data.__displayValue(this.__value)
                    if (typeof this.__value === 'string') return this.__value
                    return ''
                },
                __open() {
                    if (this.__isOpen) return
                    this.__isOpen = true

                    this.__activateSelectedOrFirst()

                    // Safari needs more of a "tick" for focusing after x-show for some reason.
                    // Probably because Alpine adds an extra tick when x-showing for @click.outside
                    let nextTick = callback => requestAnimationFrame(() => requestAnimationFrame(callback))

                    nextTick(() => this.$refs.__input.focus({ preventScroll: true }))
                },
                __close() {
                    this.__isOpen = false

                    this.__context.deactivate()
                },
                __activateSelectedOrFirst(activateSelected = true) {
                    if (! this.__isOpen) return

                    if (this.__context.activeKey) {
                        this.__context.activateAndScrollToKey(this.__context.activeKey)
                        return
                    }

                    let firstSelectedValue

                    if (this.__isMultiple) {
                        firstSelectedValue = this.__value.find(i => {
                            return !! this.__context.getItemByValue(i)
                        })
                    } else {
                        firstSelectedValue = this.__value
                    }

                    if (activateSelected && firstSelectedValue) {
                        let firstSelected = this.__context.getItemByValue(firstSelectedValue)

                        firstSelected && this.__context.activateAndScrollToKey(firstSelected.key)
                    } else {
                        this.__context.activateAndScrollToKey(this.__context.firstKey())
                    }
                },
                __selectActive() {
                    let active = this.$data.__context.getActiveItem()
                    if (active) this.__toggleSelected(active.value)
                },
                __selectOption(el) {
                    let item = this.__context.getItemByEl(el)

                    if (item) this.__toggleSelected(item.value)
                },
                __isSelected(el) {
                    let item = this.__context.getItemByEl(el)

                    if (! item) return false
                    if (! item.value) return false

                    return this.__hasSelected(item.value)
                },
                __toggleSelected(value) {
                    if (! this.__isMultiple) {
                        this.__value = value

                        return
                    }

                    let index = this.__value.findIndex(j => this.__compare(j, value))

                    if (index === -1) {
                        this.__value.push(value)
                    } else {
                        this.__value.splice(index, 1)
                    }
                },
                __hasSelected(value) {
                    if (! this.__isMultiple) return this.__compare(this.__value, value)

                    return this.__value.some(i => this.__compare(i, value))
                },
                __compare(a, b) {
                    let by = this.__compareBy

                    if (! by) by = (a, b) => Alpine.raw(a) === Alpine.raw(b)

                    if (typeof by === 'string') {
                        let property = by
                        by = (a, b) => a[property] === b[property]
                    }

                    return by(a, b)
                },
            }
        },

        // Register event liseners..
        '@mousedown.window'(e) {
            if (
                !! ! this.$refs.__input.contains(e.target)
                && ! this.$refs.__button.contains(e.target)
                && ! this.$refs.__options.contains(e.target)
            ) {
                this.$data.__resetInput()
                this.$data.__close()
            }
        }
    })
}

function handleInput(el, Alpine) {
    Alpine.bind(el, {
        // Setup...
        'x-ref': '__input',
        ':id'() { return this.$id('alpine-combobox-input') },

        // Accessibility attributes...
        'role': 'combobox',
        'tabindex': '0',
        // We need to defer this evaluation a bit because $refs that get declared later
        // in the DOM aren't available yet when x-ref is the result of an Alpine.bind object.
        async ':aria-controls'() { return await microtask(() => this.$refs.__options && this.$refs.__options.id) },
        ':aria-expanded'() { return this.$data.__isDisabled ? undefined : this.$data.__isOpen },
        ':aria-multiselectable'() { return this.$data.__isMultiple ? true : undefined },
        ':aria-activedescendant'() {
            if (! this.$data.__context.hasActive()) return

            let active = this.$data.__context.getActiveItem()

            return active ? active.el.id : null
        },
        ':aria-labelledby'() { return this.$refs.__label ? this.$refs.__label.id : (this.$refs.__button ? this.$refs.__button.id : null) },

        // Initialize...
        'x-init'() {
            let displayValueFn = Alpine.extractProp(this.$el, 'display-value')
            if (displayValueFn) this.$data.__displayValue = displayValueFn
        },

        // Register listeners...
        '@input.stop'(e) {
            this.$data.__open(); this.$dispatch('change')
        },
        '@blur'() { this.$data.__stopTyping(false) },
        '@keydown'(e) {
            queueMicrotask(() => this.$data.__context.activateByKeyEvent(e, false, () => this.$data.__isOpen, () => this.$data.__open(), (state) => this.$data.__isTyping = state))
         },
        '@keydown.enter.prevent.stop'() {
            this.$data.__selectActive()

            this.$data.isTyping = false

            if (! this.$data.__isMultiple) {
                this.$data.__close()
                this.$data.__resetInput()
            }
        },
        '@keydown.escape.prevent'(e) {
            if (! this.$data.__static) e.stopPropagation()

            this.$data.__close()

            this.$data.__stopTyping()
        },
        '@keydown.tab'() {
            this.$data.__stopTyping()
            this.$data.__resetInput()

            if (this.$data.__isOpen) { this.$data.__close() }
        },
        '@keydown.backspace'(e) {
            if (this.$data.__isMultiple) return
            if (! this.$data.__nullable) return

            let input = e.target

            requestAnimationFrame(() => {
                if (input.value === '') {
                    this.$data.__value = null

                    let options = this.$refs.__options
                    if (options) {
                        options.scrollTop = 0
                    }

                    this.$data.__context.deactivate()
                }
            })
        },
    })
}

function handleButton(el, Alpine) {
    Alpine.bind(el, {
        // Setup...
        'x-ref': '__button',
        ':id'() { return this.$id('alpine-combobox-button') },

        // Accessibility attributes...
        'aria-haspopup': 'true',
        // We need to defer this evaluation a bit because $refs that get declared later
        // in the DOM aren't available yet when x-ref is the result of an Alpine.bind object.
        async ':aria-controls'() { return await microtask(() => this.$refs.__options && this.$refs.__options.id) },
        ':aria-labelledby'() { return this.$refs.__label ? [this.$refs.__label.id, this.$el.id].join(' ') : null },
        ':aria-expanded'() { return this.$data.__isDisabled ? null : this.$data.__isOpen },
        ':disabled'() { return this.$data.__isDisabled },
        'tabindex': '-1',

        // Initialize....
        'x-init'() { if (this.$el.tagName.toLowerCase() === 'button' && ! this.$el.hasAttribute('type')) this.$el.type = 'button' },

        // Register listeners...
        '@click'(e) {
            if (this.$data.__isDisabled) return
            if (this.$data.__isOpen) {
                this.$data.__resetInput()
                this.$data.__close()
            } else {
                e.preventDefault()
                this.$data.__open()
            }

            this.$nextTick(() => this.$refs.__input.focus({ preventScroll: true }))
        },
    })
}

function handleLabel(el, Alpine) {
    Alpine.bind(el, {
        'x-ref': '__label',
        ':id'() { return this.$id('alpine-combobox-label') },
        '@click'() { this.$refs.__input.focus({ preventScroll: true }) },
    })
}

function handleOptions(el, Alpine) {
    Alpine.bind(el, {
        // Setup...
        'x-ref': '__options',
        ':id'() { return this.$id('alpine-combobox-options') },

        // Accessibility attributes...
        'role': 'combobox',
        ':aria-labelledby'() { return this.$refs.__label ? this.$refs.__label.id : (this.$refs.__button ? this.$refs.__button.id : null) },
        ':aria-activedescendant'() {
            if (! this.$data.__context.hasActive()) return

            let active = this.$data.__context.getActiveItem()

            return active ? active.el.id : null
        },

        // Initialize...
        'x-init'() {
            this.$data.__isStatic = Alpine.bound(this.$el, 'static', false)

            if (Alpine.bound(this.$el, 'hold')) {
                this.$data.__hold = true;
            }
        },

        'x-show'() { return this.$data.__isStatic ? true : this.$data.__isOpen },
    })
}

function handleOption(el, Alpine) {
    Alpine.bind(el, {
        // Setup...
        'x-id'() { return ['alpine-combobox-option'] },
        ':id'() { return this.$id('alpine-combobox-option') },

        // Accessibility attributes...
        'role': 'option',
        ':tabindex'() { return this.$comboboxOption.isDisabled ? undefined : '-1' },
        ':aria-selected'() { return this.$comboboxOption.isSelected },
        ':aria-disabled'() { return this.$comboboxOption.isDisabled },

        // Initialize...
        'x-data'() {
            return {
                init() {
                    let key = el.__optionKey = (Math.random() + 1).toString(36).substring(7)

                    let value = Alpine.extractProp(el, 'value')
                    let disabled = Alpine.extractProp(el, 'disabled', false, false)

                    this.$data.__context.registerItem(key, el, value, disabled)

                    // @todo: make sure the "destroy" hook is good enough and we don't need this...
                    // el._x_forCleanup = () => {
                        // this.$data.__context.unregisterItem(key)
                    // }
                },
                destroy() {
                    this.$data.__context.unregisterItem(this.$el.__optionKey)
                },
            }
        },

        // Register listeners...
        '@click'() {
            if (this.$comboboxOption.isDisabled) return;

            this.$data.__selectOption(el)

            if (! this.$data.__isMultiple) {
                this.$data.__resetInput()
                this.$data.__close()
            }

            this.$nextTick(() => this.$refs.__input.focus({ preventScroll: true }))
        },

        // @todo: this is a memory leak for _x_cleanups...
        '@mouseenter'() { this.$data.__context.activateEl(el) },
        '@mouseleave'() {
            this.$data.__hold || this.$data.__context.deactivate()
        },
    })
}

// Little utility to defer a callback into the microtask queue...
function microtask(callback) {
    return new Promise(resolve => queueMicrotask(() => resolve(callback())))
}
