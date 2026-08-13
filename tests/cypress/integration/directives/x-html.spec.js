import { haveText, notHaveText, html, test } from '../../utils'

test('sets html on init',
    html`
        <div x-data="{ foo: '<h1>hey</h1>' }">
            <span x-html="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveText('hey'))
    }
)

test('sets html on update',
    html`
        <div x-data="{ foo: '' }">
            <button x-on:click="foo = '<h1>hey</h1>'">Show "bar"</button>

            <span x-html="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(notHaveText('hey'))
        get('button').click()
        get('h1').should(haveText('hey'))
    }
)

test('x-html allows alpine code within',
    html`
        <div x-data="{ foo: '<h1  x-text=&quot;bar&quot;></h1>', bar: 'baz' }" x-html="foo"></div>
    `,
    ({ get }) => {
        get('h1').should(haveText('baz'))
    }
)

test('x-html runs even after x-if or x-for',
    html`
        <div x-data="{ html: '<span x-text=&quot;foo&quot;></span>', foo: 'bar' }">
            <template x-if="true">
                <h1>yoyoyo</h1>
            </template>

            <div x-html="html"></div>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
    }
)

test('x-html removes a nested x-for before the loop evaluates invalidated state',
    html`
        <div x-data="{
            user: { items: ['one', 'two'] },
            content: '<template x-for=&quot;item in user.items&quot; :key=&quot;item&quot;><span x-text=&quot;item&quot;></span></template>',
        }">
            <button @click="user = null">Clear</button>
            <div x-html="user ? content : ''"></div>
        </div>
    `,
    ({ get }) => {
        get('span').should('have.length', 2)
        get('button').click()
        get('span').should('not.exist')
    }
)

test('x-html destroys the replaced Alpine tree exactly once',
    [html`
        <div x-data="{ content: '<div id=&quot;child&quot; x-data=&quot;child&quot;></div>' }">
            <button @click="content = ''">Clear</button>
            <div x-html="content"></div>
        </div>
    `, `
        window.destroyCount = 0

        Alpine.data('child', () => ({
            destroy() { window.destroyCount++ },
        }))
    `],
    ({ get, window }) => {
        get('#child').should('exist')
        get('button').click()
        get('#child').should('not.exist')
        window().its('destroyCount').should('equal', 1)
    }
)

test('x-html sets HTML to a blank string when value is `null`',
    html`
        <div x-data="{ html: null }">
            <span x-html="html">original HTML</span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText(''))
    }
)

test('x-html sets HTML to a blank string when value is `undefined`',
    html`
        <div x-data="{ html: undefined }">
            <span x-html="html">original HTML</span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText(''))
    }
)
