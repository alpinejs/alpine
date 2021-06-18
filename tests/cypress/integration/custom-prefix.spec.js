import { haveText, html, test } from '../utils'

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
