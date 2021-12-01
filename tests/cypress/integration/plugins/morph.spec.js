import { haveText, html, test } from '../../utils'

test('can morph components and preserve Alpine state',
    [html`
        <div x-data="{ foo: 'bar' }">
            <button @click="foo = 'baz'">Change Foo</button>
            <span x-text="foo"></span>
        </div>
    `],
    ({ get }, reload, window, document) => {
        let toHtml = document.querySelector('div').outerHTML

        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('baz'))

        get('div').then(([el]) => window.Alpine.morph(el, toHtml))

        get('span').should(haveText('baz'))
    },
)

test('morphing target uses outer Alpine scope',
    [html`
        <article x-data="{ foo: 'bar' }">
            <div>
                <button @click="foo = 'baz'">Change Foo</button>
                <span x-text="foo"></span>
            </div>
        </article>
    `],
    ({ get }, reload, window, document) => {
        let toHtml = document.querySelector('div').outerHTML

        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('baz'))

        get('div').then(([el]) => window.Alpine.morph(el, toHtml))

        get('span').should(haveText('baz'))
    },
)

test('can morph with HTML change and preserve Alpine state',
    [html`
        <div x-data="{ foo: 'bar' }">
            <button @click="foo = 'baz'">Change Foo</button>
            <span x-text="foo"></span>
        </div>
    `],
    ({ get }, reload, window, document) => {
        let toHtml = document.querySelector('div').outerHTML.replace('Change Foo', 'Changed Foo')

        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('baz'))
        get('button').should(haveText('Change Foo'))

        get('div').then(([el]) => window.Alpine.morph(el, toHtml))

        get('span').should(haveText('baz'))
        get('button').should(haveText('Changed Foo'))
    },
)

test('morphing an element with multiple nested Alpine components preserves scope',
    [html`
        <div x-data="{ foo: 'bar' }">
            <button @click="foo = 'baz'">Change Foo</button>
            <span x-text="foo"></span>

            <div x-data="{ bob: 'lob' }">
                <a href="#" @click.prevent="bob = 'law'">Change Bob</a>
                <h1 x-text="bob"></h1>
            </div>
        </div>
    `],
    ({ get }, reload, window, document) => {
        let toHtml = document.querySelector('div').outerHTML

        get('span').should(haveText('bar'))
        get('h1').should(haveText('lob'))
        get('button').click()
        get('a').click()
        get('span').should(haveText('baz'))
        get('h1').should(haveText('law'))

        get('div').then(([el]) => window.Alpine.morph(el, toHtml))

        get('span').should(haveText('baz'))
        get('h1').should(haveText('law'))
    },
)

test('can morph teleports',
    [html`
        <div x-data="{ count: 1 }" id="a">
            <button @click="count++">Inc</button>

            <template x-teleport="#b">
                <div>
                    <h1 x-text="count"></h1>
                    <h2>hey</h2>
                </div>
            </template>
        </div>

        <div id="b"></div>
    `],
    ({ get }, reload, window, document) => {
        let toHtml = html`
        <div x-data="{ count: 1 }" id="a">
            <button @click="count++">Inc</button>

            <template x-teleport="#b">
                <div>
                    <h1 x-text="count"></h1>
                    <h2>there</h2>
                </div>
            </template>
        </div>
        `
        get('h1').should(haveText('1'))
        get('h2').should(haveText('hey'))
        get('button').click()
        get('h1').should(haveText('2'))
        get('h2').should(haveText('hey'))

        get('div#a').then(([el]) => window.Alpine.morph(el, toHtml))

        get('h1').should(haveText('2'))
        get('h2').should(haveText('there'))
    },
)
