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
