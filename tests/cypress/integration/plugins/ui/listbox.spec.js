import { beVisible, haveAttribute, haveText, html, notBeVisible, notHaveAttribute, test } from '../../../utils'

test('it works with x-model',
    [html`
        <div
            x-data="{ active: null, people: [
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
            x-listbox
            x-model="active"
        >
            <label x-listbox:label>Assigned to</label>

            <button x-listbox:button x-text="active ? active.name : 'Select Person'"></button>

            <ul x-listbox:options>
                <template x-for="person in people" :key="person.id">
                    <li
                        :option="person.id"
                        x-listbox:option
                        :value="person"
                        :disabled="person.disabled"
                    >
                        <span x-text="person.name"></span>

                        <!-- <span x-show="$listboxOption.isSelected">
                            selected
                        </span> -->
                    </li>
                </template>
            </ul>

            <article x-text="active?.name"></article>
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
        get('article').should(haveText('Arlene Mccoy'))
    },
)

test('it works with internal state/$listbox',
    [html`
        <div
            x-data="{ active: null, people: [
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
            x-listbox
        >
            <label x-listbox:label>Assigned to</label>

            <button x-listbox:button x-text="active ? active.name : 'Select Person'"></button>

            <ul x-listbox:options>
                <template x-for="person in people" :key="person.id">
                    <li
                        :option="person.id"
                        x-listbox:option
                        :value="person"
                        :disabled="person.disabled"
                    >
                        <span x-text="person.name"></span>

                        <!-- <span x-show="$listboxOption.isSelected">
                            selected
                        </span> -->
                    </li>
                </template>
            </ul>

            <article x-text="$listbox.selected?.name"></article>
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
        get('article').should(haveText('Arlene Mccoy'))
    },
)
