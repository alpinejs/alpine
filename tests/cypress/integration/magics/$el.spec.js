import { haveText, html, test } from '../../utils'

test('$el returns the current element',
    html`
        <div x-data>
            <button @click="$el.innerText = 'foo'">click me</button>
        </div>
    `,
    ({ get }) => {
        get('button').should(haveText('click me'))
        get('button').click()
        get('button').should(haveText('foo'))
    }
)
