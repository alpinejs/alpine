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

test('fixed modifier applies position: fixed',
    [html`
        <div x-data>
            <button x-ref="foo">toggle</button>
            <h1 x-anchor.fixed="$refs.foo" id="anchored">contents</h1>
        </div>
    `],
    ({ get }) => {
        get('#anchored').should(haveComputedStyle('position', 'fixed'))
    },
)

test('absence of fixed modifier keeps default position: absolute',
    [html`
        <div x-data>
            <button x-ref="foo">toggle</button>
            <h1 x-anchor.bottom="$refs.foo" id="anchored">contents</h1>
        </div>
    `],
    ({ get }) => {
        get('#anchored').should(haveComputedStyle('position', 'absolute'))
    },
)

test('fixed modifier order is interchangeable with placement modifiers',
    [html`
        <div x-data>
            <button x-ref="foo">toggle</button>
            <div x-anchor.bottom.fixed="$refs.foo" id="a">a</div>
            <div x-anchor.fixed.bottom="$refs.foo" id="b">b</div>
        </div>
    `],
    ({ get }) => {
        get('#a').should(haveComputedStyle('position', 'fixed'))
        get('#b').should(haveComputedStyle('position', 'fixed'))
    },
)

test('fixed modifier still anchors when reference is inside a clipping parent',
    [html`
        <div x-data>
            <div id="clip" style="position: relative; overflow: hidden; width: 150px; height: 40px;">
                <button x-ref="foo" style="margin: 10px;">toggle</button>
            </div>
            <div x-anchor.fixed.bottom="$refs.foo" id="fixed-pop">fixed popover</div>
        </div>
    `],
    ({ get }) => {
        // With absolute strategy, the popover's offsetParent would be the
        // clipping container (once it has position:relative), and overflow:
        // hidden would cut it off. With the fixed strategy this PR adds,
        // the popover's containing block is the viewport instead, so it
        // escapes the clip.
        get('#fixed-pop').should(haveComputedStyle('position', 'fixed'))

        // And the popover should still be horizontally overlapping the button
        // (it's anchored to it regardless of clipping).
        get('button').then(($btn) => {
            let btnRect = $btn[0].getBoundingClientRect()
            get('#fixed-pop').then(($el) => {
                let popRect = $el[0].getBoundingClientRect()
                expect(popRect.left).to.be.lessThan(btnRect.right)
                expect(popRect.right).to.be.greaterThan(btnRect.left)
            })
        })
    },
)

test('fixed strategy survives a morph (clone branch re-applies strategy)',
    [html`
        <div id="wrap" x-data>
            <button x-ref="foo">toggle</button>
            <div x-anchor.fixed.bottom="$refs.foo" id="anchored">contents</div>
        </div>
    `],
    ({ get }, reload, window, document) => {
        get('#anchored').should(haveComputedStyle('position', 'fixed'))

        // Morph the wrapper back into itself. This runs x-anchor's clone
        // branch, which must re-apply position: fixed (not fall back to
        // the hardcoded absolute that existed before this change).
        let toHtml = document.querySelector('#wrap').outerHTML

        get('#wrap').then(([el]) => window.Alpine.morph(el, toHtml))

        get('#anchored').should(haveComputedStyle('position', 'fixed'))
    },
)
