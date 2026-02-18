import { haveAttr, html, test } from '../../utils'

test('useState initializes state with the given initial value',
    html`
        <div x-data="{ state: $useState('testValue') }" x-init="$el.setAttribute('x-data', state)">
        </div>
    `,
    ({ get }) => {
        get('[x-data]').should(haveAttr('x-data', 'testValue'))
    }
)

test('useState updates state correctly',
    html`
        <div x-data="{ state: $useState('initialValue') }" x-init="$el.setAttribute('x-data', state)">
            <button @click="state('updatedValue')">Update</button>
        </div>
    `,
    ({ get }) => {
        get('[x-data]').should(haveAttr('x-data', 'initialValue'))
        get('button').click()
        get('[x-data]').should(haveAttr('x-data', 'updatedValue'))
    }
)

test('useState reacts to state changes',
    html`
        <div x-data="{ state: $useState('initialValue') }" x-init="$el.setAttribute('x-data', state)">
            <button @click="state('updatedValue')">Update</button>
        </div>
    `,
    ({ get }) => {
        cy.wait(1000) // Espera 1 segundo para asegurarte de que Alpine.js se haya inicializado
        get('[x-data]').should(haveAttr('x-data', 'initialValue'))
        get('button').click()
        get('[x-data]').should(haveAttr('x-data', 'updatedValue'))
    }
)
