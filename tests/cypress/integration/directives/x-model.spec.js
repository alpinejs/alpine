import { haveData, haveText, haveValue, html, test } from '../../utils'

test('The name of the test',
    html`<h1 x-data x-text="'HEY'"></h1>`,
    ({ get }) => get('h1').should(haveText('HEY'))
)

test('x-model has value binding when initialized',
    html`
    <div x-data="{ foo: 'bar' }">
        <input x-model="foo"></input>
    </div>
    `,
    ({ get }) => { get('input').should(haveValue('bar')) }
)

test('x-model updates value when updated via input event',
    html`
    <div x-data="{ foo: 'bar' }">
        <input x-model="foo"></input>
        <span x-text="foo"></span>
    </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('input').type('baz')
        get('span').should(haveText('barbaz'))
    }
)

test('x-model has value binding when updated',
    html`
    <div x-data="{ foo: 'bar' }">
        <input x-model="foo"></input>

        <button x-on:click="foo = 'baz'">click me</button>
    </div>
    `,
    ({ get }) => {
        get('input').should(haveValue('bar'))
        get('button').click()
        get('input').should(haveValue('baz'))
    }
)

test('x-model casts value to number if number modifier is present',
    html`
    <div x-data="{ foo: null }">
        <input type="number" x-model.number="foo"></input>
    </div>
    `,
    ({ get }) => {
        get('input').type('123')
        get('div').should(haveData('foo', 123))

    }
)

test('x-model with number modifier returns: null if empty, original value if casting fails, numeric value if casting passes',
    html`
    <div x-data="{ foo: 0, bar: '' }">
        <input type="number" x-model.number="foo"></input>
        <input x-model.number="bar"></input>
    </div>
    `,
    ({ get }) => {
        get('input:nth-of-type(1)').clear()
        get('div').should(haveData('foo', null))
        get('input:nth-of-type(1)').clear().type('-')
        get('div').should(haveData('foo', null))
        get('input:nth-of-type(1)').clear().type('-123')
        get('div').should(haveData('foo', -123))
        get('input:nth-of-type(2)').type(123).clear()
        get('div').should(haveData('bar', null))
        get('input:nth-of-type(2)').clear().type('-')
        get('div').should(haveData('bar', '-'))
        get('input:nth-of-type(2)').clear().type('-123')
        get('div').should(haveData('bar', -123))
    }
)

test('x-model trims value if trim modifier is present',
    html`
    <div x-data="{ foo: '' }">
        <input x-model.trim="foo"></input>

        <span x-text="foo"></span>
    </div>
    `,
    ({ get }) => {
        get('input').type('bar     ')
        get('div').should(haveData('foo', 'bar'))
    }
)

test('x-model can be accessed programmatically',
    html`
    <div x-data="{ foo: 'bar' }" x-model="foo">
        <input x-model="foo">

        <span x-text="$root._x_model.get()"></span>
        <button @click="$root._x_model.set('bob')">Set foo to bob</button>
    </div>
    `,
    ({ get }) => {
        get('span').should(haveText('bar'))
        get('input').type('baz')
        get('span').should(haveText('barbaz'))
        get('button').click()
        get('span').should(haveText('bob'))
    }
)
