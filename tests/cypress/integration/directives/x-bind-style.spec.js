import { beHidden, beVisible, haveText, beChecked, haveAttribute, haveClasses, haveValue, notBeChecked, notHaveAttribute, notHaveClasses, test, html } from '../../utils'

test('style attribute object binding',
    html`
        <div x-data>
            <span x-bind:style="{ color: 'red' }">I should be red</span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveAttribute('style', 'color: red;'))
    }
)

test('style attribute object binding using camelCase syntax',
    html`
        <div x-data>
            <span x-bind:style="{ backgroundColor: 'red' }">I should be red</span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveAttribute('style', 'background-color: red;'))
    }
)

test('style attribute object binding using kebab-case syntax',
    html`
        <div x-data>
            <span x-bind:style="{ 'background-color': 'red' }">I should be red</span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveAttribute('style', 'background-color: red;'))
    }
)

test('style attribute object bindings are merged with existing styles',
    html`
        <div x-data>
            <span style="display: block" x-bind:style="{ color: 'red' }">I should be red</span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveAttribute('style', 'display: block; color: red;'))
    }
)

test('CSS custom properties are set',
    html`
        <div x-data="{custom_color: '#f00'}">
            <span style="color: var(--custom-prop)" x-bind:style="{ '--custom-prop': custom_color }">I should be red</span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveAttribute('style', 'color: var(--custom-prop); --custom-prop:#f00;'))
    }
)

test('existing CSS custom properties are preserved',
    html`
        <div x-data="{link: 'var(--custom-prop-a)'}">
            <span style="color: var(--custom-prop-b); --custom-prop-a: red" x-bind:style="{ '--custom-prop-b': link }">I should be red</span>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveAttribute('style', 'color: var(--custom-prop-b); --custom-prop-a: red; --custom-prop-b:var(--custom-prop-a);'))
    }
)
