import { haveAttribute, haveFocus, html, haveClasses, notHaveClasses, test, haveText, notExist, beHidden, } from '../../../utils'

test('it works using x-model',
    [html`
        <main x-data="{ active: null, access: [
            {
                id: 'access-1',
                name: 'Public access',
                description: 'This project would be available to anyone who has the link',
                disabled: false,
            },
            {
                id: 'access-2',
                name: 'Private to Project Members',
                description: 'Only members of this project would be able to access',
                disabled: false,
            },
            {
                id: 'access-3',
                name: 'Private to you',
                description: 'You are the only one able to access this project',
                disabled: true,
            },
            {
                id: 'access-4',
                name: 'Private to you',
                description: 'You are the only one able to access this project',
                disabled: false,
            },
        ]}">
            <div x-radio x-model="active">
                <fieldset>
                    <legend>
                        <h2 x-radio:label>Privacy setting</h2>
                    </legend>

                    <div>
                        <template x-for="({ id, name, description, disabled }, i) in access" :key="id">
                            <div :option="id" x-radio:option :value="id" :disabled="disabled">
                                <span x-radio:label x-text="name"></span>
                                <span x-radio:description x-text="description"></span>
                            </div>
                        </template>
                    </div>
                </fieldset>
            </div>

            <input x-model="active" type="hidden">
        </main>
    `],
    ({ get }) => {
        get('input').should(haveAttribute('value', ''))
        get('[option="access-2"]').click()
        get('input').should(haveAttribute('value', 'access-2'))
        get('[option="access-4"]').click()
        get('input').should(haveAttribute('value', 'access-4'))
    },
)

test('it works without x-model/with default-value',
    [html`
        <main x-data="{ access: [
            {
                id: 'access-1',
                name: 'Public access',
                description: 'This project would be available to anyone who has the link',
                disabled: false,
            },
            {
                id: 'access-2',
                name: 'Private to Project Members',
                description: 'Only members of this project would be able to access',
                disabled: false,
            },
            {
                id: 'access-3',
                name: 'Private to you',
                description: 'You are the only one able to access this project',
                disabled: true,
            },
            {
                id: 'access-4',
                name: 'Private to you',
                description: 'You are the only one able to access this project',
                disabled: false,
            },
        ]}">
            <div x-radio default-value="access-4">
                <fieldset>
                    <legend>
                        <h2 x-radio:label>Privacy setting</h2>
                    </legend>

                    <div>
                        <template x-for="({ id, name, description, disabled }, i) in access" :key="id">
                            <div :option="id" x-radio:option :value="id" :disabled="disabled">
                                <span x-radio:label x-text="name"></span>
                                <span x-radio:description x-text="description"></span>
                            </div>
                        </template>
                    </div>
                </fieldset>
            </div>
        </main>
    `],
    ({ get }) => {
        get('[option="access-4"]').should(haveAttribute('aria-checked', 'true'))
        get('[option="access-2"]').click()
        get('[option="access-2"]').should(haveAttribute('aria-checked', 'true'))
    },
)

test('cannot select any option when the group is disabled',
    [html`
        <main x-data="{ active: null, access: [
            {
                id: 'access-1',
                name: 'Public access',
                description: 'This project would be available to anyone who has the link',
                disabled: false,
            },
            {
                id: 'access-2',
                name: 'Private to Project Members',
                description: 'Only members of this project would be able to access',
                disabled: false,
            },
            {
                id: 'access-3',
                name: 'Private to you',
                description: 'You are the only one able to access this project',
                disabled: true,
            },
            {
                id: 'access-4',
                name: 'Private to you',
                description: 'You are the only one able to access this project',
                disabled: false,
            },
        ]}">
            <div x-radio x-model="active" disabled>
                <template x-for="({ id, name, description, disabled }, i) in access" :key="id">
                    <div :option="id" x-radio:option :value="id" :disabled="disabled">
                        <span x-radio:label x-text="name"></span>
                        <span x-radio:description x-text="description"></span>
                    </div>
                </template>
            </div>

            <input x-model="active" type="hidden">
        </main>
    `],
    ({ get }) => {
        get('input').should(haveAttribute('value', ''))
        get('[option="access-1"]').click()
        get('input').should(haveAttribute('value', ''))
    },
)

