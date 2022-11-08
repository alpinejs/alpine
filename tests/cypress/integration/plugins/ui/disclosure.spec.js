import { beVisible, haveClasses, haveAttribute, html, notBeVisible, notHaveClasses, test } from '../../../utils'

test('has accessibility attributes',
    [html`
        <div x-data x-disclosure>
            <button trigger x-disclosure:button>Trigger</button>

            <div x-disclosure:panel panel>
                Content
            </div>
        </div>
    `],
    ({ get }) => {
        get('button').should(haveAttribute('aria-expanded', 'false'))
        get('button').should(haveAttribute('aria-controls', 'alpine-disclosure-panel-1'))
        get('[panel]').should(haveAttribute('id', 'alpine-disclosure-panel-1'))
    },
)

test('it toggles',
    [html`
        <div x-data x-disclosure>
            <button trigger x-disclosure:button>Trigger</button>

            <div x-disclosure:panel panel>
                Content

                <button close-button type="button" @click="$disclosure.close()">Close</button>
            </div>
        </div>
    `],
    ({ get }) => {
        get('[panel]').should(notBeVisible())
        get('[trigger]').click()
        get('[panel]').should(beVisible())
        get('[trigger]').click()
        get('[panel]').should(notBeVisible())
    },
)

test('$disclosure.isOpen and $disclosure.close() work',
    [html`
        <div x-data x-disclosure>
            <button trigger x-disclosure:button>Trigger</button>

            <div x-disclosure:panel panel :class="$disclosure.isOpen && 'open'">
                Content

                <button close-button type="button" @click="$disclosure.close()">Close</button>
            </div>
        </div>
    `],
    ({ get }) => {
        get('[panel]').should(notHaveClasses(['open']))
        get('[trigger]').click()
        get('[panel]').should(haveClasses(['open']))
        get('[close-button]').click()
        get('[panel]').should(notBeVisible())
    },
)

test('can set a default open state',
    [html`
        <div x-data x-disclosure :default-open="true">
            <button trigger x-disclosure:button>Trigger</button>

            <div x-disclosure:panel panel>
                Content

                <button close-button type="button" @click="$disclosure.close()">Close</button>
            </div>
        </div>
    `],
    ({ get }) => {
        get('[panel]').should(beVisible())
        get('[trigger]').click()
        get('[panel]').should(notBeVisible())
    },
)

test('it toggles using the space key',
    [html`
        <div x-data x-disclosure>
            <button trigger x-disclosure:button>Trigger</button>

            <div x-disclosure:panel panel>
                Content

                <button close-button type="button" @click="$disclosure.close()">Close</button>
            </div>
        </div>
    `],
    ({ get }) => {
        get('[panel]').should(notBeVisible())
        get('[trigger]').click()
        get('[panel]').should(beVisible())
        get('[trigger]').type(' ')
        get('[panel]').should(notBeVisible())
        get('[trigger]').type(' ')
        get('[panel]').should(beVisible())
    },
)
