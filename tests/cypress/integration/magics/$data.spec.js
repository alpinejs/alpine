import { haveText, html, test } from '../../utils'

test('$data returns the current scope (with cascading)',
    html`
        <div x-data="{ foo: 'bar'}">
            <div x-data="{ bob: 'lob' }">
                <span x-text="$data.foo + ' ' + $data.bob"></span>
            </div>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar lob'))
    }
)
