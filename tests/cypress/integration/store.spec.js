import { haveText, html, test } from '../utils'

test('can register and use a global store',
    [html`
        <div x-data>
            <span x-text="$store.test.foo"></span>
            <button @click="$store.test.foo = 'baz'">clickme</button>
        </div>
    `,
    `
        Alpine.store('test', { foo: 'bar' })
    `],
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('baz'))
    }
)

test('can register multiple stores at once',
    [html`
        <div x-data>
            <span id="foo" x-text="$store.foo.bar"></span>
            <span id="boo" x-text="$store.boo.car"></span>
        </div>
    `,
    `
        Alpine.store({
            foo: {
                bar: 'baz'
            },
            boo: {
                car: 'caz'
            }
        })
    `],
    ({ get }) => {
        get('span#foo').should(haveText('baz'))
        get('span#boo').should(haveText('caz'))
    }
)

test('store init function is called',
    [html`
        <div x-data>
            <span x-text="$store.test.foo"></span>
            <button @click="$store.test.foo = 'baz'">clickme</button>
        </div>
    `,
    `
        Alpine.store('test', { foo: 'bar', init() { this.foo = 'baz'} })
    `],
    ({ get }) => {
        get('span').should(haveText('baz'))
    }
)

test('can use primitives as store',
    [html`
        <div x-data>
            <span x-text="$store.test"></span>
            <button @click="$store.test = 'baz'">clickme</button>
        </div>
    `,
    `
        Alpine.store('test', 'bar')
    `],
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('baz'))
    }
)

test('can use number as store',
    [html`
        <div x-data>
            <span x-text="$store.test"></span>
            <button @click="$store.test++">clickme</button>
        </div>
    `,
    `
        Alpine.store('test', 0)
    `],
    ({ get }) => {
        get('span').should(haveText('0'))
        get('button').click()
        get('span').should(haveText('1'))
    }
)

test('store\'s "this" context is reactive for init function',
    [html`
        <div x-data>
        <span x-text="$store.test.count"></span>
        <button @click="$store.test.increment()" id="button">increment</button>
        </div>
    `,
    `
        Alpine.store('test', {
            init() {
                document.querySelector('#button').addEventListener('click', () => {
                    this.count++
                })
            },
            count: 0,
        })
    `],
    ({ get }) => {
        get('span').should(haveText('0'))
        get('button').click()
        get('span').should(haveText('1'))
    }
)
