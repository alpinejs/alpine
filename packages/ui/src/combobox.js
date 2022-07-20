
export default function (Alpine) {
    Alpine.directive('combobox', (el, directive, { evaluate }) => {
        if      (directive.value === 'input')        handleInput(el, Alpine)
        else if (directive.value === 'button')       handleButton(el, Alpine)
        else if (directive.value === 'label')        handleLabel(el, Alpine)
        else if (directive.value === 'options')      handleOptions(el, Alpine)
        else if (directive.value === 'option')       handleOption(el, Alpine, directive, evaluate)
        else                                         handleRoot(el, Alpine)
    })

    Alpine.magic('comboboxOption', el => {
        let $data = Alpine.$data(el)

        return $data.$item
    })

    registerListStuff(Alpine)
}

function handleRoot(el, Alpine) {
    Alpine.bind(el, {
        'x-id'() { return ['headlessui-combobox-button', 'headlessui-combobox-options', 'headlessui-combobox-label'] },
        'x-list': '__value',
        'x-modelable': '__value',
        'x-data'() {
            return {
                init() {
                    this.$nextTick(() => {
                        this.syncInputValue()

                        Alpine.effect(() => this.syncInputValue())
                    })
                },
                __value: null,
                __disabled: false,
                __static: false,
                __hold: false,
                __displayValue: i => i,
                __isOpen: false,
                __optionsEl: null,
                __open() {
                    // @todo handle disabling the entire combobox.
                    if (this.__isOpen) return
                    this.__isOpen = true

                    this.$list.activateSelectedOrFirst()
                },
                __close() {
                    this.syncInputValue()

                    if (this.__static) return
                    if (! this.__isOpen) return

                    this.__isOpen = false
                    this.$list.active = null
                },
                syncInputValue() {
                    if (this.$list.selected) this.$refs.__input.value = this.__displayValue(this.$list.selected)
                },
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
        ':id'() { return this.$id('headlessui-combobox-input') },
        'role': 'combobox',
        'tabindex': '0',
        ':aria-controls'() { return this.$data.__optionsEl && this.$data.__optionsEl.id },
        ':aria-expanded'() { return this.$data.__disabled ? undefined : this.$data.__isOpen },
        ':aria-activedescendant'() { return this.$data.$list.activeEl ? this.$data.$list.activeEl.id : null },
        ':aria-labelledby'() { return this.$refs.__label ? this.$refs.__label.id : (this.$refs.__button ? this.$refs.__button.id : null) },
        'x-init'() {
            queueMicrotask(() => {
                Alpine.effect(() => {
                    this.$data.__disabled = Alpine.bound(this.$el, 'disabled', false)
                })

                let displayValueFn = Alpine.bound(this.$el, 'display-value')
                if (displayValueFn) this.$data.__displayValue = displayValueFn
            })
        },
        '@input.stop'() { this.$data.__open(); this.$dispatch('change') },
        '@change.stop'() {},
        '@keydown.enter.prevent.stop'() { this.$list.selectActive(); this.$data.__close() },
        '@keydown'(e) { this.$list.handleKeyboardNavigation(e) },
        '@keydown.down'(e) { if(! this.$data.__isOpen) this.$data.__open(); },
        '@keydown.up'(e) { if(! this.$data.__isOpen) this.$data.__open(); },
        '@keydown.escape.prevent'(e) {
            if (! this.$data.__static) e.stopPropagation()

            this.$data.__close()
        },
        '@keydown.tab'() { if (this.$data.__isOpen) { this.$list.selectActive(); this.$data.__close() }},
    })
}

function handleButton(el, Alpine) {
    Alpine.bind(el, {
        'x-ref': '__button',
        ':id'() { return this.$id('headlessui-combobox-button') },
        'aria-haspopup': 'true',
        ':aria-labelledby'() { return this.$refs.__label ? [this.$refs.__label.id, this.$el.id].join(' ') : null },
        ':aria-expanded'() { return this.$data.__disabled ? null : this.$data.__isOpen },
        ':aria-controls'() { return this.$data.__optionsEl ? this.$data.__optionsEl.id : null },
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
        ':id'() { return this.$id('headlessui-combobox-label') },
        '@click'() { this.$refs.__input.focus({ preventScroll: true }) },
    })
}

function handleOptions(el, Alpine) {
    Alpine.bind(el, {
        'x-ref': '__options',
        'x-init'() {
            this.$data.__optionsEl = this.$el

            queueMicrotask(() => {
                if (Alpine.bound(this.$el, 'static')) {
                    this.$data.__open()
                    this.$data.__static = true;
                }

                if (Alpine.bound(this.$el, 'hold')) {
                    this.$data.__hold = true;
                }
            })

            // Add `role="none"` to all non option elements.
            this.$nextTick(() => {
                let walker = document.createTreeWalker(
                    this.$el,
                    NodeFilter.SHOW_ELEMENT,
                    { acceptNode: node => {
                        if (node.getAttribute('role') === 'option') return NodeFilter.FILTER_REJECT
                        if (node.hasAttribute('role')) return NodeFilter.FILTER_SKIP
                        return NodeFilter.FILTER_ACCEPT
                    }},
                    false
                )

                while (walker.nextNode()) walker.currentNode.setAttribute('role', 'none')
            })
        },
        'role': 'listbox',
        ':id'() { return this.$id('headlessui-combobox-options') },
        ':aria-labelledby'() { return this.$id('headlessui-combobox-button') },
        ':aria-activedescendant'() { return this.$list.activeEl ? this.$list.activeEl.id : null },
        'x-show'() { return this.$data.__isOpen },
    })
}

function handleOption(el, Alpine, directive, evaluate) {
    let value = evaluate(directive.expression)

    Alpine.bind(el, {
        'role': 'option',
        'x-item'() { return value },
        ':id'() { return this.$id('headlessui-combobox-option') },
        ':tabindex'() { return this.$item.disabled ? undefined : '-1' },
        ':aria-selected'() { return this.$item.selected },
        ':aria-disabled'() { return this.$item.disabled },
        '@click'(e) {
            if (this.$item.disabled) e.preventDefault()
            this.$item.select()
            this.$data.__close()
            this.$nextTick(() => this.$refs.__input.focus({ preventScroll: true }))
        },
        '@focus'() {
            if (this.$item.disabled) return this.$list.deactivate()
            this.$item.activate()
        },
        '@pointermove'() {
            if (this.$item.disabled || this.$item.active) return
            this.$item.activate()
        },
        '@mousemove'() {
            if (this.$item.disabled || this.$item.active) return
            this.$item.activate()
        },
        '@pointerleave'() {
            if (this.$item.disabled || ! this.$item.active || this.$data.__hold) return
            this.$list.deactivate()
        },
        '@mouseleave'() {
            if (this.$item.disabled || ! this.$item.active || this.$data.__hold) return
            this.$list.deactivate()
        },
    })
}

function registerListStuff(Alpine) {
    Alpine.directive('list', (el, { expression, modifiers }, { evaluateLater, effect }) => {
        let wrap = modifiers.includes('wrap')
        let getOuterValue = () => null
        let setOuterValue = () => {}

        if (expression) {
            let func = evaluateLater(expression)
            getOuterValue = () => { let result; func(i => result = i); return result; }
            let evaluateOuterSet = evaluateLater(`${expression} = __placeholder`)
            setOuterValue = val => evaluateOuterSet(() => {}, { scope: { '__placeholder': val }})
        }

        let listEl = el

        el._x_listState = {
            wrap,
            reactive: Alpine.reactive({
                active: null,
                selected: null,
            }),
            get active() { return this.reactive.active },
            get selected() { return this.reactive.selected },
            get activeEl() {
                this.reactive.active

                let item = this.items.find(i => i.value === this.reactive.active)

                return item && item.el
            },
            get selectedEl() {
                let item = this.items.find(i => i.value === this.reactive.selected)

                return item && item.el
            },
            set active(value) { this.setActive(value) },
            set selected(value) { this.setSelected(value) },
            setSelected(value) {
                let item = this.items.find(i => i.value === value)

                if (item && item.disabled) return

                this.reactive.selected = value; setOuterValue(value)
            },
            setActive(value) {
                let item = this.items.find(i => i.value === value)

                if (item && item.disabled) return

                this.reactive.active = value
            },
            deactivate() {
                this.reactive.active = null
            },
            selectActive() {
                this.selected = this.active
            },
            activateSelectedOrFirst() {
                if (this.selected) this.active = this.selected
                else this.first()?.activate()
            },
            activateSelectedOrLast() {
                if (this.selected) this.active = this.selected
                else this.last()?.activate()
            },
            items: [],
            get filteredEls() { return this.items.filter(i => ! i.disabled).map(i => i.el) },
            addItem(el, value, disabled = false) {
                this.items.push({ el, value, disabled })
                this.reorderList()
            },
            disableItem(el) {
                this.items.find(i => i.el === el).disabled = true
            },
            removeItem(el) {
                this.items = this.items.filter(i => i.el !== el)
                this.reorderList()
            },
            reorderList() {
                this.items = this.items.slice().sort((a, z) => {
                    if (a === null || z === null) return 0

                    let position = a.el.compareDocumentPosition(z.el)

                    if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1
                    if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1
                    return 0
                })
            },
            handleKeyboardNavigation(e) {
                let item

                switch (e.key) {
                    case 'Tab':
                    case 'Backspace':
                    case 'Delete':
                    case 'Meta':
                        break;

                        break;
                    case ['ArrowDown', 'ArrowRight'][0]: // @todo handle orientation switching.
                        e.preventDefault(); e.stopPropagation()
                        item = this.active ? this.next() : this.first()
                        break;

                    case ['ArrowUp', 'ArrowLeft'][0]:
                        e.preventDefault(); e.stopPropagation()
                        item = this.active ? this.prev() : this.last()
                        break;
                    case 'Home':
                    case 'PageUp':
                        e.preventDefault(); e.stopPropagation()
                        item = this.first()
                        break;

                    case 'End':
                    case 'PageDown':
                        e.preventDefault(); e.stopPropagation()
                        item = this.last()
                        break;

                    default:
                        if (e.key.length === 1) {
                            // item = this.search(e.key)
                        }
                        break;
                }

                item && item.activate(({ el }) => {
                    setTimeout(() => el.scrollIntoView({ block: 'nearest' }))
                })
            },
            // Todo: the debounce doesn't work.
            searchQuery: '',
            clearSearch: Alpine.debounce(function () { this.searchQuery = '' }, 350),
            search(key) {
                this.searchQuery += key

                let el = this.filteredEls.find(el => {
                    return el.textContent.trim().toLowerCase().startsWith(this.searchQuery)
                })

                let obj = el ? generateItemObject(listEl, el) : null

                this.clearSearch()

                return obj
            },
            first() {
                let el = this.filteredEls[0]

                return el && generateItemObject(listEl, el)
            },
            last() {
                let el = this.filteredEls[this.filteredEls.length-1]

                return el && generateItemObject(listEl, el)
            },
            next() {
                let current = this.activeEl || this.filteredEls[0]
                let index = this.filteredEls.indexOf(current)

                let el = this.wrap
                    ? this.filteredEls[index + 1] || this.filteredEls[0]
                    : this.filteredEls[index + 1] || this.filteredEls[index]

                return el && generateItemObject(listEl, el)
            },
            prev() {
                let current = this.activeEl || this.filteredEls[0]
                let index = this.filteredEls.indexOf(current)

                let el = this.wrap
                    ? (index - 1 < 0 ? this.filteredEls[this.filteredEls.length-1] : this.filteredEls[index - 1])
                    : (index - 1 < 0 ? this.filteredEls[0] : this.filteredEls[index - 1])

                return el && generateItemObject(listEl, el)
            },
        }

        effect(() => {
            el._x_listState.setSelected(getOuterValue())
        })
    })

    Alpine.magic('list', (el) => {
        let listEl = Alpine.findClosest(el, el => el._x_listState)

        return listEl._x_listState
    })

    Alpine.directive('item', (el, { expression }, { effect, evaluate, cleanup }) => {
        let value
        el._x_listItem = true

        if (expression) value = evaluate(expression)

        let listEl = Alpine.findClosest(el, el => el._x_listState)

        console.log(value)
        listEl._x_listState.addItem(el, value)

        queueMicrotask(() => {
            Alpine.bound(el, 'disabled') && listEl._x_listState.disableItem(el)
        })

        cleanup(() => {
            listEl._x_listState.removeItem(el)
            delete el._x_listItem
        })
    })

    Alpine.magic('item', el => {
        let listEl = Alpine.findClosest(el, el => el._x_listState)
        let itemEl = Alpine.findClosest(el, el => el._x_listItem)

        if (! listEl) throw 'Cant find x-list element'
        if (! itemEl) throw 'Cant find x-item element'

        return generateItemObject(listEl, itemEl)
    })

    function generateItemObject(listEl, el) {
        let state = listEl._x_listState
        let item = listEl._x_listState.items.find(i => i.el === el)

        return {
            activate(callback = () => {}) {
                state.setActive(item.value)

                callback(item)
            },
            deactivate() {
                if (Alpine.raw(state.active) === Alpine.raw(item.value)) state.setActive(null)
            },
            select(callback = () => {}) {
                state.setSelected(item.value)

                callback(item)
            },
            isFirst() {
                return state.items.findIndex(i => i.el.isSameNode(el)) === 0
            },
            get active() {
                if (state.reactive.active) return state.reactive.active === item.value

                return null
            },
            get selected() {
                if (state.reactive.selected) return state.reactive.selected === item.value

                return null
            },
            get disabled() {
                return item.disabled
            },
            get el() { return item.el },
            get value() { return item.value },
        }
    }
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
