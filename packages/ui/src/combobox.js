import { generateContext } from "./list-context"

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

    Alpine.magic('comboboxOption', el => {
        let data = Alpine.$data(el)

        let stub = {
            isDisabled: false,
            isSelected: false,
            isActive: true,
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
        'x-id'() { return ['alpine-combobox-button', 'alpine-combobox-options', 'alpine-combobox-label'] },
        'x-modelable': '__value',
        'x-data'() {
            return {
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

                    // @todo: remove me...
                    window._reorder = () => this.__context.reorderKeys()

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

                            Alpine.effect(() => {
                                if (this.__value) {
                                    this.$refs.__input.value = this.$data.__displayValue(this.__value)
                                }
                            })
                        })
                    })
                },
                __open() {
                    if (this.__isOpen) return
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
        '@mousedown.window'(e) {
            if (
                !! ! this.$refs.__input.contains(e.target)
                && ! this.$refs.__button.contains(e.target)
                && ! this.$refs.__options.contains(e.target)
            ) {
                this.__close()
            }
        }
    })
}

function handleInput(el, Alpine) {
    Alpine.bind(el, {
        'x-ref': '__input',
        ':id'() { return this.$id('alpine-combobox-input') },
        'role': 'combobox',
        'tabindex': '0',
        // ':aria-controls'() { return this.$data.__optionsEl && this.$data.__optionsEl.id },
        // ':aria-expanded'() { return this.$data.__disabled ? undefined : this.$data.__isOpen },
        // ':aria-activedescendant'() { return this.$data.$list.activeEl ? this.$data.$list.activeEl.id : null },
        // ':aria-labelledby'() { return this.$refs.__label ? this.$refs.__label.id : (this.$refs.__button ? this.$refs.__button.id : null) },
        'x-init'() {
            queueMicrotask(() => {
                // Alpine.effect(() => {
                //     this.$data.__disabled = Alpine.bound(this.$el, 'disabled', false)
                // })

                let displayValueFn = Alpine.bound(this.$el, 'display-value')
                if (displayValueFn) this.$data.__displayValue = displayValueFn
            })
        },
        '@input.stop'() {
            this.$data.__open(); this.$dispatch('change')
            setTimeout(() => this.$data.__context.reorderKeys())
        },
        '@change.stop'() {
            setTimeout(() => this.$data.__context.reorderKeys())
        },
        '@keydown.enter.prevent.stop'() { this.$data.__context.selectActive(); this.$data.__close() },
        '@keydown'(e) {
            this.$data.__context.activateByKeyEvent(e)
         },
        '@keydown.down'(e) { if(! this.$data.__isOpen) this.$data.__open(); },
        '@keydown.up'(e) { if(! this.$data.__isOpen) this.$data.__open(); },
        '@keydown.escape.prevent'(e) {
            if (! this.$data.__static) e.stopPropagation()

            this.$data.__close()
        },
        '@keydown.tab'() { if (this.$data.__isOpen) { this.$data.__context.selectActive(); this.$data.__close() }},
    })
}

