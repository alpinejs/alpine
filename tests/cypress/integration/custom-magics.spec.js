import { haveText, html, test } from '../utils'

test('can register custom magic properties',
    html`
        <script>
            document.addEventListener('alpine:init', () => {
                Alpine.magic('foo', (el) => {
                    return { bar: 'baz' }
                })
            })
        </script>

        <div x-data>
            <span x-text="$foo.bar"></span>
        </div>
    `,
    ({ get }) => get('span').should(haveText('baz'))
)

test('magics are lazily accessed',
    html`
        <script>
            window.hasBeenAccessed = false

            document.addEventListener('alpine:init', () => {
                Alpine.magic('foo', (el) => {
                    window.hasBeenAccessed = true
                })
            })
        </script>

        <div x-data>
            <button @click="$el.textContent = window.hasBeenAccessed">clickme</button>
        </div>
    `,
    ({ get }) => {
        get('button').click()
        get('button').should(haveText('false'))
    }
)
