import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('x-text on init', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('bar') })
})

test('x-text on triggered update', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: '' }">
            <button x-on:click="foo = 'bar'"></button>

            <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('') })

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('bar') })
})

test('x-text.once on init', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'initial text' }">
            <span x-text.once="foo"></span>
        </div>
    `

    Alpine.start()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('initial text') })
})

test('x-text.once on triggered update', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'initial text' }">
            <button x-on:click="foo = 'updated text'"></button>

            <span x-text.once="foo"></span>
        </div>
    `

    Alpine.start()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('initial text') })

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('initial text') })
})
