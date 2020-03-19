import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('$watch direct and nested properties', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar', bob: 'lob', qux: { foo: 'quux', bob: 'corge' } }" x-init="
            $watch('foo', value => { bob = value });
            $watch('qux.foo', value => { qux.bob = value });
        ">
            <h1 x-text="foo"></h1>
            <h2 x-text="bob"></h2>

            <button x-on:click="foo = 'baz'"></button>

            <h3 x-text="qux.foo"></h3>
            <h4 x-text="qux.bob"></h4>

            <button x-on:click="qux.foo = 'biz'"></button>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('h1').innerText).toEqual('bar')
    expect(document.querySelector('h2').innerText).toEqual('lob')
    expect(document.querySelector('h3').innerText).toEqual('quux')
    expect(document.querySelector('h4').innerText).toEqual('corge')

    document.querySelectorAll('button')[0].click()

    await wait(() => {
        expect(document.querySelector('h1').innerText).toEqual('baz')
        expect(document.querySelector('h2').innerText).toEqual('baz')
        expect(document.querySelector('h3').innerText).toEqual('quux')
        expect(document.querySelector('h4').innerText).toEqual('corge')
    })

    document.querySelectorAll('button')[1].click()

    await wait(() => {
        expect(document.querySelector('h1').innerText).toEqual('baz')
        expect(document.querySelector('h2').innerText).toEqual('baz')
        expect(document.querySelector('h3').innerText).toEqual('biz')
        expect(document.querySelector('h4').innerText).toEqual('biz')
    })
})
