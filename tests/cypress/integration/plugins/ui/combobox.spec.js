import { beVisible, beHidden, haveAttribute, haveClasses, notHaveClasses, haveText, contain, notContain, html, notBeVisible, notHaveAttribute, notExist, haveFocus, test, haveValue} from '../../../utils'

test('it works with x-model',
    [html`
        <div
            x-data="{
                query: '',
                selected: null,
                people: [
                    { id: 1, name: 'Wade Cooper' },
                    { id: 2, name: 'Arlene Mccoy' },
                    { id: 3, name: 'Devon Webb' },
                    { id: 4, name: 'Tom Cook' },
                    { id: 5, name: 'Tanya Fox', disabled: true },
                    { id: 6, name: 'Hellen Schmidt' },
                    { id: 7, name: 'Caroline Schultz' },
                    { id: 8, name: 'Mason Heaney' },
                    { id: 9, name: 'Claudie Smitham' },
                    { id: 10, name: 'Emil Schaefer' },
                ],
                get filteredPeople() {
                    return this.query === ''
                        ? this.people
                        : this.people.filter((person) => {
                            return person.name.toLowerCase().includes(this.query.toLowerCase())
                        })
                },
            }"
        >
            <div x-combobox x-model="selected">
                <label x-combobox:label>Select person</label>

                <div>
                    <div>
                        <input
                            x-combobox:input
                            :display-value="person => person.name"
                            @change="query = $event.target.value"
                            placeholder="Search..."
                        />

                        <button x-combobox:button>Toggle</button>
                    </div>

                    <div x-combobox:options>
                        <ul>
                            <template
                                x-for="person in filteredPeople"
                                :key="person.id"
                                hidden
                            >
                                <li
                                    x-combobox:option
                                    :option="person.id"
                                    :value="person"
                                    :disabled="person.disabled"
                                    x-text="person.name"
                                >
                                </li>
                            </template>
                        </ul>

                        <p x-show="filteredPeople.length == 0">No people match your query.</p>
                    </div>
                </div>

                <article x-text="selected?.name"></article>
            </div>
        </div>
    `],
    ({ get }) => {
        get('ul').should(notBeVisible())
        get('button').click()
        get('ul').should(beVisible())
        get('button').click()
        get('ul').should(notBeVisible())
        get('button').click()
        get('[option="2"]').click()
        get('ul').should(notBeVisible())
        get('input').should(haveValue('Arlene Mccoy'))
        get('article').should(haveText('Arlene Mccoy'))
        get('button').click()
        get('ul').should(contain('Wade Cooper'))
            .should(contain('Arlene Mccoy'))
            .should(contain('Devon Webb'))
        get('[option="3"]').click()
        get('ul').should(notBeVisible())
        get('input').should(haveValue('Devon Webb'))
        get('article').should(haveText('Devon Webb'))
        get('button').click()
        get('ul').should(contain('Wade Cooper'))
            .should(contain('Arlene Mccoy'))
            .should(contain('Devon Webb'))
        get('[option="1"]').click()
        get('ul').should(notBeVisible())
        get('input').should(haveValue('Wade Cooper'))
        get('article').should(haveText('Wade Cooper'))
    },
)

test('it works with internal state',
    [html`
        <div
            x-data="{ people: [
                { id: 1, name: 'Wade Cooper' },
                { id: 2, name: 'Arlene Mccoy' },
                { id: 3, name: 'Devon Webb' },
                { id: 4, name: 'Tom Cook' },
                { id: 5, name: 'Tanya Fox', disabled: true },
                { id: 6, name: 'Hellen Schmidt' },
                { id: 7, name: 'Caroline Schultz' },
                { id: 8, name: 'Mason Heaney' },
                { id: 9, name: 'Claudie Smitham' },
                { id: 10, name: 'Emil Schaefer' },
            ]}"
            x-combobox
        >
            <label x-combobox:label>Assigned to</label>

            <input x-combobox:input :display-value="(person) => person.name" type="text">
            <button x-combobox:button x-text="$combobox.value ? $combobox.value.name : 'Select Person'"></button>

            <ul x-combobox:options>
                <template x-for="person in people" :key="person.id">
                    <li
                        :option="person.id"
                        x-combobox:option
                        :value="person"
                        :disabled="person.disabled"
                    >
                        <span x-text="person.name"></span>
                    </li>
                </template>
            </ul>
        </div>
    `],
    ({ get }) => {
        get('ul').should(notBeVisible())
        get('button')
            .should(haveText('Select Person'))
            .click()
        get('ul').should(beVisible())
        get('button').click()
        get('ul').should(notBeVisible())
        get('button').click()
        get('[option="2"]').click()
        get('ul').should(notBeVisible())
        get('button').should(haveText('Arlene Mccoy'))
        get('input').should(haveValue('Arlene Mccoy'))
    },
)

