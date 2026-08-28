import { haveText, html, test } from '../utils'

test('can defer initialization and resume without running the interceptor twice',
    [html`
        <button id="resolve" x-data @click="window.resolveInit()">Resolve</button>

        <div id="target" x-data="{ count: 0 }" x-init="count++">
            <button id="increment" @click="count++">Increment</button>
            <span x-text="count"></span>
        </div>
    `,
    `
        window.initRuns = 0
        window.initPromise = new Promise(resolve => window.resolveInit = resolve)

        Alpine.interceptInit((el) => {
            if (el.id !== 'target') return

            window.initRuns++
            Alpine.deferInit(el, window.initPromise)
        })
    `],
    ({ get }) => {
        get('#target span').should(haveText(''))
        get('#resolve').click()
        get('#target span').should(haveText('1'))
        get('#increment').click()
        get('#target span').should(haveText('2'))
        cy.window().its('initRuns').should('equal', 1)
    }
)

test('resumes each deferred interceptor in order',
    [html`
        <button id="resolve-one" x-data @click="window.resolveOne()">Resolve one</button>
        <button id="resolve-two" x-data @click="window.resolveTwo()">Resolve two</button>

        <div id="target" x-data x-init="window.initSteps.push('directive')"></div>
    `,
    `
        window.initSteps = []
        window.promiseOne = new Promise(resolve => window.resolveOne = resolve)
        window.promiseTwo = new Promise(resolve => window.resolveTwo = resolve)

        Alpine.interceptInit((el) => {
            if (el.id !== 'target') return

            window.initSteps.push('one')
            Alpine.deferInit(el, window.promiseOne)
        })

        Alpine.interceptInit((el) => {
            if (el.id !== 'target') return

            window.initSteps.push('two')
            Alpine.deferInit(el, window.promiseTwo)
        })
    `],
    ({ get }) => {
        cy.window().its('initSteps').should('deep.equal', ['one'])
        get('#resolve-one').click()
        cy.window().its('initSteps').should('deep.equal', ['one', 'two'])
        get('#resolve-two').click()
        cy.window().its('initSteps').should('deep.equal', ['one', 'two', 'directive'])
    }
)

test('waits for every promise deferred by one interceptor',
    [html`
        <button id="resolve-one" x-data @click="window.resolveOne()">Resolve one</button>
        <button id="resolve-two" x-data @click="window.resolveTwo()">Resolve two</button>

        <div id="target" x-data="{ status: 'ready' }">
            <span x-text="status"></span>
        </div>
    `,
    `
        window.promiseOne = new Promise(resolve => window.resolveOne = resolve)
        window.promiseTwo = new Promise(resolve => window.resolveTwo = resolve)

        Alpine.interceptInit((el) => {
            if (el.id !== 'target') return

            Alpine.deferInit(el, window.promiseOne)
            Alpine.deferInit(el, window.promiseTwo)
        })
    `],
    ({ get }) => {
        get('#target span').should(haveText(''))
        get('#resolve-one').click()
        get('#target span').should(haveText(''))
        get('#resolve-two').click()
        get('#target span').should(haveText('ready'))
    }
)

test('a nested deferred tree does not block its parent or siblings',
    [html`
        <button id="resolve-child" x-data @click="window.resolveChild()">Resolve child</button>

        <div id="parent" x-data="{ message: 'ready' }">
            <span id="sibling" x-text="message"></span>
            <span id="child" x-data x-init="window.childInitialized = true">Waiting</span>
        </div>
    `,
    `
        window.childInitialized = false
        window.childPromise = new Promise(resolve => window.resolveChild = resolve)

        Alpine.interceptInit((el) => {
            if (el.id !== 'child') return

            Alpine.deferInit(el, window.childPromise)
        })
    `],
    ({ get }) => {
        get('#sibling').should(haveText('ready'))
        cy.window().its('childInitialized').should('equal', false)
        get('#resolve-child').click()
        cy.window().its('childInitialized').should('equal', true)
    }
)

