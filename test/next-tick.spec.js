import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('$nextTick', async () => {
    document.body.innerHTML = `
        <div x-data="{foo: 'bar'}">
            <span x-text="foo" x-ref="span"></span>

            <button x-on:click="foo = 'baz'; $nextTick(() => {$refs.span.innerText = 'bob'})"></button>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual('bar')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('bob') })
})
