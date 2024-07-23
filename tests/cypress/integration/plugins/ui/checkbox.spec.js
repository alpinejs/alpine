import { haveAttribute, notHaveAttribute, haveFocus, html, haveClasses, notHaveClasses, test, haveText, notExist, beHidden, } from '../../../utils'

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

            <button x-on:click="colors = ['blue', 'green']"></button>
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
        get('button').click()
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

test('keyboard navigation works',
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
        </main>
    `],
    ({ get }) => {
        get('input').should(haveAttribute('value', ''))
        get('[value="red"]').focus().tab()
        get('[value="blue"]').should(haveFocus()).tab()
        get('[value="green"]').should(haveFocus()).tab()
        get('input').should(haveAttribute('value', ''))
        get('[value="red"]').should(haveAttribute('aria-checked', 'false'))
        get('[value="blue"]').should(haveAttribute('aria-checked', 'false'))
        get('[value="green"]').should(haveAttribute('aria-checked', 'false'))
    },
)

test('has accessibility attributes',
    [html`
        <main x-data="{ colors: [] }">
            <div x-checkbox:group x-model="colors">
                <div x-checkbox value="red">
                    <span label="red" x-checkbox:label>Red</span>
                    <span description="red" x-checkbox:description>The beautiful color "red"</span>
                </div>
                <div x-checkbox value="blue">
                    <span label="blue" x-checkbox:label>Blue</span>
                    <span description="blue" x-checkbox:description>The amazing color "blue"</span>
                </div>
                <div x-checkbox value="green">
                    <span label="green" x-checkbox:label>Green</span>
                    <span description="green" x-checkbox:description>The cool color "green"</span>
                </div>
            </div>
        </main>
    `],
    ({ get }) => {
        ['red', 'blue', 'green'].forEach((color, i) => {
            get(`[value="${color}"]`)
                .should(haveAttribute('tabindex', 0))
                .should(haveAttribute('role', 'checkbox'))
                .should(notHaveAttribute('aria-disabled'))
                .should(haveAttribute('aria-checked', 'false'))
                .should(haveAttribute('aria-labelledby', `alpine-checkbox-label-${i + 1}`))
                .should(haveAttribute('aria-describedby', `alpine-checkbox-description-${i + 1}`))
            get(`[label="${color}"]`)
                .should(haveAttribute('id', `alpine-checkbox-label-${i + 1}`))
            get(`[description="${color}"]`)
                .should(haveAttribute('id', `alpine-checkbox-description-${i + 1}`))
        })

        get('[value="blue"]')
            .click()
            .should(haveAttribute('aria-checked', 'true'))
    },
)

test('$checkbox.isActive, $checkbox.isChecked, $checkbox.isDisabled work',
    [html`
        <main x-data="{ colors: [] }">
            <div x-checkbox:group x-model="colors">
                <div
                    x-checkbox
                    value="red"
                    :class="{
                        'active': $checkbox.isActive,
                        'checked': $checkbox.isChecked,
                        'disabled': $checkbox.isDisabled,
                    }"
                >
                </div>
                <div
                    x-checkbox
                    value="blue"
                    :class="{
                        'active': $checkbox.isActive,
                        'checked': $checkbox.isChecked,
                        'disabled': $checkbox.isDisabled,
                    }"
                >
                </div>
                <div
                    x-checkbox
                    value="green"
                    disabled
                    :class="{
                        'active': $checkbox.isActive,
                        'checked': $checkbox.isChecked,
                        'disabled': $checkbox.isDisabled,
                    }"
                >
                </div>
            </div>
        </main>
    `],
    ({ get }) => {
        get('[value="red"]')
            .should(notHaveClasses(['active', 'checked', 'disabled']))
            .focus()
            .should(haveClasses(['active']))
            .should(notHaveClasses(['checked']))
            .type(' ')
            .should(haveClasses(['active', 'checked']))
            .should(notHaveAttribute('aria-disabled'))
            .tab()
        get('[value="blue"]')
            .should(haveClasses(['active']))
            .should(notHaveClasses(['checked', 'disabled']))
            .should(notHaveAttribute('aria-disabled'))
        get('[value="green"]')
            .should(haveClasses(['disabled']))
            .should(notHaveClasses(['active', 'checked']))
            .should(haveAttribute('aria-disabled', 'true'))
    },
)
