import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('$watch', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar', bob: 'lob' }" x-init="$watch('foo', value => { bob = value })">
            <h1 x-text="foo"></h1>
            <h2 x-text="bob"></h2>

            <button x-on:click="foo = 'baz'"></button>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('h1').innerText).toEqual('bar')
    expect(document.querySelector('h2').innerText).toEqual('lob')

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('h1').innerText).toEqual('baz')
        expect(document.querySelector('h2').innerText).toEqual('baz')
    })
})

test('$watch nested properties', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: { bar: 'baz', bob: 'lob' } }" x-init="
            $watch('foo.bar', value => { foo.bob = value });
        ">
            <h1 x-text="foo.bar"></h1>
            <h2 x-text="foo.bob"></h2>

            <button x-on:click="foo.bar = 'law'"></button>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('h1').innerText).toEqual('baz')
    expect(document.querySelector('h2').innerText).toEqual('lob')

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('h1').innerText).toEqual('law')
        expect(document.querySelector('h2').innerText).toEqual('law')
    })
})

test('$watch arrays', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: ['one'], bob: 'lob' }" x-init="$watch('foo', value => { bob = 'baz' })">
            <h1 x-text="foo"></h1>
            <h2 x-text="bob"></h2>

            <button x-on:click="foo.push('two')"></button>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('h1').innerText).toEqual(['one'])
    expect(document.querySelector('h2').innerText).toEqual('lob')

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('h1').innerText).toEqual(['one','two'])
        expect(document.querySelector('h2').innerText).toEqual('baz')
    })
})
