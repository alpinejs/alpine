import { haveAttribute, html, test } from '../../utils'

test('$root returns the root element',
    html`
        <div x-data data-foo="bar">
            <button @click="$root.setAttribute('data-foo', 'baz')">click me</button>
        </div>
    `,
    ({ get }) => {
        get('div').should(haveAttribute('data-foo', 'bar'))
        get('button').click()
        get('div').should(haveAttribute('data-foo', 'baz'))
    }
)
