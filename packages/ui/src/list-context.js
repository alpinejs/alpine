
export function generateContext(multiple, orientation, activateSelectedOrFirst) {
    return {
        /**
         * Main state...
         */
        items: [],

        disabledKeys: [],
        activeKey: null,
        selectedKeys: [],
        orderedKeys: [],
        elsByKey: {},
        values: {},

        /**
         *  Initialization...
         */
        activateSelectedOrFirst: Alpine.debounce(function () {
            activateSelectedOrFirst(false)
        }),

        registerItem(key, el, value, disabled) {
            this.items.push({
                key, el, value, disabled
            })

            this.orderedKeys.push(key)

            this.reorderKeys()
            this.activateSelectedOrFirst()
        },

        unregisterItem(key) {
            let i = this.items.findIndex((i) => i.key === key)
            if (i !== -1) this.items.splice(i, 1)

            i = this.orderedKeys.indexOf(key)
            if (i !== -1) this.orderedKeys.splice(i, 1)

            this.reorderKeys()
            this.activateSelectedOrFirst()
        },

        getItemByKey(key) {
            return this.items.find(i => i.key === key)
        },

        getItemByValue(value) {
            return this.items.find(i => Alpine.raw(i.value) === Alpine.raw(value))
        },

        getItemByEl(el) {
            return this.items.find(i => i.el === el)
        },

        getItemsByValues(values) {
            let rawValues = values.map(i => Alpine.raw(i));
            return this.items.filter(i => rawValues.includes(Alpine.raw(i.value)))
        },

        getActiveItem() {
            if (! this.hasActive()) return null

            let item = this.items.find(i => i.key === this.activeKey)

            if (! item) return this.activeKey = null

            return item
        },

        activateItem(item) {
            if (! item) return

            this.activeKey = item.key
        },

        /**
         * Handle elements...
         */
         reorderKeys: Alpine.debounce(function () {
            this.orderedKeys = this.items.map(i => i.key)

            this.orderedKeys = this.orderedKeys.slice().sort((a, z) => {
                if (a === null || z === null) return 0

                let aEl = this.items.find(i => i.key === a).el
                let zEl = this.items.find(i => i.key === z).el

                let position = aEl.compareDocumentPosition(zEl)

                if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1
                if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1
                return 0
            })

            // If there no longer is the active key in the items list, then
            // deactivate it...
            if (! this.orderedKeys.includes(this.activeKey)) this.activeKey = null
        }),

        activeEl() {
            if (! this.activeKey) return

            return this.items.find(i => i.key === this.activeKey).el
        },

        isActiveEl(el) {
            let key = this.items.find(i => i.el === el)

            return this.activeKey === key
        },

        activateEl(el) {
            let item = this.items.find(i => i.el === el)

            this.activateKey(item.key)
        },

        isDisabledEl(el) {
            return this.items.find(i => i.el === el).disabled
        },

        get isScrollingTo() { return this.scrollingCount > 0 },

        scrollingCount: 0,

        activateAndScrollToKey(key) {
            if (! this.getItemByKey(key)) return

            // This addresses the following problem:
            // If deactivate is hooked up to mouseleave,
            // scrolling to an element will trigger deactivation.
            // This "isScrollingTo" is exposed to prevent that.
            this.scrollingCount++

            this.activateKey(key)

            let targetEl = this.items.find(i => i.key === key).el

            targetEl.scrollIntoView({ block: 'nearest' })

            setTimeout(() => {
                this.scrollingCount--
            // Unfortunately, browser experimentation has shown me
            // that 25ms is the sweet spot when holding down an
            // arrow key to scroll the list of items...
            }, 25)
        },

        /**
         * Handle values...
         */
        // selectedValueOrValues() {
        //     if (multiple) {
        //         return this.selectedValues()
        //     } else {
        //         return this.selectedValue()
        //     }
        // },

        // selectedValues() {
        //     return this.selectedKeys.map(i => this.values[i])
        // },

        // selectedValue() {
        //     return this.selectedKeys[0] ? this.values[this.selectedKeys[0]] : null
        // },

        // selectValue(value, by) {
        //     if (!value) value = (multiple ? [] : null)
        //     if (! by) by = (a, b) => a === b

        //     if (typeof by === 'string') {
        //         let property = by
        //         by = (a, b) => a[property] === b[property]
        //     }

        //     if (multiple) {
        //         let keys = []

        //         value.forEach(i => {
        //             for (let key in this.values) {
        //                 if (by(this.values[key], i)) {
        //                     if (! keys.includes(key)) {
        //                         keys.push(key)
        //                     }
        //                 }
        //             }
        //         })

        //         this.selectExclusive(keys)
        //     } else {
        //         for (let key in this.values) {
        //             if (value && by(this.values[key], value)) {
        //                 this.selectKey(key)
        //             }
        //         }
        //     }
        // },

        /**
         * Handle disabled keys...
         */
        isDisabled(key) {
            let item = this.items.find(i => i.key === key)

            if (! item) return false

            return item.disabled
        },

        get nonDisabledOrderedKeys() {
            return this.orderedKeys.filter(i => ! this.isDisabled(i))
        },

        /**
         * Handle selected keys...
         */
        // selectKey(key) {
        //     if (this.isDisabled(key)) return

        //     if (multiple) {
        //         this.toggleSelected(key)
        //     } else {
        //         this.selectOnly(key)
        //     }
        // },

        // toggleSelected(key) {
        //     console.log(key)
        //     if (this.selectedKeys.includes(key)) {
        //         this.selectedKeys.splice(this.selectedKeys.indexOf(key), 1)
        //     } else {
        //         this.selectedKeys.push(key)
        //     }
        // },

        // selectOnly(key) {
        //     this.selectedKeys = []
        //     this.selectedKeys.push(key)
        // },

        // selectExclusive(keys) {
        //     // We can't just do this.selectedKeys = keys,
        //     // because we need to preserve reactivity...

        //     let toAdd = [...keys]

        //     for (let i = 0; i < this.selectedKeys.length; i++) {
        //         if (keys.includes(this.selectedKeys[i])) {
        //             delete toAdd[toAdd.indexOf(this.selectedKeys[i])]
        //             continue;
        //         }

        //         if (! keys.includes(this.selectedKeys[i])) {
        //             this.selectedKeys.splice(i, 1)
        //         }
        //     }

        //     toAdd.forEach(i => {
        //         this.selectedKeys.push(i)
        //     })
        // },

        // selectActive(key) {
        //     if (! this.activeKey) return

        //     this.selectKey(this.activeKey)
        // },

        // isSelected(key) { return this.selectedKeys.includes(key) },


        // firstSelectedKey() { return this.selectedKeys[0] },

        /**
         * Handle activated keys...
         */
        hasActive() { return !! this.activeKey },

        isActiveKey(key) { return this.activeKey === key },


        // activateSelectedOrFirst() {
        //     let firstSelected = this.firstSelectedKey()

        //     if (firstSelected) {
        //         return this.activateKey(firstSelected)
        //     }

        //     let firstKey = this.firstKey()

        //     if (firstKey) {
        //         this.activateKey(firstKey)
        //     }
        // },

        activateKey(key) {
            if (this.isDisabled(key)) return

            this.activeKey = key
        },

        deactivateKey(key) {
            if (this.activeKey === key) this.activeKey = null
        },

        deactivate() {
            if (! this.activeKey) return
            if (this.isScrollingTo) return

            this.activeKey = null
        },

        /**
         * Handle active key traveral...
         */
        nextKey() {
            if (! this.activeKey) return

            let index = this.nonDisabledOrderedKeys.findIndex(i => i === this.activeKey)

            return this.nonDisabledOrderedKeys[index + 1]
        },

        prevKey() {
            if (! this.activeKey) return

            let index = this.nonDisabledOrderedKeys.findIndex(i => i === this.activeKey)

            return this.nonDisabledOrderedKeys[index - 1]
        },

        firstKey() { return this.nonDisabledOrderedKeys[0] },

        lastKey() { return this.nonDisabledOrderedKeys[this.nonDisabledOrderedKeys.length - 1] },

        searchQuery: '',

        clearSearch: Alpine.debounce(function () { this.searchQuery = '' }, 350),

        searchKey(query) {
            this.clearSearch()

            this.searchQuery += query

            let foundKey

            for (let key in this.items) {
                let content = this.items[key].el.textContent.trim().toLowerCase()

                if (content.startsWith(this.searchQuery)) {
                    foundKey = this.items[key].key
                    break;
                }
            }

            if (! this.nonDisabledOrderedKeys.includes(foundKey)) return

            return foundKey
        },

        activateByKeyEvent(e, searchable = false, isOpen = () => false, open = () => {}, setIsTyping) {
            let targetKey, hasActive

            setIsTyping(true)

            switch (e.key) {
                // case 'Backspace':
                // case 'Delete':
                case ['ArrowDown', 'ArrowRight'][orientation === 'vertical' ? 0 : 1]:
                    e.preventDefault(); e.stopPropagation()

                    setIsTyping(false)

                    if (! isOpen()) {
                        open()
                        break;
                    }

                    this.reorderKeys(); hasActive = this.hasActive()

                    targetKey = hasActive ? this.nextKey() : this.firstKey()
                    break;

                case ['ArrowUp', 'ArrowLeft'][orientation === 'vertical' ? 0 : 1]:
                    e.preventDefault(); e.stopPropagation()

                    setIsTyping(false)

                    if (! isOpen()) {
                        open()
                        break;
                    }

                    this.reorderKeys(); hasActive = this.hasActive()

                    targetKey = hasActive ? this.prevKey() : this.lastKey()
                    break;
                case 'Home':
                case 'PageUp':
                    e.preventDefault(); e.stopPropagation()
                    setIsTyping(false)
                    this.reorderKeys(); hasActive = this.hasActive()
                    targetKey = this.firstKey()
                    break;

                case 'End':
                case 'PageDown':
                    e.preventDefault(); e.stopPropagation()
                    setIsTyping(false)
                    this.reorderKeys(); hasActive = this.hasActive()
                    targetKey = this.lastKey()
                    break;

                default:
                    if (searchable && e.key.length === 1) {
                        targetKey = this.searchKey(e.key)
                    }
                    break;
            }

            if (targetKey) {
                this.activateAndScrollToKey(targetKey)
            }
        }
    }
}

function keyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value)
}

export function renderHiddenInputs(el, name, value) {
    // Create input elements...
    let newInputs = generateInputs(name, value)

    // Mark them for later tracking...
    newInputs.forEach(i => i._x_hiddenInput = true)

    // Mark them for Alpine ignoring...
    newInputs.forEach(i => i._x_ignore = true)

    // Gather old elements for removal...
    let children = el.children

    let oldInputs = []

    for (let i = 0; i < children.length; i++) {
        let child = children[i];

        if (child._x_hiddenInput) oldInputs.push(child)
        else break
    }

    // Remove old, and insert new ones into the DOM...
    Alpine.mutateDom(() => {
        oldInputs.forEach(i => i.remove())

        newInputs.reverse().forEach(i => el.prepend(i))
    })
}

function generateInputs(name, value, carry = []) {
    if (isObjectOrArray(value)) {
        for (let key in value) {
            carry = carry.concat(
                generateInputs(`${name}[${key}]`, value[key])
            )
        }
    } else {
        let el = document.createElement('input')
        el.setAttribute('type', 'hidden')
        el.setAttribute('name', name)
        el.setAttribute('value', '' + value)

        return [el]
    }


    return carry
}

function isObjectOrArray(subject) {
    return typeof subject === 'object' && subject !== null
}
