import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('x-watch', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: '---', count: 0 }" x-watch="{ foo: 'count = count + 1' }">
            <button x-on:click="foo = (new Date()).toString()">Update foo</button>

            <div x-text="foo"></div>

            <span x-text="count"></div>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual(0)

    document.querySelector('button').click()
    document.querySelector('button').click()
    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual(3) })
})


test('x-watch on nested elements', async () => {
    document.body.innerHTML = `
        <div x-data="{ foo: { bar: '---' }, count: 0 }" x-watch="{ 'foo.bar': 'count = count + 1' }">
            <button x-on:click="foo.bar = (new Date()).toString()">Update foo</button>

            <div x-text="foo.bar"></div>

            <span x-text="count"></div>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual(0)

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual(1) })

    document.querySelector('button').click()
    document.querySelector('button').click()
    document.querySelector('button').click()
    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual(5) })
})
