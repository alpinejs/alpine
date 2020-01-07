import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('x-init', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }" x-init="foo = 'baz'">
            <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual('baz')
})
