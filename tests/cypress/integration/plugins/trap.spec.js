import { haveText, test, html, haveFocus } from '../../utils'

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
        <script>
            function triggerClone() {
                var original = document.getElementById('foo')
                var copy = original.cloneNode(true)
                Alpine.clone(original, copy)
                let p = document.createElement("p")
                p.textContent = 'bar'
                copy.appendChild(p)
                original.parentNode.replaceChild(copy, original)
            }
        </script>
        <div id="foo" x-data="{ open: false }">
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
