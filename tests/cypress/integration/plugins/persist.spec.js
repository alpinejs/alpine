import { beHidden, beVisible, haveText, html, test } from '../../utils'

test('can persist data',
    [html`
        <div x-data="{ count: $persist(1) }">
            <button @click="count++">Inc</button>
            <span x-text="count"></span>
        </div>
    `],
    ({ get }, reload) => {
        get('span').should(haveText('1'))
        get('button').click()
        get('span').should(haveText('2'))
        reload()
        get('span').should(haveText('2'))
    },
)

test('can persist boolean data',
    [html`
        <div x-data="{ show: $persist(true) }">
            <button x-on:click="show = false"></button>
            <span x-show="show">thing</span>
        </div>
    `],
    ({ get }, reload) => {
        get('span').should(beVisible())
        get('button').click()
        reload()
        get('span').should(beHidden())
    },
)

test('can persist array data',
    [html`
        <div x-data="{ items: $persist(['foo']) }">
            <button x-on:click="items[0] = 'bar'"></button>
            <span x-text="items[0]"></span>
        </div>
    `],
    ({ get }, reload) => {
        get('span').should(haveText('foo'))
        get('button').click()
        reload()
        get('span').should(haveText('bar'))
    },
)

test('can persist object data',
    [html`
        <div x-data="{ foo: $persist({ bar: 1 }) }">
            <button x-on:click="foo.bar = 2"></button>
            <span x-text="foo.bar"></span>
        </div>
    `],
    ({ get }, reload) => {
        get('span').should(haveText('1'))
        get('button').click()
        reload()
        get('span').should(haveText('2'))
    },
)
