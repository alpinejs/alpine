import { haveAttribute, haveComputedStyle, html, notHaveAttribute, test } from '../../utils'

test('can anchor an element',
    [html`
        <div x-data>
            <button x-ref="foo">toggle</button>
            <h1 x-anchor="$refs.foo">contents</h1>
        </div>
    `],
    ({ get }, reload) => {
        get('h1').should(haveComputedStyle('position', 'absolute'))
    },
)
