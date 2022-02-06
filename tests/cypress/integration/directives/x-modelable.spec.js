import { haveText, html, test } from '../../utils'

test('can expose data for x-model binding',
    html`
        <div x-data="{ outer: 'foo' }">
            <div x-data="{ inner: 'bar' }" x-modelable="inner" x-model="outer">
                <h1 x-text="outer"></h1>
                <h2 x-text="inner"></h2>

                <button @click="inner = 'bob'" id="1">change inner</button>
                <button @click="outer = 'lob'" id="2">change outer</button>
            </div>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveText('foo'))
        get('h2').should(haveText('foo'))
        get('#1').click()
        get('h1').should(haveText('bob'))
        get('h2').should(haveText('bob'))
        get('#2').click()
        get('h1').should(haveText('lob'))
        get('h2').should(haveText('lob'))
    }
)

test('Something like Livewire can hook into x-modelable',
    html`
        <h1 x-data="{ value: 'bar' }" x-modelable="value" x-init="
            () => {}; $el._x_modelable_hook = (val) => {
                return val.toUpperCase()
            }
        ">
            <span x-text="value"></span>
        </h1>
    `,
    ({ get }) => {
        get('span').should(haveText('BAR'))
    }
)

test('x-modelable works when inside x-bind and x-model is outside',
    html`
        <div x-data="{ outer: 'foo', thing: {
            ['x-modelable']: 'inner',
        } }">
            <div x-data="{ inner: 'bar' }" x-bind="thing" x-model="outer">
                <h1 x-text="outer"></h1>
                <h2 x-text="inner"></h2>

                <button @click="inner = 'bob'" id="1">change inner</button>
                <button @click="outer = 'lob'" id="2">change outer</button>
            </div>
        </div>
    `,
    ({ get }) => {
        get('h1').should(haveText('foo'))
        get('h2').should(haveText('foo'))
        get('#1').click()
        get('h1').should(haveText('bob'))
        get('h2').should(haveText('bob'))
        get('#2').click()
        get('h1').should(haveText('lob'))
        get('h2').should(haveText('lob'))
    }
)
