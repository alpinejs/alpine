import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

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

test('Proxies are not nested and duplicated when manipulating an array', async () => {
    document.body.innerHTML = `
        <div x-data="{ list: [ {name: 'foo'}, {name: 'bar'} ] }">
            <span x-text="list[0].name"></span>
            <button x-on:click="list.sort((a, b) => (a.name > b.name) ? 1 : -1)"></button>
            <h1 x-on:click="list.sort((a, b) => (a.name < b.name) ? 1 : -1)"></h1>
        </div>
    `

    Alpine.start()

    // Before this fix: https://github.com/alpinejs/alpine/pull/141
    // This test would create exponentially slower performance and eventually stall out.
    await wait(() => { expect(document.querySelector('span').innerText).toEqual('foo') })
    document.querySelector('button').click()
    await wait(() => { expect(document.querySelector('span').innerText).toEqual('bar') })
    document.querySelector('h1').click()
    await wait(() => { expect(document.querySelector('span').innerText).toEqual('foo') })
    document.querySelector('button').click()
    await wait(() => { expect(document.querySelector('span').innerText).toEqual('bar') })
    document.querySelector('h1').click()
    await wait(() => { expect(document.querySelector('span').innerText).toEqual('foo') })
    document.querySelector('button').click()
    await wait(() => { expect(document.querySelector('span').innerText).toEqual('bar') })
    document.querySelector('h1').click()
    await wait(() => { expect(document.querySelector('span').innerText).toEqual('foo') })
    document.querySelector('button').click()
    await wait(() => { expect(document.querySelector('span').innerText).toEqual('bar') })
    document.querySelector('h1').click()
    await wait(() => { expect(document.querySelector('span').innerText).toEqual('foo') })
    document.querySelector('button').click()
    await wait(() => { expect(document.querySelector('span').innerText).toEqual('bar') })
    document.querySelector('h1').click()
    await wait(() => { expect(document.querySelector('span').innerText).toEqual('foo') })
    document.querySelector('button').click()
    await wait(() => { expect(document.querySelector('span').innerText).toEqual('bar') })
    document.querySelector('h1').click()
    await wait(() => { expect(document.querySelector('span').innerText).toEqual('foo') })
    document.querySelector('button').click()
    await wait(() => { expect(document.querySelector('span').innerText).toEqual('bar') })
})

test('array.push is reactive', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo'] }">
            <span x-text="items.toString()"></span>
            <button x-on:click="items.push('bar')"></button>
        </div>
    `
    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual('foo')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('foo,bar') })
})

test('array.pop is reactive', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo', 'bar'] }">
            <span x-text="items.toString()"></span>
            <button x-on:click="items.pop()"></button>
        </div>
    `
    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual('foo,bar')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('foo') })
})

test('array.shift is reactive', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo', 'bar'] }">
            <span x-text="items.toString()"></span>
            <button x-on:click="items.shift()"></button>
        </div>
    `
    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual('foo,bar')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('bar') })
})

test('array.unshift is reactive', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo'] }">
            <span x-text="items.toString()"></span>
            <button x-on:click="items.unshift('bar')"></button>
        </div>
    `
    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual('foo')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('bar,foo') })
})
