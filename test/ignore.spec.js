import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('x-ignore ignores initialization of any new components within the node', async () => {
    document.body.innerHTML = `
    <div x-ignore="ignore" data="{ignore:true}">
        <div x-data="{foo:'foo'}">
            <span x-text="foo"></span>
        </div>
    </div>
    `

    Alpine.start()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual(undefined) })
})

test('x-ignore if set to false it will initialize any new components within the node', async () => {
    document.body.innerHTML = `
    <div x-ignore="false">
        <div x-data="{foo:'foo'}">
            <span x-text="foo"></span>
        </div>
    </div>
    `

    Alpine.start()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('foo') })
})

test('x-ignore if empty ignores initialization of any new components within the node', async () => {
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
