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
