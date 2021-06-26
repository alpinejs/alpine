import { haveText, html, test } from '../../utils'

test('sets text on init',
    html`
        <div x-data="{ foo: 'bar' }" x-init="foo = 'baz'">
            <span x-text="foo"></span>
        </div>
    `,
    ({ get }) => get('span').should(haveText('baz'))
)


test('x-init can be used outside of x-data',
    html`
        <div x-init="$el.textContent = 'foo'"></div>
    `,
    ({ get }) => get('div').should(haveText('foo'))
)

test('A nested x-init doesn\'t create a new component',
    html`
        <div x-data>
            <!-- A good way to test this is to use x-ref, which is scoped to a component -->
            <p x-ref="bob"></p>
            <span x-init="$refs['bob'].textContent = 'lob'"></span>
        </div>
    `,
    ({ get }) => get('p').should(haveText('lob'))
)


test('changes made in x-init happen before the rest of the component',
    html`
        <div x-data="{ foo: 'bar' }" x-init="$refs.foo.innerText = 'yo'">
            <span x-text="foo" x-ref="foo">baz</span>
        </div>
    `,
    ({ get }) => get('span').should(haveText('bar'))
)

test('can make deferred changes with $nextTick',
    html`
        <div x-data="{ foo: 'bar' }" x-init="$nextTick(() => $refs.foo.innerText = 'yo')">
            <span x-text="foo" x-ref="foo">baz</span>
        </div>
    `,
    ({ get }) => get('span').should(haveText('yo'))
)
