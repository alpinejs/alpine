import {beVisible, haveLength, haveText, html, notBeVisible, test} from '../../utils'

test('x-if',
    html`
        <div x-data="{ show: false }">
            <button @click="show = ! show">Toggle</button>

            <template x-if="show">
                <h1>Toggle Me</h1>
            </template>
        </div>
    `,
    ({get}) => {
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
    ({get}) => {
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
    ({get}) => {
        get('li').should(haveText('bar'))
    }
)

test('x-if condition is same as x-for iterator, and is undfined',
    `
        <div x-data="{ items: {a:[1,2,3],b:[4,5,6,7]},showitems:'a'  }">
            <template x-if="items[showitems]">
                <template x-for="i in items[showitems]">
                    <span x-text="i"></span>
                </template>
            </template>
            <button @click="showitems = 'b'" id="first">Show b</button>
            <button @click="showitems = 'c'" id="second">Show c (undefined)</button>


        </div>
    `,
    ({get}) => {
        get('span').should(haveLength('3'))
        get('#first').click()
        get('span').should(haveLength('4'))
        get('#second').click()
        get('span').should(haveLength('0'))

    }
)
