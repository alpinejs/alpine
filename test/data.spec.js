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
            <button x-on:click="foo = 'baz'"></button>
        </div>
    `
    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual('bar')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('baz') })
})

test('Proxy are not nested and duplicated when manipulating an array', async () => {
    const util = require('util')

    document.body.innerHTML = `
        <div id="A" x-data="{ list: [ {name: 'foo'}, {name: 'bar'} ] }">
            <span x-text="list[0].name"></span>
            <button x-on:click="list.sort((a, b) => (a.name > b.name) ? 1 : -1)"></button>
        </div>
    `
    Alpine.start()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('foo') })

    // Getters should return a proxy when the element is an object so we don't break reactivity
    expect(util.types.isProxy(document.querySelector('#A').__x.$data.list[0])).toEqual(true)
    expect(util.types.isProxy(document.querySelector('#A').__x.$data.list[1])).toEqual(true)
    // Control values '$isProxy' should be set to true
    expect(document.querySelector('#A').__x.$data.list[0].$isProxy).toEqual(true)
    expect(document.querySelector('#A').__x.$data.list[1].$isProxy).toEqual(true)
    // Original values should not be proxies.
    expect(util.types.isProxy(document.querySelector('#A').__x.$data.list[0].$originalTarget)).toEqual(false)
    expect(util.types.isProxy(document.querySelector('#A').__x.$data.list[1].$originalTarget)).toEqual(false)

    // Reorder
    document.querySelector('button').click()
    await wait(() => { expect(document.querySelector('span').innerText).toEqual('bar') })

    // Getters should return a proxy when the element is an object so we don't break reactivity
    expect(util.types.isProxy(document.querySelector('#A').__x.$data.list[0])).toEqual(true)
    expect(util.types.isProxy(document.querySelector('#A').__x.$data.list[1])).toEqual(true)
    // Control values '$isProxy' should still be set to true
    expect(document.querySelector('#A').__x.$data.list[0].$isProxy).toEqual(true)
    expect(document.querySelector('#A').__x.$data.list[1].$isProxy).toEqual(true)
    // Original values should not be proxies.
    expect(util.types.isProxy(document.querySelector('#A').__x.$data.list[0].$originalTarget)).toEqual(false)
    expect(util.types.isProxy(document.querySelector('#A').__x.$data.list[1].$originalTarget)).toEqual(false)
})
