import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('x-html on init', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: '<h1>bar</h1>' }">
            <span x-html="foo"></span>
        </div>
    `

    Alpine.start()

    await wait(() => { expect(document.querySelector('span').innerHTML).toEqual('<h1>bar</h1>') })
})

test('x-html on triggered update', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: '' }">
            <button x-on:click="foo = '<h1>bar</h1>'"></button>

            <span x-html="foo"></span>
        </div>
    `

    Alpine.start()

    await wait(() => { expect(document.querySelector('span').innerHTML).toEqual('') })

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').innerHTML).toEqual('<h1>bar</h1>') })
})

test('x-html.once on init', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: '<h1>bar</h1>' }">
            <span x-html.once="foo"></span>
        </div>
    `

    Alpine.start()

    await wait(() => { expect(document.querySelector('span').innerHTML).toEqual('<h1>bar</h1>') })
})

test('x-html.once on triggered update', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: '<h1>foo</h1>' }">
            <button x-on:click="foo = '<h2>bar</h2>'"></button>

            <span x-html.once="foo"></span>
        </div>
    `

    Alpine.start()

    await wait(() => { expect(document.querySelector('span').innerHTML).toEqual('<h1>foo</h1>') })

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').innerHTML).toEqual('<h1>foo</h1>') })
})
