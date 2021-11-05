import { haveText, test, html, haveFocus, notHaveAttribute, haveAttribute } from '../../utils'

test('can trap focus',
    [html`
        <div x-data="{ open: false }">
            <input type="text" id="1">
            <button id="2" @click="open = true">open</button>
            <div>
                <div x-trap="open">
                    <input type="text" id="3">
                    <button @click="open = false" id="4">close</button>
                </div>
            </div>
        </div>
    `],
    ({ get }, reload) => {
        get('#1').click()
        get('#1').should(haveFocus())
        get('#2').click()
        get('#3').should(haveFocus())
        cy.focused().tab()
        get('#4').should(haveFocus())
        cy.focused().tab()
        get('#3').should(haveFocus())
        cy.focused().tab({shift: true})
        get('#4').should(haveFocus())
        cy.focused().click()
        get('#2').should(haveFocus())
    },
)

test('works with clone',
    [html`
        <div id="foo" x-data="{
            open: false,
            triggerClone() {
                var original = document.getElementById('foo');
                var copy = original.cloneNode(true);
                Alpine.clone(original, copy);
                var p = document.createElement('p');
                p.textContent = 'bar';
                copy.appendChild(p);
                original.parentNode.replaceChild(copy, original);
            }
        }">
            <button id="one" @click="open = true">Trap</button>
            <div x-trap="open">
                <input type="text">
                <button id="two" @click="triggerClone()">Test</button>
            </div>
        </div>
    `],
    ({ get, wait }, reload) => {
        get('#one').click()
        get('#two').click()
        get('p').should(haveText('bar'))
    }
)

test('can trap focus with inert',
    [html`
        <div x-data="{ open: false }">
            <h1>I should have aria-hidden when outside trap</h1>

            <button id="open" @click="open = true">open</button>

            <div x-trap.inert="open">
                <button @click="open = false" id="close">close</button>
            </div>
        </div>
    `],
    ({ get }, reload) => {
        get('#open').should(notHaveAttribute('aria-hidden', 'true'))
        get('#open').click()
        get('#open').should(haveAttribute('aria-hidden', 'true'))
        get('#close').click()
        get('#open').should(notHaveAttribute('aria-hidden', 'true'))
    },
)

test('can trap focus with noscroll',
    [html`
        <div x-data="{ open: false }">
            <button id="open" @click="open = true">open</button>

            <div x-trap.noscroll="open">
                <button @click="open = false" id="close">close</button>
            </div>

            <div style="height: 100vh">&nbsp;</div>
        </div>
    `],
    ({ get, window }, reload) => {
        window().then((win) => {
            let scrollbarWidth = win.innerWidth - win.document.documentElement.clientWidth
            get('#open').click()
            get('html').should(haveAttribute('style', `overflow: hidden; padding-right: ${scrollbarWidth}px;`))
            get('#close').click()
            get('html').should(notHaveAttribute('style', `overflow: hidden; padding-right: ${scrollbarWidth}px;`))
        })
    },
)
