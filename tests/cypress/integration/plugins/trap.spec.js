import { haveText, test, html, haveFocus } from '../../utils'

test('can trap focus',
    [html`
        <div x-data="{ open: false }" @keydown.shift.prevent="open = ! open">
            <input type="text" id="1">
            <button @click="open = true">Inc</button>

            <div x-trap="open">
                <input type="text" id="2">
            </div>
        </div>
    `],
    ({ get }, reload) => {
        get('#1').click()
        get('#1').should(haveFocus())
        get('#1').type('{shift}')
        get('#2').should(haveFocus())
        cy.focused().tab()
        get('#2').should(haveFocus())
        get('#2').type('{shift}')
        get('#1').should(haveFocus())
        cy.focused().tab()
        cy.focused().tab()
        get('#2').should(haveFocus())
    },
)
