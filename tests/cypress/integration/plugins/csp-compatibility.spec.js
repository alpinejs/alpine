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
            <span x-text="foo.bar"></span>

            <button @click="foo.change">Change Foo</button>
        </div>
    `,
    `
        Alpine.data('test', () => ({
            foo: {
                bar: 'baz',
                change() { this.foo.bar = 'qux' },
            }
        }))
    `],
    ({ get }) => {
        get('span').should(haveText('baz'))
        get('button').click()
        get('span').should(haveText('qux'))
    }
)
