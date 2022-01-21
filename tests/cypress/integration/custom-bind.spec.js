import { haveText, html, test } from '../utils'

test('can register custom bind object',
    html`
        <script>
            document.addEventListener('alpine:init', () => {
                Alpine.bind('Foo', {
                    'x-init'() { this.$el.innerText = 'bar' },
                })
            })
        </script>

        <div x-data x-bind="Foo"></div>
    `,
    ({ get }) => get('div').should(haveText('bar'))
)

test('can register custom bind as function',
    html`
        <script>
            document.addEventListener('alpine:init', () => {
                Alpine.bind('Foo', () => ({
                    'x-init'() { this.$el.innerText = 'bar' },
                }))
            })
        </script>

        <div x-data x-bind="Foo"></div>
    `,
    ({ get }) => get('div').should(haveText('bar'))
)

test('can consume custom bind as function',
    html`
        <script>
            document.addEventListener('alpine:init', () => {
                Alpine.bind('Foo', (subject) => ({
                    'x-init'() { this.$el.innerText = subject },
                }))
            })
        </script>

        <div x-data x-bind="Foo('bar')"></div>
    `,
    ({ get }) => get('div').should(haveText('bar'))
)
