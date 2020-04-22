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

test('if x-ignore set to false it will initialize any new components within the node', async () => {
    document.body.innerHTML = `
    <div x-ignore="false">
        <div x-data="{foo:'foo'}">
            <span x-text="foo"></span>
        </div>
    </div>
    `

    Alpine.start()

    await wait(() => {
        expect(document.querySelector('span').innerText).toEqual('foo')
     })
})

test('Nested x-ignore set to true nodes will not initialize any new components within the node', async () => {
    document.body.innerHTML = `
    <div x-ignore="false">
        <div x-data="{foo:'foo'}">
            <span x-text="foo"></span>
        </div>
        <div x-ignore="true">
            <div x-data="{bar:'baz'}">
                <h1 x-text="bar"></h1>
            </div>
        </div>
    </div>
    `

    Alpine.start()

    await wait(() => {
        expect(document.querySelector('span').innerText).toEqual('foo')
        expect(document.querySelector('h1').innerText).toEqual(undefined)
     })
})

test('if x-ignore attribute without a value, it will default to "true"', async () => {
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
