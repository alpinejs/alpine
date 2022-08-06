import { beVisible, haveAttribute, html, notBeVisible, notHaveAttribute, test } from '../../../utils'

test.skip('button toggles panel',
    [html`
        <div x-data x-popover>
            <button x-popover:button>Toggle</button>

            <ul x-popover:panel>
                Dialog Contents!
            </ul>
        </div>
    `],
    ({ get }) => {
        get('ul').should(notBeVisible())
        get('button').click()
        get('ul').should(beVisible())
        get('button').click()
        get('ul').should(notBeVisible())
    },
)

test.skip('has accessibility attributes',
    [html`
        <div x-data x-popover>
            <button x-popover:button>Toggle</button>

            <ul x-popover:panel>
                Dialog Contents!
            </ul>
        </div>
    `],
    ({ get }) => {
        get('button').should(haveAttribute('aria-expanded', 'false'))
        get('button').should(notHaveAttribute('aria-controls'))
        get('button').click()
        get('button').should(haveAttribute('aria-expanded', 'true'))
        get('button').should(haveAttribute('aria-controls', 'alpine-popover-panel-1'))
    },
)

test.skip('escape closes panel',
    [html`
        <div x-data x-popover>
            <button x-popover:button>Toggle</button>

            <ul x-popover:panel>
                Dialog Contents!
            </ul>
        </div>
    `],
    ({ get }) => {
        get('ul').should(notBeVisible())
        get('button').click()
        get('ul').should(beVisible())
        get('body').type('{esc}')
        get('ul').should(notBeVisible())
    },
)

test.skip('clicking outside closes panel',
    [html`
        <div>
            <div x-data x-popover>
                <button x-popover:button>Toggle</button>

                <ul x-popover:panel>
                    Dialog Contents!
                </ul>
            </div>

            <h1>Click away to me</h1>
        </div>
    `],
    ({ get }) => {
        get('ul').should(notBeVisible())
        get('button').click()
        get('ul').should(beVisible())
        get('h1').click()
        get('ul').should(notBeVisible())
    },
)

test.skip('focusing away closes panel',
    [html`
        <div>
            <div x-data x-popover>
                <button x-popover:button>Toggle</button>

                <ul x-popover:panel>
                    Dialog Contents!
                </ul>
            </div>

            <a href="#">Focus Me</a>
        </div>
    `],
    ({ get }) => {
        get('ul').should(notBeVisible())
        get('button').click()
        get('ul').should(beVisible())
        cy.focused().tab()
        get('ul').should(notBeVisible())
    },
)

test.skip('focusing away doesnt close panel if focusing inside a group',
    [html`
        <div x-data>
            <div x-popover:group>
                <div x-data x-popover id="1">
                    <button x-popover:button>Toggle 1</button>
                    <ul x-popover:panel>
                        Dialog 1 Contents!
                    </ul>
                </div>
                <div x-data x-popover id="2">
                    <button x-popover:button>Toggle 2</button>
                    <ul x-popover:panel>
                        Dialog 2 Contents!
                    </ul>
                </div>
            </div>

            <a href="#">Focus Me</a>
        </div>
    `],
    ({ get }) => {
        get('#1 ul').should(notBeVisible())
        get('#2 ul').should(notBeVisible())
        get('#1 button').click()
        get('#1 ul').should(beVisible())
        get('#2 ul').should(notBeVisible())
        cy.focused().tab()
        get('#1 ul').should(beVisible())
        get('#2 ul').should(notBeVisible())
        cy.focused().tab()
        get('#1 ul').should(notBeVisible())
        get('#2 ul').should(notBeVisible())
    },
)
