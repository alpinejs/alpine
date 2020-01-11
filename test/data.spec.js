import Alpine from 'alpinejs'
import { fireEvent, wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('data manipulated on component object is reactive', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    document.querySelector('div').__x.$data.foo = 'baz'

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('baz') })
})

test('x-data attribute value is optional', async () => {
    document.body.innerHTML = `
        <div x-data>
            <span x-text="'foo'"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual('foo')
})

test('x-data can use attributes from a reusable function', async () => {
    document.body.innerHTML = `
        <div x-data="test()">
            <span x-text="foo"></span>
        </div>
    `
        test = function() {
            return {
                foo: 'bar',
            }
        }

    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual('bar')
})

test('functions in x-data are reactive', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar', getFoo() {return this.foo}}">
            <span x-text="getFoo()"></span>
<<<<<<< HEAD

=======
>>>>>>> master
            <button x-on:click="foo = 'baz'"></button>
        </div>
    `
    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual('bar')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('baz') })
})
