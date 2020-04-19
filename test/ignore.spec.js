import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('x-ignore ignores initialization of any new components within the node', async () => {
    document.body.innerHTML = `
    <div x-ignore>
        <div x-data="{foo:'foo'}">
            <span x-text="foo"></span>
        </div>
    </div>
    `

    Alpine.start()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual(undefined) })
})