test('cannot select a disabled option',
    [html`
        <main x-data="{ active: null, access: [
            {
                id: 'access-1',
                name: 'Public access',
                description: 'This project would be available to anyone who has the link',
                disabled: false,
            },
            {
                id: 'access-2',
                name: 'Private to Project Members',
                description: 'Only members of this project would be able to access',
                disabled: false,
            },
            {
                id: 'access-3',
                name: 'Private to you',
                description: 'You are the only one able to access this project',
                disabled: true,
            },
            {
                id: 'access-4',
                name: 'Private to you',
                description: 'You are the only one able to access this project',
                disabled: false,
            },
        ]}">
            <div x-radio x-model="active">
                <template x-for="({ id, name, description, disabled }, i) in access" :key="id">
                    <div :option="id" x-radio:option :value="id" :disabled="disabled">
                        <span x-radio:label x-text="name"></span>
                        <span x-radio:description x-text="description"></span>
                    </div>
                </template>
            </div>

            <input x-model="active" type="hidden">
        </main>
    `],
    ({ get }) => {
        get('input').should(haveAttribute('value', ''))
        get('[option="access-3"]').click()
        get('input').should(haveAttribute('value', ''))
    },
)

test('keyboard navigation works',
    [html`
        <main x-data="{ active: null, access: [
            {
                id: 'access-1',
                name: 'Public access',
                description: 'This project would be available to anyone who has the link',
                disabled: false,
            },
            {
                id: 'access-2',
                name: 'Private to Project Members',
                description: 'Only members of this project would be able to access',
                disabled: false,
            },
            {
                id: 'access-3',
                name: 'Private to you',
                description: 'You are the only one able to access this project',
                disabled: true,
            },
            {
                id: 'access-4',
                name: 'Private to you',
                description: 'You are the only one able to access this project',
                disabled: false,
            },
        ]}">
            <div x-radio x-model="active">
                <template x-for="({ id, name, description, disabled }, i) in access" :key="id">
                    <div :option="id" x-radio:option :value="id" :disabled="disabled">
                        <span x-radio:label x-text="name"></span>
                        <span x-radio:description x-text="description"></span>
                    </div>
                </template>
            </div>

            <input x-model="active" type="hidden">
        </main>
    `],
    ({ get }) => {
        get('input').should(haveAttribute('value', ''))
        get('[option="access-1"]').focus().type('{downarrow}')
        get('[option="access-2"]').should(haveFocus()).type('{downarrow}')
        get('[option="access-4"]').should(haveFocus()).type('{downarrow}')
        get('[option="access-1"]').should(haveFocus())
    },
)

test('keyboard navigation works when first option has null as value',
    [html`
        <main x-data="{ active: null }">
            <div x-radio x-model="active">
                <div x-radio:option option="option-null" :value="null"></div>
                <div x-radio:option option="option-1" value="1"></div>
                <div x-radio:option option="option-2" value="2"></div>
            </div>

            <input x-model="active" type="hidden">
        </main>
    `],
    ({ get }) => {
        get('[option="option-1"]').focus().type('{downarrow}')
        get('[option="option-2"]').should(haveFocus()).type('{uparrow}')
        get('[option="option-1"]').should(haveFocus()).type('{uparrow}')
        get('[option="option-null"]').should(haveFocus()).type('{uparrow}')
        get('[option="option-2"]').should(haveFocus()).type('{downarrow}')
        get('[option="option-null"]').should(haveFocus())
    },
)