test('$combobox/$comboboxOption',
    [html`
        <div
            x-data="{ people: [
                { id: 1, name: 'Wade Cooper' },
                { id: 2, name: 'Arlene Mccoy' },
                { id: 3, name: 'Devon Webb' },
                { id: 4, name: 'Tom Cook' },
                { id: 5, name: 'Tanya Fox', disabled: true },
                { id: 6, name: 'Hellen Schmidt' },
                { id: 7, name: 'Caroline Schultz' },
                { id: 8, name: 'Mason Heaney' },
                { id: 9, name: 'Claudie Smitham' },
                { id: 10, name: 'Emil Schaefer' },
            ]}"
            x-combobox
        >
            <label x-combobox:label>Assigned to</label>

            <input x-combobox:input :display-value="(person) => person.name" type="text">
            <button x-combobox:button x-text="$combobox.value ? $combobox.value.name : 'Select Person'"></button>

            <p x-text="$combobox.activeIndex"></p>
            <article x-text="$combobox.activeOption?.name"></article>

            <ul x-combobox:options>
                <template x-for="person in people" :key="person.id">
                    <li
                        :option="person.id"
                        x-combobox:option
                        :value="person"
                        :disabled="person.disabled"
                        :class="{
                            'selected': $comboboxOption.isSelected,
                            'active': $comboboxOption.isActive,
                            'disabled': $comboboxOption.isDisabled,
                        }"
                    >
                        <span x-text="person.name"></span>
                    </li>
                </template>
            </ul>
        </div>
    `],
    ({ get }) => {
        get('article').should(haveText(''))
        get('[option="5"]').should(haveClasses(['disabled']))
        get('button')
            .should(haveText('Select Person'))
            .click()
        get('[option="1"]').should(haveClasses(['active']))
        get('input').type('{downarrow}')
        get('article').should(haveText('Arlene Mccoy'))
        get('p').should(haveText('1'))
        get('[option="2"]').should(haveClasses(['active']))
        get('button').should(haveText('Select Person'))
        get('[option="2"]').click()
        get('button').should(haveText('Arlene Mccoy'))
        get('[option="2"]').should(haveClasses(['selected']))
    },
)

test('"name" prop',
    [html`
        <div
            x-data="{ people: [
                { id: 1, name: 'Wade Cooper' },
                { id: 2, name: 'Arlene Mccoy' },
                { id: 3, name: 'Devon Webb' },
                { id: 4, name: 'Tom Cook' },
                { id: 5, name: 'Tanya Fox', disabled: true },
                { id: 6, name: 'Hellen Schmidt' },
                { id: 7, name: 'Caroline Schultz' },
                { id: 8, name: 'Mason Heaney' },
                { id: 9, name: 'Claudie Smitham' },
                { id: 10, name: 'Emil Schaefer' },
            ]}"
            x-combobox
            name="person"
        >
            <label x-combobox:label>Assigned to</label>

            <input x-combobox:input :display-value="(person) => person.name" type="text">
            <button x-combobox:button x-text="$combobox.value ? $combobox.value : 'Select Person'"></button>

            <ul x-combobox:options>
                <template x-for="person in people" :key="person.id">
                    <li
                        :option="person.id"
                        x-combobox:option
                        :value="person.id"
                        :disabled="person.disabled"
                        :class="{
                            'selected': $comboboxOption.isSelected,
                            'active': $comboboxOption.isActive,
                        }"
                    >
                        <span x-text="person.name"></span>
                    </li>
                </template>
            </ul>
        </div>
    `],
    ({ get }) => {
        get('input').should(haveAttribute('value', 'null'))
        get('button').click()
        get('input').should(haveAttribute('value', 'null'))
        get('[option="2"]').click()
        get('input').should(beHidden())
            .should(haveAttribute('name', 'person'))
            .should(haveAttribute('value', '2'))
            .should(haveAttribute('type', 'hidden'))
        get('button').click()
        get('[option="4"]').click()
        get('input').should(beHidden())
            .should(haveAttribute('name', 'person'))
            .should(haveAttribute('value', '4'))
            .should(haveAttribute('type', 'hidden'))
    },
);

