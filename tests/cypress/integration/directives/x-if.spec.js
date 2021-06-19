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
