import { beVisible, haveAttribute, haveText, html, notBeVisible, notHaveAttribute, test } from '../../../utils'

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

            <button>Focus Me</button>
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