test('"name" prop with object value',
    [html`
        <div
            x-data="{ people: [
                { id: 1, name: 'Wade Cooper' },
                { id: 2, name: 'Arlene Mccoy' },
                { id: 3, name: 'Devon Webb' },
                { id: 4, name: 'Tom Cook' },
                { id: 5, name: 'Tanya Fox', disabled: true },
                { id: 6, name: 'Hellen Schmidt' },
                { id: 7, name: 'Caroline Schultz' },
                { id: 8, name: 'Mason Heaney' },
                { id: 9, name: 'Claudie Smitham' },
                { id: 10, name: 'Emil Schaefer' },
            ]}"
            x-combobox
            name="person"
        >
            <label x-combobox:label>Assigned to</label>

            <input x-combobox:input :display-value="(person) => person.name" type="text">

            <button x-combobox:button x-text="$combobox.value ? $combobox.value.name : 'Select Person'"></button>

            <ul x-combobox:options>
                <template x-for="person in people" :key="person.id">
                    <li
                        :option="person.id"
                        x-combobox:option
                        :value="person"
                        :disabled="person.disabled"
                        :class="{
                            'selected': $comboboxOption.isSelected,
                            'active': $comboboxOption.isActive,
                        }"
                    >
                        <span x-text="person.name"></span>
                    </li>
                </template>
            </ul>
        </div>
    `],
    ({ get }) => {
        get('input[name="person"]').should(haveAttribute('value', 'null'))
        get('button').click()
        get('[name="person[id]"]').should(notExist())
        get('[option="2"]').click()
        get('input[name="person"]').should(notExist())
        get('[name="person[id]"]').should(beHidden())
            .should(haveAttribute('value', '2'))
            .should(haveAttribute('type', 'hidden'))
        get('[name="person[name]"]').should(beHidden())
            .should(haveAttribute('value', 'Arlene Mccoy'))
            .should(haveAttribute('type', 'hidden'))
        get('button').click()
        get('[option="4"]').click()
        get('[name="person[id]"]').should(beHidden())
            .should(haveAttribute('value', '4'))
            .should(haveAttribute('type', 'hidden'))
        get('[name="person[name]"]').should(beHidden())
            .should(haveAttribute('value', 'Tom Cook'))
            .should(haveAttribute('type', 'hidden'))
    },
);

test('"default-value" prop',
    [html`
        <div
            x-data="{ people: [
                { id: 1, name: 'Wade Cooper' },
                { id: 2, name: 'Arlene Mccoy' },
                { id: 3, name: 'Devon Webb' },
                { id: 4, name: 'Tom Cook' },
                { id: 5, name: 'Tanya Fox', disabled: true },
                { id: 6, name: 'Hellen Schmidt' },
                { id: 7, name: 'Caroline Schultz' },
                { id: 8, name: 'Mason Heaney' },
                { id: 9, name: 'Claudie Smitham' },
                { id: 10, name: 'Emil Schaefer' },
            ]}"
            x-combobox
            name="person"
            default-value="2"
        >
            <label x-combobox:label>Assigned to</label>

            <input x-combobox:input :display-value="(person) => person.name" type="text">
            <button x-combobox:button x-text="$combobox.value ? $combobox.value : 'Select Person'"></button>

            <ul x-combobox:options>
                <template x-for="person in people" :key="person.id">
                    <li
                        :option="person.id"
                        x-combobox:option
                        :value="person.id"
                        :disabled="person.disabled"
                        :class="{
                            'selected': $comboboxOption.isSelected,
                            'active': $comboboxOption.isActive,
                        }"
                    >
                        <span x-text="person.name"></span>
                    </li>
                </template>
            </ul>
        </div>
    `],
    ({ get }) => {
        get('input[name="person"]').should(beHidden())
            .should(haveAttribute('value', '2'))
            .should(haveAttribute('type', 'hidden'))
    },
);

