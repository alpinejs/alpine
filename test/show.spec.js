import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('x-show toggles display: none; with no other style attributes', async () => {
    document.body.innerHTML = `
        <div x-data="{ show: true }">
            <span x-show="show"></span>

            <button x-on:click="show = false"></button>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').getAttribute('style')).toEqual(null)

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').getAttribute('style')).toEqual('display: none;') })
})

test('x-show toggles display: none; with no other style attributes', async () => {
    document.body.innerHTML = `
        <div x-data="{ show: true }">
            <span x-show="show" style="color: blue;"></span>

            <button x-on:click="show = false"></button>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').getAttribute('style')).toEqual('color: blue;')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').getAttribute('style')).toEqual('color: blue; display: none;') })
})
