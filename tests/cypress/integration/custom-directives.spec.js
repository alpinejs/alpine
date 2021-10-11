import { haveText, html, test } from '../utils'

test('can register custom directive',
    [html`
        <div x-data>
            <span x-foo:bar.baz="bob"></span>
        </div>
    `,
    `
        Alpine.directive('foo', (el, { value, modifiers, expression }) => {
            el.textContent = value+modifiers+expression
        })
    `],
    ({ get }) => get('span').should(haveText('barbazbob'))
)

test('directives are auto cleaned up',
    [html`
        <div x-data="{ count: 0 }">
            <span x-foo x-ref="foo"></span>
            <h1 x-text="count"></h1>

            <button @click="count++" id="change">change</button>
            <button @click="$refs.foo.remove()" id="remove">remove</button>
        </div>
    `,
    `
        Alpine.directive('foo', (el, {}, { effect, cleanup, evaluateLater }) => {
            let incCount = evaluateLater('count++')

            cleanup(() => {
                incCount()
                incCount()
            })

            effect(() => {
                incCount()
            })
        })
    `],
    ({ get }) => {
        get('h1').should(haveText('1'))
        get('#change').click()
        get('h1').should(haveText('3'))
        get('#remove').click()
        get('#change').click()
        get('h1').should(haveText('6'))
        get('#change').click()
        get('h1').should(haveText('7'))
    }
)
