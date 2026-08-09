import { haveText, html, test } from '../../utils'

test('x-data attribute value is optional',
    html`
        <div x-data>
            <span x-text="'foo'"></span>
        </div>
    `,
    ({ get }) => get('span').should(haveText('foo'))
)

test('x-data can be nested',
    html`
        <div x-data="{ foo: 'bar', bar: 'baz' }">
            <div x-data="{ bar: 'bob' }">
                <h1 x-text="foo"></h1>
                <h2 x-text="bar"></h2>
                <button id="inner" @click="foo = 'bob'; bar = 'lob'">click</button>
            </div>

            <h3 x-text="foo"></h3>
            <h4 x-text="bar"></h4>
            <button id="outer" @click="foo = 'law'; bar = 'blog'">click</button>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveText('bar'))
        get('h2').should(haveText('bob'))
        get('h3').should(haveText('bar'))
        get('h4').should(haveText('baz'))

        get('button#inner').click()
        get('h1').should(haveText('bob'))
        get('h2').should(haveText('lob'))
        get('h3').should(haveText('bob'))
        get('h4').should(haveText('baz'))

        get('button#outer').click()
        get('h1').should(haveText('law'))
        get('h2').should(haveText('lob'))
        get('h3').should(haveText('law'))
        get('h4').should(haveText('blog'))
    }
)

test('x-data can use attributes from a reusable function',
    html`
        <script>
            window.test = () => {
                return {
                    foo: 'bar'
                }
            }
        </script>
        <div x-data="test()">
            <span x-text="foo"></span>
        </div>
    `,
    ({ get }) => get('span').should(haveText('bar'))
)

test('x-data can use $el',
    html`
        <div x-data="{ text: $el.dataset.text }" data-text="test">
            <span x-text="text"></span>
        </div>
    `,
    ({ get }) => get('span').should(haveText('test'))
)

test('functions in x-data are reactive',
    html`
        <div x-data="{ foo: 'bar', getFoo() {return this.foo}}">
            <span x-text="getFoo()"></span>
            <button x-on:click="foo = 'baz'">click me</button>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('baz'))
    }
)

test('functions in x-data have access to proper this context',
    html`
        <div x-data="{ foo: undefined, change() { this.foo = 'baz' }}" x-init="foo = 'bar'">
            <button @click="change()">change</button>
            <span x-text="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('baz'))
    }
)

test('x-data works on the html tag',
    [html`
        <div>
            <span x-text="'foo'"></span>
        </div>
    `,
    `
        document.querySelector('html').setAttribute('x-data', '')
    `],
    ({ get }) => {
        get('span').should(haveText('foo'))
    }
)

test('x-data getters have access to parent scope',
    html`
    <div x-data="{ foo: 'bar' }">
        <div x-data="{
            get bob() {
                return this.foo
            }
        }">
            <h1 x-text="bob"></h1>
        </div>
    </div>
    `,
    ({ get }) => get('h1').should(haveText('bar'))
)

test('replacing x-data keeps descendant effects bound to the same reactive object',
    html`
        <div id="component" x-data="{ version: 1, value: 'one' }">
            <span x-text="value"></span>
        </div>
    `,
    ({ get }, reload, window) => {
        get('#component').then(([el]) => {
            window.originalScope = el._x_dataStack[0]

            el.setAttribute('x-data', "{ version: 2, value: 'two' }")
        })

        get('#component').should(([el]) => {
            expect(el._x_dataStack).to.have.length(1)
            expect(el._x_dataStack[0]).to.equal(window.originalScope)
            expect(window.Alpine.$data(el).version).to.equal(2)
        })

        get('span').should(haveText('two'))

        get('#component').then(([el]) => {
            window.Alpine.$data(el).value = 'three'
        })

        get('span').should(haveText('three'))
    },
)

test('replacing x-data removes old keys and preserves property descriptors',
    html`
        <div id="component" x-data="{
            removed: true,
            value: 'one',
            get label() { return this.value },
        }">
            <span x-text="label"></span>
        </div>
    `,
    ({ get }, reload, window) => {
        get('#component').then(([el]) => {
            el.setAttribute('x-data', "{ label: 'two' }")
        })

        get('#component').should(([el]) => {
            let data = window.Alpine.$data(el)

            expect('removed' in data).to.equal(false)
            expect(data.label).to.equal('two')
        })

        get('span').should(haveText('two'))

        get('#component').then(([el]) => {
            el.setAttribute('x-data', "{ value: 'three', get label() { return this.value } }")
        })

        get('span').should(haveText('three'))
    },
)

test('multiple synchronous x-data replacements initialize only the final expression',
    html`
        <div id="component" x-data="{
            version: 1,
            init() { window.xDataInitCount = (window.xDataInitCount || 0) + 1 },
        }"></div>
    `,
    ({ get }, reload, window) => {
        get('#component').then(([el]) => {
            window.originalScope = el._x_dataStack[0]

            el.setAttribute('x-data', "{ version: 2, init() { window.xDataInitCount++ } }")
            el.setAttribute('x-data', "{ version: 3, init() { window.xDataInitCount++ } }")
        })

        get('#component').should(([el]) => {
            expect(window.Alpine.$data(el).version).to.equal(3)
            expect(el._x_dataStack).to.have.length(1)
            expect(el._x_dataStack[0]).to.equal(window.originalScope)
            expect(window.xDataInitCount).to.equal(2)
        })
    },
)

test('removing and later re-adding x-data creates a new reactive object',
    html`
        <div id="component" x-data="{
            version: 1,
            destroy() { window.xDataDestroyCount = (window.xDataDestroyCount || 0) + 1 },
        }"></div>
    `,
    ({ get }, reload, window) => {
        get('#component').then(([el]) => {
            window.originalScope = el._x_dataStack[0]
            el.removeAttribute('x-data')
        })

        get('#component').should(() => {
            expect(window.xDataDestroyCount).to.equal(1)
        })

        get('#component').then(([el]) => {
            el.setAttribute('x-data', '{ version: 2 }')
        })

        get('#component').should(([el]) => {
            expect(window.Alpine.$data(el).version).to.equal(2)
            expect(el._x_dataStack[0]).not.to.equal(window.originalScope)
        })
    },
)
