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

test('noflip modifier prevents automatic flipping',
    [html`
        <div x-data style="height: 100vh; display: flex; align-items: flex-end;">
            <button x-ref="foo" style="margin-top: auto;">toggle</button>
            <div x-anchor.bottom.noflip="$refs.foo" id="anchored">dropdown</div>
        </div>
    `],
    ({ get }, reload) => {
        get('#anchored').should(haveComputedStyle('position', 'absolute'))

        // The element should be positioned below the button (bottom placement)
        // even though there's no room — noflip prevents it from flipping to top
        get('button').then(($btn) => {
            let btnBottom = $btn[0].getBoundingClientRect().bottom

            get('#anchored').then(($el) => {
                let elTop = $el[0].getBoundingClientRect().top
                expect(elTop).to.be.gte(btnBottom - 1)
            })
        })
    },
)
