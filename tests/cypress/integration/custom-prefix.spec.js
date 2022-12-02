import { haveText, html, test, haveAttribute, haveClasses } from '../utils'

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

test('binding still supports short syntax',
    html`
        <script>
            document.addEventListener('alpine:init', () => {
                Alpine.prefix('data-x-')
            })
        </script>
        <div data-x-data="{ foo: 'bar' }">
            <span :class="foo"></span>
        </div>
    `,
    ({ get }) => get('span').should(haveClasses(['bar']))
)

test('on still supports short syntax',
    html`
        <script>
            document.addEventListener('alpine:init', () => {
                Alpine.prefix('data-x-')
            })
        </script>
        <div data-x-data="{ foo: 'bar' }">
            <button @click="foo = 'baz'"></button>

            <span data-x-bind:foo="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveAttribute('foo', 'bar'))
        get('button').click()
        get('span').should(haveAttribute('foo', 'baz'))
    }
)
