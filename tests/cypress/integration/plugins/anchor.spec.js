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

test('can anchor to dynamic reference',
    [html`
        <div x-data="{ reference: null }" x-init="reference = document.getElementById('foo')">
            <button id="foo">toggle foo</button>
            <button id="bar" @click="reference = $el">toggle bar</button>
            <h1 id="baz" x-anchor="reference">contents</h1>
        </div>
    `],
    ({ get }) => {
        let originalLeft

        get('#baz').then($el => {
            originalLeft = $el[0].style.left
        })

        get('#bar').click()

        get('#baz').should($el => {
            expect($el[0].style.left).not.to.eq(originalLeft)
        })
    }
)
