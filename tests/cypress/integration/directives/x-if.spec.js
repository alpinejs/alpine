import { exist, haveText, html, notExist, test } from '../../utils'

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
        get('h1').should(notExist())
        get('button').click()
        get('h1').should(exist())
        get('button').click()
        get('h1').should(notExist())
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

// If x-if evaluates to false, the expectation is that no sub-expressions will be evaluated.
test('x-if removed dom does not evaluate reactive expressions in dom tree',
    html`
    <div x-data="{user: {name: 'lebowski'}}">
        <button @click="user = null">Log out</button>
        <template x-if="user">
            <span x-text="user.name"></span>
        </template>

    </div>
    `,
    ({ get }) => {
        get('span').should(haveText('lebowski'))

        // Clicking button sets user=null and thus x-if="user" will evaluate to false.
        // If the sub-expression x-text="user.name" is evaluated, the button click
        // will produce an error because user is no longer defined and the test will fail
        get('button').click()
        get('span').should(notExist())
    }
)