test('keyboard navigation works when last option has null as value',
    [html`
        <main x-data="{ active: null }">
            <div x-radio x-model="active">
                <div x-radio:option option="option-1" value="1"></div>
                <div x-radio:option option="option-2" value="2"></div>
                <div x-radio:option option="option-null" :value="null"></div>
            </div>

            <input x-model="active" type="hidden">
        </main>
    `],
    ({ get }) => {
        get('[option="option-1"]').focus().type('{downarrow}')
        get('[option="option-2"]').should(haveFocus()).type('{downarrow}')
        get('[option="option-null"]').should(haveFocus()).type('{downarrow}')
        get('[option="option-1"]').should(haveFocus()).type('{uparrow}')
        get('[option="option-null"]').should(haveFocus())
    },
)

test('has accessibility attributes',
    [html`
        <main x-data="{ active: null, access: [
            {
                id: 'access-1',
                name: 'Public access',
                description: 'This project would be available to anyone who has the link',
                disabled: false,
            },
            {
                id: 'access-2',
                name: 'Private to Project Members',
                description: 'Only members of this project would be able to access',
                disabled: false,
            },
            {
                id: 'access-3',
                name: 'Private to you',
                description: 'You are the only one able to access this project',
                disabled: true,
            },
            {
                id: 'access-4',
                name: 'Private to you',
                description: 'You are the only one able to access this project',
                disabled: false,
            },
        ]}">
            <div x-radio group x-model="active">
                <fieldset>
                    <legend>
                        <h2 x-radio:label>Privacy setting</h2>
                        <p x-radio:description>Some description</p>
                    </legend>

                    <div>
                        <template x-for="({ id, name, description, disabled }, i) in access" :key="id">
                            <div :option="id" x-radio:option :value="id" :disabled="disabled">
                                <span :label="id" x-radio:label x-text="name"></span>
                                <span :description="id" x-radio:description x-text="description"></span>
                            </div>
                        </template>
                    </div>
                </fieldset>
            </div>
        </main>
    `],
    ({ get }) => {
        get('[group]').should(haveAttribute('role', 'radiogroup'))
            .should(haveAttribute('aria-labelledby', 'alpine-radio-label-1'))
            .should(haveAttribute('aria-describedby', 'alpine-radio-description-1'))
        get('h2').should(haveAttribute('id', 'alpine-radio-label-1'))
        get('p').should(haveAttribute('id', 'alpine-radio-description-1'))

        get('[option="access-1"]')
            .should(haveAttribute('tabindex', 0))

        for (i in 4) {
            get(`[option="access-${i}"]`)
                .should(haveAttribute('role', 'radio'))
                .should(haveAttribute('aria-disabled', 'false'))
                .should(haveAttribute('aria-labelledby', `alpine-radio-label-${i + 1}`))
                .should(haveAttribute('aria-describedby', `alpine-radio-description-${i + 1}`))
            get(`[label="access-${i}"]`)
                .should(haveAttribute('id', `alpine-radio-label-${i + 1}`))
            get(`[description="access-${i}"]`)
                .should(haveAttribute('id', `alpine-radio-description-${i + 1}`))
        }

        get('[option="access-1"]')
            .click()
            .should(haveAttribute('aria-checked', 'true'))
    },
)

