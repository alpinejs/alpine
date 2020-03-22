import Alpine from 'alpinejs'
import { wait, fireEvent } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('x-model has value binding when initialized', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <input x-model="foo"></input>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('input').value).toEqual('bar')
})

test('x-model updates value when updated via input event', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <input x-model="foo"></input>
        </div>
    `

    Alpine.start()

    fireEvent.input(document.querySelector('input'), { target: { value: 'baz' }})

    await wait(() => { expect(document.querySelector('input').value).toEqual('baz') })
})

test('x-model reflects data changed elsewhere', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <input x-model="foo"></input>

            <button x-on:click="foo = 'baz'"></button>
        </div>
    `

    Alpine.start()

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('input').value).toEqual('baz') })
})

test('x-model casts value to number if number modifier is present', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: null }">
            <input type="number" x-model.number="foo"></input>
        </div>
    `

    Alpine.start()

    fireEvent.input(document.querySelector('input'), { target: { value: '123' }})

    await wait(() => { expect(document.querySelector('[x-data]').__x.$data.foo).toEqual(123) })
})

test('x-model with number modifier returns: null if empty, original value if casting fails, numeric value if casting passes', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 0, bar: '' }">
            <input type="number" x-model.number="foo"></input>
            <input x-model.number="bar"></input>
        </div>
    `

    Alpine.start()

    fireEvent.input(document.querySelectorAll('input')[0], { target: { value: '' }})

    await wait(() => { expect(document.querySelector('[x-data]').__x.$data.foo).toEqual(null) })

    fireEvent.input(document.querySelectorAll('input')[0], { target: { value: '-' }})

    await wait(() => { expect(document.querySelector('[x-data]').__x.$data.foo).toEqual(null) })

    fireEvent.input(document.querySelectorAll('input')[0], { target: { value: '-123' }})

    await wait(() => { expect(document.querySelector('[x-data]').__x.$data.foo).toEqual(-123) })

    fireEvent.input(document.querySelectorAll('input')[1], { target: { value: '' }})

    await wait(() => { expect(document.querySelector('[x-data]').__x.$data.bar).toEqual(null) })

    fireEvent.input(document.querySelectorAll('input')[1], { target: { value: '-' }})

    await wait(() => { expect(document.querySelector('[x-data]').__x.$data.bar).toEqual('-') })

    fireEvent.input(document.querySelectorAll('input')[1], { target: { value: '-123' }})

    await wait(() => { expect(document.querySelector('[x-data]').__x.$data.bar).toEqual(-123) })
})

test('x-model trims value if trim modifier is present', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: '' }">
            <input x-model.trim="foo"></input>

            <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    fireEvent.input(document.querySelector('input'), { target: { value: 'bar   ' }})

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('bar') })
})

