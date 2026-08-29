import { beEqualTo, haveAttribute, haveText, html, notHaveAttribute, test } from '../utils'

// Registers an interceptor that suspends any [defer-me] element on
// window.promise until window.resolveIt() is called. Mirrors real usage:
// only defer while the prerequisite is still outstanding, so the resume
// pass initializes normally...
let suspendOnDeferMe = `
    window.ready = false

    window.promise = new Promise(resolve => window.resolveIt = () => {
        window.ready = true

        resolve()
    })

    Alpine.interceptInit(el => {
        if (el.hasAttribute('defer-me') && ! window.ready) {
            Alpine.deferInit(el, window.promise)
        }
    })
`

test('deferInit suspends a tree until the promise resolves',
    [html`
        <div id="deferred" defer-me x-data="lateData">
            <span x-text="message"></span>
        </div>

        <button x-data @click="registerAndResolve()">resolve</button>
    `,
    suspendOnDeferMe + `
        window.registerAndResolve = () => {
            Alpine.data('lateData', () => ({ message: 'loaded' }))

            window.resolveIt()
        }
    `],
    ({ get }) => {
        get('#deferred span').should(haveText(''))
        get('button').click()
        get('#deferred span').should(haveText('loaded'))
    }
)

test('deferInit only suspends the affected tree',
    [html`
        <div id="deferred" defer-me x-data="{ message: 'deferred' }">
            <span x-text="message"></span>
        </div>

        <div id="untouched" x-data="{ message: 'immediate' }">
            <span x-text="message"></span>
        </div>

        <button x-data @click="resolveIt()">resolve</button>
    `,
    suspendOnDeferMe],
    ({ get }) => {
        get('#untouched span').should(haveText('immediate'))
        get('#deferred span').should(haveText(''))
        get('button').click()
        get('#deferred span').should(haveText('deferred'))
    }
)

test('deferInit waits for every registered promise',
    [html`
        <div id="deferred" defer-me x-data="{ message: 'both' }">
            <span x-text="message"></span>
        </div>

        <button id="first" x-data @click="resolveFirst()">first</button>
        <button id="second" x-data @click="resolveSecond()">second</button>
    `,
    `
        window.firstDone = false
        window.secondDone = false

        let first = new Promise(resolve => window.resolveFirst = () => {
            window.firstDone = true

            resolve()
        })

        let second = new Promise(resolve => window.resolveSecond = () => {
            window.secondDone = true

            resolve()
        })

        Alpine.interceptInit(el => {
            if (! el.hasAttribute('defer-me')) return

            if (! window.firstDone) Alpine.deferInit(el, first)
            if (! window.secondDone) Alpine.deferInit(el, second)
        })
    `],
    ({ get }) => {
        get('#first').click()
        get('#deferred span').should(haveText(''))
        get('#second').click()
        get('#deferred span').should(haveText('both'))
    }
)

test('a rejected promise surfaces the error and initializes the tree anyway',
    [html`
        <div id="deferred" defer-me x-data="{ message: 'recovered' }">
            <span x-text="message"></span>
        </div>

        <button x-data @click="rejectIt()">reject</button>
    `,
    `
        window.ready = false

        window.promise = new Promise((resolve, reject) => window.rejectIt = () => {
            window.ready = true

            reject(new Error('failed to load'))
        })

        Alpine.interceptInit(el => {
            if (el.hasAttribute('defer-me') && ! window.ready) {
                Alpine.deferInit(el, window.promise)
            }
        })
    `],
    ({ get }) => {
        get('#deferred span').should(haveText(''))
        get('button').click()
        get('#deferred span').should(haveText('recovered'))
    },
    true // The surfaced rejection is expected...
)

test('x-cloak is honored while a tree is suspended',
    [html`
        <div id="deferred" defer-me x-data x-cloak>
            <span>hidden until ready</span>
        </div>

        <button x-data @click="resolveIt()">resolve</button>
    `,
    suspendOnDeferMe],
    ({ get }) => {
        get('#deferred').should(haveAttribute('x-cloak', ''))
        get('button').click()
        get('#deferred').should(notHaveAttribute('x-cloak'))
    }
)

test('nodes added inside a suspended tree wait for it to resume',
    [html`
        <div id="deferred" defer-me x-data="{ message: 'ready' }">
            <span x-text="message"></span>
        </div>

        <button id="add" x-data @click="addChild()">add</button>
        <button id="resolve" x-data @click="resolveIt()">resolve</button>
    `,
    suspendOnDeferMe + `
        window.addChild = () => {
            let child = document.createElement('h1')

            child.setAttribute('x-text', 'message')

            document.querySelector('#deferred').appendChild(child)
        }
    `],
    ({ get }) => {
        get('#add').click()
        get('#deferred h1').should(haveText(''))
        get('#resolve').click()
        get('#deferred h1').should(haveText('ready'))
    }
)

test('attributes added to an initialized element inside a suspended tree are replayed on resume',
    [html`
        <div id="target" x-data="{ message: 'replayed' }">
            <span>plain</span>
        </div>

        <button id="suspend" x-data @click="suspendIt()">suspend</button>
        <button id="resolve" x-data @click="resolveIt()">resolve</button>
    `,
    `
        window.promise = new Promise(resolve => window.resolveIt = resolve)

        window.suspendIt = () => {
            let el = document.querySelector('#target')

            Alpine.deferInit(el, window.promise)

            el.querySelector('span').setAttribute('x-text', 'message')
        }
    `],
    ({ get }) => {
        get('#suspend').click()
        get('#target span').should(haveText('plain'))
        get('#resolve').click()
        get('#target span').should(haveText('replayed'))
    }
)

