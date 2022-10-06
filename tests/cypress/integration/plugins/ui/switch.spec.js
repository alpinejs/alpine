import { beVisible, haveAttribute, haveClasses, haveText, html, notBeVisible, notExist, test } from '../../../utils'

test('has accessibility attributes',
    [html`
        <div x-data="{ checked: false }">
            <article x-switch:group>
                <label x-switch:label>Enable notifications</label>
                <span description x-switch:description>A description of the switch.</span>

                <button x-switch x-model="checked">Enable Notifications</button>
            </article>
        </div>
    `],
    ({ get }) => {
        get('label').should(haveAttribute('id', 'alpine-switch-label-1'))
        get('[description]').should(haveAttribute('id', 'alpine-switch-description-1'))
        get('button').should(haveAttribute('type', 'button'))
        get('button').should(haveAttribute('aria-labelledby', 'alpine-switch-label-1'))
        get('button').should(haveAttribute('aria-describedby', 'alpine-switch-description-1'))
        get('button').should(haveAttribute('role', 'switch'))
        get('button').should(haveAttribute('tabindex', 0))
        get('button').should(haveAttribute('aria-checked', 'false'))
        get('button').click()
        get('button').should(haveAttribute('aria-checked', 'true'))
    },
)

test('works with x-model',
    [html`
        <div x-data="{ checked: false }">
            <button x-switch x-model="checked">Enable notifications</button>

            <article x-show="checked">
                Notifications are enabled.
            </article>
        </div>
    `],
    ({ get }) => {
        get('article').should(notBeVisible())
        get('button').click()
        get('article').should(beVisible())
        get('button').click()
        get('article').should(notBeVisible())
    },
)

test('works with internal state/$switch.isChecked',
    [html`
        <div x-data>
            <button x-switch x-bind:class="$switch.isChecked ? 'foo' : 'bar'">
                Enable notifications
            </button>
        </div>
    `],
    ({ get }) => {
        get('button').should(haveClasses(['bar']))
        get('button').click()
        get('button').should(haveClasses(['foo']))
        get('button').click()
        get('button').should(haveClasses(['bar']))
    },
)

test('pressing space toggles the switch',
    [html`
        <div x-data="{ checked: false }">
            <div>
                <button x-switch x-model="checked">Enable notifications</button>

                <article x-show="checked">
                    Notifications are enabled.
                </article>
            </div>
        </div>
    `],
    ({ get }) => {
        get('article').should(notBeVisible())
        get('button').focus()
        get('button').type(' ')
        get('article').should(beVisible())
        get('button').type(' ')
        get('article').should(notBeVisible())
    },
)

// @todo: add test for default-checked
// @todo: add test for hidden input
