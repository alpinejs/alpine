import { beSelected, haveText, html, notBeSelected, test } from '../../utils'

test('$model allows you to interact with parent x-model bindings explicitly',
    html`
        <div x-data="{ foo: 'bar' }" x-model="foo">
            <button @click="$model.set('baz')">click me</button>
            <h1 x-text="$model.get()"></h1>
            <h2 x-text="foo"></h2>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveText('bar'))
        get('h2').should(haveText('bar'))
        get('button').click()
        get('h1').should(haveText('baz'))
        get('h2').should(haveText('baz'))
    }
)

test('$model accepts a callback when setting a value',
    html`
        <div x-data="{ foo: 'bar' }" x-model="foo">
            <button @click="$model.set(i => i + 'r')">click me</button>
            <h1 x-text="$model.get()"></h1>
            <h2 x-text="foo"></h2>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveText('bar'))
        get('h2').should(haveText('bar'))
        get('button').click()
        get('h1').should(haveText('barr'))
        get('h2').should(haveText('barr'))
    }
)

test('$model can be used with a getter and setter',
    html`
        <div x-data="{ foo: 'bar' }" x-model="foo">
            <div x-data="{
                get value() {
                    return this.$model.get()
                },
                set value(value) {
                    this.$model.set(value)
                }
            }">
                <button @click="value = 'baz'">click me</button>
                <h1 x-text="foo"></h1>
                <h2 x-text="value"></h2>
                <h3 x-text="$model.get()"></h3>
            </div>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveText('bar'))
        get('h2').should(haveText('bar'))
        get('h3').should(haveText('bar'))
        get('button').click()
        get('h1').should(haveText('baz'))
        get('h2').should(haveText('baz'))
        get('h3').should(haveText('baz'))
    }
)

test('$model can be used with another x-model',
    html`
        <div x-data="{ foo: 'bar' }" x-model="foo">
            <select x-model="$model">
                <option>bar</option>
                <option>baz</option>
            </select>

            <h1 x-text="foo"></h1>
            <h2 x-text="$model.get()"></h2>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveText('bar'))
        get('h2').should(haveText('bar'))
        get('option:first').should(beSelected())
        get('option:last').should(notBeSelected())
        get('select').
        get('select').select('baz')
        get('h1').should(haveText('baz'))
        get('h2').should(haveText('baz'))
        get('option:first').should(notBeSelected())
        get('option:last').should(beSelected())
    }
)

test('$model can be used on the same element as the corresponding x-model',
    [html`
        <div x-data="{ foo: 'bar' }">
            <button @click="foo = 'baz'">click me</button>

            <div x-test x-model="foo">
                <h1 x-text="value"></h1>
            </div>
        </div>
    `,
    `
        Alpine.directive('test', el => {
            Alpine.bind(el, {
                'x-data'() {
                    return {
                        internalValue: 'bob',
                        get value() {
                            if (this.$model) return this.$model.get()

                            return this.internalValue
                        },
                        set value(value) {
                            if (this.$model) {
                                this.$model.set(value)
                            } else {
                                this.internalValue = value
                            }
                        }
                    }
                }
            })
        })
    `],
    ({ get }) => {
        get('h1').should(haveText('bar'))
        get('button').click()
        get('h1').should(haveText('baz'))
    }
)

test('$model can watch for changing values and watcher gets cleaned up on element removal',
    html`
        <div x-data="{ foo: 'bar' }" x-model="foo">
            <button @click="$model.set('baz')">click me</button>
            <h1 x-text="$model.get()"></h1>
            <h2 x-init="$model.watch(newValue => $el.textContent = newValue)" x-on:click="$el.remove()"></h2>
            <h3 x-on:click="$model.set('bob')">click me</h3>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveText('bar'))
        get('h2').should(haveText(''))
        get('button').click()
        get('h1').should(haveText('baz'))
        get('h2').should(haveText('baz'))
        get('h2').click()
        get('h3').click()
        get('h1').should(haveText('bob'))
    }
)

test('$model can be used as a getter/setter pair in x-data',
    html`
        <div x-data="{ foo: 'bar' }" x-model="foo">
            <div x-data="{ value: $model }">
                <button @click="value = 'baz'">click me</button>
                <h2 x-text="value"></h2>
            </div>
        </div>
    `,
    ({ get }) => {
        get('h2').should(haveText('bar'))
        get('button').click()
        get('h2').should(haveText('baz'))
    }
)

test('$model can be used as a getter/setter pair in x-data with an initial value that makes x-model optional',
    html`
        <div x-data="{ foo: 'bar' }">
            <div x-data="{ value: $model('bar') }">
                <button @click="value = 'baz'">click me</button>
                <h2 x-text="value"></h2>
            </div>
        </div>
    `,
    ({ get }) => {
        get('h2').should(haveText('bar'))
        get('button').click()
        get('h2').should(haveText('baz'))
    }
)

test('$model can be used as a getter/setter pair in x-data on the same element when defined within a custom directive binding',
    [html`
        <div x-data="{ foo: 'bar' }">
            <div x-test x-model="foo">
                <button @click="value = 'baz'">click me</button>
                <h2 x-text="value"></h2>
            </div>
        </div>
    `,
    `
        Alpine.directive('test', (el) => {
            Alpine.bind(el, {
                'x-data'() {
                    return {
                        value: this.$model
                    }
                }
            })
        })
    `],
    ({ get }) => {
        get('h2').should(haveText('bar'))
        get('button').click()
        get('h2').should(haveText('baz'))
    }
)
