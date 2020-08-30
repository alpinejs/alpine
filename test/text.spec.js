import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() { }
}

test('x-text on init', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    await wait(() => { expect(document.querySelector('span').textContent).toEqual('bar') })
})

test('x-text on triggered update', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: '' }">
            <button x-on:click="foo = 'bar'"></button>

            <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    await wait(() => { expect(document.querySelector('span').textContent).toEqual('') })

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').textContent).toEqual('bar') })
})

test('x-text on SVG elements', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <svg>
                <text x-text="foo"></text>
            </svg>
        </div>
    `

    Alpine.start()

    await wait(() => { expect(document.querySelector('text').textContent).toEqual('bar') })
})