test('"multiple" prop',
    [html`
        <div
            x-data="{
                people: [
                    { id: 1, name: 'Wade Cooper' },
                    { id: 2, name: 'Arlene Mccoy' },
                    { id: 3, name: 'Devon Webb' },
                    { id: 4, name: 'Tom Cook' },
                    { id: 5, name: 'Tanya Fox', disabled: true },
                    { id: 6, name: 'Hellen Schmidt' },
                    { id: 7, name: 'Caroline Schultz' },
                    { id: 8, name: 'Mason Heaney' },
                    { id: 9, name: 'Claudie Smitham' },
                    { id: 10, name: 'Emil Schaefer' },
                ]
            }"
            x-combobox
            multiple
        >
            <label x-combobox:label>Assigned to</label>

            <input x-combobox:input :display-value="(person) => person.name" type="text">
            <button x-combobox:button x-text="$combobox.value ? $combobox.value.join(',') : 'Select People'"></button>

            <ul x-combobox:options>
                <template x-for="person in people" :key="person.id">
                    <li
                        :option="person.id"
                        x-combobox:option
                        :value="person.id"
                        :disabled="person.disabled"
                        :class="{
                            'selected': $comboboxOption.isSelected,
                            'active': $comboboxOption.isActive,
                        }"
                    >
                        <span x-text="person.name"></span>
                    </li>
                </template>
            </ul>
        </div>
    `],
    ({ get }) => {
        get('button').click()
        get('[option="2"]').click()
        get('ul').should(beVisible())
        get('button').should(haveText('2'))
        get('[option="4"]').click()
        get('button').should(haveText('2,4'))
        get('ul').should(beVisible())
        get('[option="4"]').click()
        get('button').should(haveText('2'))
        get('ul').should(beVisible())
    },
);

test('"multiple" and "name" props together',
    [html`
        <div
            x-data="{
                people: [
                    { id: 1, name: 'Wade Cooper' },
                    { id: 2, name: 'Arlene Mccoy' },
                    { id: 3, name: 'Devon Webb' },
                    { id: 4, name: 'Tom Cook' },
                    { id: 5, name: 'Tanya Fox', disabled: true },
                    { id: 6, name: 'Hellen Schmidt' },
                    { id: 7, name: 'Caroline Schultz' },
                    { id: 8, name: 'Mason Heaney' },
                    { id: 9, name: 'Claudie Smitham' },
                    { id: 10, name: 'Emil Schaefer' },
                ]
            }"
            x-combobox
            multiple
            name="people"
        >
            <label x-combobox:label>Assigned to</label>

            <input x-combobox:input :display-value="(person) => person.name" type="text">
            <button x-combobox:button x-text="$combobox.value ? $combobox.value.map(p => p.id).join(',') : 'Select People'"></button>

            <ul x-combobox:options>
                <template x-for="person in people" :key="person.id">
                    <li
                        :option="person.id"
                        x-combobox:option
                        :value="person"
                        :disabled="person.disabled"
                        :class="{
                            'selected': $comboboxOption.isSelected,
                            'active': $comboboxOption.isActive,
                        }"
                    >
                        <span x-text="person.name"></span>
                    </li>
                </template>
            </ul>
        </div>
    `],
    ({ get }) => {
        // get('input[name="people"]').should(haveAttribute('value', 'null'))
        get('button').click()
        get('[name="people[0][id]"]').should(notExist())
        get('[option="2"]').click()
        get('ul').should(beVisible())
        get('button').should(haveText('2'))
        get('input[name="people"]').should(notExist())
        get('[name="people[0][id]"]').should(beHidden())
            .should(haveAttribute('value', '2'))
            .should(haveAttribute('type', 'hidden'))
        get('[name="people[0][name]"]').should(beHidden())
            .should(haveAttribute('value', 'Arlene Mccoy'))
            .should(haveAttribute('type', 'hidden'))
        get('[option="4"]').click()
        get('[name="people[0][id]"]').should(beHidden())
            .should(haveAttribute('value', '2'))
            .should(haveAttribute('type', 'hidden'))
        get('[name="people[0][name]"]').should(beHidden())
            .should(haveAttribute('value', 'Arlene Mccoy'))
            .should(haveAttribute('type', 'hidden'))
        get('[name="people[1][id]"]').should(beHidden())
            .should(haveAttribute('value', '4'))
            .should(haveAttribute('type', 'hidden'))
        get('[name="people[1][name]"]').should(beHidden())
            .should(haveAttribute('value', 'Tom Cook'))
            .should(haveAttribute('type', 'hidden'))
        get('button').should(haveText('2,4'))
        get('ul').should(beVisible())
        get('[option="4"]').click()
        get('[name="people[0][id]"]').should(beHidden())
            .should(haveAttribute('value', '2'))
            .should(haveAttribute('type', 'hidden'))
        get('[name="people[0][name]"]').should(beHidden())
            .should(haveAttribute('value', 'Arlene Mccoy'))
            .should(haveAttribute('type', 'hidden'))
        get('[name="people[1][id]"]').should(notExist())
        get('[name="people[1][name]"]').should(notExist())
        get('button').should(haveText('2'))
        get('ul').should(beVisible())
    },
);

