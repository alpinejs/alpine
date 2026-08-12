import { beEqualTo, exist, haveText, html, notExist, test } from '../../utils'

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
        get('span').should(notExist())
        get('button').click()
        get('span').should(exist())
        reload()
        get('span').should(exist())
    },
)

test('does not persist undefined values',
    [html`
        <div x-data="{ foo: $persist('bar').as('no-undefined') }">
            <button @click="foo = undefined"></button>
            <span x-text="foo === undefined ? 'undefined' : foo"></span>
        </div>
    `],
    ({ get, window }, reload) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('undefined'))
        window().then((win) => {
            expect(win.localStorage.getItem('no-undefined')).to.equal(null)
        })
        reload()
        get('span').should(haveText('bar'))
    },
)

test('does not write undefined values to custom storage without removeItem',
    [html`
        <div x-data="{ foo: $persist('bar').as('custom-undefined').using(window.customStorage) }">
            <button @click="foo = undefined"></button>
            <span x-text="foo === undefined ? 'undefined' : foo"></span>
        </div>
    `, `
        window.customStorage = {
            values: {},
            writes: {},
            getItem(key) { return this.values[key] ?? null },
            setItem(key, value) { this.values[key] = value; this.writes[key] = (this.writes[key] || 0) + 1 },
        }
    `],
    ({ get, window }) => {
        get('span').should(haveText('bar'))
        window().then((win) => {
            win.customStorage.writes['custom-undefined'] = 0
        })
        get('button').click()
        get('span').should(haveText('undefined'))
        window().then((win) => {
            expect(win.customStorage.writes['custom-undefined']).to.equal(0)
        })
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
        get('span#one').should(notExist())
        get('span#two').should(notExist())
        get('button').click()
        get('span#one').should(notExist())
        get('span#two').should(exist())
        reload()
        get('span#one').should(notExist())
        get('span#two').should(exist())
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
        get('span#one').should(notExist())
        get('span#two').should(notExist())
        get('button').click()
        get('span#one').should(notExist())
        get('span#two').should(exist())
        reload()
        get('span#one').should(notExist())
        get('span#two').should(exist())
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

test('can persist a primitive as a direct Alpine store',
    [html`
        <div x-data>
            <button @click="$store.language = $store.language === 'EN' ? 'IT' : 'EN'"></button>
            <span x-text="$store.language"></span>
        </div>
    `, `
        Alpine.store('language', Alpine.$persist('EN').as('direct-store-language'))
    `],
    ({ get, window }, reload) => {
        get('span').should(haveText('EN'))
        get('button').click()
        get('span').should(haveText('IT'))
        window().its('localStorage.direct-store-language').should(beEqualTo(JSON.stringify('IT')))
        reload()
        get('span').should(haveText('IT'))
    },
)

test('persist in Stores is available in init call',
    [html`
        <div x-data>
            <span x-text="$store.name.name"></span>
        </div>
    `, `
        Alpine.store('name', {
            firstName: Alpine.$persist('Daniel').as('dev-name'),
            name: null,
            init() {
                this.name = String(this.firstName)
            }
        })
    `],
    ({ get }) => {
        get('span').should(haveText('Daniel'))
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

test('x-data replacement initializes new persisted properties',
    [html`
        <div id="component" x-data="{
            count: $persist(1).as('count').using(window.persistStorage),
        }">
            <span x-text="count"></span>
        </div>
    `, `
        window.persistStorage = {
            values: {},
            getItem(key) { return this.values[key] ?? null },
            setItem(key, value) { this.values[key] = value },
        }
    `],
    ({ get }, reload, window) => {
        get('#component').then(([el]) => {
            window.Alpine.$data(el).count = 2
        })

        get('span').should(haveText('2'))

        get('#component').then(([el]) => {
            el.setAttribute('x-data', `{
                count: $persist(0).as('count').using(window.persistStorage),
                message: $persist('hello').as('message').using(window.persistStorage),
            }`)
        })

        get('#component').should(([el]) => {
            let data = window.Alpine.$data(el)

            expect(data.count).to.equal(2)
            expect(data.message).to.equal('hello')
        })

        get('#component').then(([el]) => {
            let data = window.Alpine.$data(el)

            data.count = 3
            data.message = 'goodbye'
        })

        get('#component').should(() => {
            expect(window.persistStorage.values.count).to.equal(JSON.stringify(3))
            expect(window.persistStorage.values.message).to.equal(JSON.stringify('goodbye'))
        })
    },
)

test('x-data replacement releases previous persistence effects',
    [html`
        <div id="component" x-data="{
            count: $persist(1).as('count').using(window.persistStorage),
        }">
            <span x-text="count"></span>
        </div>
    `, `
        window.persistStorage = {
            values: {},
            writes: {},
            getItem(key) { return this.values[key] ?? null },
            setItem(key, value) {
                this.values[key] = value
                this.writes[key] = (this.writes[key] || 0) + 1
            },
        }
    `],
    ({ get }, reload, window) => {
        let replacePersistedCount = version => {
            get('#component').then(([el]) => {
                el.setAttribute('x-data', `{
                    version: ${version},
                    count: $persist(${version}).as('count').using(window.persistStorage),
                }`)
            })

            get('#component').should(([el]) => {
                expect(window.Alpine.$data(el).version).to.equal(version)
            })
        }

        replacePersistedCount(2)
        replacePersistedCount(3)

        get('#component').then(([el]) => {
            window.persistStorage.writes.count = 0
            window.Alpine.$data(el).count = 4
        })

        get('#component').should(() => {
            expect(window.persistStorage.writes.count).to.equal(1)
        })

        get('#component').then(([el]) => {
            el.setAttribute('x-data', '{ count: 5 }')
        })

        get('#component').should(([el]) => {
            expect(window.Alpine.$data(el).count).to.equal(5)
        })

        get('#component').then(([el]) => {
            window.persistStorage.writes.count = 0
            window.Alpine.$data(el).count = 6
        })

        get('span').should(haveText('6'))
        get('#component').should(() => {
            expect(window.persistStorage.writes.count).to.equal(0)
        })
    },
)
