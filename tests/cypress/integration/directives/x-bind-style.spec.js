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
