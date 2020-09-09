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

test('elements inside x-if are still reactive', async () => {
    document.body.innerHTML = `
        <div x-data="{ show: false, foo: 'bar' }">
            <h1 x-on:click="show = ! show"></h1>

            <template x-if="show">
                <h2 @click="foo = 'baz'"></h2>
            </template>

            <span x-text="foo"></span>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('h2')).toBeFalsy()
    expect(document.querySelector('span').textContent).toEqual('bar')

    document.querySelector('h1').click()

    await wait(() => {
        expect(document.querySelector('h2')).toBeTruthy()
    })

    document.querySelector('h2').click()

    await wait(() => {
        expect(document.querySelector('span').textContent).toEqual('baz')
    })
})

test('x-if works inside a loop', async () => {
    document.body.innerHTML = `
        <div x-data="{ foos: [{bar: 'baz'}, {bar: 'bop'}]}">
            <template x-for="foo in foos">
                <div>
                    <template x-if="foo.bar === 'baz'">
                        <div>
                            <span x-text="foo.bar"></span>
                        </div>
                    </template>
                </div>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('span').length).toEqual(1)
    expect(document.querySelector('span').textContent).toEqual('baz')
})

test('event listeners are attached once', async () => {
    document.body.innerHTML = `
        <div x-data="{ count: 0 }">
            <span x-text="count"></span>
            <template x-if="true">
                <button @click="count += 1">Click me</button>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('span').textContent).toEqual('0')

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').textContent).toEqual('1')
    })
})
