import { haveText, html, test, haveAttribute } from '../utils'

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


test('can still bind standard attributes with object syntax',
    html`
        <script>
            document.addEventListener('alpine:init', () => {
                Alpine.prefix('data-x-')
            })
        </script>
        <span data-x-data data-x-bind="{ foo: 'bar' }"></span>
    `,
    ({ get }) => {
        get('span').should(haveAttribute('foo', 'bar'))
    }
)
