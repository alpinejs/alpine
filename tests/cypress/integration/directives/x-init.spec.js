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

test('x-init will not evaluate expression if it is empty',
    html`
        <div x-data="{ foo: 'bar' }" x-init=" ">
            <span x-text="foo" x-ref="foo">baz</span>
        </div>
    `,
    ({ get }) => get('span').should(haveText('bar'))
)

test('arrow function assignment in x-init should not execute the function body',
    html`
        <div x-data="{ flag: false }" x-init="$el.fn = () => { flag = true }">
            <span x-text="flag"></span>
        </div>
    `,
    ({ get }) => get('span').should(haveText('false'))
)

test('arrow function assignment in x-init should not execute the function body when after a first statement',
    html`
        <div x-data="{ flag: false }" x-init="0; $el.fn = () => { flag = true }">
            <span x-text="flag"></span>
        </div>
    `,
    ({ get }) => get('span').should(haveText('false'))
)

test('component nested into x-init without x-data are not initialised twice',
    html`
        <div x-init="$el.setAttribute('attribute', 'value')">
            <p x-data="{foo: 'foo'}" x-init="$el.textContent += foo"></p>
        </div>
    `,
    ({ get }) => get('p').should(haveText('foo'))
)
