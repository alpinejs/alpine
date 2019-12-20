import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('x-if', async () => {
    document.body.innerHTML = `
        <div x-data="{ show: false }">
            <button x-on:click="show = ! show"></button>

            <template x-if="show">
                <p></p>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('p')).toBeFalsy()

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('p')).toBeTruthy() })
})
