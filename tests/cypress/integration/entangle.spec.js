import { haveValue, html, test } from '../utils'

test.skip('can entangle to getter/setter pairs',
    [html`
    <div x-data="{ outer: 'foo' }">
        <input x-model="outer" outer>

        <div x-data="{ inner: 'bar' }" x-init="() => {}; Alpine.entangle(
            {
                get() { return outer },
                set(value) { outer = value },
            },
            {
                get() { return inner },
                set(value) { inner = value },
            }
        )">
            <input x-model="inner" inner>
        </div>
    </div>
    `],
    ({ get }) => {
        get('input[outer]').should(haveValue('foo'))
        get('input[inner]').should(haveValue('foo'))

        get('input[inner]').type('bar')
        get('input[inner]').should(haveValue('foobar'))
        get('input[outer]').should(haveValue('foobar'))

        get('input[outer]').type('baz')
        get('input[outer]').should(haveValue('foobarbaz'))
        get('input[inner]').should(haveValue('foobarbaz'))
    }
)

test.skip('can release entanglement',
    [html`
        <div x-data="{ outer: 'foo' }">
            <input x-model="outer" outer>

            <div x-data="{ inner: 'bar', release: () => {} }" x-init="() => {}; release = Alpine.entangle(
                {
                    get() { return outer },
                    set(value) { outer = value },
                },
                {
                    get() { return inner },
                    set(value) { inner = value },
                }
            )">
                <input x-model="inner" inner>

                <button @click="release()">release</button>
            </div>
        </div>
    `],
    ({ get }) => {
        get('input[outer]').should(haveValue('foo'))
        get('input[inner]').should(haveValue('foo'))

        get('input[inner]').type('bar')
        get('input[inner]').should(haveValue('foobar'))
        get('input[outer]').should(haveValue('foobar'))

        get('button').click()

        get('input[inner]').type('baz')
        get('input[inner]').should(haveValue('foobarbaz'))
        get('input[outer]').should(haveValue('foobar'))
    }
)
