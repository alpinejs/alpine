import { beVisible, haveText, html, notBeVisible, test } from '../../utils'

test('x-if',
    html`
        <div x-data="{ show: false }">
            <button @click="show = ! show">Toggle</button>

            <template x-if="show">
                <h1>Toggle Me</h1>
            </template>
        </div>
    `,
    ({ get }) => {
        get('h1').should(notBeVisible())
        get('button').click()
        get('h1').should(beVisible())
        get('button').click()
        get('h1').should(notBeVisible())
    }
)

test('x-if inside x-for allows nested directives',
    html`
        <div x-data="{items: [{id: 1, label: '1'}]}">

            <template x-for="item in items" :key="item.id">
                <div>
                    <template x-if="item.label">
                        <span x-text="item.label"></span>
                    </template>
                </div>
            </template>
        </div>
    `,
    ({ get }) => {
        get('span').should(haveText('1'))
    }
)

test('x-if initializes after being added to the DOM to allow x-ref to work',
    html`
        <div x-data="{}">
            <template x-if="true">
                <ul x-ref="listbox" data-foo="bar">
                    <li x-text="$refs.listbox.dataset.foo"></li>
                </ul>
            </template>
        </div>
    `,
    ({ get }) => {
        get('li').should(haveText('bar'))
    }
)
