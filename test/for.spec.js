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

test('removes all elements when array is empty and previously had one item', async () => {
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

test('removes all elements when array is empty and previously had multiple items', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo', 'bar', 'world'] }">
            <button x-on:click="items = []"></button>

            <template x-for="item in items">
                <span x-text="item"></span>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('span').length).toEqual(3)

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

test('can use index inside of loop', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo'] }">
            <template x-for="(item, index) in items">
                <div>
                    <h1 x-text="items.indexOf(item)"></h1>
                    <h2 x-text="index"></h2>
                </div>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('h1').innerText).toEqual(0)
    expect(document.querySelector('h2').innerText).toEqual(0)
})

test('can use third iterator param (collection) inside of loop', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo'] }">
            <template x-for="(item, index, things) in items">
                <div>
                    <h1 x-text="items"></h1>
                    <h2 x-text="things"></h2>
                </div>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('h1').innerText).toEqual(["foo"])
    expect(document.querySelector('h2').innerText).toEqual(["foo"])
})

test('can use x-if in conjunction with x-for', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: ['foo', 'bar'], show: false }">
            <button @click="show = ! show"></button>

            <template x-if="show" x-for="item in items">
                <span x-text="item"></span>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelectorAll('span').length).toEqual(0)

    document.querySelector('button').click()

    await new Promise(resolve => setTimeout(resolve, 1))

    expect(document.querySelectorAll('span').length).toEqual(2)

    document.querySelector('button').click()

    await new Promise(resolve => setTimeout(resolve, 1))

    expect(document.querySelectorAll('span').length).toEqual(0)
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

test('nested x-for', async () => {
    document.body.innerHTML = `
        <div x-data="{ foos: [ {bars: ['bob', 'lob']} ] }">
            <button x-on:click="foos = [ {bars: ['bob', 'lob']}, {bars: ['law']} ]"></button>
            <template x-for="foo in foos">
                <h1>
                    <template x-for="bar in foo.bars">
                        <h2 x-text="bar"></h2>
                    </template>
                </h1>
            </template>
        </div>
    `

    Alpine.start()

    await wait(() => { expect(document.querySelectorAll('h1').length).toEqual(1) })
    await wait(() => { expect(document.querySelectorAll('h2').length).toEqual(2) })

    expect(document.querySelectorAll('h2')[0].innerText).toEqual('bob')
    expect(document.querySelectorAll('h2')[1].innerText).toEqual('lob')

    document.querySelector('button').click()

    await wait(() => { expect(document.querySelectorAll('h2').length).toEqual(3) })

    expect(document.querySelectorAll('h2')[0].innerText).toEqual('bob')
    expect(document.querySelectorAll('h2')[1].innerText).toEqual('lob')
    expect(document.querySelectorAll('h2')[2].innerText).toEqual('law')
})

test('can use object for x-for', async () => {
    document.body.innerHTML = `
        <div x-data="{ items: { foo: 'bar' } }">
            <template x-for="(item, key) in items">
                <div>
                    <h1 x-text="item"></h1>
                </div>
            </template>
        </div>
    `

    Alpine.start()

    expect(document.querySelector('h1').innerText).toEqual(["bar"])
})
