import { generateContext, renderHiddenInputs } from './list-context'

export default function (Alpine) {
    Alpine.directive('combobox', (el, directive, { evaluate }) => {
        if      (directive.value === 'input')        handleInput(el, Alpine)
        else if (directive.value === 'button')       handleButton(el, Alpine)
        else if (directive.value === 'label')        handleLabel(el, Alpine)
        else if (directive.value === 'options')      handleOptions(el, Alpine)
        else if (directive.value === 'option')       handleOption(el, Alpine, directive, evaluate)
        else                                         handleRoot(el, Alpine)
    }).before('bind')

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

        // It's not great depending on the existance of the attribute in the DOM
        // but it's probably the fastest and most reliable at this point...
        let optionEl = Alpine.findClosest(el, i => {
            return i.hasAttribute('x-combobox:option')
        })

        if (! optionEl) throw 'No x-combobox:option directive found...'

        return {
            get isActive() {
                return data.__context.isActiveKey(Alpine.$data(optionEl).__optionKey)
            },
            get isSelected() {
                return data.__isSelected(optionEl)
            },
            get isDisabled() {
                return data.__context.isDisabled(Alpine.$data(optionEl).__optionKey)
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

                    this.__context = generateContext(Alpine, this.__isMultiple, 'vertical', () => this.__activateSelectedOrFirst())

                    let defaultValue = Alpine.extractProp(el, 'default-value', this.__isMultiple ? [] : null)

                    this.__value = defaultValue

                    // We have to wait again until after the "ready" processes are finished
                    // to settle up currently selected Values (this prevents this next bit
                    // of code from running multiple times on startup...)
                    queueMicrotask(() => {
                        Alpine.effect(() => {
                            // Everytime the value changes, we need to re-render the hidden inputs,
                            // if a user passed the "name" prop...
                            this.__inputName && renderHiddenInputs(Alpine, this.$el, this.__inputName, this.__value)
                        })

                        // Set initial combobox values in the input and properly clear it when the value is reset programmatically...
                        Alpine.effect(() => ! this.__isMultiple && this.__resetInput())
                    })
                },
                __startTyping() {
                    this.__isTyping = true
                },
                __stopTyping() {
                    this.__isTyping = false
                },
                __resetInput() {
                    let input = this.$refs.__input

                    if (! input) return

                    let value = this.__getCurrentValue()

                    input.value = value
                },
                __getCurrentValue() {
                    if (! this.$refs.__input) return ''
                    if (! this.__value) return ''
                    if (this.__displayValue) return this.__displayValue(this.__value)
                    if (typeof this.__value === 'string') return this.__value
                    return ''
                },
                __open() {
                    if (this.__isOpen) return
                    this.__isOpen = true

                    let input = this.$refs.__input

                    // Make sure we always notify the parent component
                    // that the starting value is the empty string
                    // when we open the combobox (ignoring any existing value)
                    // to avoid inconsistent displaying.
                    // Setting the input to empty and back to the real value
                    // also helps VoiceOver to annunce the content properly
                    // See https://github.com/tailwindlabs/headlessui/pull/2153
                    if (input) {
                        let value = input.value
                        let { selectionStart, selectionEnd, selectionDirection } = input
                        input.value = ''
                        input.dispatchEvent(new Event('change'))
                        input.value = value
                        if (selectionDirection !== null) {
                            input.setSelectionRange(selectionStart, selectionEnd, selectionDirection)
                        } else {
                            input.setSelectionRange(selectionStart, selectionEnd)
                        }
                    }

                    // Safari needs more of a "tick" for focusing after x-show for some reason.
                    // Probably because Alpine adds an extra tick when x-showing for @click.outside
                    let nextTick = callback => requestAnimationFrame(() => requestAnimationFrame(callback))

                    nextTick(() => {
                        this.$refs.__input.focus({ preventScroll: true })
                        this.__activateSelectedOrFirst()
                    })
                },
                __close() {
                    this.__isOpen = false

                    this.__context.deactivate()
                },
                __activateSelectedOrFirst(activateSelected = true) {
                    if (! this.__isOpen) return

                    if (this.__context.hasActive() && this.__context.wasActivatedByKeyPress()) return

                    let firstSelectedValue

                    if (this.__isMultiple) {
                        let selectedItem = this.__context.getItemsByValues(this.__value)

                        firstSelectedValue = selectedItem.length ? selectedItem[0].value : null
                    } else {
                        firstSelectedValue = this.__value
                    }

                    let firstSelected = null
                    if (activateSelected && firstSelectedValue) {
                        firstSelected = this.__context.getItemByValue(firstSelectedValue)
                    }

                    if (firstSelected) {
                        this.__context.activateAndScrollToKey(firstSelected.key)
                        return
                    }

                    this.__context.activateAndScrollToKey(this.__context.firstKey())
                },
                __selectActive() {
                    let active = this.__context.getActiveItem()
                    if (active) this.__toggleSelected(active.value)
                },
                __selectOption(el) {
                    let item = this.__context.getItemByEl(el)

                    if (item) this.__toggleSelected(item.value)
                },
                __isSelected(el) {
                    let item = this.__context.getItemByEl(el)

                    if (! item) return false
                    if (item.value === null || item.value === undefined) return false

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
        // Register event listeners..
        '@mousedown.window'(e) {
            if (
                !! ! this.$refs.__input.contains(e.target)
                && ! this.$refs.__button.contains(e.target)
                && ! this.$refs.__options.contains(e.target)
            ) {
                this.__close()
                this.__resetInput()
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
        'aria-autocomplete': 'list',

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
            if(this.$data.__isTyping) {
                this.$data.__open();
                this.$dispatch('change')
            }
        },
        '@blur'() { this.$data.__stopTyping(false) },
        '@keydown'(e) {
            queueMicrotask(() => this.$data.__context.activateByKeyEvent(e, false, () => this.$data.__isOpen, () => this.$data.__open(), (state) => this.$data.__isTyping = state))
        },
        '@keydown.enter.prevent.stop'() {
            this.$data.__selectActive()

            this.$data.__stopTyping()

            if (! this.$data.__isMultiple) {
                this.$data.__close()
                this.$data.__resetInput()
            }
        },
        '@keydown.escape.prevent'(e) {
            if (! this.$data.__static) e.stopPropagation()

            this.$data.__stopTyping()
            this.$data.__close()
            this.$data.__resetInput()

        },
        '@keydown.tab'() {
            this.$data.__stopTyping()
            if (this.$data.__isOpen) { this.$data.__close() }
            this.$data.__resetInput()
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
                this.$data.__close()
                this.$data.__resetInput()
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
        'role': 'listbox',
        ':aria-labelledby'() { return this.$refs.__label ? this.$refs.__label.id : (this.$refs.__button ? this.$refs.__button.id : null) },

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

        // Only the active element should have aria-selected="true"...
        'x-effect'() {
            this.$comboboxOption.isSelected
                ? el.setAttribute('aria-selected', true)
                : el.setAttribute('aria-selected', false)
        },

        ':aria-disabled'() { return this.$comboboxOption.isDisabled },

        // Initialize...
        'x-data'() {
            return {
                '__optionKey': null,

                init() {
                    this.__optionKey = (Math.random() + 1).toString(36).substring(7)

                    let value = Alpine.extractProp(this.$el, 'value')
                    let disabled = Alpine.extractProp(this.$el, 'disabled', false, false)

                    // memoize the context as it's not going to change
                    // and calling this.$data on mouse action is expensive
                    this.__context.registerItem(this.__optionKey, this.$el, value, disabled)
                },
                destroy() {
                    this.__context.unregisterItem(this.__optionKey)
                }
            }
        },

        // Register listeners...
        '@click'() {
            if (this.$comboboxOption.isDisabled) return;

            this.__selectOption(this.$el)

            if (! this.__isMultiple) {
                this.__close()
                this.__resetInput()
            }

            this.$nextTick(() => this.$refs.__input.focus({ preventScroll: true }))
        },
        '@mouseenter'(e) {
            this.__context.activateEl(this.$el)
        },
        '@mousemove'(e) {
            if (this.__context.isActiveEl(this.$el)) return

            this.__context.activateEl(this.$el)
        },
        '@mouseleave'(e) {
            if (this.__hold) return

            this.__context.deactivate()
        },
    })
}

// Little utility to defer a callback into the microtask queue...
function microtask(callback) {
    return new Promise(resolve => queueMicrotask(() => resolve(callback())))
}