test('keyboard controls',
    [html`
        <div
            x-data="{ active: null, people: [
                { id: 1, name: 'Wade Cooper' },
                { id: 2, name: 'Arlene Mccoy' },
                { id: 3, name: 'Devon Webb', disabled: true },
                { id: 4, name: 'Tom Cook' },
                { id: 5, name: 'Tanya Fox', disabled: true },
                { id: 6, name: 'Hellen Schmidt' },
                { id: 7, name: 'Caroline Schultz' },
                { id: 8, name: 'Mason Heaney' },
                { id: 9, name: 'Claudie Smitham' },
                { id: 10, name: 'Emil Schaefer' },
            ]}"
            x-combobox
            x-model="active"
        >
            <label x-combobox:label>Assigned to</label>

            <input x-combobox:input :display-value="(person) => person.name" type="text">
            <button x-combobox:button x-text="active ? active.name : 'Select Person'"></button>

            <ul x-combobox:options options>
                <template x-for="person in people" :key="person.id">
                    <li
                        :option="person.id"
                        x-combobox:option
                        :value="person"
                        :disabled="person.disabled"
                        :class="{
                            'selected': $comboboxOption.isSelected,
                            'active': $comboboxOption.isActive,
                        }"
                    >
                        <span x-text="person.name"></span>
                    </li>
                </template>
            </ul>
        </div>
    `],
    ({ get }) => {
        get('.active').should(notExist())
        get('button').click()
        get('[options]')
            .should(beVisible())
        get('input').should(haveFocus())
        get('[option="1"]')
            .should(haveClasses(['active']))
        get('input')
            .type('{downarrow}')
        get('[option="2"]')
            .should(haveClasses(['active']))
        get('input')
            .type('{downarrow}')
        get('[option="4"]')
            .should(haveClasses(['active']))
        get('input')
            .type('{uparrow}')
        get('[option="2"]')
            .should(haveClasses(['active']))
        get('input')
            .type('{home}')
        get('[option="1"]')
            .should(haveClasses(['active']))
        get('input')
            .type('{end}')
        get('[option="10"]')
            .should(haveClasses(['active']))
        get('input')
            .type('{pageUp}')
        get('[option="1"]')
            .should(haveClasses(['active']))
        get('input')
            .type('{pageDown}')
        get('[option="10"]')
            .should(haveClasses(['active']))
        get('input')
            .tab()
            .should(haveFocus())
        get('[options]')
            .should(beVisible())
        get('input')
            .type('{esc}')
        get('[options]')
            .should(notBeVisible())
    },
)