test('queues directive and element initialization inside an existing deferred tree',
    html`
        <div id="target" x-data="{ message: 'loaded' }">
            <span id="changed"></span>
            <div id="children"></div>
        </div>
    `,
    ({ get }, reload, window, document) => {
        window.existingInitPromise = new Promise(resolve => window.resolveExistingInit = resolve)
        window.Alpine.deferInit(document.querySelector('#target'), window.existingInitPromise)

        document.querySelector('#changed').setAttribute('x-text', 'message')

        let added = document.createElement('span')
        added.id = 'added'
        added.setAttribute('x-text', 'message')
        document.querySelector('#children').appendChild(added)

        get('#changed').should(haveText(''))
        get('#added').should(haveText(''))

        cy.then(() => window.resolveExistingInit())

        get('#changed').should(haveText('loaded'))
        get('#added').should(haveText('loaded'))
    }
)

test('does not clone a tree while its source is deferred',
    [html`
        <div id="target" x-data x-init="window.cloneInitRuns++"></div>
    `,
    `
        window.cloneInitRuns = 0
        window.cloneInterceptorRuns = []

        Alpine.interceptClone((from, to) => window.cloneInterceptorRuns.push(to.id))
    `],
    ({ get }, reload, window, document) => {
        window.clonePromise = new Promise(resolve => window.resolveClone = resolve)

        let target = document.querySelector('#target')
        let clone = target.cloneNode(true)
        let legacyClone = target.cloneNode(true)

        clone.id = 'clone'
        legacyClone.id = 'legacy-clone'
        window.cloneInterceptorRuns = []
        window.Alpine.deferInit(target, window.clonePromise)
        window.Alpine.cloneNode(target, clone)
        window.Alpine.clone(target, legacyClone)

        cy.window().its('cloneInitRuns').should('equal', 1)
        cy.window().its('cloneInterceptorRuns').should('deep.equal', [])
        cy.then(() => {
            expect(clone).not.to.have.property('_x_marker')
            expect(legacyClone).not.to.have.property('_x_marker')
        })
        cy.then(() => window.resolveClone())
        cy.window().its('cloneInitRuns').should('equal', 1)
    }
)

test('reports a rejected deferral and still releases initialization',
    [html`
        <button id="reject" x-data @click="window.rejectInit(new Error('failed to load'))">Reject</button>

        <div id="target" x-data="{ status: 'ready' }">
            <span x-text="status"></span>
        </div>
    `,
    `
        window.rejectedInitPromise = new Promise((resolve, reject) => window.rejectInit = reject)

        Alpine.interceptInit((el) => {
            if (el.id !== 'target') return

            Alpine.deferInit(el, window.rejectedInitPromise)
        })
    `],
    ({ get }) => {
        get('#target span').should(haveText(''))
        get('#reject').click()
        get('#target span').should(haveText('ready'))
    },
    true,
)

test('does not initialize a deferred tree removed before settlement',
    [html`
        <div id="target" x-data x-init="window.detachedInitRuns++"></div>
    `,
    `
        window.detachedInitRuns = 0
        window.detachedInitPromise = new Promise(resolve => window.resolveDetachedInit = resolve)

        Alpine.interceptInit((el) => {
            if (el.id !== 'target') return

            Alpine.deferInit(el, window.detachedInitPromise)
        })
    `],
    ({ get }, reload, window, document) => {
        document.querySelector('#target').remove()
        window.resolveDetachedInit()

        cy.window().its('detachedInitRuns').should('equal', 0)
    }
)

test('alpine:initialized remains synchronous while a tree is deferred',
    [html`
        <div id="target" x-data x-init="window.initSteps.push('directive')"></div>
    `,
    `
        window.initSteps = []
        window.initializedPromise = new Promise(resolve => window.resolveInitialized = resolve)

        document.addEventListener('alpine:initialized', () => window.initSteps.push('initialized'))

        Alpine.interceptInit((el) => {
            if (el.id !== 'target') return

            window.initSteps.push('interceptor')
            Alpine.deferInit(el, window.initializedPromise)
        })
    `],
    ({ get }) => {
        cy.window().its('initSteps').should('deep.equal', ['interceptor', 'initialized'])
        cy.window().then(window => window.resolveInitialized())
        cy.window().its('initSteps').should('deep.equal', ['interceptor', 'initialized', 'directive'])
    }
)
