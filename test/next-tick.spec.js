import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('$nextTick', async () => {
    document.body.innerHTML = `
        <div x-data="{foo: 'bar'}">
            <span x-text="foo" x-ref="span"></span>

            <button x-on:click="foo = 'baz'; $nextTick(() => {$refs.span.innerText = 'bob'})"></button>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').innerText).toEqual('bar')

    document.querySelector('button').click()

    await wait(() => expect(document.querySelector('span').innerText).toEqual('bob'))
})

test('nextTick wait for x-for to finish rendering', async () => {
    document.body.innerHTML = `
        <div x-data="{list: ['one', 'two'], check: 2}">
            <template x-for="item in list">
                <span x-text="item"></span>
            </template>

            <p x-text="check"></p>

            <button x-on:click="list = ['one', 'two', 'three']; $nextTick(() => {check = document.querySelectorAll('span').length})"></button>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('p').innerText).toEqual(2)

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('p').innerText).toEqual(3) })
})
