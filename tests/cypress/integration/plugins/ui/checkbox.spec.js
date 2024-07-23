import { haveAttribute, haveFocus, html, haveClasses, notHaveClasses, test, haveText, notExist, beHidden, } from '../../../utils'

test('it works without group using x-model',
    [html`
        <main x-data="{ active: false }">
            <div x-checkbox x-model="active">
                <span x-checkbox:label>Terms & Conditions</span>
                <span x-checkbox:description>I accept the terms and conditions of this application.</span>
            </div>

            <input x-model="active" type="hidden">
            <button x-on:click="active = !active>Toggle</button>
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