test('changing value manually changes internal state',
    [html`
        <div
            x-data="{ active: null, people: [
                { id: 1, name: 'Wade Cooper' },
                { id: 2, name: 'Arlene Mccoy' },
                { id: 3, name: 'Devon Webb', disabled: true },
                { id: 4, name: 'Tom Cook' },
                { id: 5, name: 'Tanya Fox', disabled: true },
                { id: 6, name: 'Hellen Schmidt' },
                { id: 7, name: 'Caroline Schultz' },
                { id: 8, name: 'Mason Heaney' },
                { id: 9, name: 'Claudie Smitham' },
                { id: 10, name: 'Emil Schaefer' },
            ]}"
            x-combobox
            x-model="active"
        >
            <label x-combobox:label>Assigned to</label>

            <input x-combobox:input :display-value="(person) => person.name" type="text">
            <button toggle x-combobox:button x-text="$combobox.value ? $combobox.value : 'Select Person'"></button>

            <button select-tim @click="active = 4">Select Tim</button>

            <ul x-combobox:options options>
                <template x-for="person in people" :key="person.id">
                    <li
                        :option="person.id"
                        x-combobox:option
                        :value="person.id"
                        :disabled="person.disabled"
                        :class="{
                            'selected': $comboboxOption.isSelected,
                            'active': $comboboxOption.isActive,
                        }"
                    >
                        <span x-text="person.name"></span>
                    </li>
                </template>
            </ul>
        </div>
    `],
    ({ get }) => {
        get('[select-tim]').click()
        get('[option="4"]').should(haveClasses(['selected']))
        get('[option="1"]').should(notHaveClasses(['selected']))
        get('[toggle]').should(haveText('4'))
    },
)

test('has accessibility attributes',
    [html`
        <div
            x-data="{ active: null, people: [
                { id: 1, name: 'Wade Cooper' },
                { id: 2, name: 'Arlene Mccoy' },
                { id: 3, name: 'Devon Webb', disabled: true },
                { id: 4, name: 'Tom Cook' },
                { id: 5, name: 'Tanya Fox', disabled: true },
                { id: 6, name: 'Hellen Schmidt' },
                { id: 7, name: 'Caroline Schultz' },
                { id: 8, name: 'Mason Heaney' },
                { id: 9, name: 'Claudie Smitham' },
                { id: 10, name: 'Emil Schaefer' },
            ]}"
            x-combobox
            x-model="active"
        >
            <label x-combobox:label>Assigned to</label>

            <input x-combobox:input :display-value="(person) => person.name" type="text">
            <button x-combobox:button x-text="active ? active.name : 'Select Person'"></button>

            <ul x-combobox:options options>
                <template x-for="person in people" :key="person.id">
                    <li
                        :option="person.id"
                        x-combobox:option
                        :value="person"
                        :disabled="person.disabled"
                        :class="{
                            'selected': $comboboxOption.isSelected,
                            'active': $comboboxOption.isActive,
                        }"
                    >
                        <span x-text="person.name"></span>
                    </li>
                </template>
            </ul>
        </div>
    `],
    ({ get }) => {
        get('input')
            .should(haveAttribute('aria-expanded', 'false'))

        get('button')
            .should(haveAttribute('aria-haspopup', 'true'))
            .should(haveAttribute('aria-labelledby', 'alpine-combobox-label-1 alpine-combobox-button-1'))
            .should(haveAttribute('aria-expanded', 'false'))
            .should(notHaveAttribute('aria-controls'))
            .should(haveAttribute('id', 'alpine-combobox-button-1'))
            .should(haveAttribute('tabindex', '-1'))
            .click()
            .should(haveAttribute('aria-expanded', 'true'))
            .should(haveAttribute('aria-controls', 'alpine-combobox-options-1'))

        get('[options]')
            .should(haveAttribute('role', 'combobox'))
            .should(haveAttribute('id', 'alpine-combobox-options-1'))
            .should(haveAttribute('aria-labelledby', 'alpine-combobox-label-1'))

        get('[option="1"]')
            .should(haveAttribute('role', 'option'))
            .should(haveAttribute('id', 'alpine-combobox-option-1'))
            .should(haveAttribute('tabindex', '-1'))
            .should(haveAttribute('aria-selected', 'true'))

        get('[option="2"]')
            .should(haveAttribute('role', 'option'))
            .should(haveAttribute('id', 'alpine-combobox-option-2'))
            .should(haveAttribute('tabindex', '-1'))
            .should(haveAttribute('aria-selected', 'false'))

        get('input')
            .should(haveAttribute('role', 'combobox'))
            .should(haveAttribute('aria-autocomplete', 'list'))
            .should(haveAttribute('tabindex', '0'))
            .should(haveAttribute('aria-expanded', 'true'))
            .should(haveAttribute('aria-labelledby', 'alpine-combobox-label-1'))
            .should(haveAttribute('aria-controls', 'alpine-combobox-options-1'))
            .should(haveAttribute('aria-activedescendant', 'alpine-combobox-option-1'))
            .type('{downarrow}')
            .should(haveAttribute('aria-activedescendant', 'alpine-combobox-option-2'))

        get('[option="2"]')
            .should(haveAttribute('aria-selected', 'true'))
    },
)

