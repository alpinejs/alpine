import { haveText, html, test } from '../../utils'

test('$root returns the root element of the component',
    html`
        <div x-data data-message="foo">
            <button @click="$el.innerText = $root.dataset.message">click me</button>
        </div>
    `,
    ({ get }) => {
        get('button').should(haveText('click me'))
        get('button').click()
        get('button').should(haveText('foo'))
    }
)
