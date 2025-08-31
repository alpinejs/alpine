import { haveText, html, test } from '../../utils'

test.csp('Can use components and basic expressions with CSP-compatible build',
    [html`
        <div x-data="test">
            <span x-text="foo"></span>

            <button @click="change">Change Foo</button>
        </div>
    `,
    `
        Alpine.data('test', () => ({
            foo: 'bar',
            change() { this.foo = 'baz' },
        }))
    `],
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('button').click()
        get('span').should(haveText('baz'))
    }
)

test.csp('Supports nested properties',
    [html`
        <div x-data="test">
            <button @click="foo.change" id="1">Change Foo</button>
            <span x-text="foo.bar"></span>

            <button @click="bar" id="2">Change Bar</button>
            <article x-ref="target"></article>
        </div>
    `,
    `
        Alpine.data('test', () => ({
            foo: {
                bar: 'baz',

                change() {
                    this.foo.bar = 'qux'

                    this.$refs.target.innerHTML = 'test2'
                },
            },
            bar() {
                this.$refs.target.innerHTML = 'test'
            },
        }))
    `],
    ({ get }) => {
        get('span').should(haveText('baz'))
        get('#1').click()
        get('span').should(haveText('qux'))
        get('article').should(haveText('test2'))
        get('#2').click()
        get('article').should(haveText('test'))
    }
)
