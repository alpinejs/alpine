import { haveText, html, test } from '../../utils'

test('can perist number',
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

test('can perist string',
    [html`
        <div x-data="{ message: $persist('foo') }">
            <input x-model="message">

            <span x-text="message"></span>
        </div>
    `],
    ({ get }, reload) => {
        get('span').should(haveText('foo'))
        get('input').clear().type('bar')
        get('span').should(haveText('bar'))
        reload()
        get('span').should(haveText('bar'))
    },
)

test('can perist array',
    [html`
        <div x-data="{ things: $persist(['foo', 'bar']) }">
            <button @click="things.push('baz')"></button>

            <span x-text="things.join('-')"></span>
        </div>
    `],
    ({ get }, reload) => {
        get('span').should(haveText('foo-bar'))
        get('button').click()
        get('span').should(haveText('foo-bar-baz'))
        reload()
        get('span').should(haveText('foo-bar-baz'))
    },
)
