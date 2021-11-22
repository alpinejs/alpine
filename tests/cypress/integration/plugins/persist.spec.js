import { beEqualTo, beVisible, haveText, html, notBeVisible, test } from '../../utils'

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

test('can persist using an alias',
    [html`
        <div x-data="{ show: $persist(false) }">
            <template x-if="show">
                <span id="one">Foo</span>
            </template>
        </div>
        <div x-data="{ show: $persist(false).as('foo') }">
            <button id="test" @click="show = true"></button>

            <template x-if="show">
                <span id="two">Foo</span>
            </template>
        </div>
    `],
    ({ get }, reload) => {
        get('span#one').should(notBeVisible())
        get('span#two').should(notBeVisible())
        get('button').click()
        get('span#one').should(notBeVisible())
        get('span#two').should(beVisible())
        reload()
        get('span#one').should(notBeVisible())
        get('span#two').should(beVisible())
    },
)

test('aliases do not affect other $persist calls',
    [html`
        <div x-data="{ show: $persist(false).as('foo') }">
            <button id="test" @click="show = true"></button>

            <template x-if="show">
                <span id="two">Foo</span>
            </template>
        </div>
        <div x-data="{ open: $persist(false) }">
            <template x-if="open">
                <span id="one">Foo</span>
            </template>
        </div>
    `],
    ({ get }, reload) => {
        get('span#one').should(notBeVisible())
        get('span#two').should(notBeVisible())
        get('button').click()
        get('span#one').should(notBeVisible())
        get('span#two').should(beVisible())
        reload()
        get('span#one').should(notBeVisible())
        get('span#two').should(beVisible())
    },
)

test('can persist to custom storage',
    [html`
        <div x-data="{ message: $persist('foo').using(sessionStorage) }">
            <input x-model="message">

            <span x-text="message"></span>
        </div>
    `],
    ({ get, window }, reload) => {
        get('span').should(haveText('foo'))
        get('input').clear().type('bar')
        get('span').should(haveText('bar'))
        reload()
        get('span').should(haveText('bar'))
        window().its('sessionStorage._x_message').should(beEqualTo(JSON.stringify('bar')))
        window().then((win) => {
            win.sessionStorage.clear()
        });
    },
)

test('can persist to custom storage using an alias',
    [html`
        <div x-data="{ message: $persist('foo').as('mymessage').using(sessionStorage) }">
            <input x-model="message">

            <span x-text="message"></span>
        </div>
    `],
    ({ get, window }, reload) => {
        get('span').should(haveText('foo'))
        get('input').clear().type('bar')
        get('span').should(haveText('bar'))
        window().its('sessionStorage.mymessage').should(beEqualTo(JSON.stringify('bar')))
        window().then((win) => {
            win.sessionStorage.clear()
        });
    },
)

test('can persist using global Alpine.$persist within Alpine.store',
    [html`
        <div x-data>
            <input x-model="$store.name.firstName">

            <span x-text="$store.name.firstName"></span>
        </div>
    `, `
        Alpine.store('name', {
            firstName: Alpine.$persist('Daniel').as('dev-name')
        })
    `],
    ({ get, window }, reload) => {
        get('span').should(haveText('Daniel'))
        get('input').clear().type('Malcolm')
        get('span').should(haveText('Malcolm'))
        reload()
        get('span').should(haveText('Malcolm'))
    },
)

test('multiple aliases work when using global Alpine.$persist',
    [html`
        <div x-data>
            <input x-model="$store.name.firstName">

            <span x-text="$store.name.firstName"></span>
            <p x-text="$store.name.lastName"></p>
        </div>
    `, `
        Alpine.store('name', {
            firstName: Alpine.$persist('John').as('first-name'),
            lastName: Alpine.$persist('Doe').as('name-name')
        })
    `],
    ({ get, window }, reload) => {
        get('span').should(haveText('John'))
        get('p').should(haveText('Doe'))
        get('input').clear().type('Joe')
        get('span').should(haveText('Joe'))
        get('p').should(haveText('Doe'))
        reload()
        get('span').should(haveText('Joe'))
        get('p').should(haveText('Doe'))
    },
)
