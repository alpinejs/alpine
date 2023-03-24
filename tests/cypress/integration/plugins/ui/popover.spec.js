import { beVisible, haveAttribute, html, notBeVisible, notHaveAttribute, test } from '../../../utils'

test('button toggles panel',
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

test('popover can be rendered statically',
    [html`
        <div x-data x-popover>
            <button x-popover:button>Toggle</button>

            <ul x-popover:panel static>
                Dialog Contents!
            </ul>
        </div>
    `],
    ({ get }) => {
        get('ul').should(beVisible())
        get('button').click()
        get('ul').should(beVisible())
    },
)

test('has accessibility attributes',
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

test('escape closes panel',
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

test('clicking outside closes panel',
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

test('focusing away closes panel',
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

test('focusing away doesnt close panel if focusing inside a group',
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

test.retry(5)('focusing away still closes panel inside a group if the focus attribute is present',
    [html`
        <div x-data>
            <div x-popover:group>
                <div x-data x-popover id="1">
                    <button x-popover:button>Toggle 1</button>
                    <ul x-popover:panel focus>
                        <a href="#">Dialog 1 Contents!</a>
                    </ul>
                </div>
                <div x-data x-popover id="2">
                    <button x-popover:button>Toggle 2</button>
                    <ul x-popover:panel>
                        <a href="#">Dialog 2 Contents!</a>
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
        get('#1 ul').should(notBeVisible())
        get('#2 ul').should(notBeVisible())
    },
)
