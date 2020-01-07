import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('child component can see the parent scope', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <div x-data="{}">
                <span x-text="$parent.foo"></span>
            </div>
        </div>
    `

    Alpine.start()

    await wait(() => {
        expect(document.querySelector('span').innerText).toEqual('bar')
    })
})

test('child component updates correctly when the parent scope changes', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <button x-on:click="foo = 'baz'"></button>
            <div x-data="{}">
                <span x-text="$parent.foo"></span>
            </div>
        </div>
    `

    Alpine.start()

    await wait(() => {
        expect(document.querySelector('span').innerText).toEqual('bar')
    })

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').innerText).toEqual('baz')
    })
})

test('child component can update the parent scope', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <span x-text="foo"></span>
            <div x-data="{}">
                <button x-on:click="$parent.foo = 'baz'"></button>
            </div>
        </div>
    `

    Alpine.start()

    await wait(() => {
        expect(document.querySelector('span').innerText).toEqual('bar')
    })

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').innerText).toEqual('baz')
    })
})


test('child component supports multiple levels of nesting', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <button x-on:click="foo = 'baz'"></button>
            <div x-data="{}">
                <div x-data="{}">
                    <span x-text="$parent.$parent.foo"></span>
                </div>
            </div>
        </div>
    `

    Alpine.start()

    await wait(() => {
        expect(document.querySelector('span').innerText).toEqual('bar')
    })

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').innerText).toEqual('baz')
    })
})
