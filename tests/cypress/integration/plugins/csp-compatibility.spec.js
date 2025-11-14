import { should } from 'chai'
import { haveText, html, test } from '../../utils'

test.csp('supports regular syntax', 
    [html`
        <div x-data="{ value: 0, user: { name: 'John' } }">
            <span x-text="value"></span>
            <h1 x-text="user.name"></h1>
            <button @click="value++">Increment</button>
        </div>
    `],
    ({ get }) => {
        get('h1').should(haveText('John'))
        get('button').click()
        get('span').should(haveText('1'))
    }
)

test.csp('throws when accessing a global',
    [html`
        <button x-on:click="document"></button>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => should(message).contain('Undefined variable: document'))
        cy.get('button').click()
    }
)

test.csp('throws when accessing a global via property',
    [html`
        <button x-on:click="$el.ownerDocument"></button>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => should(message).contain('Accessing global variables is prohibited'))
        cy.get('button').click()
    },
)

test.csp('throws when accessing a global via property',
    [html`
        <button x-on:click="$el['ownerDocument']"></button>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => should(message).contain('Accessing global variables is prohibited'))
        cy.get('button').click()
    },
)

test.csp('throws when accessing a global via property',
    [html`
        <button x-on:click="$el.getRootNode()"></button>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => should(message).contain('Accessing global variables is prohibited'))
        cy.get('button').click()
    },
)

test.csp('throws when parsing an assignment',
    [html`
        <button x-on:click="value = 0"></button>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => should(message).contain('Assignments are prohibited'))
        cy.get('button').click()
    },
)

test.csp('throws when parsing an assignment',
    [html`
        <button x-on:click="$el.insertAdjacentHTML('beforeend', '<iframe></iframe>')"></button>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => should(message).contain('Accessing "insertAdjacentHTML" is prohibited'))
        cy.get('button').click()
    },
)

test.csp('throws when accessing an iframe',
    [html`
        <button x-on:click="$refs.foo"></button>
        <iframe x-ref="foo"></iframe>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => should(message).contain('Accessing iframes and scripts is prohibited'))
        cy.get('button').click()
    },
)

test.csp('throws when accessing an iframe via computed property',
    [html`
        <button x-on:click="$refs['foo']"></button>
        <iframe x-ref="foo"></iframe>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => should(message).contain('Accessing iframes and scripts is prohibited'))
        cy.get('button').click()
    },
)

test.csp('throws when accessing an iframe via function',
    [html`
        <button x-on:click="$refs.parentElement.querySelector('iframe')"></button>
        <iframe x-ref="foo"></iframe>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => should(message).contain('Accessing iframes and scripts is prohibited'))
        cy.get('button').click()
    },
)

test.csp('throws when evaluating on an iframe', 
    [html`
        <iframe x-on:click="$el.setAttribute('srcdoc', '')"></iframe>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => should(message).contain('Evaluating expressions on an iframe is prohibited'))
        cy.get('iframe').click()
    },
)

test.csp('throws when accessing a script',
    [html`
        <button x-on:click="$refs.foo"></button>
        <script x-ref="foo"></script>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => should(message).contain('Accessing iframes and scripts is prohibited'))
        cy.get('button').click()
    },
)

test.csp('throws when accessing a script via computed property',
    [html`
        <button x-on:click="$refs['foo']"></button>
        <script x-ref="foo"></script>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => should(message).contain('Accessing iframes and scripts is prohibited'))
        cy.get('button').click()
    },
)

test.csp('throws when accessing a script via function',
    [html`
        <button x-on:click="$refs.parentElement.querySelector('script')"></button>
        <script x-ref="foo"></script>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => should(message).contain('Accessing iframes and scripts is prohibited'))
        cy.get('button').click()
    },
)

test.csp('throws when evaluating on a script', 
    [html`
        <button x-on:click="$dispatch('script')"></button>
        <script x-on:script="$el.setAttribute('srcdoc', '')"></script>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => should(message).contain('Evaluating expressions on a script is prohibited'))
        cy.get('button').click()
    },
)

test.csp('throws when using x-html directive',
    [html`
        <div x-data="{ show: false }">
            <button x-on:click="show = true"></button>
            <template x-if="show">
                <div x-html=""></div>
            </template>
        </div>
    `],
    (cy) => {
        // cy.on('uncaught:exception', ({message}) => should(message).contain('Using the x-html directive is prohibited'))
        cy.get('button').click()
    },
)