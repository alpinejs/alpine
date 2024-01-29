import { beVisible, beHidden, haveAttribute, haveClasses, notHaveClasses, haveText, contain, notContain, html, notBeVisible, notHaveAttribute, notExist, haveFocus, test, haveValue, haveLength, ensureNoConsoleWarns} from '../../../utils'

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

            <a href="#" x-on:click.prevent="selected = { id: 7, name: 'Caroline Schultz' }">Set selected via code</a>
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
        get('a').click()
        get('input').should(haveValue('Caroline Schultz'))
        get('article').should(haveText('Caroline Schultz'))
    },
)

test('initial value is set from x-model',
    [html`
        <div
            x-data="{
                query: '',
                selected: { id: 1, name: 'Wade Cooper' },
                people: [
                    { id: 1, name: 'Wade Cooper' },
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
                    </div>
                </div>

                <article x-text="selected?.name"></article>
            </div>
        </div>
    `],
    ({ get }) => {
        get('input').should(haveValue('Wade Cooper'))
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

test('Preserves currently active keyboard selection while options change from searching even if there\'s a selected option in the filtered results',
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
                                >
                                    <span x-text="person.name"></span>
                                    <span x-show="$comboboxOption.isActive">*</span>
                                    <span x-show="$comboboxOption.isSelected">x</span>
                                </li>
                            </template>
                        </ul>

                        <p x-show="filteredPeople.length == 0">No people match your query.</p>
                    </div>
                </div>
            </div>

            <article>lorem ipsum</article>
        </div>
    `],
    ({ get }) => {
        get('input').should(haveText(''))
        get('button').click()
        get('[option="3"]').click()
        cy.wait(100)
        get('input').type('{selectAll}{backspace}')
        cy.wait(100)
        get('input').type('{downArrow}')
        cy.wait(100)
        get('[option="3"]').should(contain('*'))
        get('input').type('{upArrow}{upArrow}')
        cy.wait(100)
        get('[option="1"]').should(contain('*'))
        cy.wait(100)
        get('input').type('d')
        get('input').trigger('change')
        cy.wait(100)
        get('[option="1"]').should(contain('*'))
    },
);

test('Ignore active selection while options change if not selected by a keyboard event',
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
                                >
                                    <span x-text="person.name"></span>
                                    <span x-show="$comboboxOption.isActive">*</span>
                                    <span x-show="$comboboxOption.isSelected">x</span>
                                </li>
                            </template>
                        </ul>

                        <p x-show="filteredPeople.length == 0">No people match your query.</p>
                    </div>
                </div>
            </div>

            <article>lorem ipsum</article>
        </div>
    `],
    ({ get }) => {
        get('input').should(haveText(''))
        get('button').click()
        get('[option="1"]').should(contain('*'))
        get('input').type('t')
        get('input').trigger('change')
        get('[option="4"]').should(contain('*'))
        get('input').type('{backspace}')
        get('input').trigger('change')
        get('[option="1"]').should(contain('*'))
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

            <input x-combobox:input type="text">
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
        get('input').type('Tom')
        get('input').type('{enter}')
        get('button').should(haveText('2,4'))
        // input field doesn't reset when a new option is selected
        get('input').should(haveValue('Tom'))
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

test('"by" prop with string value',
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
            by="id"
        >
            <label x-combobox:label>Assigned to</label>

            <input x-combobox:input :display-value="(person) => person" type="text">
            <button x-combobox:button x-text="$combobox.value ? $combobox.value : 'Select People'"></button>

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
        get('ul').should(notBeVisible())
        get('button').click()
        get('ul').should(beVisible())
        get('button').click()
        get('ul').should(notBeVisible())
        get('button').click()
        get('[option="2"]').click()
        get('ul').should(notBeVisible())
        get('input').should(haveValue('2'))
        get('button').should(haveText('2'))
        get('button').click()
        get('ul').should(contain('Wade Cooper'))
            .should(contain('Arlene Mccoy'))
            .should(contain('Devon Webb'))
        get('[option="3"]').click()
        get('ul').should(notBeVisible())
        get('input').should(haveValue('3'))
        get('button').should(haveText('3'))
        get('button').click()
        get('ul').should(contain('Wade Cooper'))
            .should(contain('Arlene Mccoy'))
            .should(contain('Devon Webb'))
        get('[option="1"]').click()
        get('ul').should(notBeVisible())
        get('input').should(haveValue('1'))
        get('button').should(haveText('1'))
    },
);

test('"by" prop with string value and "nullable"',
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
            by="id"
            default-value="5"
            nullable
        >
            <label x-combobox:label>Assigned to</label>

            <input x-combobox:input :display-value="(person) => person?.name" type="text">
            <button x-combobox:button x-text="$combobox.value ? $combobox.value.name : 'Select People'"></button>

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
        get('ul').should(notBeVisible())
        get('button').click()
        get('ul').should(beVisible())
        get('button').click()
        get('ul').should(notBeVisible())
        get('button').click()
        get('[option="2"]').click()
        get('ul').should(notBeVisible())
        get('input').should(haveValue('Arlene Mccoy'))
        get('button').should(haveText('Arlene Mccoy'))
        get('button').click()
        get('ul').should(contain('Wade Cooper'))
            .should(contain('Arlene Mccoy'))
            .should(contain('Devon Webb'))
        get('[option="3"]').click()
        get('ul').should(notBeVisible())
        get('input').should(haveValue('Devon Webb'))
        get('button').should(haveText('Devon Webb'))
        get('button').click()
        get('ul').should(contain('Wade Cooper'))
            .should(contain('Arlene Mccoy'))
            .should(contain('Devon Webb'))
        get('[option="1"]').click()
        get('ul').should(notBeVisible())
        get('input').should(haveValue('Wade Cooper'))
        get('button').should(haveText('Wade Cooper'))
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
            .should(haveAttribute('role', 'listbox'))
            .should(haveAttribute('id', 'alpine-combobox-options-1'))
            .should(haveAttribute('aria-labelledby', 'alpine-combobox-label-1'))

        get('[option="1"]')
            .should(haveAttribute('role', 'option'))
            .should(haveAttribute('id', 'alpine-combobox-option-1'))
            .should(haveAttribute('tabindex', '-1'))
            .should(haveAttribute('aria-selected', 'false'))

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
            .type('{enter}')

        get('[option="2"]')
            .should(haveAttribute('aria-selected', 'true'))

        get('[option="1"]')
            .should(haveAttribute('aria-selected', 'false'))
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

test('input reset',
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

            <article>lorem ipsum</article>
            <a x-on:click="selected = null">Clear</a>
        </div>
    `],
    ({ get }) => {
        // Test after closing with button
        get('button').click()
        get('input').type('w')
        get('button').click()
        get('input').should(haveValue(''))

        // Test correct state after closing with ESC
        get('button').click()
        get('input').type('w')
        get('input').type('{esc}')
        get('input').should(haveValue(''))

        // Test correct state after closing with TAB
        get('button').click()
        get('input').type('w')
        get('input').tab()
        get('input').should(haveValue(''))

        // Test correct state after closing with external click
        get('button').click()
        get('input').type('w')
        get('article').click()
        get('input').should(haveValue(''))

        // Select something
        get('button').click()
        get('ul').should(beVisible())
        get('[option="2"]').click()
        get('input').should(haveValue('Arlene Mccoy'))

        // Test after closing with button
        get('button').click()
        get('input').type('w')
        get('button').click()
        get('input').should(haveValue('Arlene Mccoy'))

        // Test correct state after closing with ESC and reopening
        get('button').click()
        get('input').type('w')
        get('input').type('{esc}')
        get('input').should(haveValue('Arlene Mccoy'))

        // Test correct state after closing with TAB and reopening
        get('button').click()
        get('input').type('w')
        get('input').tab()
        get('input').should(haveValue('Arlene Mccoy'))

        // Test correct state after closing with external click and reopening
        get('button').click()
        get('input').type('w')
        get('article').click()
        get('input').should(haveValue('Arlene Mccoy'))

        // Test correct state after clearing selected via code
        get('a').click()
        get('input').should(haveValue(''))
    },
)

test('combobox shows all options when opening',
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

            <article>lorem ipsum</article>
        </div>
    `],
    ({ get }) => {
        get('button').click()
        get('li').should(haveLength('10'))

        // Test after closing with button and reopening
        get('input').type('w').trigger('input')
        get('li').should(haveLength('2'))
        get('button').click()
        get('button').click()
        get('li').should(haveLength('10'))

        // Test correct state after closing with ESC and reopening
        get('input').type('w').trigger('input')
        get('li').should(haveLength('2'))
        get('input').type('{esc}')
        get('button').click()
        get('li').should(haveLength('10'))

        // Test correct state after closing with TAB and reopening
        get('input').type('w').trigger('input')
        get('li').should(haveLength('2'))
        get('input').tab()
        get('button').click()
        get('li').should(haveLength('10'))

        // Test correct state after closing with external click and reopening
        get('input').type('w').trigger('input')
        get('li').should(haveLength('2'))
        get('article').click()
        get('button').click()
        get('li').should(haveLength('10'))
    },
)

test('active element logic when opening a combobox',
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
                                    :class="$comboboxOption.isActive ? 'active' : ''"
                                    x-text="person.name"
                                >
                                </li>
                            </template>
                        </ul>

                        <p x-show="filteredPeople.length == 0">No people match your query.</p>
                    </div>
                </div>
            </div>
        </div>
    `],
    ({ get }) => {
        get('button').click()
        // First option is selected on opening if no preselection
        get('ul').should(beVisible())
        get('[option="1"]').should(haveAttribute('aria-selected', 'false'))
        get('[option="1"]').should(haveClasses(['active']))
        // First match is selected while typing
        get('[option="4"]').should(haveAttribute('aria-selected', 'false'))
        get('[option="4"]').should(notHaveClasses(['active']))
        get('input').type('T')
        get('input').trigger('change')
        get('[option="4"]').should(haveAttribute('aria-selected', 'false'))
        get('[option="4"]').should(haveClasses(['active']))
        // Reset state and select option 3
        get('button').click()
        get('button').click()
        get('[option="3"]').click()
        // Previous selection is selected
        get('button').click()
        get('[option="4"]').should(haveAttribute('aria-selected', 'false'))
        get('[option="3"]').should(haveAttribute('aria-selected', 'true'))
    }
)

test('can remove an option without other options getting removed',
    [html`<div
        x-data="{
            query: '',
            selected: [],
            frameworks: [
                {
                    id: 1,
                    name: 'Laravel',
                    disabled: false,
                },
                {
                    id: 2,
                    name: 'Ruby on Rails',
                    disabled: false,
                },
                {
                    id: 3,
                    name: 'Django',
                    disabled: false,
                },
            ],
            get filteredFrameworks() {
                return this.query === ''
                    ? this.frameworks
                    : this.frameworks.filter((framework) => {
                        return framework.name.toLowerCase().includes(this.query.toLowerCase())
                    })
            },
            remove(framework) {
                this.selected = this.selected.filter((i) => i !== framework)
            }
        }"
    >
        <div x-combobox x-model="selected" by="id" multiple>
            <div x-show="selected.length">
                <template x-for="selectedFramework in selected" :key="selectedFramework.id">
                    <button x-on:click.prevent="remove(selectedFramework)" :remove-option="selectedFramework.id">
                        <span x-text="selectedFramework.name"></span>
                    </button>
                </template>
            </div>

            <div>
                <div>
                    <input
                        x-combobox:input
                        @change="query = $event.target.value;"
                        placeholder="Search..."
                    />
                    <button x-combobox:button>
                        Show options
                    </button>
                </div>

                <div x-combobox:options x-cloak x-transition.out.opacity>
                    <ul>
                        <template
                            x-for="framework in filteredFrameworks"
                            :key="framework.id"
                            hidden
                        >
                            <li
                                x-combobox:option
                                :option="framework.id"
                                :value="framework"
                                :disabled="framework.disabled"
                            >
                                <span x-text="framework.name"></span>

                                <span x-show="$comboboxOption.isSelected" :check="framework.id">&check;</span>
                            </li>
                        </template>
                    </ul>

                    <p x-show="filteredFrameworks.length == 0">No frameworks match your query.</p>
                </div>
            </div>
        </div>
    </div>
    `],
    ({ get }) => {
        get('input').type('a').trigger('input')
        cy.wait(100)
        get('[option="1"]').click()
        get('[option="2"]').click()
        get('[option="3"]').click()
        get('[remove-option="3"]').click()
        get('[option="1"]').should(haveAttribute('aria-selected', 'true'))
        get('[option="2"]').should(haveAttribute('aria-selected', 'true'))
        get('[option="3"]').should(haveAttribute('aria-selected', 'false'))
        get('input').type('a').trigger('input')
        get('[check="1"]').should(beVisible())
        get('[check="2"]').should(beVisible())
        get('[check="3"]').should(notBeVisible())
    },
);

test('works with morph',
    [html`
    <div x-data="{ value: null }">
        <div x-combobox x-model="value">
            <button x-combobox:button>Select Framework</button>

            <ul x-combobox:options>
                <li x-combobox:option value="laravel">Laravel</li>
            </ul>
        </div>

        Selected: <span x-text="value"></span>
    </div>
    `],
    ({ get }, reload, window, document) => {
        let toHtml = html`
        <div x-data="{ value: null }">
            <div x-combobox x-model="value">
                <button x-combobox:button>Select Framework (updated)</button>

                <ul x-combobox:options>
                    <li x-combobox:option value="laravel">Laravel</li>
                </ul>
            </div>

            Selected: <span x-text="value"></span>
        </div>
        `
        ensureNoConsoleWarns()

        get('div').then(([el]) => window.Alpine.morph(el, toHtml))

        get('button').should(haveText('Select Framework (updated)'))
    },
)

test('boolean option values',
    [html`
    <div x-data="{ value: null }">
        <div x-combobox x-model="value">
            <input x-combobox:input />
            <button x-combobox:button>Select boolean</button>

            <ul x-combobox:options>
                <li
                    option="boolean-true"
                    x-combobox:option
                    :value="true"
                    :class="{
                        'selected': $comboboxOption.isSelected,
                        'active': $comboboxOption.isActive,
                    }">
                    <span>Yes</span>
                </li>
                <li
                    option="boolean-false"
                    x-combobox:option
                    :value="false"
                    :class="{
                        'selected': $comboboxOption.isSelected,
                        'active': $comboboxOption.isActive,
                    }">
                    <span>No</span>
                </li>
            </ul>
        </div>

        Selected: <p x-text="value?.toString()"></p>
    </div>
    `],
    ({ get }) => {
        get('ul').should(notBeVisible())
        get('p').should(haveText(''))
        get('button')
            .should(haveText('Select boolean'))
            .click()
        get('ul').should(beVisible())
        get('[option="boolean-true"]').should(notHaveClasses(['selected']))
        get('[option="boolean-false"]').should(notHaveClasses(['selected']))
        get('[option="boolean-true"]').click()
        get('ul').should(notBeVisible())
        get('p').should(haveText('true'))
        get('button').click()
        get('ul').should(beVisible())
        get('[option="boolean-true"]').should(haveClasses(['selected']))
        get('[option="boolean-false"]').should(notHaveClasses(['selected']))
        get('[option="boolean-false"]').click()
        get('ul').should(notBeVisible())
        get('p').should(haveText('false'))
        get('button').click()
        get('ul').should(beVisible())
        get('[option="boolean-true"]').should(notHaveClasses(['selected']))
        get('[option="boolean-false"]').should(haveClasses(['selected']))
    },
)

test('integer option values',
    [html`
    <div x-data="{ value: null }">
        <div x-combobox x-model="value">
            <input x-combobox:input />
            <button x-combobox:button>Select number</button>

            <ul x-combobox:options>
                <li
                    option="0"
                    x-combobox:option
                    :value="0"
                    :class="{
                        'selected': $comboboxOption.isSelected,
                        'active': $comboboxOption.isActive,
                    }">
                    <span>0</span>
                </li>
                <li
                    option="1"
                    x-combobox:option
                    :value="1"
                    :class="{
                        'selected': $comboboxOption.isSelected,
                        'active': $comboboxOption.isActive,
                    }">
                    <span>1</span>
                </li>
                <li
                    option="2"
                    x-combobox:option
                    :value="2"
                    :class="{
                        'selected': $comboboxOption.isSelected,
                        'active': $comboboxOption.isActive,
                    }">
                    <span>2</span>
                </li>
            </ul>
        </div>

        Selected: <p x-text="value?.toString()"></p>
    </div>
    `],
    ({ get }) => {
        get('ul').should(notBeVisible())
        get('p').should(haveText(''))
        get('button')
            .should(haveText('Select number'))
            .click()
        get('ul').should(beVisible())
        get('[option="0"]').should(notHaveClasses(['selected']))
        get('[option="1"]').should(notHaveClasses(['selected']))
        get('[option="2"]').should(notHaveClasses(['selected']))
        get('[option="1"]').click()
        get('ul').should(notBeVisible())
        get('p').should(haveText('1'))
        get('button').click()
        get('ul').should(beVisible())
        get('[option="0"]').should(notHaveClasses(['selected']))
        get('[option="1"]').should(haveClasses(['selected']))
        get('[option="2"]').should(notHaveClasses(['selected']))
        get('[option="0"]').click()
        get('ul').should(notBeVisible())
        get('p').should(haveText('0'))
        get('button').click()
        get('ul').should(beVisible())
        get('[option="0"]').should(haveClasses(['selected']))
        get('[option="1"]').should(notHaveClasses(['selected']))
        get('[option="2"]').should(notHaveClasses(['selected']))
        get('[option="2"]').click()
        get('ul').should(notBeVisible())
        get('p').should(haveText('2'))
        get('button').click()
        get('ul').should(beVisible())
        get('[option="0"]').should(notHaveClasses(['selected']))
        get('[option="1"]').should(notHaveClasses(['selected']))
        get('[option="2"]').should(haveClasses(['selected']))
    },
)
