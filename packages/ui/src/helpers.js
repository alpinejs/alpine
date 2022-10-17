export default function (Alpine) {
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
                console.log(value);

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
        el._x_listItem = true

        let listEl = Alpine.findClosest(el, el => el._x_listState)

        queueMicrotask(() => {
            let value = Alpine.bound(el, 'value');

            listEl._x_listState.addItem(el, value)

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
            },
            get selected() {
                if (state.reactive.selected) return state.reactive.selected === item.value
            },
            get disabled() {
                return item.disabled
            },
            get el() { return item.el },
            get value() { return item.value },
        }
    }
}