test('$radioOption.isActive, $radioOption.isChecked, $radioOption.isDisabled work',
    [html`
        <main x-data="{ access: [
            {
                id: 'access-1',
                name: 'Public access',
                description: 'This project would be available to anyone who has the link',
                disabled: false,
            },
            {
                id: 'access-2',
                name: 'Private to Project Members',
                description: 'Only members of this project would be able to access',
                disabled: false,
            },
            {
                id: 'access-3',
                name: 'Private to you',
                description: 'You are the only one able to access this project',
                disabled: true,
            },
            {
                id: 'access-4',
                name: 'Private to you',
                description: 'You are the only one able to access this project',
                disabled: false,
            },
        ]}">
            <div x-radio group>
                <template x-for="({ id, name, description, disabled }, i) in access" :key="id">
                    <div
                        :option="id"
                        x-radio:option
                        :value="id"
                        :disabled="disabled"
                        :class="{
                            'active': $radioOption.isActive,
                            'checked': $radioOption.isChecked,
                            'disabled': $radioOption.isDisabled,
                        }"
                    >
                        <span :label="id" x-radio:label x-text="name"></span>
                        <span :description="id" x-radio:description x-text="description"></span>
                    </div>
                </template>
            </div>
        </main>
    `],
    ({ get }) => {
        get('[option="access-1"]')
            .should(notHaveClasses(['active', 'checked', 'disabled']))
            .focus()
            .should(haveClasses(['active']))
            .should(notHaveClasses(['checked']))
            .type(' ')
            .should(haveClasses(['active', 'checked']))
            .type('{downarrow}')
        get('[option="access-2"]')
            .should(haveClasses(['active', 'checked']))
        get('[option="access-3"]')
            .should(haveClasses(['disabled']))
    },
)

test('can bind objects to the value',
    [html`
        <main x-data="{ active: null, access: [
            {
                id: 'access-1',
                name: 'Public access',
                description: 'This project would be available to anyone who has the link',
                disabled: false,
            },
            {
                id: 'access-2',
                name: 'Private to Project Members',
                description: 'Only members of this project would be able to access',
                disabled: false,
            },
            {
                id: 'access-3',
                name: 'Private to you',
                description: 'You are the only one able to access this project',
                disabled: true,
            },
            {
                id: 'access-4',
                name: 'Private to you',
                description: 'You are the only one able to access this project',
                disabled: false,
            },
        ]}">
            <div x-radio group x-model="active">
                <template x-for="(option, i) in access" :key="option.id">
                    <div
                        :option="option.id"
                        x-radio:option
                        :value="option"
                        :disabled="option.disabled"
                    >
                        <span :label="option.id" x-radio:label x-text="option.name"></span>
                        <span :description="option.id" x-radio:description x-text="option.description"></span>
                    </div>
                </template>
            </div>

            <article x-text="JSON.stringify(active)"></article>
        </main>
    `],
    ({ get }) => {
        get('[option="access-2"]').click()
        get('article')
            .should(haveText(JSON.stringify({
                id: 'access-2',
                name: 'Private to Project Members',
                description: 'Only members of this project would be able to access',
                disabled: false,
            })))
    },
)

test('name prop',
    [html`
        <main
            x-data="{
                active: null,
                access: [
                    {
                        id: 'access-1',
                        name: 'Public access',
                        description: 'This project would be available to anyone who has the link',
                        disabled: false,
                    },
                    {
                        id: 'access-2',
                        name: 'Private to Project Members',
                        description: 'Only members of this project would be able to access',
                        disabled: false,
                    },
                    {
                        id: 'access-3',
                        name: 'Private to you',
                        description: 'You are the only one able to access this project',
                        disabled: true,
                    },
                    {
                        id: 'access-4',
                        name: 'Private to you',
                        description: 'You are the only one able to access this project',
                        disabled: false,
                    },
                ]
            }
        ">
            <div x-radio group x-model="active" name="access">
                <template x-for="({ id, name, description, disabled }, i) in access" :key="id">
                    <div
                        :option="id"
                        x-radio:option
                        :value="id"
                        :disabled="disabled"
                    >
                        <span :label="id" x-radio:label x-text="name"></span>
                        <span :description="id" x-radio:description x-text="description"></span>
                    </div>
                </template>
            </div>
        </main>
    `],
    ({ get }) => {
        get('input').should(notExist())
        get('[option="access-2"]').click()
        get('input').should(beHidden())
            .should(haveAttribute('name', 'access'))
            .should(haveAttribute('value', 'access-2'))
            .should(haveAttribute('type', 'hidden'))
        get('[option="access-4"]').click()
        get('input').should(beHidden())
            .should(haveAttribute('name', 'access'))
            .should(haveAttribute('value', 'access-4'))
            .should(haveAttribute('type', 'hidden'))
    },
)
