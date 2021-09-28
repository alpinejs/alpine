import { haveAttribute, haveComputedStyle, html, test } from '../../utils'

test('can collapse and expand element',
    [html`
        <div x-data="{ expanded: false }">
            <button @click="expanded = ! expanded">toggle</button>
            <h1 x-show="expanded" x-collapse>contents</h1>
        </div>
    `],
    ({ get }, reload) => {
        get('h1').should(haveComputedStyle('height', '0px'))
        get('button').click()
        get('h1').should(haveAttribute('style', 'overflow: hidden; height: auto;'))
        get('button').click()
        get('h1').should(haveComputedStyle('height', '0px'))
    },
)
