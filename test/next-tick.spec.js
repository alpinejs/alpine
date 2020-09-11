import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('$nextTick', async () => {
    document.body.innerHTML = `
        <div x-data="{foo: 'bar'}">
            <span x-text="foo" x-ref="span"></span>

            <button x-on:click="foo = 'baz'; $nextTick(() => {$refs.span.textContent = 'bob'})"></button>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').textContent).toEqual('bar')

    document.querySelector('button').click()

    await wait(() => expect(document.querySelector('span').textContent).toEqual('bob'))
})

test('$nextTick waits for x-for to finish rendering', async () => {
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

    expect(document.querySelector('p').textContent).toEqual('2')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('p').textContent).toEqual('3') })
})

test('$nextTick works with transition', async () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
        setTimeout(callback, 10)
    })

    document.body.innerHTML = `
        <div x-data="{ show: false, loggedDisplayStyle: null }" x-init="$nextTick(() => { loggedDisplayStyle = document.querySelector('h1').style.display })">
            <h1 x-show="show" x-transition:enter="animation-enter"></h1>

            <h2 x-text="loggedDisplayStyle"></h2>

            <button @click="show = true; $nextTick(() => { loggedDisplayStyle = document.querySelector('h1').style.display })"
        </div>
    `

    Alpine.start()

    await wait(() => {
        expect(document.querySelector('h2').textContent).toEqual('none')
    })

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('h2').textContent).toEqual('')
    })
})
