import { haveAttribute, haveFocus, html, notHaveFocus, test } from '../../../utils'

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
            <div x-radio x-model="active" :disabled="true">
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
        get('[option="access-1"]').focus().type('{downarrow}')
        get('[option="access-2"]').should(haveFocus()).type('{downarrow}')
        get('[option="access-4"]').should(haveFocus()).type('{downarrow}')
        get('[option="access-1"]').should(haveFocus())
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
                            <div :option="id" x-radio:option="({ value: id, disabled: disabled })">
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
            .should(haveAttribute('aria-labelledby', 'alpine-radiogroup-label-1'))
            .should(haveAttribute('aria-describedby', 'alpine-radiogroup-description-1'))
        get('h2').should(haveAttribute('id', 'alpine-radiogroup-label-1'))
        get('p').should(haveAttribute('id', 'alpine-radiogroup-description-1'))

        get('[option="access-1"]')
            .should(haveAttribute('tabindex', 0))

        for (i in 4) {
            get(`[option="access-${i}"]`)
                .should(haveAttribute('role', 'radio'))
                .should(haveAttribute('aria-disabled', 'false'))
                .should(haveAttribute('aria-labelledby', `alpine-radiogroup-label-${i + 1}`))
                .should(haveAttribute('aria-describedby', `alpine-radiogroup-description-${i + 1}`))
            get(`[label="access-${i}"]`)
                .should(haveAttribute('id', `alpine-radiogroup-label-${i + 1}`))
            get(`[description="access-${i}"]`)
                .should(haveAttribute('id', `alpine-radiogroup-description-${i + 1}`))
        }

        get('[option="access-1"]')
            .click()
            .should(haveAttribute('aria-checked', 'true'))
    },
)
