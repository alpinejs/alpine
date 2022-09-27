import { beVisible, haveClasses, haveFocus, html, notBeVisible, notHaveClasses, test } from '../../../utils'

test('can use tabs to toggle panels',
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

test('can use arrow keys to cycle through tabs',
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

test('cant tab through tabs, can only use arrows',
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

test('can detect the selected tab & panel',
    [html`
        <div x-data x-tabs>
            <div x-tabs:list>
                <button x-tabs:tab button-1 :class="$tab.isSelected && 'active'">First</button>
                <button x-tabs:tab button-2 :class="$tab.isSelected && 'active'">Second</button>
            </div>

            <div x-tabs:panels>
                <div x-tabs:panel panel-1 :class="$panel.isSelected && 'active'">First Panel</div>
                <div x-tabs:panel panel-2 :class="$panel.isSelected && 'active'">Second Panel</div>
            </div>
        </div>
    `],
    ({ get }) => {
        get('[panel-1]').should(beVisible())
        get('[panel-2]').should(notBeVisible())
        get('[button-1]').should(haveClasses(['active']))
        get('[panel-1]').should(haveClasses(['active']))
        get('[button-2]').should(notHaveClasses(['active']))
        get('[panel-2]').should(notHaveClasses(['active']))
        get('[button-2]').click()
        get('[button-1]').should(notHaveClasses(['active']))
        get('[panel-1]').should(notHaveClasses(['active']))
        get('[button-2]').should(haveClasses(['active']))
        get('[panel-2]').should(haveClasses(['active']))
        get('[panel-1]').should(notBeVisible())
        get('[panel-2]').should(beVisible())
    },
)

test('can disable a tab',
    [html`
        <div x-data x-tabs>
            <div x-tabs:list>
                <button x-tabs:tab button-1>First</button>
                <button x-tabs:tab button-2 disabled :class="$tab.isDisabled && 'disabled'">Second</button>
                <button x-tabs:tab button-3>Third</button>
            </div>

            <div x-tabs:panels>
                <div x-tabs:panel panel-1>First Panel</div>
                <div x-tabs:panel panel-2>Second Panel</div>
                <div x-tabs:panel panel-3>Third Panel</div>
            </div>
        </div>
    `],
    ({ get }) => {
        get('[button-2]').should(haveClasses(['disabled']))
        get('[button-1]').click()
        get('[button-1]').should(haveFocus())
        get('[panel-1]').should(beVisible())
        get('[panel-2]').should(notBeVisible())
        get('[button-1]').type('{rightArrow}')
        get('[panel-1]').should(notBeVisible())
        get('[panel-3]').should(beVisible())
        get('[button-3]').type('{rightArrow}')
        get('[panel-3]').should(notBeVisible())
        get('[panel-1]').should(beVisible())
    },
)

test('can traverse tabs manually',
    [html`
        <div x-data x-tabs manual>
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
        get('[button-1]').click()
        get('[button-1]').should(haveFocus())
        get('[panel-1]').should(beVisible())
        get('[panel-2]').should(notBeVisible())
        get('[button-1]').type('{rightArrow}')
        get('[button-2]').should(haveFocus())
        get('[panel-1]').should(beVisible())
        get('[panel-2]').should(notBeVisible())
        get('[button-2]').click()
        get('[panel-1]').should(notBeVisible())
        get('[panel-2]').should(beVisible())
    },
)

test('can set a default index',
    [html`
        <div x-data x-tabs default-index="1">
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
        get('[panel-1]').should(notBeVisible())
        get('[panel-2]').should(beVisible())
    },
)

test('can programmatically control the selected tab',
    [html`
        <div x-data="{ selectedIndex: 1 }">
            <button @click="selectedIndex = selectedIndex ? 0 : 1" button-toggle>Toggle tabs</button>

            <div x-tabs x-model="selectedIndex">
                <div x-tabs:list>
                    <button x-tabs:tab button-1>First</button>
                    <button x-tabs:tab button-2>Second</button>
                </div>
                <div x-tabs:panels>
                    <div x-tabs:panel panel-1>First Panel</div>
                    <div x-tabs:panel panel-2>Second Panel</div>
                </div>
            </div>
        </div>
    `],
    ({ get }) => {
        get('[panel-1]').should(notBeVisible())
        get('[panel-2]').should(beVisible())
        get('[button-toggle]').click()
        get('[panel-2]').should(notBeVisible())
        get('[panel-1]').should(beVisible())
        get('[button-toggle]').click()
        get('[panel-1]').should(notBeVisible())
        get('[panel-2]').should(beVisible())
    },
)
