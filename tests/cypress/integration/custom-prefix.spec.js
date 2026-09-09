import { haveAttribute, haveText, html, test } from '../utils'

test('can set a custom x- prefix',
    html`
        <script>
            document.addEventListener('alpine:init', () => {
                Alpine.prefix('data-x-')
            })
        </script>

        <div data-x-data="{ foo: 'bar' }">
            <span data-x-text="foo"></span>
        </div>
    `,
    ({ get }) => get('span').should(haveText('bar'))
)

test('can set a custom value operator',
    html`
        <script>
            document.addEventListener('alpine:init', () => {
                Alpine.useValueOperator('--value--')
            })
        </script>

        <div x-data="{ foo: 'bar' }">
            <button x-on--value--click="foo = 'baz'"></button>

            <span x-bind--value--foo="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveAttribute('foo', 'bar'))
        get('button').click()
        get('span').should(haveAttribute('foo', 'baz'))
    }
)
