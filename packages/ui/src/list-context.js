import Alpine from "../../alpinejs/src/alpine"

export function generateContext(multiple, orientation) {
    return {
        /**
         * Main state...
         */
        searchableText: {},
        disabledKeys: [],
        activeKey: null,
        selectedKeys: [],
        orderedKeys: [],
        elsByKey: {},
        values: {},

        /**
         *  Initialization...
         */
        initItem(el, value, disabled) {
            let key = (Math.random() + 1).toString(36).substring(7)

            // Register value by key...
            this.values[key] = value

            // Associate key with element...
            this.elsByKey[key] = el

            // Register key for ordering...
            this.orderedKeys.push(key)

            // Register key for searching...
            this.searchableText[key] = el.textContent.trim().toLowerCase()

            // Store whether disabled or not...
            disabled && this.disabledKeys.push(key)

            return key
        },

        destroyItem(el) {
            let key = keyByValue(this.elsByKey, el)

            delete this.values[key]
            delete this.elsByKey[key]
            delete this.orderedKeys[this.orderedKeys.indexOf(key)]
            delete this.searchableText[key]
            delete this.disabledKeys[key]

            this.reorderKeys()
        },

        /**
         * Handle elements...
         */
         reorderKeys() {
            // Filter out elements removed from the dom...
            this.orderedKeys.forEach((key) => {
                let el = this.elsByKey[key]

                if (el.isConnected) return

                this.destroyItem(el)
            })

            this.orderedKeys = this.orderedKeys.slice().sort((a, z) => {
                if (a === null || z === null) return 0

                let aEl = this.elsByKey[a]
                let zEl = this.elsByKey[z]

                let position = aEl.compareDocumentPosition(zEl)

                if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1
                if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1
                return 0
            })
        },

        activeEl() {
            if (! this.activeKey) return

            return this.elsByKey[this.activeKey]
        },

        isActiveEl(el) {
            let key = keyByValue(this.elsByKey, el)

            if (! key) return

            return this.activeKey === key
        },

        activateEl(el) {
            let key = keyByValue(this.elsByKey, el)

            if (! key) return

            this.activateKey(key)
        },

        selectEl(el) {
            let key = keyByValue(this.elsByKey, el)

            if (! key) return

            this.selectKey(key)
        },

        isSelectedEl(el) {
            let key = keyByValue(this.elsByKey, el)

            if (! key) return

            return this.isSelected(key)
        },

        isDisabledEl(el) {
            let key = keyByValue(this.elsByKey, el)

            if (! key) return

            return this.isDisabled(key)
        },

        get isScrollingTo() { return this.scrollingCount > 0 },

        scrollingCount: 0,

        activateAndScrollToKey(key) {
            // This addresses the following problem:
            // If deactivate is hooked up to mouseleave,
            // scrolling to an element will trigger deactivation.
            // This "isScrollingTo" is exposed to prevent that.
            this.scrollingCount++

            this.activateKey(key)

            let targetEl = this.elsByKey[key]

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
        selectedValueOrValues() {
            if (multiple) {
                return this.selectedValues()
            } else {
                return this.selectedValue()
            }
        },

        selectedValues() {
            return this.selectedKeys.map(i => this.values[i])
        },

        selectedValue() {
            return this.selectedKeys[0] ? this.values[this.selectedKeys[0]] : null
        },

        selectValue(value, by) {
            if (!value) value = (multiple ? [] : null)
            if (! by) by = (a, b) => a === b

            if (typeof by === 'string') {
                let property = by
                by = (a, b) => a[property] === b[property]
            }

            if (multiple) {
                // debugger
                let keys = []

                value.forEach(i => {
                    for (let key in this.values) {
                        if (by(this.values[key], i)) {
                            if (! keys.includes(key)) {
                                keys.push(key)
                            }
                        }
                    }
                })

                this.selectExclusive(keys)
            } else {
                for (let key in this.values) {
                    if (value && by(this.values[key], value)) {
                        this.selectKey(key)
                    }
                }
            }
        },

        /**
         * Handle disabled keys...
         */
        isDisabled(key) { return this.disabledKeys.includes(key) },

        get nonDisabledOrderedKeys() {
            return this.orderedKeys.filter(i => ! this.isDisabled(i))
        },

        /**
         * Handle selected keys...
         */
        selectKey(key) {
            if (this.isDisabled(key)) return

            if (multiple) {
                this.toggleSelected(key)
            } else {
                this.selectOnly(key)
            }
        },

        toggleSelected(key) {
            if (this.selectedKeys.includes(key)) {
                this.selectedKeys.splice(this.selectedKeys.indexOf(key), 1)
            } else {
                this.selectedKeys.push(key)
            }
        },

        selectOnly(key) {
            this.selectedKeys = []
            this.selectedKeys.push(key)
        },

        selectExclusive(keys) {
            // We can't just do this.selectedKeys = keys,
            // because we need to preserve reactivity...

            let toAdd = [...keys]

            for (let i = 0; i < this.selectedKeys.length; i++) {
                if (keys.includes(this.selectedKeys[i])) {
                    delete toAdd[toAdd.indexOf(this.selectedKeys[i])]
                    continue;
                }

                if (! keys.includes(this.selectedKeys[i])) {
                    delete this.selectedKeys[i]
                }
            }

            toAdd.forEach(i => {
                this.selectedKeys.push(i)
            })
        },

        selectActive(key) {
            if (! this.activeKey) return

            this.selectKey(this.activeKey)
        },

        isSelected(key) { return this.selectedKeys.includes(key) },


        firstSelectedKey() { return this.selectedKeys[0] },

        /**
         * Handle activated keys...
         */
        hasActive() { return !! this.activeKey },

        isActiveKey(key) { return this.activeKey === key },

        get active() { return this.hasActive() && this.values[this.activeKey] },

        activateSelectedOrFirst() {
            let firstSelected = this.firstSelectedKey()

            if (firstSelected) {
                return this.activateKey(firstSelected)
            }

            let firstKey = this.firstKey()

            if (firstKey) {
                this.activateKey(firstKey)
            }
        },

        activateKey(key) {
            if (this.isDisabled(key)) return

            this.activeKey = key
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

            for (let key in this.searchableText) {
                let content = this.searchableText[key]

                if (content.startsWith(this.searchQuery)) {
                    foundKey = key
                    break;
                }
            }

            if (! this.nonDisabledOrderedKeys.includes(foundKey)) return

            return foundKey
        },

        activateByKeyEvent(e) {
            this.reorderKeys()

            let hasActive = this.hasActive()

            let targetKey

            switch (e.key) {
                case 'Tab':
                case 'Backspace':
                case 'Delete':
                case 'Meta':
                    break;

                    break;
                case ['ArrowDown', 'ArrowRight'][orientation === 'vertical' ? 0 : 1]:
                    e.preventDefault(); e.stopPropagation()
                    targetKey = hasActive ? this.nextKey() : this.firstKey()
                    break;

                case ['ArrowUp', 'ArrowLeft'][orientation === 'vertical' ? 0 : 1]:
                    e.preventDefault(); e.stopPropagation()
                    targetKey = hasActive ? this.prevKey() : this.lastKey()
                    break;
                case 'Home':
                case 'PageUp':
                    e.preventDefault(); e.stopPropagation()
                    targetKey = this.firstKey()
                    break;

                case 'End':
                case 'PageDown':
                    e.preventDefault(); e.stopPropagation()
                    targetKey = this.lastKey()
                    break;

                default:
                    if (e.key.length === 1) {
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
