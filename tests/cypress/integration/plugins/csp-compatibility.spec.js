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
