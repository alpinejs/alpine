import projectX from 'project-x'
import { wait } from '@testing-library/dom'
const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))

global.MutationObserver = class {
    observe() {}
}

test('can nest components', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: 'bar' }">
            <span x-text="foo"></span>

            <div x-data="{ foo: 'bob' }">
                <button x-on:click="foo = 'baz'">Something</button>
            </div>
        </div>
    `

    projectX.start()

    expect(document.querySelector('span').innerText).toEqual('bar')

    document.querySelector('button').click()

    await timeout(20)

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('bar') })
})
