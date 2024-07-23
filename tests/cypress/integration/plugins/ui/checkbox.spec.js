import { haveAttribute, haveFocus, html, haveClasses, notHaveClasses, test, haveText, notExist, beHidden, } from '../../../utils'

test('it works without group using x-model',
    [html`
        <main x-data="{ active: false }">
            <div x-checkbox x-model="active">
                <span x-checkbox:label>Terms & Conditions</span>
                <span x-checkbox:description>I accept the terms and conditions of this application.</span>
            </div>

            <input x-model="active" type="hidden">
            <button x-on:click="active = !active">Toggle</button>
        </main>
    `],
    ({ get }) => {
        get('input').should(haveAttribute('value', 'false'))
        get('[x-checkbox]').click()
        get('input').should(haveAttribute('value', 'true'))
        get('[x-checkbox]').click()
        get('input').should(haveAttribute('value', 'false'))
        get('button').click()
        get('input').should(haveAttribute('value', 'true'))
        get('[x-checkbox]').should(haveAttribute('aria-checked', 'true'))
        get('button').click()
        get('input').should(haveAttribute('value', 'false'))
        get('[x-checkbox]').should(haveAttribute('aria-checked', 'false'))
    },
)

test('it works with group using x-model',
    [html`
        <main x-data="{ colors: [] }">
            <div x-checkbox:group x-model="colors">
                <div x-checkbox value="red">
                    <span x-checkbox:label>Red</span>
                </div>
                <div x-checkbox value="blue">
                    <span x-checkbox:label>Blue</span>
                </div>
                <div x-checkbox value="green">
                    <span x-checkbox:label>Green</span>
                </div>
            </div>

            <input x-model="colors" type="hidden">

            <button data-color="red" x-on:click="(index = colors.findIndex(color => color === 'red')) > 0 ? colors.splice(index, 1) : colors.push('red')">Toggle Red</button>
            <button data-color="blue" x-on:click="(index = colors.findIndex(color => color === 'blue')) > 0 ? colors.splice(index, 1) : colors.push('blue')">Toggle Blue</button>
            <button data-color="green" x-on:click="(index = colors.findIndex(color => color === 'green')) > 0 ? colors.splice(index, 1) : colors.push('green')">Toggle Green</button>
        </main>
    `],
    ({ get }) => {
        get('input').should(haveAttribute('value', ''))
        get('[value="red"]').click()
        get('input').should(haveAttribute('value', 'red'))
        get('[value="green"]').click()
        get('input').should(haveAttribute('value', 'red,green'))
        get('[value="blue"]').click()
        get('input').should(haveAttribute('value', 'red,green,blue'))
        get('[value="green"]').click()
        get('input').should(haveAttribute('value', 'red,blue'))
        get('button[data-color="red"]').click()
        get('input').should(haveAttribute('value', 'blue'))
        get('[value="red"]').should(haveAttribute('aria-checked', 'false'))
        get('[value="blue"]').should(haveAttribute('aria-checked', 'true'))
        get('[value="green"]').should(haveAttribute('aria-checked', 'false'))
        get('button[data-color="green"]').click()
        get('input').should(haveAttribute('value', 'blue,green'))
        get('[value="red"]').should(haveAttribute('aria-checked', 'false'))
        get('[value="blue"]').should(haveAttribute('aria-checked', 'true'))
        get('[value="green"]').should(haveAttribute('aria-checked', 'true'))
    },
)

test('cannot check any checkbox when the group is disabled',
    [html`
        <main x-data="{ colors: [] }">
            <div x-checkbox:group x-model="colors" disabled>
                <div x-checkbox value="red">
                    <span x-checkbox:label>Red</span>
                </div>
                <div x-checkbox value="blue">
                    <span x-checkbox:label>Blue</span>
                </div>
                <div x-checkbox value="green">
                    <span x-checkbox:label>Green</span>
                </div>
            </div>

            <input x-model="colors" type="hidden">
        </main>
    `],
    ({ get }) => {
        get('input').should(haveAttribute('value', ''))
        get('[value="red"]').click()
        get('input').should(haveAttribute('value', ''))
        get('[value="blue"]').click()
        get('input').should(haveAttribute('value', ''))
        get('[value="green"]').click()
        get('input').should(haveAttribute('value', ''))
    },
)

test('cannot check disabled checkbox',
    [html`
        <main x-data="{ colors: [] }">
            <div x-checkbox:group x-model="colors">
                <div x-checkbox value="red">
                    <span x-checkbox:label>Red</span>
                </div>
                <div x-checkbox value="blue" disabled>
                    <span x-checkbox:label>Blue</span>
                </div>
                <div x-checkbox value="green">
                    <span x-checkbox:label>Green</span>
                </div>
            </div>

            <input x-model="colors" type="hidden">
        </main>
    `],
    ({ get }) => {
        get('input').should(haveAttribute('value', ''))
        get('[value="red"]').click()
        get('input').should(haveAttribute('value', 'red'))
        get('[value="blue"]').click()
        get('input').should(haveAttribute('value', 'red'))
        get('[value="green"]').click()
        get('input').should(haveAttribute('value', 'red,green'))
    },
)
