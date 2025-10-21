import { haveText, html, notHaveText, test } from '../../utils'

test('sets text on init',
    html`
        <div x-data="{ foo: 'bar' }">
            <span x-text="foo"></span>
        </div>
    `,
    ({ get }) => { get('span').should(haveText('bar')) }
)

test('sets text on update',
    html`
        <div x-data="{ foo: '' }">
            <button x-on:click="foo = 'bar'">Show "bar"</button>

            <span x-text="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(notHaveText('bar'))
        get('button').click()
        get('span').should(haveText('bar'))
    }
)

test('sets text on SVG elements',
    html`
        <div x-data="{ foo: 'bar' }">
            <svg viewBox="0 0 240 80">
                <text x="30" y="50" x-text="foo"></text>
            </svg>
        </div>
    `,
    ({ get }) => get('svg text').should(haveText('bar'))
)

test('ignores nullish values when requested',
    html`
        <div x-data="{ foo: null, baz: 'quux' }">
            <button x-on:click="(foo = 'bar') && (baz = null)">Show "bar"</button>

            <span x-text.ignore-nullish="foo">not set yet</span>
            <section x-text.ignore-nullish="baz">not set yet</section>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('not set yet'))
        get('section').should(haveText('quux'))
        get('button').click()
        get('span').should(haveText('bar'))
        get('section').should(haveText('quux'))
    }
)