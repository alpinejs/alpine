
export default function (Alpine) {
    Alpine.directive('listbox', (el, directive) => {
        if (!directive.value) handleRoot(el, Alpine)
        else if (directive.value === 'label') handleLabel(el, Alpine)
        else if (directive.value === 'button') handleButton(el, Alpine)
        else if (directive.value === 'options') handleOptions(el, Alpine)
        else if (directive.value === 'option') handleOption(el, Alpine)
    })

    Alpine.magic('listbox', (el, { evaluate }) => {
        return evaluate('$list', el)
    })

    Alpine.magic('listboxOption', (el, { evaluate }) => {
        return evaluate('$item', el)
    })
}
function handleRoot(el, Alpine) {
    Alpine.bind(el, {
        'x-id'() { return ['alpine-listbox-button', 'alpine-listbox-options', 'alpine-listbox-label'] },
        'x-list': '__value',
        'x-modelable': '__value',
        'x-data'() {
            return {
                __value: null,
                __isOpen: false,
                __open() {
                    this.__isOpen = true

                    this.$list.activateSelectedOrFirst()

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
    })
}

function handleLabel(el, Alpine) {
    Alpine.bind(el, {
        'x-ref': '__label',
        ':id'() { return this.$id('alpine-listbox-label') },
        '@click'() { this.$refs.__button.focus({ preventScroll: true }) },
    })
}

function handleButton(el, Alpine) {
    Alpine.bind(el, {
        'x-ref': '__button',
        ':id'() { return this.$id('alpine-listbox-button') },
        'aria-haspopup': 'true',
        ':aria-labelledby'() { return this.$id('alpine-listbox-label') },
        ':aria-expanded'() { return this.$data.__isOpen },
        ':aria-controls'() { return this.$data.__isOpen && this.$id('alpine-listbox-options') },
        'x-init'() { if (this.$el.tagName.toLowerCase() === 'button' && !this.$el.hasAttribute('type')) this.$el.type = 'button' },
        '@click'() { this.$data.__open() },
        '@keydown.[down|up|space|enter].stop.prevent'() { this.$data.__open() },
        '@keydown.up.stop.prevent'() { this.$data.__open() },
        '@keydown.space.stop.prevent'() { this.$data.__open() },
        '@keydown.enter.stop.prevent'() { this.$data.__open() },
    })
}

function handleOptions(el, Alpine) {
    Alpine.bind(el, {
        tabindex: '0',
        '@keydown'(e) { this.$list.handleKeyboardNavigation(e) },
        // '@focus'() { this.$list.first().activate() },
        '@keydown.enter.stop.prevent'() { this.$list.selectActive(); this.$data.__close() },
        '@keydown.space.stop.prevent'() { this.$list.selectActive(); this.$data.__close() },
        'x-ref': '__options',
        'aria-orientation': 'vertical',
        'role': 'listbox',
        ':id'() { return this.$id('alpine-listbox-options') },
        // ':aria-labelledby'() { return 'listbox-button-' + this.$data.__buttonId },
        // ':aria-activedescendant'() { return this.$data.__activeEl && this.$data.__activeEl.id },
        'x-show'() { return this.$data.__isOpen },
        'x-trap'() { return this.$data.__isOpen },
        '@click.outside'() { this.$data.__close() },
        '@keydown.escape.stop.prevent'() { this.$data.__close() },
    })
}

function handleOption(el, Alpine) {
    Alpine.bind(el, () => {
        return {
            'x-data'() {
                return {
                    '__value': undefined,
                    '__disabled': false,
                    init() {
                        queueMicrotask(() => {
                            this.__value = Alpine.bound(el, 'value');
                            this.__disabled = Alpine.bound(el, 'disabled', false);
                            console.log(this.__value);
                        })
                    }
                }
            },
            'x-item'() { return this.$data.__value },
            ':id'() { return this.$id('alpine-listbox-option') },
            ':tabindex'() { return this.$data.__disabled ? false : '-1' },
            'role': 'option',
            ':aria-selected'() { return this.$data.__selected === this.$data.__value },
            '@click'() { this.$item.select(); this.$data.__close() },
            '@mousemove'() { this.$item.activate() },
            '@mouseleave'() { this.$item.deactivate() },
        }
    })
}