function handleButton(el, Alpine) {
    Alpine.bind(el, {
        'x-ref': '__button',
        ':id'() { return this.$id('alpine-combobox-button') },
        'aria-haspopup': 'true',
        // ':aria-labelledby'() { return this.$refs.__label ? [this.$refs.__label.id, this.$el.id].join(' ') : null },
        // ':aria-expanded'() { return this.$data.__disabled ? null : this.$data.__isOpen },
        // ':aria-controls'() { return this.$data.__optionsEl ? this.$data.__optionsEl.id : null },
        ':disabled'() { return this.$data.__disabled },
        'tabindex': '-1',
        'x-init'() { if (this.$el.tagName.toLowerCase() === 'button' && ! this.$el.hasAttribute('type')) this.$el.type = 'button' },
        '@click'(e) {
            if (this.$data.__disabled) return
            if (this.$data.__isOpen) {
                this.$data.__close()
            } else {
                e.preventDefault()
                this.$data.__open()
            }

            this.$nextTick(() => this.$refs.__input.focus({ preventScroll: true }))
        },
        '@keydown.down.prevent.stop'() {
            if (! this.$data.__isOpen) {
                this.$data.__open()
                this.$list.activateSelectedOrFirst()
            }

            this.$nextTick(() => this.$refs.__input.focus({ preventScroll: true }))
        },
        '@keydown.up.prevent.stop'() {
            if (! this.$data.__isOpen) {
                this.$data.__open()
                this.$list.activateSelectedOrLast()
            }

            this.$nextTick(() => this.$refs.__input.focus({ preventScroll: true }))
        },
        '@keydown.escape.prevent'(e) {
            if (! this.$data.__static) e.stopPropagation()

            this.$data.__close()
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
        'x-ref': '__options',
        'x-init'() {
            this.$data.__isStatic = Alpine.bound(this.$el, 'static', false)

            // if (Alpine.bound(this.$el, 'hold')) {
            //     this.$data.__hold = true;
            // }
            // Add `role="none"` to all non option elements.
            // this.$nextTick(() => {
            //     let walker = document.createTreeWalker(
            //         this.$el,
            //         NodeFilter.SHOW_ELEMENT,
            //         { acceptNode: node => {
            //             if (node.getAttribute('role') === 'option') return NodeFilter.FILTER_REJECT
            //             if (node.hasAttribute('role')) return NodeFilter.FILTER_SKIP
            //             return NodeFilter.FILTER_ACCEPT
            //         }},
            //         false
            //     )
            //
            //     while (walker.nextNode()) walker.currentNode.setAttribute('role', 'none')
            // })
        },
        'role': 'listbox',
        ':id'() { return this.$id('alpine-combobox-options') },
        // ':aria-labelledby'() { return this.$id('alpine-combobox-button') },
        // ':aria-activedescendant'() { return this.$list.activeEl ? this.$list.activeEl.id : null },
        'x-show'() { return this.$data.__isOpen },
    })
}

function handleOption(el, Alpine) {
    Alpine.bind(el, {
        'role': 'option',
        'x-init'() {
            el._x_optionReady = Alpine.reactive({ state: false })

            queueMicrotask(() => {
                el._x_optionReady.state = true

                let value = Alpine.bound(el, 'value')
                let disabled = Alpine.bound(el, 'disabled')

                el.__optionKey = this.$data.__context.initItem(el, value, disabled)
            })
        },
        ':id'() { return this.$id('alpine-combobox-option') },
        // ':tabindex'() { return this.$item.disabled ? undefined : '-1' },
        // ':aria-selected'() { return this.$item.selected },
        // ':aria-disabled'() { return this.$item.disabled },
        '@click'() {
            if (this.$comboboxOption.isDisabled) return;
            this.$data.__context.selectEl(el);
            this.$data.__isMultiple || this.$data.__close()
        },
        // @todo: this is a memory leak for _x_cleanups...
        '@mouseenter'() { this.$data.__context.activateEl(el) },
        '@mouseleave'() { this.$data.__context.deactivate() },
    })
}

/* <div x-data="{
    query: '',
    selected: null,
    people: [
        { id: 1, name: 'Kevin' },
        { id: 2, name: 'Caleb' },
    ],
    get filteredPeople() {
        return this.people.filter(i => {
            return i.name.toLowerCase().includes(this.query.toLowerCase())
        })
    }
}">
<p x-text="query"></p>
<div class="fixed top-16 w-72">
    <div x-combobox x-model="selected">
            <div class="relative mt-1">
                <div class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                    <input x-combobox:input class="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0" :display-value="() => (person) => person.name" @change="query = $event.target.value" />
                    <button x-combobox:button class="absolute inset-y-0 right-0 flex items-center pr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" class="h-5 w-5 text-gray-400"><path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </button>
                </div>
                <ul x-combobox:options class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    <div x-show="filteredPeople.length === 0 && query !== ''" class="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Nothing found.
                    </div>

                    <template x-for="person in filteredPeople" :key="person.id">
                        <li x-combobox:option :value="person" class="relative cursor-default select-none py-2 pl-10 pr-4" :class="{ 'bg-teal-600 text-white': $comboboxOption.active, 'text-gray-900': !$comboboxOption.active, }">
                            <span x-text="person.name" class="block truncate" :class="{ 'font-medium': $comboboxOption.selected, 'font-normal': ! $comboboxOption.selected }"></span>

                            <template x-if="$comboboxOption.selected">
                                <span class="absolute inset-y-0 left-0 flex items-center pl-3" :class="{ 'text-white': $comboboxOption.active, 'text-teal-600': !$comboboxOption.active }">
                                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                                </span>
                            </template>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
    </div>
</div> */
