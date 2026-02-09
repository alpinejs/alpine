import { haveText, html, notContain, notExist, notHaveAttribute, test } from '../../utils'

test.csp('supports regular syntax', 
    [html`
        <div x-data="{ value: 0, user: { name: 'John' } }">
            <span x-text="value"></span>
            <h1 x-text="user.name"></h1>
            <button @click="value = 2">Increment</button>
        </div>
    `],
    ({ get }) => {
        get('h1').should(haveText('John'))
        get('button').click()
        get('span').should(haveText('2'))
    }
)

test.csp('throws when accessing a global',
    [html`
        <button x-data x-on:click="document.write('evil')"></button>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => message.includes('Undefined variable: document') ? false : true)
        cy.get('button').click()
        cy.get('body').should(notContain('evil'))
    }
)

test.csp('throws when accessing a global via property',
    [html`
        <button x-data x-on:click="$el.ownerDocument.write('evil')"></button>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => message.includes('Accessing global variables is prohibited') ? false : true)
        cy.get('button').click()
        cy.get('body').should(notContain('evil'))
    }
)

test.csp('throws when accessing a global via computed property',
    [html`
        <button x-data x-on:click="$el['ownerDocument'].write('evil')"></button>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => message.includes('Accessing global variables is prohibited') ? false : true)
        cy.get('button').click()
        cy.get('body').should(notContain('evil'))
    },
)

test.csp('throws when accessing a global via function',
    [html`
        <button x-data x-on:click="$el.getRootNode().write('evil')"></button>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => message.includes('Accessing global variables is prohibited') ? false : true)
        cy.get('button').click()
        cy.get('body').should(notContain('evil'))
    },
)

test.csp('throws when parsing a property assignment',
    [html`
        <button x-data x-on:click="$el.innerHTML = 'evil'"></button>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => message.includes('Property assignments are prohibited') ? false : true)
        cy.get('button').click()
        cy.get('button').should(notContain('evil'))
    },
)

test.csp('throws when accessing blacklisted properties',
    [html`
        <button x-data x-on:click="$el.insertAdjacentHTML('beforeend', '<div id=evil></div>')"></button>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => message.includes('Accessing "insertAdjacentHTML" is prohibited') ? false : true)
        cy.get('button').click()
        cy.get('#evil').should(notExist())
    },
)

test.csp('throws when accessing an iframe',
    [html`
        <div x-data>
            <button x-on:click="$refs.foo.setAttribute('srcdoc', 'dangerous')"></button>
            <iframe x-ref="foo"></iframe>
        </div>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => message.includes('Accessing iframes and scripts is prohibited') ? false : true)
        cy.get('button').click()
        cy.get('iframe').should(notHaveAttribute('srcdoc', 'dangerous'))
    },
)

test.csp('throws when accessing an iframe via computed property',
    [html`
        <div x-data>
            <button x-on:click="$refs['foo'].setAttribute('srcdoc', 'dangerous')"></button>
            <iframe x-ref="foo"></iframe>
        </div>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => message.includes('Accessing iframes and scripts is prohibited') ? false : true)
        cy.get('button').click()
        cy.get('iframe').should(notHaveAttribute('srcdoc', 'dangerous'))
    },
)

test.csp('throws when accessing an iframe via function',
    [html`
        <div x-data>
            <button x-on:click="$el.parentElement.querySelector('iframe').setAttribute('srcdoc', 'dangerous')"></button>
            <iframe x-ref="foo"></iframe>
        </div>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => message.includes('Accessing iframes and scripts is prohibited') ? false : true)
        cy.get('button').click()
        cy.get('iframe').should(notHaveAttribute('srcdoc', 'dangerous'))
    },
)

test.csp('throws when evaluating on an iframe', 
    [html`
        <div x-data="{ show: false }">
            <button x-data x-on:click="show = true"></button>
            <template x-if="show">
                <iframe x-init="$el.setAttribute('srcdoc', 'dangerous')"></iframe>
            </template>
        </div>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => message.includes('Evaluating expressions on an iframe is prohibited') ? false : true)
        cy.get('button').click()
        cy.get('iframe').should(notHaveAttribute('srcdoc', 'dangerous'))
    },
)

test.csp('throws when accessing a script',
    [html`
        <div x-data>
            <button x-on:click="$refs.foo.setAttribute('src', 'evil')"></button>
            <script id="script" x-ref="foo"></script>
        </div>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => message.includes('Accessing iframes and scripts is prohibited') ? false : true)
        cy.get('button').click()
        cy.get('#script').should(notHaveAttribute('src', 'evil'))
    },
)

test.csp('throws when accessing a script via computed property',
    [html`
        <div x-data>
            <button x-on:click="$refs['foo'].setAttribute('src', 'evil')"></button>
            <script id="script" x-ref="foo"></script>
        </div>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => message.includes('Accessing iframes and scripts is prohibited') ? false : true)
        cy.get('button').click()
        cy.get('#script').should(notHaveAttribute('src', 'evil'))
    },
)

test.csp('throws when accessing a script via function',
    [html`
        <div x-data>
            <button x-on:click="$el.parentElement.querySelector('script').setAttribute('src', 'evil')"></button>
            <script id="script" x-ref="foo"></script>
        </div>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => message.includes('Accessing iframes and scripts is prohibited') ? false : true)
        cy.get('button').click()
        cy.get('#script').should(notHaveAttribute('src', 'evil'))
    },
)

test.csp('throws when evaluating on a script', 
    [html`
        <div x-data="{ show: false }">
            <button x-on:click="show = true"></button>
            <template x-if="show">
                <script id="script" x-init="$el.setAttribute('src', 'evil')"></script>
            </template>
        </div>
    `,
    ],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => message.includes('Evaluating expressions on a script is prohibited') ? false : true)
        cy.get('button').click()
        cy.get('#script').should(notHaveAttribute('src', 'evil'))
    },
)

test.csp('throws when using x-html directive',
    [html`
        <div x-data="{ show: false }">
            <button x-on:click="show = true"></button>
            <template x-if="show">
                <div x-html="evil"></div>
            </template>
        </div>
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => message.includes('Using the x-html directive is prohibited') ? false : true)
        cy.get('button').click()
        cy.get('body').should(notContain('evil'))
    },
)

test.csp('throws when non-enumerable global is accessed',
    [html`
        <div x-data="app">
            <button x-on:click="show = true"></button>
            <template x-if="show">
                <span x-text="obj() ? 'evil' : ''"></span>
            </template>
        </div>
    `,`
        Alpine.data('app', () => ({
            show: false,
            obj() { return Object },
        }))
    `],
    (cy) => {
        cy.on('uncaught:exception', ({message}) => message.includes('Accessing global variables is prohibited') ? false : true)
        cy.get('button').click()
        cy.get('span').should(notContain('evil'))
    },
)