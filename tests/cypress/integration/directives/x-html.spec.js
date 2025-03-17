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

test('x-html ignores nullish values when requested',
    html`
        <div x-data="{ html: '<span x-text=&quot;foo&quot;></span>', foo: 'bar', baz: 'quux', nullishHtml: null }">
            <header x-html.ignore-nullish="html"></header>
            <section x-html.ignore-nullish="nullishHtml">original html</section>

            <button x-on:click="(html = null) || (nullishHtml = '<h3 x-text=&quot;baz&quot;></h3>')"
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('section').should(haveText('original html'))

        get('button').click()

        get('span').should(haveText('bar'))
        get('h3').should(haveText('quux'))
    }
)