test('x-model updates value when updated via changed event when lazy modifier is present', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <input x-model.lazy="foo"></input>
        </div>
    `

    Alpine.start()

    fireEvent.change(document.querySelector('input'), { target: { value: 'baz' }})

    await wait(() => { expect(document.querySelector('input').value).toEqual('baz') })
})

test('x-model binds checkbox value', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: true }">
            <input type="checkbox" x-model="foo"></input>

            <span x-bind:bar="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('input').checked).toEqual(true)
    expect(document.querySelector('span').getAttribute('bar')).toEqual("true")

    fireEvent.change(document.querySelector('input'), { target: { checked: false }})

    await wait(() => { expect(document.querySelector('span').getAttribute('bar')).toEqual("false") })
})

test('x-model binds checkbox value to array', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: ['bar'] }">
            <input type="checkbox" x-model="foo" value="bar"></input>
            <input type="checkbox" x-model="foo" value="baz"></input>

            <span x-bind:bar="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('input')[0].checked).toEqual(true)
    expect(document.querySelectorAll('input')[1].checked).toEqual(false)
    expect(document.querySelector('span').getAttribute('bar')).toEqual("bar")

    fireEvent.change(document.querySelectorAll('input')['1'], { target: { checked: true }})

    await wait(() => {
        expect(document.querySelectorAll('input')[0].checked).toEqual(true)
        expect(document.querySelectorAll('input')[1].checked).toEqual(true)
        expect(document.querySelector('span').getAttribute('bar')).toEqual("bar,baz")
    })
})

test('x-model binds radio value', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <input type="radio" x-model="foo" value="bar"></input>
            <input type="radio" x-model="foo" value="baz"></input>

            <span x-bind:bar="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('input')[0].checked).toEqual(true)
    expect(document.querySelectorAll('input')[1].checked).toEqual(false)
    expect(document.querySelector('span').getAttribute('bar')).toEqual('bar')

    fireEvent.change(document.querySelectorAll('input')[1], { target: { checked: true }})

    await wait(() => {
        expect(document.querySelectorAll('input')[0].checked).toEqual(false)
        expect(document.querySelectorAll('input')[1].checked).toEqual(true)
        expect(document.querySelector('span').getAttribute('bar')).toEqual('baz')
    })
})

test('x-model binds select dropdown', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <select x-model="foo">
                <option disabled value="">Please select one</option>
                <option>bar</option>
                <option>baz</option>
            </select>

            <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('option')[0].selected).toEqual(false)
    expect(document.querySelectorAll('option')[1].selected).toEqual(true)
    expect(document.querySelectorAll('option')[2].selected).toEqual(false)
    expect(document.querySelector('span').innerText).toEqual('bar')

    fireEvent.change(document.querySelector('select'), { target: { value: 'baz' }});

    await wait(() => {
        expect(document.querySelectorAll('option')[0].selected).toEqual(false)
        expect(document.querySelectorAll('option')[1].selected).toEqual(false)
        expect(document.querySelectorAll('option')[2].selected).toEqual(true)
        expect(document.querySelector('span').innerText).toEqual('baz')
    })
})

test('x-model binds multiple select dropdown', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: ['bar'] }">
            <select x-model="foo" multiple>
                <option disabled value="">Please select one</option>
                <option>bar</option>
                <option>baz</option>
            </select>

            <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('option')[0].selected).toEqual(false)
    expect(document.querySelectorAll('option')[1].selected).toEqual(true)
    expect(document.querySelectorAll('option')[2].selected).toEqual(false)
    expect(document.querySelector('span').innerText).toEqual(['bar'])

    document.querySelectorAll('option')[2].selected = true
    fireEvent.change(document.querySelector('select'));

    await wait(() => {
        expect(document.querySelectorAll('option')[0].selected).toEqual(false)
        expect(document.querySelectorAll('option')[1].selected).toEqual(true)
        expect(document.querySelectorAll('option')[2].selected).toEqual(true)
        expect(document.querySelector('span').innerText).toEqual(['bar', 'baz'])
    })
})

test('x-model binds nested keys', async () => {
    document.body.innerHTML = `
        <div x-data="{ some: { nested: { key: 'foo' } } }">
            <input type="text" x-model="some.nested.key">
            <span x-text="some.nested.key"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('input').value).toEqual('foo')
    expect(document.querySelector('span').innerText).toEqual('foo')

    fireEvent.input(document.querySelector('input'), { target: { value: 'bar' }})

    await wait(() => {
        expect(document.querySelector('input').value).toEqual('bar')
        expect(document.querySelector('span').innerText).toEqual('bar')
    })
})

test('x-model undefined nested model key defaults to empty string', async () => {
    document.body.innerHTML = `
        <div x-data="{ some: { nested: {} } }">
            <input type="text" x-model="some.nested.key">
            <span x-text="some.nested.key"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('input').value).toEqual('')
    expect(document.querySelector('span').innerText).toEqual('')

    fireEvent.input(document.querySelector('input'), { target: { value: 'bar' }})

    await wait(() => {
        expect(document.querySelector('input').value).toEqual('bar')
        expect(document.querySelector('span').innerText).toEqual('bar')
    })
})

test('x-model can listen for custom input event dispatches', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }" x-model="foo">
            <button @click="$dispatch('input', 'baz')"></button>

            <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual('bar')

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').innerText).toEqual('baz')
    })
})
