import { haveText, html, test } from '../utils'

test('can register custom data providers',
    html`
        <script>
            document.addEventListener('alpine:init', () => {
                Alpine.data('test', () => ({
                    foo: 'bar'
                }))
            })
        </script>

        <div x-data="test">
            <span x-text="foo"></span>
        </div>
    `,
    ({ get }) => get('span').should(haveText('bar'))
)

test('init functions inside custom datas are called automatically',
    html`
        <script>
            document.addEventListener('alpine:init', () => {
                Alpine.data('test', () => ({
                    init() {
                        this.foo = 'baz'
                    },

                    foo: 'bar'
                }))
            })
        </script>

        <div x-data="test">
            <span x-text="foo"></span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('baz'))
    }
)

test('init functions "this" context is reactive',
    html`
        <script>
            document.addEventListener('alpine:init', () => {
                Alpine.data('test', () => ({
                    init() {
                        window.addEventListener('click', () => {
                            this.foo = 'baz'
                        })
                    },

                    foo: 'bar'
                }))
            })
        </script>

        <div x-data="test">
            <span x-text="foo"></span>

            <button>click me</button>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('baz'))
    }
)