test('"static" prop',
    [html`
        <div
            x-data="{ active: null, show: false, people: [
                { id: 1, name: 'Wade Cooper' },
                { id: 2, name: 'Arlene Mccoy' },
                { id: 3, name: 'Devon Webb' },
                { id: 4, name: 'Tom Cook' },
                { id: 5, name: 'Tanya Fox', disabled: true },
                { id: 6, name: 'Hellen Schmidt' },
                { id: 7, name: 'Caroline Schultz' },
                { id: 8, name: 'Mason Heaney' },
                { id: 9, name: 'Claudie Smitham' },
                { id: 10, name: 'Emil Schaefer' },
            ]}"
            x-combobox
            x-model="active"
        >
            <label x-combobox:label>Assigned to</label>

            <input x-combobox:input :display-value="(person) => person.name" type="text">
            <button normal-toggle x-combobox:button x-text="active ? active.name : 'Select Person'"></button>

            <button real-toggle @click="show = ! show">Toggle</button>

            <ul x-combobox:options x-show="show" static>
                <template x-for="person in people" :key="person.id">
                    <li
                        :option="person.id"
                        x-combobox:option
                        :value="person"
                        :disabled="person.disabled"
                    >
                        <span x-text="person.name"></span>
                    </li>
                </template>
            </ul>
        </div>
    `],
    ({ get }) => {
        get('ul').should(notBeVisible())
        get('[normal-toggle]')
            .should(haveText('Select Person'))
            .click()
        get('ul').should(notBeVisible())
        get('[real-toggle]').click()
        get('ul').should(beVisible())
        get('[option="2"]').click()
        get('ul').should(beVisible())
        get('[normal-toggle]').should(haveText('Arlene Mccoy'))
    },
)

test('clicking outside the combobox closes it and resets the state',
    [html`
        <div
            x-data="{
                query: '',
                selected: null,
                people: [
                    { id: 1, name: 'Wade Cooper' },
                    { id: 2, name: 'Arlene Mccoy' },
                    { id: 3, name: 'Devon Webb' },
                    { id: 4, name: 'Tom Cook' },
                    { id: 5, name: 'Tanya Fox', disabled: true },
                    { id: 6, name: 'Hellen Schmidt' },
                    { id: 7, name: 'Caroline Schultz' },
                    { id: 8, name: 'Mason Heaney' },
                    { id: 9, name: 'Claudie Smitham' },
                    { id: 10, name: 'Emil Schaefer' },
                ],
                get filteredPeople() {
                    return this.query === ''
                        ? this.people
                        : this.people.filter((person) => {
                            return person.name.toLowerCase().includes(this.query.toLowerCase())
                        })
                },
            }"
        >
            <div x-combobox x-model="selected">
                <label x-combobox:label>Select person</label>

                <div>
                    <div>
                        <input
                            x-combobox:input
                            :display-value="person => person.name"
                            @change="query = $event.target.value"
                            placeholder="Search..."
                        />

                        <button x-combobox:button>Toggle</button>
                    </div>

                    <div x-combobox:options>
                        <ul>
                            <template
                                x-for="person in filteredPeople"
                                :key="person.id"
                                hidden
                            >
                                <li
                                    x-combobox:option
                                    :option="person.id"
                                    :value="person"
                                    :disabled="person.disabled"
                                    x-text="person.name"
                                >
                                </li>
                            </template>
                        </ul>

                        <p x-show="filteredPeople.length == 0">No people match your query.</p>
                    </div>
                </div>
            </div>

            <article x-text="selected?.name"></article>
        </div>
    `],
    ({ get }) => {
        get('button').click()
        get('[option="2"]').click()
        get('input').should(haveValue('Arlene Mccoy'))
        get('button').click()
        get('input').type('W')
        get('article').click()
        get('ul').should(notBeVisible())
        get('input').should(haveValue('Arlene Mccoy'))
    },
)
