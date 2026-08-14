import { haveText, html, notExist, test } from '../utils'

test('Alpine.effect batches synchronous updates and Alpine.release stops it',
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
    }
)

test('element cleanup dequeues the exact pending effect runner',
    [html`
        <div x-data="{ count: 0, show: true }">
            <button @click="show = false; count++">Remove</button>

            <template x-if="show">
                <span x-effect="count; window.reactivityTestRuns++"></span>
            </template>
        </div>
    `,
    `
        window.reactivityTestRuns = 0
    `],
    ({ get }, reload, window) => {
        get('span').then(() => {
            expect(window.reactivityTestRuns).to.equal(1)
        })

        get('button').click()
        get('span').should(notExist()).then(() => {
            expect(window.reactivityTestRuns).to.equal(1)
        })
    }
)
