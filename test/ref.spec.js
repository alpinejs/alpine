import projectX from 'project-x'
import { wait } from 'dom-testing-library'

global.MutationObserver = class {
    observe() {}
}

test('can reference elements from event listeners', async () => {
    document.body.innerHTML = `
        <div x-data="{}">
            <span x-ref="bob"></span>

            <button x-on:click="$refs['bob'].innerText = 'lob'"></button>
        </div>
    `

    projectX.start()

    expect(document.querySelector('span').innerText).toEqual(undefined)

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('lob') })
})
