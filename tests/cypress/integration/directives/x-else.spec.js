import { exist, haveText, html, notExist, test } from '../../utils'

test('x-else when if condition is false',
    html`
        <div x-data="{ show: false }">
            <button @click="show = ! show">Toggle</button>

            <template x-if="show">
                <h1>Showing</h1>
            </template>
            <template x-else>
                <h2>Hidden</h2>
            </template>
        </div>
    `,
    ({ get }) => {
        get('h1').should(notExist())
        get('h2').should(exist())

        get('button').click()
        get('h1').should(exist())
        get('h2').should(notExist())

        get('button').click()
        get('h1').should(notExist())
        get('h2').should(exist())
    }
)

test('x-else when if condition is true',
    html`
        <div x-data="{ show: true }">
            <button @click="show = ! show">Toggle</button>

            <template x-if="show">
                <h1>Showing</h1>
            </template>
            <template x-else>
                <h1>Hidden</h1>
            </template>
        </div>
    `,
    ({ get }) => {
        // Initial state: "Showing" is visible.
        get('h1').should(haveText('Showing'))
        // Toggle to hide "Showing" and show "Hidden"
        get('button').click()
        get('h1').should(haveText('Hidden'))
        // Toggle back to show "Showing"
        get('button').click()
        get('h1').should(haveText('Showing'))
        // Toggle again to show "Hidden"
        get('button').click()
        get('h1').should(haveText('Hidden'))
    }
)

test('x-else with nested conditions and persistent inner state',
    html`
        <div x-data="{ outer: false, inner: false }">
            <button id="toggle-outer" @click="outer = !outer">Toggle Outer</button>
            <button id="toggle-inner" @click="inner = !inner">Toggle Inner</button>

            <template x-if="outer">
                <div>
                    <h1>Outer True</h1>
                    <template x-if="inner">
                        <h2>Inner True</h2>
                    </template>
                    <template x-else>
                        <h2>Inner False</h2>
                    </template>
                </div>
            </template>
            <template x-else>
                <h3>Outer False</h3>
            </template>
        </div>
    `,
    ({ get }) => {
        // Initially, both outer and inner should be false
        get('h3').should('exist').and('contain', 'Outer False')
        get('h1').should('not.exist')
        get('h2').should('not.exist')

        // Toggle outer to true, inner still false
        get('#toggle-outer').click()
        get('h3').should('not.exist')
        get('h1').should('exist').and('contain', 'Outer True')
        get('h2').should('exist').and('contain', 'Inner False')

        // Toggle inner to true
        get('#toggle-inner').click()
        get('h1').should('exist').and('contain', 'Outer True')
        get('h2').should('exist').and('contain', 'Inner True')

        // Toggle outer back to false, then back to true
        get('#toggle-outer').click()
        get('h3').should('exist').and('contain', 'Outer False')
        get('h1').should('not.exist')
        get('h2').should('not.exist')

        get('#toggle-outer').click()
        get('h1').should('exist').and('contain', 'Outer True')
        get('h2').should('exist').and('contain', 'Inner True')  // Inner state should persist

        // Toggle inner back to false
        get('#toggle-inner').click()
        get('h1').should('exist').and('contain', 'Outer True')
        get('h2').should('exist').and('contain', 'Inner False')
    }
)

test('x-else works inside x-for loop',
    html`
        <div x-data="{ items: [{id: 1, show: false}, {id: 2, show: true}] }">
            <template x-for="item in items" :key="item.id">
                <div>
                    <template x-if="item.show">
                        <span :id="'visible-' + item.id">Visible: <span x-text="item.id"></span></span>
                    </template>
                    <template x-else>
                        <span :id="'hidden-' + item.id">Hidden: <span x-text="item.id"></span></span>
                    </template>
                </div>
            </template>
        </div>
    `,
    ({ get }) => {
        // Verify the first item's text
        get('#hidden-1').should('have.text', 'Hidden: 1');
        get('#visible-1').should('not.exist');

        // Verify the second item's text
        get('#visible-2').should('have.text', 'Visible: 2');
        get('#hidden-2').should('not.exist');
    }
);

test('x-else with empty x-for list',
    html`
        <div x-data="{ items: [] }">
            <template x-for="item in items" :key="item.id">
                <div>
                    <template x-if="item.show">
                        <span>Visible: <span x-text="item.id"></span></span>
                    </template>
                    <template x-else>
                        <span>Hidden: <span x-text="item.id"></span></span>
                    </template>
                </div>
            </template>
            <template x-if="items.length === 0">
                <span>No items available</span>
            </template>
        </div>
    `,
    ({ get }) => {
        get('span').should('have.text', 'No items available');
    }
);

test('dynamic changes in x-for list',
    html`
        <div x-data="{ items: [{id: 1, show: true}] }">
            <button @click="items.push({id: 2, show: false})">Add Item</button>
            <template x-for="item in items" :key="item.id">
                <div>
                    <template x-if="item.show">
                        <span :id="'visible-' + item.id">Visible: <span x-text="item.id"></span></span>
                    </template>
                    <template x-else>
                        <span :id="'hidden-' + item.id">Hidden: <span x-text="item.id"></span></span>
                    </template>
                </div>
            </template>
        </div>
    `,
    ({ get }) => {
        // Initial state
        get('#visible-1').should('exist').and('have.text', 'Visible: 1');
        get('#hidden-2').should('not.exist');

        // Add new item
        get('button').click();
        get('#visible-1').should('exist').and('have.text', 'Visible: 1');
        get('#hidden-2').should('exist').and('have.text', 'Hidden: 2');
    }
);

test('nested x-if and x-else with complex logic',
    html`
        <div x-data="{ outer: true, inner: true, condition: false }">
            <button id="toggle-condition" @click="condition = !condition">Toggle Condition</button>
            <template x-if="outer">
                <div id="outer-div">
                    <template x-if="inner">
                        <span id="outer-inner-true">Outer and Inner True</span>
                    </template>
                    <template x-else>
                        <span id="outer-inner-false">Outer True, Inner False</span>
                    </template>
                </div>
            </template>
            <template x-else>
                <span id="outer-false">Outer False</span>
            </template>
            <template x-if="condition">
                <span id="condition-true">Condition True</span>
            </template>
        </div>
    `,
    ({ get }) => {
        // Initially, outer and inner should be true
        get('#outer-inner-true').should('exist').and('contain', 'Outer and Inner True');
        get('#outer-inner-false').should('not.exist');
        get('#outer-false').should('not.exist');
        get('#condition-true').should('not.exist');

        // Toggle condition to show "Condition True"
        get('#toggle-condition').click();
        get('#condition-true').should('exist').and('contain', 'Condition True');

        // Toggle condition again
        get('#toggle-condition').click();
        get('#condition-true').should('not.exist');

        // Test that outer and inner states persist correctly
        get('#outer-inner-true').should('exist').and('contain', 'Outer and Inner True');
        get('#outer-inner-false').should('not.exist');
        get('#outer-false').should('not.exist');

        // Change inner state
        get('#toggle-condition').click(); // This will toggle condition back to true
        get('#condition-true').should('exist').and('contain', 'Condition True');
    }
);
