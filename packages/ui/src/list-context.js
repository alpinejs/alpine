
export function generateContext(Alpine, multiple, orientation, activateSelectedOrFirst) {
    return {
        /**
         * Main state...
         */
        items: [],
        activeKey: switchboard(),
        orderedKeys: [],
        activatedByKeyPress: false,

        /**
         *  Initialization...
         */
        activateSelectedOrFirst: Alpine.debounce(function () {
            activateSelectedOrFirst(false)
        }),

        registerItemsQueue: [],

        registerItem(key, el, value, disabled) {
            // We need to queue up these additions to not slow down the
            // init process for each row...
            if (this.registerItemsQueue.length === 0) {
                queueMicrotask(() => {
                    if (this.registerItemsQueue.length > 0) {
                        this.items = this.items.concat(this.registerItemsQueue)

                        this.registerItemsQueue = []

                        this.reorderKeys()
                        this.activateSelectedOrFirst()
                    }
                })
            }

            let item = {
                key, el, value, disabled
            }

            this.registerItemsQueue.push(item)
        },

        unregisterKeysQueue: [],

        unregisterItem(key) {
            // This gets triggered when the mutation observer picks up DOM changes.
            // It will get called for every row that gets removed. If there are
            // 1000x rows, we want to trigger this cleanup when the first one
            // is handled, let the others add their keys to the queue, then
            // handle all the cleanup in bulk at the end. Big perf gain...
            if (this.unregisterKeysQueue.length === 0) {
                queueMicrotask(() => {
                    if (this.unregisterKeysQueue.length > 0) {
                        this.items = this.items.filter(i => ! this.unregisterKeysQueue.includes(i.key))
                        this.orderedKeys = this.orderedKeys.filter(i => ! this.unregisterKeysQueue.includes(i))

                        this.unregisterKeysQueue = []

                        this.reorderKeys()
                        this.activateSelectedOrFirst()
                    }
                })
            }

            this.unregisterKeysQueue.push(key)
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
            let filteredValue = this.items.filter(i => rawValues.includes(Alpine.raw(i.value)))
            filteredValue = filteredValue.slice().sort((a, b) => {
                let position = a.el.compareDocumentPosition(b.el)
                if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1
                if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1
                return 0
            })
            return filteredValue
        },

        getActiveItem() {
            if (! this.hasActive()) return null

            let item = this.items.find(i => i.key === this.activeKey.get())

            if (! item) this.deactivateKey(this.activeKey.get())

            return item
        },

        activateItem(item) {
            if (! item) return

            this.activateKey(item.key)
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
            if (! this.orderedKeys.includes(this.activeKey.get())) this.deactivateKey(this.activeKey.get())
        }),

        getActiveKey() {
            return this.activeKey.get()
        },

        activeEl() {
            if (! this.activeKey.get()) return

            return this.items.find(i => i.key === this.activeKey.get()).el
        },

        isActiveEl(el) {
            let key = this.items.find(i => i.el === el)

            return this.activeKey.is(key)
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

        activateAndScrollToKey(key, activatedByKeyPress) {
            if (! this.getItemByKey(key)) return

            // This addresses the following problem:
            // If deactivate is hooked up to mouseleave,
            // scrolling to an element will trigger deactivation.
            // This "isScrollingTo" is exposed to prevent that.
            this.scrollingCount++

            this.activateKey(key, activatedByKeyPress)

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
         * Handle activated keys...
         */
        hasActive() { return !! this.activeKey.get() },

        /**
         * Return true if the latest active element was activated
         * by the user (i.e. using the arrow keys) and false if was
         * activated automatically by alpine (i.e. first element automatically
         * activated after filtering the list)
         */
        wasActivatedByKeyPress() {return this.activatedByKeyPress},

        isActiveKey(key) { return this.activeKey.is(key) },

        activateKey(key, activatedByKeyPress = false) {
            if (this.isDisabled(key)) return

            this.activeKey.set(key)
            this.activatedByKeyPress = activatedByKeyPress
        },

        deactivateKey(key) {
            if (this.activeKey.get() === key) {
                this.activeKey.set(null)
                this.activatedByKeyPress = false
            }
        },

        deactivate() {
            if (! this.activeKey.get()) return
            if (this.isScrollingTo) return

            this.activeKey.set(null)
            this.activatedByKeyPress = false
        },

        /**
         * Handle active key traversal...
         */
        nextKey() {
            if (! this.activeKey.get()) return

            let index = this.nonDisabledOrderedKeys.findIndex(i => i === this.activeKey.get())

            return this.nonDisabledOrderedKeys[index + 1]
        },

        prevKey() {
            if (! this.activeKey.get()) return

            let index = this.nonDisabledOrderedKeys.findIndex(i => i === this.activeKey.get())

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

            let activatedByKeyPress = true

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
                    if (e.key == 'Home' && e.shiftKey) return;

                    e.preventDefault(); e.stopPropagation()
                    setIsTyping(false)
                    this.reorderKeys(); hasActive = this.hasActive()
                    targetKey = this.firstKey()
                    break;

                case 'End':
                case 'PageDown':
                    if (e.key == 'End' && e.shiftKey) return;

                    e.preventDefault(); e.stopPropagation()
                    setIsTyping(false)
                    this.reorderKeys(); hasActive = this.hasActive()
                    targetKey = this.lastKey()
                    break;

                default:
                    activatedByKeyPress = this.activatedByKeyPress
                    if (searchable && e.key.length === 1) {
                        targetKey = this.searchKey(e.key)
                    }
                    break;
            }

            if (targetKey) {
                this.activateAndScrollToKey(targetKey, activatedByKeyPress)
            }
        }
    }
}

function keyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value)
}

export function renderHiddenInputs(Alpine, el, name, value) {
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

function switchboard(value) {
    let lookup = {}

    let current

    let changeTracker = Alpine.reactive({ state: false })

    let get = () => {
        // Depend on the change tracker so reading "get" becomes reactive...
        if (changeTracker.state) {
            //
        }

        return current
    }

    let set = (newValue) => {
        if (newValue === current) return

        if (current !== undefined) lookup[current].state = false

        current = newValue

        if (lookup[newValue] === undefined) {
            lookup[newValue] = Alpine.reactive({ state: true })
        } else {
            lookup[newValue].state = true
        }

        changeTracker.state = ! changeTracker.state
    }

    let is = (comparisonValue) => {
        if (lookup[comparisonValue] === undefined) {
            lookup[comparisonValue] = Alpine.reactive({ state: false })
            return lookup[comparisonValue].state
        }

        return !! lookup[comparisonValue].state
    }

    value === undefined || set(value)

    return { get, set, is }
}
