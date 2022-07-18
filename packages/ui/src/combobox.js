
export default function (Alpine) {
    Alpine.directive('combobox', (el, directive) => {
        if      (directive.value === 'input')        handleInput(el, Alpine)
        else if (directive.value === 'button')       handleButton(el, Alpine)
        else if (directive.value === 'label')        handleLabel(el, Alpine)
        else if (directive.value === 'options')      handleOptions(el, Alpine)
        else if (directive.value === 'option')       handleOption(el, Alpine)
        else                                         handleRoot(el, Alpine)
    })

    Alpine.magic('comboboxOption', el => {
        let $data = Alpine.$data(el)

        return {}
    })
}

function handleRoot(el, Alpine) {
    Alpine.bind(el, {
        'x-modelable': '__value',
        'x-data'() {
            return {
                init() {
                    //
                },
                __value: null,
                __isOpen: false,
                __open() {
                    if (this.__isOpen) return
                    this.__isOpen = true
                },
                __close() {
                    if (! this.__isOpen) return

                    this.__isOpen = false
                },
            }
        },
    })
}

function handleInput(el, Alpine) {
    Alpine.bind(el, {
        //
    })
}

function handleButton(el, Alpine) {
    Alpine.bind(el, {
        '@click'(e) {
            if (this.$data.__isOpen) {
                this.$data.__close()
            } else {
                e.preventDefault()
                this.$data.__open()
            }
        },
    })
}

function handleLabel(el, Alpine) {
    Alpine.bind(el, {
        //
    })
}

function handleOptions(el, Alpine) {
    Alpine.bind(el, {
        'x-show'() { return this.$data.__isOpen },
    })
}

function handleOption(el, Alpine) {
    Alpine.bind(el, {
        '@click'(e) {
            if (this.$item.disabled) e.preventDefault()
            this.$item.select()
            this.$data.__close()
            this.$nextTick(() => this.$refs.__input.focus({ preventScroll: true }))
        },
    })
}
