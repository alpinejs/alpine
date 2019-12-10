import projectX from 'project-x'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('x-text on init', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <span x-text="foo"></span>
        </div>
    `

    projectX.start()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('bar') })
})

test('x-text on triggered update', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: '' }">
            <button x-on:click="foo = 'bar'"></button>

            <span x-text="foo"></span>
        </div>
    `

    projectX.start()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('') })

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('bar') })
})
