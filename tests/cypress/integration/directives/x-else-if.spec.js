import {  haveText, html, notExist, test } from '../../utils'

test('x-else-if works correctly',
    html`
        <div x-data="{ value: 2 }">
            <button @click="value = 1">Set to 1</button>
            <button @click="value = 2">Set to 2</button>
            <button @click="value = 3">Set to 3</button>

            <template x-if="value === 1">
                <h1>Value is 1</h1>
            </template>
            <template x-else-if="value === 2">
                <h2>Value is 2</h2>
            </template>
            <template x-else-if="value === 3">
                <h3>Value is 3</h3>
            </template>
            <template x-else>
                <h4>Value is unknown</h4>
            </template>
        </div>
    `,
    ({ get }) => {
        // Initial value should be 2
        get('h2').should('contain', 'Value is 2');

        get('button').contains('Set to 1').click();
        get('h1').should('contain', 'Value is 1');

        get('button').contains('Set to 3').click();
        get('h3').should('contain', 'Value is 3');

        // Test with an unknown value
        get('button').contains('Set to 2').click();
        get('h2').should('contain', 'Value is 2');
    }
);

test('x-else-if works correctly inside x-for loop',
    html`
        <div x-data="{ items: [{id: 1, value: 1}, {id: 2, value: 2}, {id: 3, value: 3}, {id: 4, value: 4}] }">
            <template x-for="item in items" :key="item.id">
                <div>
                    <template x-if="item.value === 1">
                        <span id="item-1">Item <span x-text="item.id"></span>: Value is 1</span>
                    </template>
                    <template x-else-if="item.value === 2">
                        <span id="item-2">Item <span x-text="item.id"></span>: Value is 2</span>
                    </template>
                    <template x-else-if="item.value === 3">
                        <span id="item-3">Item <span x-text="item.id"></span>: Value is 3</span>
                    </template>
                    <template x-else>
                        <span id="item-else">Item <span x-text="item.id"></span>: Value is unknown</span>
                    </template>
                </div>
            </template>
        </div>
    `,
    ({ get }) => {
        // Verify each element's content
        get('#item-1').should(haveText('Item 1: Value is 1'));
        get('#item-2').should(haveText('Item 2: Value is 2'));
        get('#item-3').should(haveText('Item 3: Value is 3'));
        get('#item-else').should(haveText('Item 4: Value is unknown'));
    }
);

test('x-else-if works correctly without x-else',
    html`
        <div x-data="{ value: 3 }">
            <button @click="value = 1">Set to 1</button>
            <button @click="value = 2">Set to 2</button>
            <button @click="value = 3">Set to 3</button>
            <button @click="value = 4">Set to 4</button>

            <template x-if="value === 1">
                <h1>Value is 1</h1>
            </template>
            <template x-else-if="value === 2">
                <h2>Value is 2</h2>
            </template>
            <template x-else-if="value === 3">
                <h3>Value is 3</h3>
            </template>
            <!-- No x-else here -->
        </div>
    `,
    ({ get }) => {
        // Initial value should be 3
        get('h3').should('contain', 'Value is 3');

        get('button').contains('Set to 1').click();
        get('h1').should('contain', 'Value is 1');
        get('h2').should(notExist());
        get('h3').should(notExist());

        get('button').contains('Set to 2').click();
        get('h1').should(notExist());
        get('h2').should('contain', 'Value is 2');
        get('h3').should(notExist());

        get('button').contains('Set to 3').click();
        get('h1').should(notExist());
        get('h2').should(notExist());
        get('h3').should('contain', 'Value is 3');

        // Test with a value that doesn't match any x-if or x-else-if condition
        get('button').contains('Set to 4').click();
        get('h1').should(notExist());
        get('h2').should(notExist());
        get('h3').should(notExist());
    }
);
