
export default function (Alpine) {
    Alpine.directive('tabs', (el, directive) => {
        if      (! directive.value)                handleRoot(el, Alpine)
        else if (directive.value === 'list')       handleList(el, Alpine)
        else if (directive.value === 'tab')        handleTab(el, Alpine)
        else if (directive.value === 'panels')     handlePanels(el, Alpine)
        else if (directive.value === 'panel')      handlePanel(el, Alpine)
    })

    Alpine.magic('tab', el => {
        let $data = Alpine.$data(el)

        return {
            get isSelected() {
                return $data.__selectedIndex === $data.__tabs.indexOf($data.__tabEl)
            },
            get isDisabled() {
                return $data.__isDisabled
            }
        }
    })

    Alpine.magic('panel', el => {
        let $data = Alpine.$data(el)

        return {
            get isSelected() {
                return $data.__selectedIndex === $data.__panels.indexOf($data.__panelEl)
            }
        }
    })
}

function handleRoot(el, Alpine) {
    Alpine.bind(el, {
        [Alpine.prefixed('modelable')]: '__selectedIndex',
        [Alpine.prefixed('data')]() {
            return {
                init() {
                    queueMicrotask(() => {
                        let defaultIndex = this.__selectedIndex || Number(Alpine.bound(this.$el, 'default-index', 0))
                        let tabs = this.__activeTabs()
                        let clamp = (number, min, max) => Math.min(Math.max(number, min), max)

                        this.__selectedIndex = clamp(defaultIndex, 0, tabs.length -1)

                        Alpine.effect(() => {
                            this.__manualActivation = Alpine.bound(this.$el, 'manual', false)
                        })
                    })
                },
                __tabs: [],
                __panels: [],
                __selectedIndex: null,
                __tabGroupEl: undefined,
                __manualActivation: false,
                __addTab(el) { this.__tabs.push(el) },
                __addPanel(el) { this.__panels.push(el) },
                __selectTab(el) {
                    this.__selectedIndex = this.__tabs.indexOf(el)
                },
                __activeTabs() {
                   return this.__tabs.filter(i => !i.__disabled)
                },
            }
        }
    })
}

function handleList(el, Alpine) {
    Alpine.bind(el, {
        [Alpine.prefixed('init')]() { this.$data.__tabGroupEl = this.$el }
    })
}

function handleTab(el, Alpine) {
    Alpine.bind(el, {
        [Alpine.prefixed('init')]() { if (this.$el.tagName.toLowerCase() === 'button' && !this.$el.hasAttribute('type')) this.$el.type = 'button' },
        [Alpine.prefixed('data')]() { return {
            init() {
                this.__tabEl = this.$el
                this.$data.__addTab(this.$el)
                this.__tabEl.__disabled = Alpine.bound(this.$el, 'disabled', false)
                this.__isDisabled = this.__tabEl.__disabled
            },
            __tabEl: undefined,
            __isDisabled: false,
        }},
        [Alpine.prefixed('on:click')]() {
            if (this.$el.__disabled) return

            this.$data.__selectTab(this.$el)

            this.$el.focus()
        },
        [Alpine.prefixed('on:keydown.enter.prevent.stop')]() { this.__selectTab(this.$el) },
        [Alpine.prefixed('on:keydown.space.prevent.stop')]() { this.__selectTab(this.$el) },
        [Alpine.prefixed('on:keydown.home.prevent.stop')]() { this.$focus.within(this.$data.__activeTabs()).first() },
        [Alpine.prefixed('on:keydown.page-up.prevent.stop')]() { this.$focus.within(this.$data.__activeTabs()).first() },
        [Alpine.prefixed('on:keydown.end.prevent.stop')]() { this.$focus.within(this.$data.__activeTabs()).last() },
        [Alpine.prefixed('on:keydown.page-down.prevent.stop')]() { this.$focus.within(this.$data.__activeTabs()).last() },
        [Alpine.prefixed('on:keydown.down.prevent.stop')]() { this.$focus.within(this.$data.__activeTabs()).withWrapAround().next() },
        [Alpine.prefixed('on:keydown.right.prevent.stop')]() { this.$focus.within(this.$data.__activeTabs()).withWrapAround().next() },
        [Alpine.prefixed('on:keydown.up.prevent.stop')]() { this.$focus.within(this.$data.__activeTabs()).withWrapAround().prev() },
        [Alpine.prefixed('on:keydown.left.prevent.stop')]() { this.$focus.within(this.$data.__activeTabs()).withWrapAround().prev() },
        [Alpine.prefixed('bind:tabindex')]() { return this.$tab.isSelected ? 0 : -1 },
        [Alpine.prefixed('on:focus')]() {
            if (this.$data.__manualActivation) {
                this.$el.focus()
            } else {
                if (this.$el.__disabled) return

                this.$data.__selectTab(this.$el)

                this.$el.focus()
            }
        },
    })
}

function handlePanels(el, Alpine) {
    Alpine.bind(el, {
        //
    })
}

function handlePanel(el, Alpine) {
    Alpine.bind(el, {
        [Alpine.prefixed('bind:tabindex')]() { return this.$panel.isSelected ? 0 : -1 },
        [Alpine.prefixed('data')]() { return {
            init() {
                this.__panelEl = this.$el
                this.$data.__addPanel(this.$el)
            },
            __panelEl: undefined,
        }},
        [Alpine.prefixed('show')]() { return this.$panel.isSelected },
    })
}

