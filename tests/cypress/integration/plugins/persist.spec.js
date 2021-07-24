import { beVisible, haveText, html, notBeVisible, test } from '../../utils'

test('can persist number',
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

test('can persist string',
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

test('can persist array',
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

test('can persist object',
    [html`
        <div x-data="{ something: $persist({foo: 'bar'}) }">
            <button id="one" @click="something.foo = 'baz'"></button>
            <button id="two" @click="something = {foo: 'bob'}"></button>

            <span x-text="something.foo"></span>
        </div>
    `],
    ({ get }, reload) => {
        get('span').should(haveText('bar'))
        get('button#one').click()
        get('span').should(haveText('baz'))
        reload()
        get('span').should(haveText('baz'))
        get('button#two').click()
        get('span').should(haveText('bob'))
        reload()
        get('span').should(haveText('bob'))
    },
)

test('can persist boolean',
    [html`
        <div x-data="{ show: $persist(false) }">
            <button @click="show = true"></button>

            <template x-if="show">
                <span>Foo</span>
            </template>
        </div>
    `],
    ({ get }, reload) => {
        get('span').should(notBeVisible())
        get('button').click()
        get('span').should(beVisible())
        reload()
        get('span').should(beVisible())
    },
)

test('can persist multiple components using the same property',
    [html`
        <div x-data="{ duplicate: $persist('foo') }">
            <button @click="duplicate = 'bar'"></button>
            <span id="one" x-text="duplicate"></span>
        </div>
        <div x-data="{ duplicate: $persist('foo') }">
            <span id="two" x-text="duplicate"></span>
        </div>
    `],
    ({ get }, reload) => {
        get('span#one').should(haveText('foo'))
        get('span#two').should(haveText('foo'))
        get('button').click()
        get('span#one').should(haveText('bar'))
        reload()
        get('span#one').should(haveText('bar'))
        get('span#two').should(haveText('bar'))
    },
)
