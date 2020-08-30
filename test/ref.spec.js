import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('can reference elements from event listeners', async () => {
    document.body.innerHTML = `
        <div x-data="{}">
            <span x-ref="bob"></span>

            <button x-on:click="$refs['bob'].textContent = 'lob'"></button>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').textContent).toEqual('')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').textContent).toEqual('lob') })
})

test('can reference elements from data object methods', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo() { this.$refs.bob.textContent = 'lob' } }">
            <span x-ref="bob"></span>

            <button x-on:click="foo()"></button>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').textContent).toEqual('')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').textContent).toEqual('lob') })
})
