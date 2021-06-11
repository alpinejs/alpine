import { haveText, html, test } from '../utils'

test('can register custom magic properties',
    html`
        <script>
            document.addEventListener('alpine:initializing', () => {
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
