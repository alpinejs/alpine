import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('x-cloak is removed', async () => {
    document.body.innerHTML = `
        <div x-data="{ hidden: true }">
            <span x-cloak></span>
        </div>
    `

    expect(document.querySelector('span').getAttribute('x-cloak')).not.toBeNull()

    Alpine.start()

    await wait(() => { expect(document.querySelector('span').getAttribute('x-cloak')).toBeNull() })
})
