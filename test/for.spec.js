import Alpine from 'alpinejs'
import { wait } from '@testing-library/dom'

global.MutationObserver = class {
    observe() {}
}

test('x-for', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo'] }">
            <button x-on:click="items = ['foo', 'bar']"></button>

            <template x-for="item in items">
                <span x-text="item"></span>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('span').length).toEqual(1)
    expect(document.querySelectorAll('span')[0].innerText).toEqual('foo')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelectorAll('span').length).toEqual(2) })

    expect(document.querySelectorAll('span')[0].innerText).toEqual('foo')
    expect(document.querySelectorAll('span')[1].innerText).toEqual('bar')
})

test('removes all elements when array is empty', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo'] }">
            <button x-on:click="items = []"></button>

            <template x-for="item in items">
                <span x-text="item"></span>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('span').length).toEqual(1)

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelectorAll('span').length).toEqual(0) })
})

test('elements inside of loop are reactive', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['first'], foo: 'bar' }">
            <button x-on:click="foo = 'baz'"></button>

            <template x-for="item in items">
                <span>
                    <h1 x-text="item"></h1>
                    <h2 x-text="foo"></h2>
                </span>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('span').length).toEqual(1)
    expect(document.querySelector('h1').innerText).toEqual('first')
    expect(document.querySelector('h2').innerText).toEqual('bar')

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('h1').innerText).toEqual('first')
        expect(document.querySelector('h2').innerText).toEqual('baz')
    })
})

test('components inside of loop are reactive', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['first'] }">
            <template x-for="item in items">
                <div x-data="{foo: 'bar'}" class="child">
                    <span x-text="foo"></span>
                    <button x-on:click="foo = 'bob'"></button>
                </div>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('div.child').length).toEqual(1)
    expect(document.querySelector('span').innerText).toEqual('bar')

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').innerText).toEqual('bob')
    })
})

test('components inside a plain element of loop are reactive', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['first'] }">
            <template x-for="item in items">
                <ul>
                    <div x-data="{foo: 'bar'}" class="child">
                        <span x-text="foo"></span>
                        <button x-on:click="foo = 'bob'"></button>
                    </div>
                </ul>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('ul').length).toEqual(1)
    expect(document.querySelector('span').innerText).toEqual('bar')

    document.querySelector('button').click()

    await wait(() => {
        expect(document.querySelector('span').innerText).toEqual('bob')
    })
})

test('adding key attribute moves dom nodes properly', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo', 'bar'] }">
            <button x-on:click="items = ['bar', 'foo', 'baz']"></button>

            <template x-for="item in items" :key="item">
                <span x-text="item"></span>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('span').length).toEqual(2)
    const itemA = document.querySelectorAll('span')[0]
    itemA.setAttribute('order', 'first')
    const itemB = document.querySelectorAll('span')[1]
    itemB.setAttribute('order', 'second')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelectorAll('span').length).toEqual(3) })

    expect(document.querySelectorAll('span')[0].getAttribute('order')).toEqual('second')
    expect(document.querySelectorAll('span')[1].getAttribute('order')).toEqual('first')
    expect(document.querySelectorAll('span')[2].getAttribute('order')).toEqual(null)
})

test('can key by index', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo', 'bar'] }">
            <button x-on:click="items = ['bar', 'foo', 'baz']"></button>

            <template x-for="(item, index) in items" :key="index">
                <span x-text="item"></span>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('span').length).toEqual(2)

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelectorAll('span').length).toEqual(3) })
})

test('listeners in loop get fresh iteration data even though they are only registered initially', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo'], output: '' }">
            <button x-on:click="items = ['bar']"></button>

            <template x-for="(item, index) in items">
                <span x-text="item" x-on:click="output = item"></span>
            </template>

            <h1 x-text="output"></h1>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('span').length).toEqual(1)

    document.querySelector('span').click()

    await wait(() => { expect(document.querySelector('h1').innerText).toEqual('foo') })

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelector('span').innerText).toEqual('bar') })

    document.querySelector('span').click()

    await wait(() => { expect(document.querySelector('h1').innerText).toEqual('bar') })
})
