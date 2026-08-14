import { haveText, html, notExist, test } from '../utils'

test.csp('CSP Alpine.effect batches synchronous updates and Alpine.release stops it',
    [html`
        <span id="count"></span>
        <span id="runs"></span>
    `,
    `
        let state = Alpine.reactive({ count: 0 })
        let runs = 0

        let runner = Alpine.effect(() => {
            document.querySelector('#count').textContent = state.count
            document.querySelector('#runs').textContent = ++runs
        })

        window.reactivityTestState = state
        window.releaseReactivityTestEffect = () => Alpine.release(runner)
    `],
    ({ get }, reload, window) => {
        get('#count').should(haveText('0'))
        get('#runs').should(haveText('1')).then(() => {
            window.reactivityTestState.count++
            window.reactivityTestState.count++
            window.reactivityTestState.count++
        })

        get('#count').should(haveText('3'))
        get('#runs').should(haveText('2')).then(() => {
            window.releaseReactivityTestEffect()
            window.reactivityTestState.count++
        })

        get('#count').should(haveText('3'))
        get('#runs').should(haveText('2'))
    },
)

test.csp('CSP element cleanup dequeues the exact pending effect runner',
    [html`
        <div x-data="{ show: true }">
            <template x-if="show">
                <span x-audit-effect></span>
            </template>
        </div>
    `,
    `
        window.cspReactivityState = Alpine.reactive({ count: 0 })
        window.cspReactivityRuns = 0

        Alpine.directive('audit-effect', (el, value, { effect }) => {
            effect(() => {
                window.cspReactivityState.count
                window.cspReactivityRuns++
            })
        })
    `],
    ({ get }, reload, window, document) => {
        get('span').then(() => {
            expect(window.cspReactivityRuns).to.equal(1)

            document.querySelector('[x-data]')._x_dataStack[0].show = false
            window.cspReactivityState.count++
        })

        get('span').should(notExist()).then(() => {
            expect(window.cspReactivityRuns).to.equal(1)
        })
    },
)
