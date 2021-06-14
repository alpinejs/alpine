import { haveText, html, test } from '../utils'

test('can register custom interceptors',
    [html`
        <div x-data="{ foo: $magic() }">
            <span x-text="foo"></span>
        </div>
    `,
    `
        Alpine.magic('magic', () => {
            return Alpine.interceptor((initialValue, getter, setter, path, key) => {
                return key+path
            })
        })
    `],
    ({ get }) => get('span').should(haveText('foofoo'))
)

test('interceptors are nesting aware',
    [html`
        <div x-data="{ foo: { bar: { baz: $magic() }}}">
            <span x-text="foo.bar.baz"></span>
        </div>
    `,
    `
        Alpine.magic('magic', () => {
            return Alpine.interceptor((initialValue, getter, setter, path, key) => {
                return key+path
            })
        })
    `],
    ({ get }) => get('span').should(haveText('bazfoo.bar.baz'))
)

test('interceptor system prevents against circular references',
    [html`
        <div x-data="{ foo: $foo }">
            <span x-text="'...'">
        </div>
    `,
    `
        Alpine.magic('foo', () => {
            return {
                get anyGivenProperty() {
                    return this
                }
            }
        })
    `],
    ({ get }) => get('span').should(haveText('...'))
)