test('suspended trees compose when nested',
    [html`
        <div id="outer" defer-outer x-data="{ outer: 'outer-ready' }">
            <span x-text="outer"></span>

            <div id="inner" defer-inner x-data="{ inner: 'inner-ready' }">
                <span x-text="inner"></span>
            </div>
        </div>

        <button id="resolve-outer" x-data @click="resolveOuter()">outer</button>
        <button id="resolve-inner" x-data @click="resolveInner()">inner</button>
    `,
    `
        window.outerDone = false
        window.innerDone = false

        let outerPromise = new Promise(resolve => window.resolveOuter = () => {
            window.outerDone = true

            resolve()
        })

        let innerPromise = new Promise(resolve => window.resolveInner = () => {
            window.innerDone = true

            resolve()
        })

        Alpine.interceptInit(el => {
            if (el.hasAttribute('defer-outer') && ! window.outerDone) {
                Alpine.deferInit(el, outerPromise)
            }

            if (el.hasAttribute('defer-inner') && ! window.innerDone) {
                Alpine.deferInit(el, innerPromise)
            }
        })
    `],
    ({ get }) => {
        get('#outer > span').should(haveText(''))
        get('#resolve-outer').click()
        get('#outer > span').should(haveText('outer-ready'))
        get('#inner span').should(haveText(''))
        get('#resolve-inner').click()
        get('#inner span').should(haveText('inner-ready'))
    }
)

test('a suspended element removed from the DOM never initializes',
    [html`
        <div id="deferred" defer-me x-data="recordInit">
            <span>doomed</span>
        </div>

        <button id="remove" x-data @click="removeIt()">remove</button>
        <button id="resolve" x-data @click="resolveIt()">resolve</button>
    `,
    suspendOnDeferMe + `
        window.initCount = 0

        window.removeIt = () => document.querySelector('#deferred').remove()

        Alpine.data('recordInit', () => ({
            init() { window.initCount++ }
        }))
    `],
    ({ get }) => {
        get('#remove').click()
        get('#resolve').click()

        // Give the settled promise a beat to (incorrectly) initialize...
        cy.wait(50)

        cy.window().its('initCount').should(beEqualTo(0))
    }
)

test('interceptors run again when a suspended tree resumes',
    [html`
        <div id="deferred" defer-me x-data="{ message: 'ready' }">
            <span x-text="message"></span>
        </div>

        <button x-data @click="resolveIt()">resolve</button>
    `,
    suspendOnDeferMe + `
        window.interceptCount = 0

        Alpine.interceptInit(el => {
            if (el.hasAttribute('defer-me')) window.interceptCount++
        })
    `],
    ({ get }) => {
        get('button').click()
        get('#deferred span').should(haveText('ready'))

        // Once suspended, once for the real initialization on resume...
        cy.window().its('interceptCount').should(beEqualTo(2))
    }
)

test('a suspended tree survives being morphed',
    [html`
        <div id="deferred" defer-me x-data="morphedData">
            <span x-text="message"></span>
        </div>

        <button id="morph" x-data @click="morphIt()">morph</button>
        <button id="resolve" x-data @click="registerAndResolve()">resolve</button>
    `,
    `
        window.ready = false

        window.promise = new Promise(resolve => window.resolveIt = () => {
            window.ready = true

            resolve()
        })

        Alpine.interceptInit(el => {
            if (el.hasAttribute('defer-me') && ! window.ready) {
                Alpine.deferInit(el, window.promise)
            }
        })

        window.morphIt = () => {
            Alpine.morph(document.querySelector('#deferred'), \`
                <div id="deferred" defer-me x-data="morphedData">
                    <span x-text="message"></span>
                    <h1 x-text="message"></h1>
                </div>
            \`)
        }

        window.registerAndResolve = () => {
            Alpine.data('morphedData', () => ({ message: 'morphed-and-loaded' }))

            window.resolveIt()
        }
    `],
    ({ get }) => {
        // Morph the tree while it's still suspended — the clone evaluation
        // and the added node must both stay inside the boundary...
        get('#morph').click()
        get('#deferred span').should(haveText(''))
        get('#deferred h1').should(haveText(''))
        get('#resolve').click()
        get('#deferred span').should(haveText('morphed-and-loaded'))
        get('#deferred h1').should(haveText('morphed-and-loaded'))
    }
)

test('a suspended element re-entering the DOM after settling initializes normally',
    [html`
        <div id="parking" style="display: none"></div>

        <div id="deferred" defer-me x-data="{ message: 'back-alive' }">
            <span x-text="message"></span>
        </div>

        <button id="remove" x-data @click="removeIt()">remove</button>
        <button id="resolve" x-data @click="resolveIt()">resolve</button>
        <button id="reattach" x-data @click="reattachIt()">reattach</button>
    `,
    suspendOnDeferMe + `
        window.removeIt = () => {
            window.parked = document.querySelector('#deferred')

            window.parked.remove()
        }

        window.reattachIt = () => {
            document.querySelector('#parking').after(window.parked)
        }
    `],
    ({ get }) => {
        get('#remove').click()
        get('#resolve').click()
        get('#reattach').click()
        get('#deferred span').should(haveText('back-alive'))
    }
)
