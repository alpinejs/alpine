import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('$dispatch', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }" x-on:custom-event="foo = $event.detail.newValue">
            <span x-text="foo"></span>

            <button x-on:click="$dispatch('custom-event', {newValue: 'baz'})"></button>
        </div>
    `

    await Alpine.start()

    expect(document.querySelector('span').innerText).toEqual('bar')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('baz') })
})
