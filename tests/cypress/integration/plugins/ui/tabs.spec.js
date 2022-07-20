import { beVisible, haveFocus, html, notBeVisible, test } from '../../../utils'

test.skip('can use tabs to toggle panels',
    [html`
        <div x-data x-tabs>
            <div x-tabs:list>
                <button x-tabs:tab button-1>First</button>
                <button x-tabs:tab button-2>Second</button>
            </div>

            <div x-tabs:panels>
                <div x-tabs:panel panel-1>First Panel</div>
                <div x-tabs:panel panel-2>Second Panel</div>
            </div>
        </div>
    `],
    ({ get }) => {
        get('[panel-1]').should(beVisible())
        get('[panel-2]').should(notBeVisible())
        get('[button-2]').click()
        get('[panel-1]').should(notBeVisible())
        get('[panel-2]').should(beVisible())
    },
)

test.skip('can use arrow keys to cycle through tabs',
    [html`
        <div x-data x-tabs>
            <div x-tabs:list>
                <button x-tabs:tab button-1>First</button>
                <button x-tabs:tab button-2>Second</button>
            </div>

            <div x-tabs:panels>
                <div x-tabs:panel panel-1>First Panel</div>
                <div x-tabs:panel panel-2>Second Panel</div>
            </div>
        </div>
    `],
    ({ get }) => {
        get('[panel-1]').should(beVisible())
        get('[panel-2]').should(notBeVisible())
        get('[button-2]').click()
        get('[button-2]').should(haveFocus())
        get('[panel-1]').should(notBeVisible())
        get('[panel-2]').should(beVisible())
        get('[button-2]').type('{rightArrow}')
        get('[button-1]').should(haveFocus())
        get('[panel-1]').should(beVisible())
        get('[panel-2]').should(notBeVisible())
        get('[button-1]').type('{rightArrow}')
        get('[button-2]').should(haveFocus())
        get('[panel-1]').should(notBeVisible())
        get('[panel-2]').should(beVisible())
    },
)

test.skip('cant tab through tabs, can only use arrows',
    [html`
        <div>
            <button button-1>first focusable</button>
            <div x-data x-tabs>
                <div x-tabs:list>
                    <button x-tabs:tab button-2>First</button>
                    <button x-tabs:tab button-3>Second</button>
                </div>
                <div x-tabs:panels>
                    <div x-tabs:panel panel-1>First Panel</div>
                    <div x-tabs:panel panel-2>Second Panel</div>
                </div>
            </div>
            <button button-4>first focusable</button>
        </div>
    `],
    ({ get }) => {
        get('[button-1]').click()
        get('[button-1]').should(haveFocus())
        get('[button-1]').tab()
        get('[button-2]').should(haveFocus())
        get('[button-2]').tab()
        get('[panel-1]').should(haveFocus())
        get('[panel-1]').tab()
        get('[button-4]').should(haveFocus())
    },
)
